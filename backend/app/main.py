"""FastAPI app: an AI representative that answers questions about one candidate.

Endpoints
    GET  /api/health              — liveness + configuration status
    GET  /api/profile             — the structured candidate profile
    GET  /api/suggestions         — starter questions for the chat UI
    POST /api/chat                — streaming answer (Server-Sent Events)
    POST /api/match               — structured job-description suitability report
    POST /api/interview-questions — interview questions grounded in the profile
    POST /api/profile/reload      — re-read profile.json from disk (admin)
    PUT  /api/profile             — replace the profile without a code change (admin)
"""

import json
import logging
import os
import time
from collections import defaultdict, deque
from contextlib import asynccontextmanager
from typing import AsyncIterator

from fastapi import Body, Depends, FastAPI, Header, HTTPException, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, StreamingResponse
from pydantic import ValidationError

from .config import Settings, get_settings
from .llm import LLMError, LLMRouter
from .profile_store import ProfileStore
from .prompts import build_interview_prompt, build_match_prompt, build_system_prompt
from .schemas import (
    ChatRequest,
    InterviewQuestions,
    InterviewRequest,
    MatchRequest,
    MatchResult,
)

logging.basicConfig(
    level=os.getenv("LOG_LEVEL", "INFO"),
    format="%(asctime)s %(levelname)s %(name)s — %(message)s",
)
logger = logging.getLogger("ai-portfolio")

settings: Settings = get_settings()
store = ProfileStore(settings.profile_path)


@asynccontextmanager
async def lifespan(app: FastAPI):
    app.state.llm = LLMRouter(settings)
    logger.info(
        "AI representative ready for %s | providers=%s | chain: %s",
        store.name,
        ", ".join(settings.providers) or "NONE — no API key set",
        " → ".join(ref.label for ref in settings.chain) or "(empty)",
    )
    yield
    await app.state.llm.aclose()


app = FastAPI(
    title="AI Portfolio — Candidate Representative API",
    description="Ask questions about the candidate; answers are grounded strictly in profile.json.",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=False,
    allow_methods=["GET", "POST", "PUT", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["X-Model-Used"],
)


# --------------------------------------------------------------------------
# Rate limiting — a small in-process guard so a public demo can't burn the key
# --------------------------------------------------------------------------

_hits: dict[str, deque[float]] = defaultdict(deque)


def rate_limit(request: Request) -> None:
    client_ip = (
        request.headers.get("x-forwarded-for", "").split(",")[0].strip()
        or (request.client.host if request.client else "unknown")
    )
    now = time.monotonic()
    window = settings.rate_limit_window_seconds
    bucket = _hits[client_ip]

    while bucket and now - bucket[0] > window:
        bucket.popleft()

    if len(bucket) >= settings.rate_limit_requests:
        raise HTTPException(
            status_code=429,
            detail=f"Too many requests. Please wait {window} seconds and try again.",
        )
    bucket.append(now)

    if len(_hits) > 2048:  # cheap eviction so the dict can't grow forever
        for key in [k for k, v in _hits.items() if not v or now - v[-1] > window * 5]:
            _hits.pop(key, None)


def require_admin(x_admin_token: str = Header(default="")) -> None:
    expected = os.getenv("ADMIN_TOKEN", "").strip()
    if not expected:
        raise HTTPException(status_code=503, detail="Admin endpoints are disabled (ADMIN_TOKEN not set).")
    if x_admin_token != expected:
        raise HTTPException(status_code=401, detail="Invalid admin token.")


@app.exception_handler(LLMError)
async def llm_error_handler(_: Request, exc: LLMError) -> JSONResponse:
    return JSONResponse(status_code=exc.status_code, content={"detail": str(exc)})


# --------------------------------------------------------------------------
# Read-only endpoints
# --------------------------------------------------------------------------


@app.get("/")
async def root() -> dict:
    return {
        "service": "AI Portfolio — Candidate Representative API",
        "candidate": store.name,
        "docs": "/docs",
    }


@app.get("/api/health")
async def health(request: Request) -> dict:
    llm: LLMRouter = request.app.state.llm
    return {
        "status": "ok",
        "llm_configured": settings.configured,
        "providers": settings.providers,
        "model": settings.primary_model,
        "models": llm.models,
        "model_health": llm.health_snapshot(),
        "profile": store.summary_stats,
    }


@app.get("/api/profile")
async def profile() -> dict:
    return store.raw


@app.get("/api/suggestions")
async def suggestions() -> dict:
    return {
        "general": [
            "Tell me about this candidate.",
            "Walk me through his strongest project.",
            "What's his experience with FastAPI and backend work?",
            "How much real ML experience does he have?",
            "What has he shipped to production?",
            "What are his weaknesses or gaps?",
        ],
        "recruiter": [
            "Is he suitable for a backend engineering role?",
            "Summarise his experience in 3 bullet points.",
            "When is he available to start?",
            "What would you ask him in an interview?",
        ],
    }


# --------------------------------------------------------------------------
# Chat (streaming)
# --------------------------------------------------------------------------


def _build_messages(payload: ChatRequest, facts: str) -> list[dict]:
    system_prompt = build_system_prompt(
        name=store.name,
        facts=facts,
        job_description=payload.job_description,
    )
    if payload.language == "hi":
        system_prompt += "\n\nRespond in Hindi (Devanagari script), keeping technology names and metrics in their original form."
    elif payload.language == "en":
        system_prompt += "\n\nRespond in English."

    messages: list[dict] = [{"role": "system", "content": system_prompt}]

    # Conversation memory: replay the recent turns so follow-ups like
    # "which one was the hardest?" resolve against what was already discussed.
    history = payload.history[-settings.max_history_messages :]
    messages.extend({"role": m.role, "content": m.content} for m in history)
    messages.append({"role": "user", "content": payload.message})
    return messages


def _sse(event: str, data: dict) -> str:
    return f"event: {event}\ndata: {json.dumps(data, ensure_ascii=False)}\n\n"


@app.post("/api/chat", dependencies=[Depends(rate_limit)])
async def chat(payload: ChatRequest, request: Request) -> StreamingResponse:
    messages = _build_messages(payload, store.facts)
    # Smaller models reject the full prompt (HTTP 413); they get this instead.
    compact_messages = _build_messages(payload, store.facts_compact)
    llm: LLMRouter = request.app.state.llm

    async def event_stream() -> AsyncIterator[str]:
        # Which model actually answered — the router may have failed over.
        selected = {"model": None}
        try:
            got_content = False
            async for chunk in llm.stream_chat(
                messages,
                on_model_selected=lambda name: selected.update(model=name),
                compact_messages=compact_messages,
            ):
                got_content = True
                yield _sse("token", {"text": chunk})
            if not got_content:
                yield _sse("error", {"detail": "The AI returned an empty response. Please try again."})
        except LLMError as exc:
            yield _sse("error", {"detail": str(exc)})
        except Exception:  # noqa: BLE001 — the stream must always terminate cleanly
            logger.exception("Unexpected failure while streaming chat")
            yield _sse("error", {"detail": "Something went wrong while answering. Please try again."})
        finally:
            yield _sse("done", {"model": selected["model"] or settings.primary_model})

    return StreamingResponse(
        event_stream(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache, no-transform",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",  # stops nginx/proxies buffering the stream
        },
    )


# --------------------------------------------------------------------------
# Job-description matching (structured output)
# --------------------------------------------------------------------------


@app.post("/api/match", response_model=MatchResult, dependencies=[Depends(rate_limit)])
async def match(payload: MatchRequest, request: Request, response: Response) -> MatchResult:
    llm: LLMRouter = request.app.state.llm
    messages = [
        {"role": "system", "content": build_system_prompt(store.name, store.facts)},
        {"role": "user", "content": build_match_prompt(store.name, payload.job_description)},
    ]

    compact = [
        {"role": "system", "content": build_system_prompt(store.name, store.facts_compact)},
        messages[1],
    ]
    raw, model_used = await llm.complete_json(messages, max_tokens=1400, compact_messages=compact)
    response.headers["X-Model-Used"] = model_used
    try:
        return MatchResult.model_validate(raw)
    except ValidationError as exc:
        logger.error("Match result failed validation: %s", exc)
        raise HTTPException(
            status_code=502,
            detail="The AI's suitability report came back malformed. Please try again.",
        ) from exc


@app.post(
    "/api/interview-questions",
    response_model=InterviewQuestions,
    dependencies=[Depends(rate_limit)],
)
async def interview_questions(
    payload: InterviewRequest, request: Request, response: Response
) -> InterviewQuestions:
    llm: LLMRouter = request.app.state.llm
    messages = [
        {"role": "system", "content": build_system_prompt(store.name, store.facts)},
        {
            "role": "user",
            "content": build_interview_prompt(
                store.name, payload.count, payload.focus, payload.job_description
            ),
        },
    ]

    compact = [
        {"role": "system", "content": build_system_prompt(store.name, store.facts_compact)},
        messages[1],
    ]
    raw, model_used = await llm.complete_json(messages, max_tokens=1600, compact_messages=compact)
    response.headers["X-Model-Used"] = model_used
    try:
        return InterviewQuestions.model_validate(raw)
    except ValidationError as exc:
        logger.error("Interview questions failed validation: %s", exc)
        raise HTTPException(
            status_code=502,
            detail="The AI's interview questions came back malformed. Please try again.",
        ) from exc


# --------------------------------------------------------------------------
# Admin — update the candidate data without touching code
# --------------------------------------------------------------------------


@app.post("/api/profile/reload", dependencies=[Depends(require_admin)])
async def reload_profile() -> dict:
    store.load()
    logger.info("Profile reloaded from %s", settings.profile_path)
    return {"status": "reloaded", "profile": store.summary_stats}


@app.put("/api/profile", dependencies=[Depends(require_admin)])
async def replace_profile(new_profile: dict = Body(...)) -> dict:
    try:
        store.replace(new_profile)
    except ValidationError as exc:
        raise HTTPException(status_code=422, detail=json.loads(exc.json())) from exc
    logger.info("Profile replaced via API")
    return {"status": "updated", "profile": store.summary_stats}

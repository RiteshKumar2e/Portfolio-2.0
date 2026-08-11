"""FastAPI app: an AI representative that answers questions about one candidate.

Endpoints
    GET    /api/health              — liveness + configuration status
    GET    /api/profile             — the structured candidate profile
    GET    /api/suggestions         — starter questions for the chat UI
    POST   /api/chat                — streaming answer (Server-Sent Events)
    POST   /api/profile/reload      — re-read profile.json from disk (owner)
    PUT    /api/profile             — replace the profile without a code change (owner)
    GET    /api/admin/chats         — every question ever asked, with who asked it (owner)
    GET    /api/admin/chats/stats   — totals for the admin console (owner)
    GET    /api/admin/chats/export  — the same log as an Excel workbook (owner)
    DELETE /api/admin/chats         — erase the whole log (owner)
"""

import asyncio
import json
import logging
import os
import secrets
import time
from collections import defaultdict, deque
from contextlib import asynccontextmanager
from datetime import datetime, timezone
from typing import Any, AsyncIterator, Optional
from urllib.parse import unquote

from fastapi import Body, Depends, FastAPI, Header, HTTPException, Query, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, StreamingResponse
from pydantic import ValidationError
from starlette.concurrency import run_in_threadpool

from .chat_log import XLSX_AVAILABLE, ChatLogStore, parse_user_agent
from .config import Settings, get_settings
from .geo import GeoLookup
from .llm import LLMError, LLMRouter
from .moderation import (
    BLOCKED_MESSAGE,
    WARNINGS_BEFORE_BLOCK,
    StrikeStore,
    find_abuse,
    warning_message,
)
from .profile_store import ProfileStore
from .prompts import build_system_prompt
from .schemas import ChatRequest, VisitorInfo
from .turso import TursoClient

logging.basicConfig(
    level=os.getenv("LOG_LEVEL", "INFO"),
    format="%(asctime)s %(levelname)s %(name)s — %(message)s",
)
logger = logging.getLogger("ai-portfolio")

settings: Settings = get_settings()
store = ProfileStore(settings.profile_path)
turso = TursoClient(settings.turso_url, settings.turso_token)
chat_log = ChatLogStore(
    settings.chat_log_path, max_rows=settings.chat_log_max_rows, turso=turso
)
strikes = StrikeStore(settings.chat_log_path.with_name("blocked.json"), turso=turso)
geo = GeoLookup(enabled=settings.geo_lookup_enabled)


@asynccontextmanager
async def lifespan(app: FastAPI):
    app.state.llm = LLMRouter(settings)
    logger.info(
        "AI representative ready for %s | providers=%s | chain: %s",
        store.name,
        ", ".join(settings.providers) or "NONE — no API key set",
        " → ".join(ref.label for ref in settings.chain) or "(empty)",
    )
    if not settings.admin_token:
        logger.warning(
            "ADMIN_TOKEN is not set — the chat log is being written to %s but "
            "nobody can read, export or clear it until you set one.",
            settings.chat_log_path,
        )
    yield
    await run_in_threadpool(chat_log.flush)
    await run_in_threadpool(turso.close)
    await app.state.llm.aclose()
    await geo.aclose()


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
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["X-Model-Used", "X-Export-Format", "Content-Disposition"],
)


# --------------------------------------------------------------------------
# Rate limiting — a small in-process guard so a public demo can't burn the key
# --------------------------------------------------------------------------

_hits: dict[str, deque[float]] = defaultdict(deque)


def client_ip(request: Request) -> str:
    """The visitor's address as seen before Render/Cloudflare proxied it."""
    forwarded = request.headers.get("x-forwarded-for", "").split(",")[0].strip()
    return (
        forwarded
        or request.headers.get("x-real-ip", "").strip()
        or (request.client.host if request.client else "unknown")
    )


def rate_limit(request: Request) -> None:
    ip = client_ip(request)
    now = time.monotonic()
    window = settings.rate_limit_window_seconds
    bucket = _hits[ip]

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


def require_admin(
    x_admin_token: str = Header(default=""),
    token: str = Query(default="", description="Same token as the X-Admin-Token header."),
) -> None:
    """Owner-only gate.

    The token normally travels in the X-Admin-Token header. It is also accepted
    as a `?token=` query parameter, because a browser downloading the Excel file
    through a plain link cannot set a header.
    """
    expected = settings.admin_token or os.getenv("ADMIN_TOKEN", "").strip()
    if not expected:
        raise HTTPException(
            status_code=503, detail="Owner endpoints are disabled (ADMIN_TOKEN not set)."
        )

    supplied = x_admin_token or token
    # Constant-time compare so the token can't be guessed a character at a time.
    if not supplied or not secrets.compare_digest(supplied, expected):
        raise HTTPException(status_code=401, detail="Invalid admin token.")


# --------------------------------------------------------------------------
# Question logging — who asked what, kept for the owner's Excel export
# --------------------------------------------------------------------------


def asker_details(
    request: Request, visitor: Optional[VisitorInfo], kind: str
) -> dict[str, Any]:
    """Everything we know about who is asking, before the answer exists.

    Deliberately synchronous and cheap: it sits on the request path, so the one
    slow part — the IP lookup — runs alongside the answer via `start_geo_lookup`.
    """
    headers = request.headers
    agent = headers.get("user-agent", "")[:500]
    details = visitor.model_dump() if visitor else {}

    return {
        "id": f"{int(time.time() * 1000)}-{secrets.token_hex(4)}",
        "kind": kind,
        "asked_at": datetime.now(timezone.utc).isoformat(timespec="seconds"),
        "visitor_id": details.get("visitor_id") or "",
        "session_id": details.get("session_id") or "",
        "conversation_id": details.get("conversation_id") or "",
        "turn": details.get("turn") if details.get("turn") is not None else "",
        "name": details.get("name") or "",
        "email": details.get("email") or "",
        "company": details.get("company") or "",
        "ip": client_ip(request),
        # Some hosts hand us the location directly; the rest is filled in later.
        "city": _header(headers, "x-vercel-ip-city"),
        "region": _header(headers, "x-vercel-ip-country-region"),
        "country": headers.get("cf-ipcountry") or _header(headers, "x-vercel-ip-country"),
        "isp": "",
        "user_agent": agent,
        **parse_user_agent(agent),
        "page": details.get("page") or "",
        "referrer": details.get("referrer") or headers.get("referer", "")[:500],
        "timezone": details.get("timezone") or "",
        "screen": details.get("screen") or "",
        "browser_language": details.get("browser_language")
        or headers.get("accept-language", "").split(",")[0],
    }


def _header(headers, name: str) -> str:
    """Proxy geo headers arrive percent-encoded (e.g. `New%20Delhi`)."""
    return unquote(headers.get(name, "")).strip()


# Tasks are kept alive here; asyncio only holds a weak reference to them.
_background: set[asyncio.Task] = set()


def start_geo_lookup(entry: dict[str, Any]) -> Optional[asyncio.Task]:
    """Resolve the visitor's city while the model is still writing the answer.

    Started here and collected in `record_question`, so the lookup overlaps the
    generation instead of delaying either the first token or the final write.
    """
    if not geo.enabled or (entry.get("city") and entry.get("country")):
        return None

    task = asyncio.create_task(geo.lookup(entry["ip"]))
    _background.add(task)
    task.add_done_callback(_background.discard)
    return task


def record_question(entry: dict[str, Any], geo_task: Optional[asyncio.Task] = None) -> None:
    """Write one logged question to disk. Synchronous, and that is deliberate.

    This is called from the `finally` of the SSE generator, which may be running
    precisely because the visitor pressed stop or closed the tab. Anything
    awaited there re-raises the cancellation and the row is lost, and handing it
    to a background task means a process that dies moments later takes the last
    question with it. A single line appended to an open file is measured in
    microseconds, so it happens inline and is on disk before the response ends.
    """
    if not settings.chat_log_enabled:
        return

    # Whatever the lookup managed to find by now; it is never waited for.
    if geo_task is not None and geo_task.done() and not geo_task.cancelled():
        if geo_task.exception() is None:
            entry.update({key: value for key, value in geo_task.result().items() if value})

    chat_log.append(entry)  # swallows its own errors — logging can't break a chat


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
        # Public on purpose: it is just a timestamp, and every visitor's browser
        # needs it to know whether the details it remembers were wiped.
        "identity_reset_at": chat_log.reset_at,
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
    system_prompt = build_system_prompt(name=store.name, facts=facts)
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
    # -- moderation, before a single token is spent ------------------------
    #
    # 403 rather than an SSE error event: the visitor is not getting a stream at
    # all, and the browser needs a plain failure it can lock its composer on.
    visitor_id = (payload.visitor.visitor_id if payload.visitor else "") or ""
    ip = client_ip(request)

    if strikes.is_blocked(visitor_id, ip):
        raise HTTPException(status_code=403, detail=BLOCKED_MESSAGE)

    term = find_abuse(payload.message)
    if term:
        strike = await run_in_threadpool(
            strikes.record_strike, visitor_id, ip, term=term, question=payload.message
        )
        blocked = strike > WARNINGS_BEFORE_BLOCK
        detail = BLOCKED_MESSAGE if blocked else warning_message(strike)

        # Logged either way, message intact — the point is that Ritesh can see
        # exactly what was said, by whom, and how many times.
        flagged = asker_details(request, payload.visitor, kind="abuse")
        flagged.update(
            question=payload.message,
            answer=f"[{'blocked' if blocked else 'warned'} — abusive message, not sent to the model]",
            model="",
            status="flagged" if blocked else "warned",
            duration_s=0,
            language=payload.language,
            flagged_term=f"{term} (strike {strike})",
        )
        record_question(flagged, start_geo_lookup(flagged))

        # 403 ends the conversation; 400 is a warning the composer stays open for.
        raise HTTPException(status_code=403 if blocked else 400, detail=detail)

    messages = _build_messages(payload, store.facts)
    # Smaller models reject the full prompt (HTTP 413); they get this instead.
    compact_messages = _build_messages(payload, store.facts_compact)
    llm: LLMRouter = request.app.state.llm

    entry = asker_details(request, payload.visitor, kind="chat")
    geo_task = start_geo_lookup(entry)

    async def event_stream() -> AsyncIterator[str]:
        # Which model actually answered — the router may have failed over.
        selected = {"model": None}
        answer: list[str] = []
        status = "ok"
        started = time.monotonic()
        try:
            got_content = False
            async for chunk in llm.stream_chat(
                messages,
                on_model_selected=lambda name: selected.update(model=name),
                compact_messages=compact_messages,
            ):
                got_content = True
                answer.append(chunk)
                yield _sse("token", {"text": chunk})
            if not got_content:
                status = "empty"
                yield _sse("error", {"detail": "The AI returned an empty response. Please try again."})
        except asyncio.CancelledError:
            # The visitor hit stop or closed the tab — still worth logging.
            status = "stopped"
            raise
        except LLMError as exc:
            status = "error"
            answer.append(str(exc))
            yield _sse("error", {"detail": str(exc)})
        except Exception:  # noqa: BLE001 — the stream must always terminate cleanly
            status = "error"
            logger.exception("Unexpected failure while streaming chat")
            yield _sse("error", {"detail": "Something went wrong while answering. Please try again."})
        finally:
            # Logged once the turn is over, so nothing sits in front of the
            # visitor's first token.
            entry.update(
                question=payload.message,
                answer="".join(answer),
                model=selected["model"] or "",
                status=status,
                duration_s=round(time.monotonic() - started, 2),
                language=payload.language,
            )
            record_question(entry, geo_task)

            yield _sse(
                "done",
                {
                    "model": selected["model"] or settings.primary_model,
                    # Lets a tab that has been open since before a wipe notice it.
                    "identity_reset_at": chat_log.reset_at,
                },
            )

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
# Owner-only: the question log
#
# Visitors can never reach any of this. Their browser keeps a local copy of
# their own conversation for convenience, but the record here is the site
# owner's, and only the ADMIN_TOKEN holder can read, export or erase it.
# --------------------------------------------------------------------------


@app.get("/api/admin/chats", dependencies=[Depends(require_admin)])
async def list_chats(
    limit: int = Query(default=50, ge=1, le=500),
    offset: int = Query(default=0, ge=0),
    search: str = Query(default="", max_length=200),
) -> dict:
    entries, total = await run_in_threadpool(chat_log.page, limit, offset, search)
    return {
        "entries": entries,
        "total": total,
        "limit": limit,
        "offset": offset,
        "search": search,
    }


@app.get("/api/admin/chats/stats", dependencies=[Depends(require_admin)])
async def chat_stats() -> dict:
    stats = await run_in_threadpool(chat_log.stats)
    return {**stats, "logging_enabled": settings.chat_log_enabled}


@app.get("/api/admin/chats/export", dependencies=[Depends(require_admin)])
async def export_chats(
    format: str = Query(default="xlsx", pattern="^(xlsx|csv)$")
) -> Response:
    """Download the whole log as a spreadsheet.

    Falls back to CSV — which Excel opens natively — when openpyxl is missing
    from the deployment, rather than failing the download outright.
    """
    stamp = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    use_xlsx = format == "xlsx" and XLSX_AVAILABLE

    if use_xlsx:
        content = await run_in_threadpool(chat_log.to_xlsx)
        media = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        filename, actual = f"portfolio-chats-{stamp}.xlsx", "xlsx"
    else:
        content = await run_in_threadpool(chat_log.to_csv)
        media = "text/csv; charset=utf-8"
        filename, actual = f"portfolio-chats-{stamp}.csv", "csv"
        if format == "xlsx":
            logger.warning("openpyxl unavailable — served the export as CSV instead")

    return Response(
        content=content,
        media_type=media,
        headers={
            "Content-Disposition": f'attachment; filename="{filename}"',
            "X-Export-Format": actual,
            "Cache-Control": "no-store",
        },
    )


@app.delete("/api/admin/chats", dependencies=[Depends(require_admin)])
async def delete_chats(
    confirm: str = Query(
        default="", description="Must be the literal string DELETE-ALL."
    )
) -> dict:
    """Erase every logged question. Owner only, and deliberately awkward."""
    if confirm != "DELETE-ALL":
        raise HTTPException(
            status_code=400,
            detail="Add ?confirm=DELETE-ALL to confirm erasing the entire chat log.",
        )
    removed = await run_in_threadpool(chat_log.clear)
    # The blocks were raised by messages that no longer exist, so they go too.
    unblocked = await run_in_threadpool(strikes.clear)
    return {"status": "cleared", "deleted": removed, "unblocked": unblocked}


# --------------------------------------------------------------------------
# Owner-only: update the candidate data without touching code
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

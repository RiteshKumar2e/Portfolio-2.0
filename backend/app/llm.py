"""LLM client with an automatic fallback chain across models and providers.

Free tiers are rate-limited per model, so any single model eventually returns
429 under load. This client keeps an ordered list of (provider, model) links —
all Groq models, then Google's, which is a separate quota entirely. When one is
rate-limited or unhealthy it goes on a cooldown and the next one answers. From
the visitor's point of view the chat just keeps working.

Both providers are reached through their OpenAI-compatible chat/completions
endpoint, so one streaming code path serves both.
"""

import json
import logging
import time
from typing import AsyncIterator, Callable

import httpx

from .config import ModelRef, Settings

logger = logging.getLogger(__name__)

# Failures worth moving down the chain for. Credential and bad-request errors
# are included because the chain spans two providers, and they disagree on how
# to report the same problem: Groq answers 401 for a bad key, Gemini answers
# 400 "Please pass a valid API key". Neither must be allowed to abort the whole
# chain — one provider's misconfiguration should never silence the other.
FAILOVER_STATUSES = {400, 401, 403, 408, 409, 413, 429, 500, 502, 503, 504}

# Substrings that mark a failure as "this key/model will not work", so the link
# earns a long cooldown rather than being retried every few seconds.
_CREDENTIAL_HINTS = ("api key", "api_key", "credential", "unauthorized", "permission")

# Reasoning models (qwen3, some gpt-oss builds) stream their private chain of
# thought wrapped in these tags. Visitors must never see it.
REASONING_TAGS = (("<think>", "</think>"), ("<thinking>", "</thinking>"))


class ReasoningFilter:
    """Removes <think>…</think> spans from a token stream.

    Tags can be split across network chunks, so any trailing text that could
    still turn out to be the start of a tag is held back until the next chunk
    resolves it.
    """

    _OPEN = tuple(pair[0] for pair in REASONING_TAGS)
    _CLOSE = tuple(pair[1] for pair in REASONING_TAGS)

    def __init__(self) -> None:
        self._buffer = ""
        self._closing: str | None = None  # set while inside a reasoning span

    def feed(self, chunk: str) -> str:
        self._buffer += chunk
        out: list[str] = []

        while True:
            if self._closing:
                index = self._buffer.find(self._closing)
                if index == -1:
                    self._buffer = self._keep_partial_tail(self._buffer, (self._closing,))
                    break
                self._buffer = self._buffer[index + len(self._closing) :]
                self._closing = None
                continue

            index, tag = self._first_of(self._buffer, self._OPEN)
            if index == -1:
                safe = self._keep_partial_tail(self._buffer, self._OPEN)
                emit_len = len(self._buffer) - len(safe)
                if emit_len:
                    out.append(self._buffer[:emit_len])
                self._buffer = safe
                break

            out.append(self._buffer[:index])
            self._buffer = self._buffer[index + len(tag) :]
            self._closing = self._CLOSE[self._OPEN.index(tag)]

        return "".join(out)

    def flush(self) -> str:
        """Emit whatever is left, unless it was unterminated reasoning."""
        if self._closing:
            return ""
        remainder, self._buffer = self._buffer, ""
        return remainder

    @staticmethod
    def _first_of(text: str, tags: tuple[str, ...]) -> tuple[int, str]:
        best, best_tag = -1, ""
        for tag in tags:
            index = text.find(tag)
            if index != -1 and (best == -1 or index < best):
                best, best_tag = index, tag
        return best, best_tag

    @staticmethod
    def _keep_partial_tail(text: str, tags: tuple[str, ...]) -> str:
        """Return the trailing slice that might be the start of a tag."""
        longest = max(len(tag) for tag in tags)
        for size in range(min(longest - 1, len(text)), 0, -1):
            tail = text[-size:]
            if any(tag.startswith(tail) for tag in tags):
                return tail
        return ""


class LLMError(RuntimeError):
    """Raised when the upstream LLM call fails in a way the caller must handle."""

    def __init__(self, message: str, status_code: int = 502) -> None:
        super().__init__(message)
        self.status_code = status_code


class _ModelHealth:
    """Tracks which links are currently sidelined, and until when.

    Keyed by `ModelRef.label` ("groq:llama-3.3-70b-versatile") so the same model
    id on two providers never shares a health record.
    """

    def __init__(self, models: list[str]) -> None:
        self._models = models
        self._available_at: dict[str, float] = {}
        self._last_reason: dict[str, str] = {}
        # Models that rejected the full prompt as too large (HTTP 413) and must
        # be sent the compact one from now on.
        self._needs_compact: set[str] = set()

    def order(self) -> list[str]:
        """Healthy models first (in preference order), then cooling-down ones.

        Cooling-down models stay in the list as a last resort — answering with a
        degraded model beats telling the visitor the AI is down.
        """
        now = time.monotonic()
        healthy = [m for m in self._models if self._available_at.get(m, 0) <= now]
        cooling = [m for m in self._models if self._available_at.get(m, 0) > now]
        cooling.sort(key=lambda m: self._available_at[m])
        return healthy + cooling

    def penalise(self, model: str, seconds: float, reason: str) -> None:
        self._available_at[model] = time.monotonic() + seconds
        self._last_reason[model] = reason
        logger.warning("Model %s sidelined for %.0fs (%s)", model, seconds, reason)

    def recover(self, model: str) -> None:
        if self._available_at.pop(model, None) is not None:
            self._last_reason.pop(model, None)
            logger.info("Model %s is healthy again", model)

    def needs_compact(self, model: str) -> bool:
        return model in self._needs_compact

    def mark_needs_compact(self, model: str) -> None:
        if model not in self._needs_compact:
            self._needs_compact.add(model)
            logger.warning("Model %s rejected the full prompt — switching it to the compact one", model)

    def snapshot(self) -> list[dict]:
        now = time.monotonic()
        return [
            {
                "model": model,
                "available": self._available_at.get(model, 0) <= now,
                "cooldown_seconds_left": max(0, round(self._available_at.get(model, 0) - now)),
                "last_error": self._last_reason.get(model),
                "uses_compact_prompt": model in self._needs_compact,
            }
            for model in self._models
        ]


class LLMRouter:
    """Runs a request down the chain until some model answers.

    Every provider is called through its OpenAI-compatible chat/completions
    endpoint, so Groq and Gemini differ only by URL, key and model id.
    """

    def __init__(self, settings: Settings) -> None:
        self._settings = settings
        self._refs: list[ModelRef] = settings.chain
        self._by_label: dict[str, ModelRef] = {ref.label: ref for ref in self._refs}
        self._health = _ModelHealth([ref.label for ref in self._refs])
        # No base_url: the chain spans more than one host.
        self._client = httpx.AsyncClient(
            timeout=httpx.Timeout(settings.request_timeout, connect=10.0),
            headers={"Content-Type": "application/json"},
        )

    async def aclose(self) -> None:
        await self._client.aclose()

    @property
    def models(self) -> list[str]:
        return [ref.label for ref in self._refs]

    def health_snapshot(self) -> list[dict]:
        return [
            {**entry, "provider": self._by_label[entry["model"]].provider}
            for entry in self._health.snapshot()
        ]

    # -- internals ---------------------------------------------------------

    def _payload(self, ref: ModelRef, messages: list[dict], **overrides) -> dict:
        payload = {
            "model": ref.model,
            "messages": messages,
            "temperature": self._settings.temperature,
            "max_tokens": self._settings.max_tokens,
        }
        payload.update(overrides)
        return payload

    def _messages_for(
        self, model: str, messages: list[dict], compact: list[dict] | None
    ) -> list[dict]:
        """Give a model the compact prompt if the full one was too large for it."""
        if compact and self._health.needs_compact(model):
            return compact
        return messages

    def _auth_headers(self, ref: ModelRef) -> dict:
        return {"Authorization": f"Bearer {ref.api_key}"}

    @staticmethod
    def _extract_detail(body: str) -> str:
        """Pull the human-readable message out of a provider error body.

        Groq returns {"error": {...}}; Gemini returns [{"error": {...}}].
        """
        try:
            parsed = json.loads(body)
            if isinstance(parsed, list) and parsed:
                parsed = parsed[0]
            return str(parsed.get("error", {}).get("message", body))[:300]
        except (json.JSONDecodeError, AttributeError, TypeError):
            return body[:300]

    def _penalise_for_status(self, model: str, status: int, headers, detail: str) -> None:
        """Sideline a model for a duration that fits why it failed."""
        if status == 429:
            retry_after = self._parse_retry_after(headers)
            self._health.penalise(
                model, retry_after or self._settings.cooldown_rate_limited, "rate limited"
            )
        elif status in (401, 403) or any(hint in detail.lower() for hint in _CREDENTIAL_HINTS):
            self._health.penalise(model, self._settings.cooldown_unavailable, "credentials rejected")
        elif status in (400, 404) and "model" in detail.lower():
            # Decommissioned or misspelled model — no point retrying it soon.
            self._health.penalise(model, self._settings.cooldown_unavailable, f"unavailable: {detail}")
        else:
            self._health.penalise(model, self._settings.cooldown_server_error, f"http {status}")

    @staticmethod
    def _parse_retry_after(headers) -> float | None:
        raw = headers.get("retry-after") or headers.get("x-ratelimit-reset-requests")
        if not raw:
            return None
        try:
            return min(float(str(raw).rstrip("s")), 300.0)
        except ValueError:
            return None

    def _fatal_error(self, status: int, detail: str) -> LLMError:
        if status in (401, 403):
            return LLMError("The AI's API credentials were rejected.", 503)
        if status == 429:
            return LLMError(
                "Every model is rate-limited right now. Please try again in a minute.",
                429,
            )
        logger.error("Groq API error %s: %s", status, detail)
        return LLMError("The AI service is temporarily unavailable.", 502)

    # -- public API --------------------------------------------------------

    async def stream_chat(
        self,
        messages: list[dict],
        on_model_selected: Callable[[str], None] | None = None,
        compact_messages: list[dict] | None = None,
    ) -> AsyncIterator[str]:
        """Yield response text chunk by chunk, failing over between models.

        Failover only happens before the first token is emitted. Once the
        visitor is reading an answer, switching models would restart it
        mid-sentence, so a mid-stream failure is surfaced instead.
        """
        if not self._refs:
            raise LLMError(
                "The AI is not configured yet — no provider API key is set on the server.",
                status_code=503,
            )

        last_error: LLMError | None = None
        candidates = self._health.order()
        index = 0

        while index < len(candidates):
            model = candidates[index]
            ref = self._by_label[model]
            sent_compact = bool(compact_messages) and self._health.needs_compact(model)
            payload = self._payload(
                ref, self._messages_for(model, messages, compact_messages), stream=True
            )
            reasoning = ReasoningFilter()
            emitted = False

            try:
                async with self._client.stream(
                    "POST", ref.endpoint, json=payload, headers=self._auth_headers(ref)
                ) as response:
                    if response.status_code >= 400:
                        body = (await response.aread()).decode("utf-8", errors="replace")
                        detail = self._extract_detail(body)

                        # Too big for this model's per-request budget. Mark it
                        # and immediately retry the same model with the compact
                        # prompt, so the visitor never sees the failure.
                        if response.status_code == 413 and compact_messages and not sent_compact:
                            self._health.mark_needs_compact(model)
                            continue

                        if response.status_code in FAILOVER_STATUSES or response.status_code == 404:
                            self._penalise_for_status(model, response.status_code, response.headers, detail)
                            last_error = self._fatal_error(response.status_code, detail)
                            index += 1
                            continue
                        raise self._fatal_error(response.status_code, detail)

                    async for line in response.aiter_lines():
                        if not line or not line.startswith("data:"):
                            continue
                        data = line[5:].strip()
                        if data == "[DONE]":
                            break
                        try:
                            chunk = json.loads(data)
                        except json.JSONDecodeError:
                            continue
                        choices = chunk.get("choices") or []
                        if not choices:
                            continue
                        delta = choices[0].get("delta", {}).get("content")
                        if not delta:
                            continue

                        visible = reasoning.feed(delta)
                        if not visible:
                            continue  # still inside a <think> span, or a partial tag

                        if not emitted:
                            emitted = True
                            self._health.recover(model)
                            if on_model_selected:
                                on_model_selected(model)
                            visible = visible.lstrip()
                            if not visible:
                                emitted = False
                                continue
                        yield visible

                    tail = reasoning.flush()
                    if tail.strip():
                        if not emitted:
                            emitted = True
                            self._health.recover(model)
                            if on_model_selected:
                                on_model_selected(model)
                        yield tail

                if emitted:
                    return

                # Connected fine but produced nothing — try the next model.
                self._health.penalise(model, self._settings.cooldown_server_error, "empty response")
                last_error = LLMError("The AI returned an empty response.")

            except (httpx.TimeoutException, httpx.TransportError) as exc:
                if emitted:
                    raise LLMError("The connection dropped while answering. Please try again.") from exc
                self._health.penalise(model, self._settings.cooldown_server_error, type(exc).__name__)
                last_error = LLMError("The AI service is temporarily unreachable.")

            index += 1

        raise last_error or LLMError("No AI model is available right now.", 503)

    async def complete_json(
        self,
        messages: list[dict],
        max_tokens: int | None = None,
        compact_messages: list[dict] | None = None,
    ) -> tuple[dict, str]:
        """One-shot completion constrained to JSON. Returns (payload, model_used)."""
        if not self._refs:
            raise LLMError(
                "The AI is not configured yet — no provider API key is set on the server.",
                status_code=503,
            )

        last_error: LLMError | None = None

        for model in self._health.order():
            ref = self._by_label[model]
            payload = self._payload(
                ref,
                self._messages_for(model, messages, compact_messages),
                response_format={"type": "json_object"},
                temperature=0.2,
                max_tokens=max_tokens or self._settings.max_tokens,
            )

            try:
                response = await self._client.post(
                    ref.endpoint, json=payload, headers=self._auth_headers(ref)
                )
            except (httpx.TimeoutException, httpx.TransportError) as exc:
                self._health.penalise(model, self._settings.cooldown_server_error, type(exc).__name__)
                last_error = LLMError("The AI service is temporarily unreachable.")
                continue

            if response.status_code >= 400:
                detail = self._extract_detail(response.text)
                if response.status_code == 413 and compact_messages:
                    self._health.mark_needs_compact(model)
                if response.status_code in FAILOVER_STATUSES or response.status_code == 404:
                    self._penalise_for_status(model, response.status_code, response.headers, detail)
                    last_error = self._fatal_error(response.status_code, detail)
                    continue
                raise self._fatal_error(response.status_code, detail)

            try:
                content = response.json()["choices"][0]["message"]["content"]
            except (KeyError, IndexError, json.JSONDecodeError):
                self._health.penalise(model, self._settings.cooldown_server_error, "bad response shape")
                last_error = LLMError("The AI returned an unexpected response shape.")
                continue

            parsed = _parse_json_object(content)
            if parsed is None:
                # A weaker model producing prose instead of JSON is a model
                # problem, so let the next one in the chain try.
                logger.warning("Model %s returned unparseable JSON", model)
                last_error = LLMError("The AI returned malformed JSON.")
                continue

            self._health.recover(model)
            return parsed, model

        raise last_error or LLMError("No AI model is available right now.", 503)


def _parse_json_object(content: str) -> dict | None:
    try:
        return json.loads(content)
    except json.JSONDecodeError:
        pass

    # Some models wrap JSON in a markdown fence despite json_object mode.
    cleaned = content.strip().removeprefix("```json").removeprefix("```").removesuffix("```").strip()
    try:
        return json.loads(cleaned)
    except json.JSONDecodeError:
        pass

    # Last resort: the outermost {...} span.
    start, end = cleaned.find("{"), cleaned.rfind("}")
    if start != -1 and end > start:
        try:
            return json.loads(cleaned[start : end + 1])
        except json.JSONDecodeError:
            return None
    return None

"""Runtime configuration, read once from the environment."""

import os
from dataclasses import dataclass
from functools import lru_cache
from pathlib import Path

from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent.parent

load_dotenv(BASE_DIR / ".env")


def _csv(value: str) -> list[str]:
    return [item.strip() for item in value.split(",") if item.strip()]


def _flag(name: str, default: bool) -> bool:
    raw = os.getenv(name, "").strip().lower()
    if not raw:
        return default
    return raw in {"1", "true", "yes", "on"}


@dataclass(frozen=True)
class ModelRef:
    """One model on one provider — a single link in the fallback chain."""

    provider: str  # "groq" | "gemini"
    model: str  # id sent to the API
    endpoint: str  # full chat/completions URL
    api_key: str

    @property
    def label(self) -> str:
        """Stable name for logs, health output and the UI."""
        return f"{self.provider}:{self.model}"


# Ordered best-first. Every entry is a distinct chat model with a 128k context
# window (the system prompt needs ~5k tokens) AND its own rate-limit budget —
# Groq meters tokens-per-day per model, so six models means six daily budgets.
#
# This is every usable chat model Groq exposes; the rest of their catalogue
# cannot serve this workload:
#   - groq/compound, groq/compound-mini: these route to llama-3.3-70b-versatile
#     internally and consume its quota, so they add no capacity when it is the
#     model that ran out. (Confirmed by their 429: "Rate limit reached for model
#     `llama-3.3-70b-versatile`".) They also carry built-in web search, which
#     could pull facts from outside the profile.
#   - whisper-*: speech-to-text.  canopylabs/orpheus-*: text-to-speech.
#   - meta-llama/llama-prompt-guard-*: 512-token classifiers.
#   - allam-2-7b: 4k context — smaller than the prompt itself.
DEFAULT_MODEL_CHAIN = [
    "llama-3.3-70b-versatile",
    "openai/gpt-oss-120b",
    "qwen/qwen3.6-27b",
    "openai/gpt-oss-20b",
    "llama-3.1-8b-instant",
    "openai/gpt-oss-safeguard-20b",
]

# Google's free tier is a separate quota from Groq's, so these keep the chat
# alive on a day when every Groq model is exhausted. Reached through Gemini's
# OpenAI-compatible endpoint, so the same streaming code path serves both.
DEFAULT_GEMINI_CHAIN = [
    "gemini-2.5-flash",
    "gemini-2.0-flash",
    "gemini-2.0-flash-lite",
]


class Settings:
    """Plain settings object — everything is overridable through env vars."""

    def __init__(self) -> None:
        self.groq_api_key: str = os.getenv("GROQ_API_KEY", "").strip()
        self.groq_base_url: str = os.getenv(
            "GROQ_BASE_URL", "https://api.groq.com/openai/v1"
        ).rstrip("/")
        # Ordered fallback chain: the first healthy model answers. When one is
        # rate-limited it is put on cooldown and the next takes over, so a 429
        # on the busiest model never reaches the visitor.
        self.groq_models: list[str] = _csv(
            os.getenv("GROQ_MODELS", "")
            or os.getenv("GROQ_MODEL", "")
            or ",".join(DEFAULT_MODEL_CHAIN)
        )

        # Cross-provider fallback. Optional: without a key the Gemini links are
        # simply left out of the chain.
        self.gemini_api_key: str = os.getenv("GEMINI_API_KEY", "").strip()
        self.gemini_base_url: str = os.getenv(
            "GEMINI_BASE_URL", "https://generativelanguage.googleapis.com/v1beta/openai"
        ).rstrip("/")
        self.gemini_models: list[str] = _csv(
            os.getenv("GEMINI_MODELS", "") or ",".join(DEFAULT_GEMINI_CHAIN)
        )

        self.temperature: float = float(os.getenv("LLM_TEMPERATURE", "0.3"))
        self.max_tokens: int = int(os.getenv("LLM_MAX_TOKENS", "1024"))
        self.request_timeout: float = float(os.getenv("LLM_TIMEOUT_SECONDS", "60"))

        # How long a model sits out after failing, before it is tried again.
        self.cooldown_rate_limited: float = float(os.getenv("COOLDOWN_RATE_LIMITED", "60"))
        self.cooldown_server_error: float = float(os.getenv("COOLDOWN_SERVER_ERROR", "20"))
        self.cooldown_unavailable: float = float(os.getenv("COOLDOWN_UNAVAILABLE", "1800"))

        self.profile_path: Path = Path(
            os.getenv("PROFILE_PATH", str(BASE_DIR / "data" / "profile.json"))
        )

        # Conversation memory: how many prior messages the client may replay to us.
        self.max_history_messages: int = int(os.getenv("MAX_HISTORY_MESSAGES", "20"))
        self.max_question_chars: int = int(os.getenv("MAX_QUESTION_CHARS", "2000"))
        self.max_jd_chars: int = int(os.getenv("MAX_JD_CHARS", "12000"))

        # Comma-separated list, or "*" to allow any origin.
        self.allowed_origins: list[str] = _csv(
            os.getenv(
                "ALLOWED_ORIGINS",
                "http://localhost:3000,http://localhost:5173,https://riteshkr.info,https://www.riteshkr.info",
            )
        )

        # Simple in-process rate limit (requests per window, per client IP).
        self.rate_limit_requests: int = int(os.getenv("RATE_LIMIT_REQUESTS", "30"))
        self.rate_limit_window_seconds: int = int(
            os.getenv("RATE_LIMIT_WINDOW_SECONDS", "60")
        )

        # Owner-only endpoints (profile edits, the chat log, deleting the log).
        # Without a token every one of them answers 503 — the log still records,
        # it simply cannot be read or cleared by anybody, including the owner.
        self.admin_token: str = os.getenv("ADMIN_TOKEN", "").strip()

        # Where the question log lives. On Render's free plan the filesystem is
        # wiped on every deploy and cold start, so point this at a mounted disk
        # (e.g. /var/data/chat_log.jsonl) if the history has to outlive a deploy.
        self.chat_log_enabled: bool = _flag("CHAT_LOG_ENABLED", default=True)
        self.chat_log_path: Path = Path(
            os.getenv("CHAT_LOG_PATH", str(BASE_DIR / "data" / "chat_log.jsonl"))
        )
        # Turso (libSQL) is what makes the log survive a deploy: the host wipes
        # the container filesystem on every restart, so without these two the
        # chat log and the abuse strikes only live until the next cold start.
        # Both must be set; either one alone falls back to the files above.
        self.turso_url: str = os.getenv("TURSO_DATABASE_URL", "").strip()
        self.turso_token: str = os.getenv("TURSO_AUTH_TOKEN", "").strip()

        # 0 keeps every question forever; anything else trims the oldest rows.
        self.chat_log_max_rows: int = int(os.getenv("CHAT_LOG_MAX_ROWS", "20000"))
        # Sends visitor IPs to ip-api.com to fill the City/Country columns.
        self.geo_lookup_enabled: bool = _flag("GEO_LOOKUP_ENABLED", default=False)

    @property
    def chain(self) -> list[ModelRef]:
        """The full fallback chain: every Groq model, then every Gemini one.

        Providers with no API key contribute nothing, so the service still runs
        on Groq alone (or on Gemini alone, if that is all that is configured).
        """
        refs: list[ModelRef] = []

        if self.groq_api_key:
            refs.extend(
                ModelRef("groq", model, f"{self.groq_base_url}/chat/completions", self.groq_api_key)
                for model in self.groq_models
            )
        if self.gemini_api_key:
            refs.extend(
                ModelRef(
                    "gemini", model, f"{self.gemini_base_url}/chat/completions", self.gemini_api_key
                )
                for model in self.gemini_models
            )
        return refs

    @property
    def configured(self) -> bool:
        return bool(self.groq_api_key or self.gemini_api_key)

    @property
    def providers(self) -> list[str]:
        return [
            name
            for name, key in (("groq", self.groq_api_key), ("gemini", self.gemini_api_key))
            if key
        ]

    @property
    def primary_model(self) -> str:
        chain = self.chain
        return chain[0].label if chain else "none configured"


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    return Settings()

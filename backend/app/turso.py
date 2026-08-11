"""Minimal Turso (libSQL) client over the HTTP pipeline API.

Why HTTP rather than the `libsql` driver: the driver ships a native extension,
and this service deploys to a free Render instance where a wheel that has to be
compiled is a build failure waiting to happen. The pipeline endpoint is a plain
POST of JSON, httpx is already a dependency, and the whole surface this app
needs is "run this statement, give me back rows".

Everything here is synchronous on purpose. Callers either run it inside
`run_in_threadpool` (admin reads, strike writes) or hand it to the chat log's
background writer — never on the event loop.
"""

import json
import logging
from typing import Any, Iterable, Optional, Sequence

import httpx

logger = logging.getLogger("ai-portfolio.turso")


class TursoError(RuntimeError):
    """A statement did not run. Callers decide whether that is fatal."""


def _encode(value: Any) -> dict[str, Any]:
    """Python value → the pipeline API's tagged-value form."""
    if value is None:
        return {"type": "null"}
    if isinstance(value, bool):  # before int — bool is an int in Python
        return {"type": "integer", "value": str(int(value))}
    if isinstance(value, int):
        return {"type": "integer", "value": str(value)}
    if isinstance(value, float):
        return {"type": "float", "value": value}
    return {"type": "text", "value": str(value)}


def _decode(cell: dict[str, Any]) -> Any:
    kind = cell.get("type")
    if kind == "null":
        return None
    if kind == "integer":
        return int(cell["value"])
    if kind == "float":
        return float(cell["value"])
    return cell.get("value")


class TursoClient:
    """One database, addressed over HTTP.

    `enabled` is false when no URL/token is configured, which is how the app
    falls back to plain files for local development.
    """

    def __init__(self, url: str = "", token: str = "", timeout: float = 15.0) -> None:
        self._token = token.strip()
        self._url = self._to_http(url.strip())
        self._timeout = timeout
        self._client: Optional[httpx.Client] = None

    @staticmethod
    def _to_http(url: str) -> str:
        """`libsql://name-org.turso.io` is the form Turso hands out; the HTTP
        API lives at the same host over https."""
        if not url:
            return ""
        for prefix in ("libsql://", "wss://", "ws://"):
            if url.startswith(prefix):
                url = "https://" + url[len(prefix) :]
                break
        return url.rstrip("/")

    @property
    def enabled(self) -> bool:
        return bool(self._url and self._token)

    def _http(self) -> httpx.Client:
        if self._client is None:
            self._client = httpx.Client(
                base_url=self._url,
                timeout=self._timeout,
                headers={"Authorization": f"Bearer {self._token}"},
            )
        return self._client

    # -- statements --------------------------------------------------------

    def execute(self, sql: str, args: Sequence[Any] = ()) -> list[dict[str, Any]]:
        """Run one statement and return its rows as dicts."""
        return self.batch([(sql, args)])[0]

    def batch(self, statements: Iterable[tuple[str, Sequence[Any]]]) -> list[list[dict[str, Any]]]:
        """Run several statements in one round trip, in order."""
        requests = [
            {
                "type": "execute",
                "stmt": {"sql": sql, "args": [_encode(arg) for arg in args]},
            }
            for sql, args in statements
        ]
        if not requests:
            return []
        requests.append({"type": "close"})

        try:
            response = self._http().post("/v2/pipeline", json={"requests": requests})
            response.raise_for_status()
            payload = response.json()
        except (httpx.HTTPError, json.JSONDecodeError) as exc:
            raise TursoError(f"Turso request failed: {exc}") from exc

        results: list[list[dict[str, Any]]] = []
        for item in payload.get("results", []):
            if item.get("type") == "error":
                raise TursoError(item.get("error", {}).get("message", "unknown Turso error"))
            if item.get("type") != "ok":
                continue
            body = item.get("response", {})
            if body.get("type") != "execute":
                continue
            result = body.get("result", {})
            columns = [col.get("name") for col in result.get("cols", [])]
            results.append(
                [dict(zip(columns, (_decode(cell) for cell in row))) for row in result.get("rows", [])]
            )
        return results

    def close(self) -> None:
        if self._client is not None:
            self._client.close()
            self._client = None

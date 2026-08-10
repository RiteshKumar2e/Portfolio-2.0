"""Durable log of every question a visitor asks, exportable as an Excel sheet.

Storage is an append-only JSONL file: one question per line, written the moment
the answer finishes. JSONL is used rather than writing .xlsx directly because a
spreadsheet has to be rewritten whole on every change — a plain append is
atomic enough to survive a crash mid-request and costs microseconds. The
workbook is rendered on demand when the owner downloads it.

Only the owner (ADMIN_TOKEN) can read or clear this log; visitors can neither
see it nor delete from it.
"""

import csv
import io
import json
import logging
import re
import threading
import time
from datetime import datetime, timedelta, timezone
from pathlib import Path
from typing import Any, Iterator

logger = logging.getLogger("ai-portfolio.chatlog")

IST = timezone(timedelta(hours=5, minutes=30))

try:  # optional — without it the export falls back to CSV, which Excel opens fine
    from openpyxl import Workbook
    from openpyxl.styles import Alignment, Font, PatternFill
    from openpyxl.utils import get_column_letter

    XLSX_AVAILABLE = True
except ImportError:  # pragma: no cover - depends on the deployment image
    XLSX_AVAILABLE = False


# (header, entry key, column width) — the order here is the order in the sheet.
# Who asked comes before what they asked, because that is what the sheet is for.
COLUMNS: list[tuple[str, str, int]] = [
    ("#", "row", 6),
    ("Date (IST)", "date_ist", 12),
    ("Time (IST)", "time_ist", 10),
    ("Type", "kind", 11),
    ("Name", "name", 18),
    ("Email", "email", 26),
    ("Company / role", "company", 22),
    ("Question", "question", 60),
    ("Answer", "answer", 70),
    ("IP address", "ip", 16),
    ("City", "city", 14),
    ("Region", "region", 14),
    ("Country", "country", 12),
    ("Network / ISP", "isp", 22),
    ("Device", "device", 10),
    ("OS", "os", 14),
    ("Browser", "browser", 14),
    ("Page", "page", 30),
    ("Came from", "referrer", 30),
    ("Their timezone", "timezone", 20),
    ("Screen", "screen", 12),
    ("Browser language", "browser_language", 16),
    ("Reply language", "language", 12),
    ("Visitor ID", "visitor_id", 20),
    ("Session ID", "session_id", 20),
    ("Conversation", "conversation_id", 20),
    ("Turn", "turn", 6),
    ("Model used", "model", 26),
    ("Status", "status", 10),
    ("Reply time (s)", "duration_s", 12),
    ("Job description", "job_description", 40),
    ("User agent", "user_agent", 40),
    ("Asked at (UTC)", "asked_at", 22),
]

KIND_LABELS = {"chat": "Chat", "job_match": "Job match", "interview": "Interview Qs"}


class ChatLogStore:
    """Append-only question log on disk, with owner-only read/export/clear."""

    def __init__(self, path: Path, max_rows: int = 20000) -> None:
        self._path = path
        # Sidecar, so it survives the log file being deleted — that is the whole
        # point of it. Holds when the log was last wiped.
        self._meta_path = path.with_name(path.stem + ".meta.json")
        self._max_rows = max_rows
        self._lock = threading.Lock()
        self._count = self._count_lines()
        self._reset_at = self._read_reset_at()
        logger.info("Chat log at %s (%d entries)", self._path, self._count)

    # -- writing -----------------------------------------------------------

    def append(self, entry: dict[str, Any]) -> None:
        """Persist one question. Never raises — a logging failure must not
        break the answer the visitor is already reading."""
        try:
            line = json.dumps(entry, ensure_ascii=False, default=str)
            with self._lock:
                self._path.parent.mkdir(parents=True, exist_ok=True)
                with self._path.open("a", encoding="utf-8") as handle:
                    handle.write(line + "\n")
                self._count += 1
                over = self._max_rows and self._count > self._max_rows
            if over:
                self._trim()
        except Exception:  # noqa: BLE001 — logging is best-effort by design
            logger.exception("Could not append to the chat log")

    def _trim(self) -> None:
        """Drop the oldest entries once the file passes its ceiling.

        Set CHAT_LOG_MAX_ROWS=0 to keep everything forever instead.
        """
        try:
            with self._lock:
                lines = self._path.read_text(encoding="utf-8").splitlines()
                keep = lines[-self._max_rows :]
                self._path.write_text("\n".join(keep) + "\n", encoding="utf-8")
                dropped = len(lines) - len(keep)
                self._count = len(keep)
            logger.warning("Chat log hit %d rows — dropped the %d oldest", self._max_rows, dropped)
        except Exception:  # noqa: BLE001
            logger.exception("Could not trim the chat log")

    # -- reading -----------------------------------------------------------

    # -- the reset marker --------------------------------------------------
    #
    # Wiping the log has to reach the visitors too: their name and email live in
    # their own browser, and a server-side delete cannot touch that. So the wipe
    # stamps a timestamp here, every client compares it against the one it last
    # saw, and anything newer means "forget who you are and ask again".
    #
    # A timestamp rather than a counter, and "newer wins" rather than "different
    # wins", so that losing this file — which Render's free plan does on every
    # cold start — reads as 0 and quietly resets nobody.

    def _read_reset_at(self) -> float:
        try:
            return float(json.loads(self._meta_path.read_text(encoding="utf-8"))["reset_at"])
        except (OSError, ValueError, KeyError, TypeError):
            return 0.0

    def _write_reset_at(self, value: float) -> None:
        try:
            self._meta_path.parent.mkdir(parents=True, exist_ok=True)
            self._meta_path.write_text(
                json.dumps({"reset_at": value}), encoding="utf-8"
            )
        except OSError:
            logger.exception("Could not persist the chat-log reset marker")

    @property
    def reset_at(self) -> float:
        """Unix seconds of the last wipe; 0 if it has never been wiped."""
        return self._reset_at

    def _count_lines(self) -> int:
        if not self._path.exists():
            return 0
        try:
            with self._path.open("r", encoding="utf-8") as handle:
                return sum(1 for line in handle if line.strip())
        except OSError:
            return 0

    def _iter_entries(self) -> Iterator[dict[str, Any]]:
        if not self._path.exists():
            return
        try:
            with self._path.open("r", encoding="utf-8") as handle:
                for line in handle:
                    line = line.strip()
                    if not line:
                        continue
                    try:
                        yield json.loads(line)
                    except json.JSONDecodeError:
                        continue  # a half-written line from a killed process
        except OSError:
            logger.exception("Could not read the chat log")

    @property
    def count(self) -> int:
        return self._count

    @property
    def path(self) -> Path:
        return self._path

    def all_entries(self, newest_first: bool = False) -> list[dict[str, Any]]:
        entries = list(self._iter_entries())
        return entries[::-1] if newest_first else entries

    def page(
        self, limit: int = 50, offset: int = 0, search: str = ""
    ) -> tuple[list[dict[str, Any]], int]:
        """Newest first, optionally filtered by a free-text search."""
        entries = self.all_entries(newest_first=True)

        needle = search.strip().lower()
        if needle:
            fields = ("question", "answer", "name", "email", "company", "ip", "city", "country")
            entries = [
                entry
                for entry in entries
                if any(needle in str(entry.get(field, "")).lower() for field in fields)
            ]

        total = len(entries)
        return entries[offset : offset + limit], total

    def stats(self) -> dict[str, Any]:
        entries = self.all_entries()
        visitors = {entry.get("visitor_id") for entry in entries if entry.get("visitor_id")}
        identified = [entry for entry in entries if entry.get("email") or entry.get("name")]
        first = entries[0].get("asked_at") if entries else None
        last = entries[-1].get("asked_at") if entries else None
        return {
            "total_questions": len(entries),
            "unique_visitors": len(visitors),
            "identified_visitors": len({e.get("email") or e.get("name") for e in identified}),
            "job_matches": sum(1 for e in entries if e.get("kind") == "job_match"),
            "first_asked_at": first,
            "last_asked_at": last,
            "xlsx_available": XLSX_AVAILABLE,
            "storage_path": str(self._path),
        }

    # -- clearing (owner only) ---------------------------------------------

    def clear(self) -> int:
        """Delete every logged question. Returns how many were removed.

        Also stamps the reset marker, so returning visitors are asked for their
        name and email again instead of riding on a record that no longer exists.
        """
        with self._lock:
            removed = self._count
            try:
                if self._path.exists():
                    self._path.unlink()
            except OSError:
                logger.exception("Could not delete the chat log file")
                raise
            self._count = 0
            self._reset_at = time.time()
            self._write_reset_at(self._reset_at)
        logger.warning("Chat log cleared by the owner — %d entries deleted", removed)
        return removed

    # -- export ------------------------------------------------------------

    def to_rows(self) -> list[dict[str, Any]]:
        """Flatten the stored entries into spreadsheet-ready rows."""
        rows: list[dict[str, Any]] = []
        for index, entry in enumerate(self.all_entries(), start=1):
            asked_at = entry.get("asked_at", "")
            local = _to_ist(asked_at)
            row = {key: _cell(entry.get(key, "")) for _, key, _ in COLUMNS}
            row["row"] = index
            row["kind"] = KIND_LABELS.get(entry.get("kind", "chat"), entry.get("kind", ""))
            row["date_ist"] = local.strftime("%Y-%m-%d") if local else ""
            row["time_ist"] = local.strftime("%H:%M:%S") if local else ""
            row["asked_at"] = asked_at
            rows.append(row)
        return rows

    def to_xlsx(self) -> bytes:
        """Render the log as a real .xlsx workbook."""
        if not XLSX_AVAILABLE:
            raise RuntimeError("openpyxl is not installed")

        workbook = Workbook()
        sheet = workbook.active
        sheet.title = "Chat questions"

        header_font = Font(bold=True, color="FFFFFF", size=11)
        header_fill = PatternFill("solid", fgColor="4F46E5")

        sheet.append([header for header, _, _ in COLUMNS])
        for cell in sheet[1]:
            cell.font = header_font
            cell.fill = header_fill
            cell.alignment = Alignment(vertical="center", horizontal="left")
        sheet.row_dimensions[1].height = 22

        for row in self.to_rows():
            sheet.append([row.get(key, "") for _, key, _ in COLUMNS])

        for index, (_, _, width) in enumerate(COLUMNS, start=1):
            sheet.column_dimensions[get_column_letter(index)].width = width

        # Long free text stays readable instead of bleeding across the sheet.
        wrapped = {"question", "answer", "job_description", "user_agent"}
        for index, (_, key, _) in enumerate(COLUMNS, start=1):
            if key not in wrapped:
                continue
            for cell in sheet[get_column_letter(index)][1:]:
                cell.alignment = Alignment(wrap_text=True, vertical="top")

        sheet.freeze_panes = "E2"  # keep #/date/time/type visible while scrolling
        sheet.auto_filter.ref = sheet.dimensions

        buffer = io.BytesIO()
        workbook.save(buffer)
        return buffer.getvalue()

    def to_csv(self) -> bytes:
        buffer = io.StringIO(newline="")
        writer = csv.writer(buffer)
        writer.writerow([header for header, _, _ in COLUMNS])
        for row in self.to_rows():
            writer.writerow([row.get(key, "") for _, key, _ in COLUMNS])
        # BOM so Excel opens UTF-8 (Hindi questions included) without mojibake.
        return buffer.getvalue().encode("utf-8-sig")


# --------------------------------------------------------------------------
# Helpers
# --------------------------------------------------------------------------


def _cell(value: Any) -> Any:
    """Excel rejects some values outright; coerce them to something printable."""
    if value is None:
        return ""
    if isinstance(value, (int, float, str)):
        # 32767 is Excel's hard per-cell character limit.
        return value[:32000] if isinstance(value, str) and len(value) > 32000 else value
    if isinstance(value, (list, tuple)):
        return ", ".join(str(item) for item in value)
    return str(value)


def _to_ist(iso_timestamp: str) -> datetime | None:
    try:
        return datetime.fromisoformat(iso_timestamp.replace("Z", "+00:00")).astimezone(IST)
    except (AttributeError, ValueError):
        return None


_BROWSERS = [
    ("Edge", r"Edg[A-Z]?/"),
    ("Opera", r"OPR/|Opera"),
    ("Samsung Internet", r"SamsungBrowser"),
    ("Brave", r"Brave"),
    ("Chrome", r"Chrome/|CriOS"),
    ("Firefox", r"Firefox/|FxiOS"),
    ("Safari", r"Safari/"),
]

_PLATFORMS = [
    ("Android", r"Android"),
    ("iOS", r"iPhone|iPad|iPod"),
    ("Windows", r"Windows NT"),
    ("macOS", r"Mac OS X|Macintosh"),
    ("Linux", r"Linux|X11"),
]


def parse_user_agent(user_agent: str) -> dict[str, str]:
    """Best-effort browser/OS/device split — enough to know who is visiting."""
    if not user_agent:
        return {"browser": "", "os": "", "device": ""}

    browser = next((name for name, pattern in _BROWSERS if re.search(pattern, user_agent)), "Other")
    platform = next(
        (name for name, pattern in _PLATFORMS if re.search(pattern, user_agent)), "Unknown"
    )

    if re.search(r"iPad|Tablet", user_agent):
        device = "Tablet"
    elif re.search(r"Mobi|Android|iPhone", user_agent):
        device = "Mobile"
    elif re.search(r"bot|crawler|spider|curl|python-requests", user_agent, re.IGNORECASE):
        device = "Bot"
    else:
        device = "Desktop"

    return {"browser": browser, "os": platform, "device": device}

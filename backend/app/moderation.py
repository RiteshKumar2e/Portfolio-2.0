"""Abuse detection and the strike list that follows from it.

The AI representative speaks for a real person to real recruiters. A visitor who
swears at it does not get an answer — but nor are they cut off on the spot. The
first two abusive messages are warnings; the third is flagged in the owner's log
and ends the conversation for good.

Two warnings rather than one because the detector is a word list, and a word
list is occasionally wrong. A visitor who trips it once gets told plainly what
happened and can carry on; only a pattern gets someone blocked.

Two deliberate choices:

* **Whole-word matching only.** Substring matching is how a filter ends up
  rejecting "class", "Scunthorpe", "assessment" or the `lodash` package. Every
  term here is matched at word boundaries, so an insult has to be written as its
  own word to count. The cost of that is real: deliberately masked spellings
  ("f*ck") slip through. That trade is on purpose — wrongly locking out a
  recruiter is far worse than missing a swear word the sender already censored.
* **Strikes are counted server-side.** The browser is told where it stands so it
  can lock its own composer, but that is a courtesy: clearing local storage does
  not reset the count, because the visitor id *and* the IP are both remembered
  here. Clearing the chat log clears the strike list with it — that is the
  owner's undo.
"""

import json
import logging
import re
import threading
import time
from pathlib import Path
from typing import Any, Optional

from .turso import TursoClient, TursoError

logger = logging.getLogger("ai-portfolio.moderation")


# Roman and Devanagari spellings, since visitors write Hinglish. Kept as whole
# words — see the module docstring for why that matters.
_ABUSIVE_TERMS = [
    # English
    "fuck", "fucking", "fucker", "motherfucker", "shit", "bullshit", "bitch",
    "bastard", "asshole", "arsehole", "dickhead", "cunt", "slut", "whore",
    "retard", "retarded", "nigga", "nigger", "faggot", "wanker", "prick",
    "twat", "douchebag", "jackass", "dumbass", "shut up", "stfu", "fuck off",
    # Hindi / Hinglish, roman
    "bhosdi", "bhosdike", "bhosadike", "madarchod", "madarchd", "mc", "bc",
    "behenchod", "bhenchod", "behnchod", "chutiya", "chutiye", "chutia",
    "chootiya", "chootiye", "bhosda", "bhosdiwala", "madharchod",
    "gandu", "gaandu", "gaand", "lund", "lauda", "loda", "randi", "harami",
    "haramkhor", "kutte", "kutta", "kamine", "kamina", "saala", "sala",
    "chodu", "jhaant", "tatti", "chinal", "bakchod", "bakchodi",
    # Hindi / Hinglish, Devanagari
    "भोसड़ी", "भोसड़ीके", "मादरचोद", "बहनचोद", "चूतिया", "चुतिया", "गांडू",
    "गाँडू", "लंड", "लौड़ा", "रंडी", "हरामी", "कमीना", "कुत्ते", "कुत्ता",
]

# "mc"/"bc" are real insults in Hinglish but also ordinary abbreviations, so
# they only count when they stand completely alone as the message.
_STANDALONE_ONLY = {"mc", "bc"}

_PATTERN = re.compile(
    r"(?<!\w)(" + "|".join(re.escape(term) for term in _ABUSIVE_TERMS if term not in _STANDALONE_ONLY) + r")(?!\w)",
    re.IGNORECASE | re.UNICODE,
)

# Letter repetition ("fuuuuck") and digit swaps ("ch00tiya") are the two
# cheapest ways past a word list, so both are folded away before matching.
# Anything cleverer than that is not worth an arms race.
_LEETSPEAK = str.maketrans({"0": "o", "1": "i", "3": "e", "4": "a", "5": "s", "7": "t", "@": "a", "$": "s"})
_SEPARATORS = re.compile(r"[\W_]+", re.UNICODE)
_REPEATS = re.compile(r"(.)\1{2,}", re.UNICODE)


def _normalise(text: str) -> str:
    """Fold the obvious evasions, leaving word boundaries intact."""
    folded = text.translate(_LEETSPEAK)
    folded = _REPEATS.sub(r"\1", folded)
    return folded


def find_abuse(text: str) -> Optional[str]:
    """Return the offending term, or None if the message is clean."""
    if not text:
        return None

    candidate = _normalise(text)
    match = _PATTERN.search(candidate)
    if match:
        return match.group(1).lower()

    # A message that is nothing but "mc" / "bc" and punctuation.
    bare = _SEPARATORS.sub("", candidate).lower()
    return bare if bare in _STANDALONE_ONLY else None


# Abusive messages allowed through as warnings before the visitor is cut off.
WARNINGS_BEFORE_BLOCK = 2


def warning_message(strike: int) -> str:
    """What the visitor is told on a warning strike."""
    left = WARNINGS_BEFORE_BLOCK - strike + 1
    return (
        "That message was flagged as abusive, so it was not answered. "
        f"This is warning {strike} of {WARNINGS_BEFORE_BLOCK} — "
        f"{left} more and chatting will be disabled for you."
        if strike < WARNINGS_BEFORE_BLOCK
        else (
            "That message was flagged as abusive, so it was not answered. "
            f"This is your final warning ({strike} of {WARNINGS_BEFORE_BLOCK}) — "
            "one more and chatting will be disabled for you."
        )
    )


BLOCKED_MESSAGE = (
    "This message was flagged as abusive after two warnings, so it was not "
    "answered. Chatting has been disabled for you. If you believe this is a "
    "mistake, email riteshkumar90359@gmail.com."
)


class StrikeStore:
    """Abusive-message counts per visitor, by visitor id and by IP.

    Held in memory for speed and mirrored to disk so a restart does not hand
    everyone a clean slate. On a filesystem that does not survive (Render's free
    plan) the mirror is simply lost, which fails open rather than shut.

    Both keys carry the same count, so clearing local storage or switching the
    visitor id does not buy a fresh set of warnings from the same address.
    """

    def __init__(self, path: Path, turso: Optional[TursoClient] = None) -> None:
        self._path = path
        self._lock = threading.Lock()
        # Turso keeps strikes across the deploys and cold starts that wipe the
        # container's disk; the file is the local-development fallback.
        self._turso = turso if (turso and turso.enabled) else None
        self._blocked: dict[str, dict[str, Any]] = self._read_remote() if self._turso else self._read()
        if self._blocked:
            logger.info("Loaded %d strike record(s)", len(self._blocked))

    def _read_remote(self) -> dict[str, dict[str, Any]]:
        try:
            rows = self._turso.execute(
                "SELECT key, strikes, last_at, term, question FROM strikes"
            )
        except TursoError:
            logger.exception("Could not read strikes from Turso")
            return {}
        return {
            row["key"]: {
                "strikes": int(row["strikes"]),
                "last_at": float(row["last_at"]),
                "term": row.get("term") or "",
                "question": row.get("question") or "",
            }
            for row in rows
        }

    # -- persistence -------------------------------------------------------

    def _read(self) -> dict[str, dict[str, Any]]:
        try:
            data = json.loads(self._path.read_text(encoding="utf-8"))
            return data if isinstance(data, dict) else {}
        except (OSError, ValueError):
            return {}

    def _write(self) -> None:
        if self._turso:
            try:
                self._turso.batch(
                    (
                        "INSERT OR REPLACE INTO strikes (key, strikes, last_at, term, question)"
                        " VALUES (?, ?, ?, ?, ?)",
                        (key, r["strikes"], r["last_at"], r["term"], r["question"]),
                    )
                    for key, r in self._blocked.items()
                )
                return
            except TursoError:
                logger.exception("Could not persist strikes to Turso")
                return
        try:
            self._path.parent.mkdir(parents=True, exist_ok=True)
            self._path.write_text(json.dumps(self._blocked), encoding="utf-8")
        except OSError:
            logger.exception("Could not persist the block list")

    # -- queries -----------------------------------------------------------

    @staticmethod
    def _keys(visitor_id: str, ip: str) -> list[str]:
        keys = []
        if visitor_id:
            keys.append(f"visitor:{visitor_id}")
        if ip and ip != "unknown":
            keys.append(f"ip:{ip}")
        return keys

    def strikes(self, visitor_id: str = "", ip: str = "") -> int:
        """Abusive messages seen from this visitor or address so far."""
        with self._lock:
            return max(
                (self._blocked[key]["strikes"] for key in self._keys(visitor_id, ip) if key in self._blocked),
                default=0,
            )

    def is_blocked(self, visitor_id: str = "", ip: str = "") -> bool:
        return self.strikes(visitor_id, ip) > WARNINGS_BEFORE_BLOCK

    def record_strike(
        self, visitor_id: str = "", ip: str = "", *, term: str = "", question: str = ""
    ) -> int:
        """Count one abusive message and return the visitor's new total.

        A total above WARNINGS_BEFORE_BLOCK means they are blocked. The count is
        shared across every key so the two identities cannot be played off each
        other for extra warnings.
        """
        keys = self._keys(visitor_id, ip)
        if not keys:
            # Nothing to pin it on (no visitor id, unknown IP) — treat every such
            # message as a first warning rather than blocking a stranger.
            return 1

        with self._lock:
            current = max(
                (self._blocked[key]["strikes"] for key in keys if key in self._blocked),
                default=0,
            )
            total = current + 1
            record = {
                "strikes": total,
                "last_at": time.time(),
                "term": term,
                "question": question[:300],
            }
            for key in keys:
                self._blocked[key] = record
            self._write()

        logger.warning(
            "Abusive message from %s (%s) — strike %d of %d",
            ", ".join(keys),
            term,
            total,
            WARNINGS_BEFORE_BLOCK + 1,
        )
        return total

    @property
    def count(self) -> int:
        """How many visitors are actually blocked, not merely warned."""
        with self._lock:
            return sum(
                1
                for key, record in self._blocked.items()
                if key.startswith("visitor:") and record["strikes"] > WARNINGS_BEFORE_BLOCK
            )

    def clear(self) -> int:
        """Wipe every strike and block — the owner's undo, tied to clearing the log."""
        with self._lock:
            removed = len(self._blocked)
            self._blocked = {}
            if self._turso:
                try:
                    self._turso.execute("DELETE FROM strikes")
                except TursoError:
                    logger.exception("Could not clear strikes in Turso")
            try:
                if self._path.exists():
                    self._path.unlink()
            except OSError:
                logger.exception("Could not delete the strike list file")
        if removed:
            logger.warning("Strike list cleared by the owner — %d entries lifted", removed)
        return removed

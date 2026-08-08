"""Loads, validates and renders the candidate profile.

The JSON file is the single source of truth. It is validated with Pydantic at
startup so a broken profile fails immediately instead of silently producing an
AI that knows nothing.
"""

import json
import threading
from pathlib import Path
from typing import Any

from .schemas import CandidateProfile


class ProfileStore:
    def __init__(self, path: Path) -> None:
        self._path = path
        self._lock = threading.Lock()
        self._raw: dict[str, Any] = {}
        self._model: CandidateProfile | None = None
        self._facts: str = ""
        self._facts_compact: str = ""
        self.load()

    # -- loading -----------------------------------------------------------

    def load(self) -> CandidateProfile:
        if not self._path.exists():
            raise FileNotFoundError(f"Profile file not found: {self._path}")

        raw = json.loads(self._path.read_text(encoding="utf-8"))
        model = CandidateProfile.model_validate(raw)

        with self._lock:
            self._raw = raw
            self._model = model
            self._facts = _render_facts(raw)
            self._facts_compact = _render_facts_compact(raw)
        return model

    def replace(self, raw: dict[str, Any]) -> CandidateProfile:
        """Validate and persist a brand-new profile (no code change required)."""
        model = CandidateProfile.model_validate(raw)
        self._path.parent.mkdir(parents=True, exist_ok=True)
        self._path.write_text(
            json.dumps(raw, indent=2, ensure_ascii=False), encoding="utf-8"
        )
        with self._lock:
            self._raw = raw
            self._model = model
            self._facts = _render_facts(raw)
            self._facts_compact = _render_facts_compact(raw)
        return model

    # -- accessors ---------------------------------------------------------

    @property
    def raw(self) -> dict[str, Any]:
        return self._raw

    @property
    def facts(self) -> str:
        """The full profile rendered as text for the system prompt."""
        return self._facts

    @property
    def facts_compact(self) -> str:
        """A trimmed rendering for models with tight per-request token limits.

        Same facts, less elaboration: the flagship projects keep their detail,
        the smaller ones shrink to a line each.
        """
        return self._facts_compact

    @property
    def name(self) -> str:
        return self._raw.get("basics", {}).get("name", "the candidate")

    @property
    def summary_stats(self) -> dict[str, Any]:
        return {
            "name": self.name,
            "headline": self._raw.get("basics", {}).get("headline"),
            "projects": len(self._raw.get("projects", [])),
            "experience": len(self._raw.get("experience", [])),
            "last_updated": self._raw.get("meta", {}).get("last_updated"),
        }


# --------------------------------------------------------------------------
# Rendering: JSON -> readable text. Readable text grounds an LLM far better
# than raw JSON, and costs fewer tokens than pretty-printed JSON.
# --------------------------------------------------------------------------


def _bullets(items: list[Any], indent: str = "  ") -> str:
    return "\n".join(f"{indent}- {item}" for item in items if item)


def _render_facts(raw: dict[str, Any]) -> str:
    parts: list[str] = []

    basics = raw.get("basics", {})
    parts.append(
        "## IDENTITY\n"
        f"Name: {basics.get('name', '')}\n"
        f"Headline: {basics.get('headline', '')}\n"
        f"Location: {basics.get('location', 'Not specified')}\n"
        f"Email: {basics.get('email', 'Not specified')}\n"
        f"Phone: {basics.get('phone', 'Not specified')}\n"
        f"Availability: {basics.get('availability', 'Not specified')}\n"
        f"Target roles: {', '.join(basics.get('roles_targeted', [])) or 'Not specified'}\n"
        f"Summary: {basics.get('summary', '')}"
    )

    education = raw.get("education", [])
    if education:
        lines = ["## EDUCATION"]
        for edu in education:
            lines.append(
                f"- {edu.get('degree', '')} in {edu.get('field', '')} — "
                f"{edu.get('institution', '')} "
                f"({edu.get('start', '?')} to {edu.get('end', '?')}); "
                f"CGPA: {edu.get('cgpa', 'Not specified')}; "
                f"Status: {edu.get('status', 'Not specified')}"
            )
            if edu.get("coursework"):
                lines.append(f"  Coursework: {', '.join(edu['coursework'])}")
        parts.append("\n".join(lines))

    skills = raw.get("skills", {})
    if skills:
        lines = ["## SKILLS"]
        for category, value in skills.items():
            if isinstance(value, list):
                lines.append(f"- {category.replace('_', ' ').title()}: {', '.join(map(str, value))}")
            elif isinstance(value, dict):
                for sub_key, sub_value in value.items():
                    if isinstance(sub_value, list):
                        lines.append(
                            f"- {category.replace('_', ' ').title()} / "
                            f"{sub_key.replace('_', ' ')}: {', '.join(map(str, sub_value))}"
                        )
                    else:
                        lines.append(
                            f"- {category.replace('_', ' ').title()} / "
                            f"{sub_key.replace('_', ' ')}: {sub_value}"
                        )
        parts.append("\n".join(lines))

    experience = raw.get("experience", [])
    if experience:
        lines = ["## EXPERIENCE"]
        for exp in experience:
            lines.append(
                f"### {exp.get('title', '')} — {exp.get('organization', '')} "
                f"({exp.get('start', '?')} to {exp.get('end', '?')}, "
                f"{exp.get('location', 'location not specified')})"
            )
            lines.append(_bullets(exp.get("highlights", [])))
            if exp.get("stack"):
                lines.append(f"  Stack: {', '.join(exp['stack'])}")
        parts.append("\n".join(line for line in lines if line))

    guidance = raw.get("project_guidance", {})
    if guidance:
        lines = ["## HOW TO TALK ABOUT THE PROJECTS"]
        tiers = guidance.get("tiers", {})
        for tier_name, description in tiers.items():
            lines.append(f"- {tier_name.title()}: {description}")
        if guidance.get("answering_superlatives"):
            lines.append(f"- On 'best/strongest project' questions: {guidance['answering_superlatives']}")
        picking = guidance.get("picking_by_role", {})
        if picking:
            lines.append("- Most relevant project by role:")
            for role_type, project_name in picking.items():
                lines.append(f"    - {role_type} → {project_name}")
        if guidance.get("honesty_note"):
            lines.append(f"- {guidance['honesty_note']}")
        parts.append("\n".join(lines))

    projects = raw.get("projects", [])
    if projects:
        lines = ["## PROJECTS"]
        for project in projects:
            links = project.get("links", {}) or {}
            tier = project.get("tier")
            header = f"### {project.get('name', '')} (role: {project.get('role', 'Not specified')}"
            header += f", tier: {tier})" if tier else ")"
            lines.append(header)
            if project.get("status"):
                lines.append(f"  Status: {project['status']}")
            if project.get("best_for"):
                lines.append(f"  Best evidence for: {project['best_for']}")
            if project.get("why_it_stands_out"):
                lines.append(f"  Why it stands out: {project['why_it_stands_out']}")
            if project.get("problem"):
                lines.append(f"  Problem: {project['problem']}")
            if project.get("what_was_built"):
                lines.append(f"  Built: {project['what_was_built']}")
            if project.get("hardest_part"):
                lines.append(f"  Hardest part: {project['hardest_part']}")
            if project.get("key_decisions"):
                lines.append("  Key decisions and trade-offs:")
                lines.append(_bullets(project["key_decisions"], indent="    "))
            if project.get("engineering_details"):
                lines.append("  How:")
                lines.append(_bullets(project["engineering_details"], indent="    "))
            if project.get("what_was_learned"):
                lines.append(f"  What it taught him: {project['what_was_learned']}")
            if project.get("impact"):
                lines.append(f"  Impact: {'; '.join(project['impact'])}")
            if project.get("stack"):
                lines.append(f"  Stack: {', '.join(project['stack'])}")
            live, github = links.get("live"), links.get("github")
            if live:
                lines.append(f"  Live: {live}")
            if github:
                lines.append(f"  Code: {github}")
        parts.append("\n".join(line for line in lines if line))

    publications = raw.get("publications", [])
    if publications:
        lines = ["## PUBLICATIONS"]
        for pub in publications:
            lines.append(
                f"- \"{pub.get('title', '')}\" — {pub.get('authors', '')}; "
                f"{pub.get('venue', '')} ({pub.get('year', '')}). Status: {pub.get('status', 'Not specified')}"
            )
        parts.append("\n".join(lines))

    achievements = raw.get("achievements", [])
    if achievements:
        lines = ["## ACHIEVEMENTS"]
        for item in achievements:
            lines.append(f"- {item.get('title', '')}: {item.get('detail', '')} ({item.get('year', '')})")
        parts.append("\n".join(lines))

    certifications = raw.get("certifications", [])
    if certifications:
        lines = ["## CERTIFICATIONS"]
        for cert in certifications:
            lines.append(
                f"- {cert.get('name', '')} — {cert.get('issuer', '')} ({cert.get('year', 'Not specified')})"
            )
        parts.append("\n".join(lines))

    leadership = raw.get("leadership", [])
    if leadership:
        lines = ["## LEADERSHIP & EXTRACURRICULAR"]
        for item in leadership:
            lines.append(
                f"- {item.get('role', '')} at {item.get('organization', '')}: {item.get('detail', '')}"
            )
        parts.append("\n".join(lines))

    if raw.get("strengths"):
        parts.append("## STRENGTHS\n" + _bullets(raw["strengths"], indent=""))

    links = raw.get("links", {})
    if links:
        parts.append(
            "## LINKS\n"
            + "\n".join(f"- {key}: {value}" for key, value in links.items() if value)
        )

    spoken = raw.get("languages_spoken")
    if isinstance(spoken, dict) and spoken.get("note"):
        parts.append(f"## SPOKEN LANGUAGES\n{spoken['note']}")

    if raw.get("not_in_profile"):
        parts.append(
            "## EXPLICITLY NOT IN THIS PROFILE (say you don't know if asked)\n"
            + _bullets(raw["not_in_profile"], indent="")
        )

    return "\n\n".join(parts)


def _render_facts_compact(raw: dict[str, Any]) -> str:
    """A smaller rendering for models with tight per-request token budgets.

    Nothing is contradicted — detail is dropped, never changed. Flagship
    projects keep enough substance to answer properly; the rest collapse to a
    single line so they can still be named and linked.
    """
    parts: list[str] = []

    basics = raw.get("basics", {})
    parts.append(
        "## IDENTITY\n"
        f"Name: {basics.get('name', '')} | {basics.get('headline', '')}\n"
        f"Location: {basics.get('location', 'Not specified')} | "
        f"Email: {basics.get('email', 'Not specified')}\n"
        f"Availability: {basics.get('availability', 'Not specified')}\n"
        f"Summary: {basics.get('summary', '')}"
    )

    for edu in raw.get("education", []):
        parts.append(
            "## EDUCATION\n"
            f"{edu.get('degree', '')} in {edu.get('field', '')}, {edu.get('institution', '')} "
            f"({edu.get('start', '?')}–{edu.get('end', '?')}). CGPA {edu.get('cgpa', 'Not specified')}. "
            f"{edu.get('status', '')}"
        )

    skills = raw.get("skills", {})
    if skills:
        lines = ["## SKILLS"]
        for category, value in skills.items():
            if isinstance(value, list) and value:
                lines.append(f"- {category.replace('_', ' ').title()}: {', '.join(map(str, value))}")
        parts.append("\n".join(lines))

    experience = raw.get("experience", [])
    if experience:
        lines = ["## EXPERIENCE"]
        for exp in experience:
            lines.append(
                f"### {exp.get('title', '')} — {exp.get('organization', '')} "
                f"({exp.get('start', '?')}–{exp.get('end', '?')}, {exp.get('location', '')})"
            )
            lines.append(_bullets(exp.get("highlights", [])))
        parts.append("\n".join(line for line in lines if line))

    guidance = raw.get("project_guidance", {})
    if guidance.get("answering_superlatives"):
        parts.append(
            "## HOW TO TALK ABOUT THE PROJECTS\n"
            f"{guidance['answering_superlatives']}\n"
            f"{guidance.get('honesty_note', '')}"
        )

    projects = raw.get("projects", [])
    if projects:
        detailed = [p for p in projects if p.get("tier") in (None, "flagship", "substantial")]
        brief = [p for p in projects if p.get("tier") == "supporting"]

        lines = ["## PROJECTS"]
        for project in detailed:
            links = project.get("links", {}) or {}
            lines.append(
                f"### {project.get('name', '')} "
                f"(role: {project.get('role', 'Not specified')}, tier: {project.get('tier', 'n/a')})"
            )
            if project.get("status"):
                lines.append(f"  Status: {project['status']}")
            if project.get("best_for"):
                lines.append(f"  Best evidence for: {project['best_for']}")
            if project.get("why_it_stands_out"):
                lines.append(f"  Why it stands out: {project['why_it_stands_out']}")
            if project.get("problem"):
                lines.append(f"  Problem: {project['problem']}")
            if project.get("what_was_built"):
                lines.append(f"  Built: {project['what_was_built']}")
            if project.get("hardest_part"):
                lines.append(f"  Hardest part: {project['hardest_part']}")
            if project.get("impact"):
                lines.append(f"  Impact: {'; '.join(project['impact'])}")
            if project.get("stack"):
                lines.append(f"  Stack: {', '.join(project['stack'])}")
            if links.get("live"):
                lines.append(f"  Live: {links['live']}")
            if links.get("github"):
                lines.append(f"  Code: {links['github']}")

        for project in brief:
            links = project.get("links", {}) or {}
            lines.append(
                f"- {project.get('name', '')} ({project.get('best_for', '')}): "
                f"{project.get('what_was_built', '')} "
                f"Stack: {', '.join(project.get('stack', []))}. "
                f"Code: {links.get('github', 'n/a')}"
            )
        parts.append("\n".join(line for line in lines if line))

    for publication in raw.get("publications", []):
        parts.append(
            f"## PUBLICATION\n\"{publication.get('title', '')}\" — {publication.get('authors', '')}; "
            f"{publication.get('venue', '')} ({publication.get('year', '')}), {publication.get('status', '')}"
        )

    achievements = raw.get("achievements", [])
    if achievements:
        parts.append(
            "## ACHIEVEMENTS\n"
            + "\n".join(f"- {a.get('title', '')}: {a.get('detail', '')}" for a in achievements)
        )

    leadership = raw.get("leadership", [])
    if leadership:
        parts.append(
            "## LEADERSHIP\n"
            + "\n".join(f"- {item.get('role', '')} at {item.get('organization', '')}" for item in leadership)
        )

    certifications = raw.get("certifications", [])
    if certifications:
        parts.append(
            "## CERTIFICATIONS\n"
            + "\n".join(f"- {c.get('name', '')} ({c.get('issuer', '')})" for c in certifications)
        )

    links = raw.get("links", {})
    if links:
        parts.append(
            "## LINKS\n" + " | ".join(f"{k}: {v}" for k, v in links.items() if v)
        )

    if raw.get("not_in_profile"):
        parts.append(
            "## EXPLICITLY NOT IN THIS PROFILE (say you don't know if asked)\n"
            + ", ".join(raw["not_in_profile"])
        )

    return "\n\n".join(parts)

"""Pydantic models: profile validation plus the API request/response contracts."""

from typing import Literal, Optional

from pydantic import BaseModel, Field, field_validator

# --------------------------------------------------------------------------
# Candidate profile (validated at startup so a malformed profile fails loudly)
# --------------------------------------------------------------------------


class Basics(BaseModel):
    name: str
    headline: str
    summary: str
    location: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    availability: Optional[str] = None
    roles_targeted: list[str] = Field(default_factory=list)

    model_config = {"extra": "allow"}


class Education(BaseModel):
    institution: str
    degree: str
    field: Optional[str] = None
    cgpa: Optional[str] = None
    start: Optional[str] = None
    end: Optional[str] = None
    status: Optional[str] = None
    coursework: list[str] = Field(default_factory=list)

    model_config = {"extra": "allow"}


class Experience(BaseModel):
    title: str
    organization: str
    location: Optional[str] = None
    start: Optional[str] = None
    end: Optional[str] = None
    highlights: list[str] = Field(default_factory=list)
    stack: list[str] = Field(default_factory=list)

    model_config = {"extra": "allow"}


class ProjectLinks(BaseModel):
    live: Optional[str] = None
    github: Optional[str] = None

    model_config = {"extra": "allow"}


class Project(BaseModel):
    name: str
    role: Optional[str] = None
    period: Optional[str] = None
    tier: Optional[Literal["flagship", "substantial", "supporting"]] = None
    status: Optional[str] = None
    best_for: Optional[str] = None
    why_it_stands_out: Optional[str] = None
    hardest_part: Optional[str] = None
    key_decisions: list[str] = Field(default_factory=list)
    what_was_learned: Optional[str] = None
    problem: Optional[str] = None
    what_was_built: Optional[str] = None
    engineering_details: list[str] = Field(default_factory=list)
    impact: list[str] = Field(default_factory=list)
    stack: list[str] = Field(default_factory=list)
    links: ProjectLinks = Field(default_factory=ProjectLinks)

    model_config = {"extra": "allow"}


class CandidateProfile(BaseModel):
    """The only source of truth the AI is allowed to speak from."""

    basics: Basics
    education: list[Education] = Field(default_factory=list)
    skills: dict = Field(default_factory=dict)
    experience: list[Experience] = Field(default_factory=list)
    projects: list[Project] = Field(default_factory=list)
    publications: list[dict] = Field(default_factory=list)
    achievements: list[dict] = Field(default_factory=list)
    certifications: list[dict] = Field(default_factory=list)
    leadership: list[dict] = Field(default_factory=list)
    strengths: list[str] = Field(default_factory=list)
    links: dict = Field(default_factory=dict)

    model_config = {"extra": "allow"}


# --------------------------------------------------------------------------
# Visitor identity — everything the browser can tell us about who is asking.
# All of it is optional: the chat works exactly the same for someone who
# supplies nothing, they just show up in the log as an anonymous visitor id.
# --------------------------------------------------------------------------


class VisitorInfo(BaseModel):
    visitor_id: Optional[str] = Field(default=None, max_length=64)
    session_id: Optional[str] = Field(default=None, max_length=64)
    conversation_id: Optional[str] = Field(default=None, max_length=64)
    turn: Optional[int] = Field(default=None, ge=0, le=10000)

    # Self-declared, from the optional "who's asking?" form.
    name: Optional[str] = Field(default=None, max_length=120)
    email: Optional[str] = Field(default=None, max_length=180)
    company: Optional[str] = Field(default=None, max_length=180)
    linkedin: Optional[str] = Field(default=None, max_length=200)

    # Ambient context the browser knows for free.
    page: Optional[str] = Field(default=None, max_length=500)
    referrer: Optional[str] = Field(default=None, max_length=500)
    timezone: Optional[str] = Field(default=None, max_length=80)
    screen: Optional[str] = Field(default=None, max_length=40)
    browser_language: Optional[str] = Field(default=None, max_length=40)

    model_config = {"extra": "ignore"}


# --------------------------------------------------------------------------
# Chat
# --------------------------------------------------------------------------


class ChatMessage(BaseModel):
    role: Literal["user", "assistant"]
    content: str = Field(min_length=1, max_length=8000)


class ChatRequest(BaseModel):
    message: str = Field(min_length=1, max_length=2000)
    history: list[ChatMessage] = Field(default_factory=list)
    language: Literal["auto", "en", "hi"] = "auto"
    visitor: Optional[VisitorInfo] = None

    @field_validator("message")
    @classmethod
    def _strip_message(cls, value: str) -> str:
        stripped = value.strip()
        if not stripped:
            raise ValueError("message cannot be blank")
        return stripped

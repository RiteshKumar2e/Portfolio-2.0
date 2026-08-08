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
# Chat
# --------------------------------------------------------------------------


class ChatMessage(BaseModel):
    role: Literal["user", "assistant"]
    content: str = Field(min_length=1, max_length=8000)


class ChatRequest(BaseModel):
    message: str = Field(min_length=1, max_length=2000)
    history: list[ChatMessage] = Field(default_factory=list)
    job_description: Optional[str] = Field(default=None, max_length=12000)
    language: Literal["auto", "en", "hi"] = "auto"

    @field_validator("message")
    @classmethod
    def _strip_message(cls, value: str) -> str:
        stripped = value.strip()
        if not stripped:
            raise ValueError("message cannot be blank")
        return stripped


# --------------------------------------------------------------------------
# Job-description matching (structured output)
# --------------------------------------------------------------------------


class MatchRequest(BaseModel):
    job_description: str = Field(min_length=20, max_length=12000)

    @field_validator("job_description")
    @classmethod
    def _strip_jd(cls, value: str) -> str:
        stripped = value.strip()
        if len(stripped) < 20:
            raise ValueError("job description is too short to evaluate")
        return stripped


class MatchResult(BaseModel):
    """Structured suitability verdict returned to the recruiter UI."""

    suitability_score: int = Field(ge=0, le=100)
    verdict: Literal["strong_match", "good_match", "partial_match", "weak_match"]
    role_title: str
    summary: str
    matching_skills: list[str] = Field(default_factory=list)
    missing_skills: list[str] = Field(default_factory=list)
    strengths: list[str] = Field(default_factory=list)
    concerns: list[str] = Field(default_factory=list)
    should_interview: bool
    interview_rationale: str

    @field_validator("suitability_score", mode="before")
    @classmethod
    def _clamp_score(cls, value):
        try:
            return max(0, min(100, int(round(float(value)))))
        except (TypeError, ValueError):
            return 0


# --------------------------------------------------------------------------
# Interview question generation
# --------------------------------------------------------------------------


class InterviewRequest(BaseModel):
    job_description: Optional[str] = Field(default=None, max_length=12000)
    focus: Literal["technical", "behavioral", "mixed"] = "mixed"
    count: int = Field(default=6, ge=3, le=12)


class InterviewQuestion(BaseModel):
    question: str
    category: str
    why_it_matters: str
    grounded_in: str


class InterviewQuestions(BaseModel):
    questions: list[InterviewQuestion]

# AI Portfolio — Backend

FastAPI service that answers questions about one candidate, grounded strictly in
[`data/profile.json`](data/profile.json). Answers stream token-by-token from the
Groq API.

## Run locally

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate          # macOS/Linux: source .venv/bin/activate
pip install -r requirements.txt

copy .env.example .env          # macOS/Linux: cp .env.example .env
# put your free key from https://console.groq.com/keys into GROQ_API_KEY

uvicorn app.main:app --reload --port 8000
```

Interactive API docs: <http://localhost:8000/docs>

## Endpoints

| Method | Path                        | Purpose                                               |
| ------ | --------------------------- | ----------------------------------------------------- |
| GET    | `/api/health`               | Liveness, model name, whether the API key is set       |
| GET    | `/api/profile`              | The structured candidate profile                       |
| GET    | `/api/suggestions`          | Starter questions for the chat UI                      |
| POST   | `/api/chat`                 | Streaming answer (Server-Sent Events)                  |
| POST   | `/api/match`                | Structured job-description suitability report          |
| POST   | `/api/interview-questions`  | Interview questions grounded in the profile            |
| POST   | `/api/profile/reload`       | Re-read `profile.json` from disk (needs `ADMIN_TOKEN`) |
| PUT    | `/api/profile`              | Replace the profile — no code change (needs `ADMIN_TOKEN`) |
| GET    | `/api/admin/chats`          | Every question ever asked, newest first (needs `ADMIN_TOKEN`) |
| GET    | `/api/admin/chats/stats`    | Totals for the admin console (needs `ADMIN_TOKEN`)     |
| GET    | `/api/admin/chats/export`   | The log as an `.xlsx` workbook (needs `ADMIN_TOKEN`)   |
| DELETE | `/api/admin/chats`          | Erase the whole log (needs `ADMIN_TOKEN`)              |

### `POST /api/chat`

```jsonc
{
  "message": "Which project was the hardest?",
  "history": [
    { "role": "user", "content": "Tell me about his projects." },
    { "role": "assistant", "content": "Ritesh has shipped..." }
  ],
  "job_description": null,        // optional — puts a JD in context
  "language": "auto",             // "auto" | "en" | "hi"
  "visitor": {                    // optional — all of it, recorded in the log
    "visitor_id": "v-9f2c…",      // stable per browser
    "session_id": "s-41ab…",      // resets when the tab closes
    "conversation_id": "c-77…",
    "turn": 3,
    "name": "Priya Sharma",       // only if they filled in the optional card
    "email": "priya@acme.com",
    "company": "Acme — Talent",
    "page": "https://riteshkr.info/#ai",
    "referrer": "https://linkedin.com/",
    "timezone": "Asia/Kolkata",
    "screen": "1920x1080",
    "browser_language": "en-IN"
  }
}
```

The response is `text/event-stream`:

```
event: token
data: {"text": "Ritesh"}

event: token
data: {"text": " built"}

event: done
data: {"model": "llama-3.3-70b-versatile"}
```

Errors arrive as `event: error` inside the stream (so a failure mid-answer is
still delivered cleanly) or as a normal HTTP error before the stream starts.

Try it from the shell:

```bash
curl -N -X POST http://localhost:8000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"Tell me about this candidate."}'
```

## How honesty is enforced

1. **One source of truth.** `profile.json` is validated by Pydantic
   (`app/schemas.py`) at startup, then rendered to compact text
   (`app/profile_store.py`) and injected into the system prompt.
2. **The prompt forbids invention** (`app/prompts.py`): no estimating, no
   rounding metrics, no assuming adjacent technologies; unknown ⇒ say so.
3. **`not_in_profile`** in the JSON lists things (salary, notice period, visa)
   the AI must explicitly decline to answer.
4. **JD matching returns validated JSON** (`MatchResult`), so a score is always
   0-100 and `missing_skills` can't be quietly dropped.

## Updating the candidate data

Edit `data/profile.json` and restart — or, with `ADMIN_TOKEN` set, push a new
profile without touching code or redeploying:

```bash
curl -X PUT https://your-service.onrender.com/api/profile \
  -H "X-Admin-Token: $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  --data @data/profile.json
```

Invalid profiles are rejected with a 422 and the old one stays live.

## The question log

Every question a visitor asks — and every job description they paste — is
appended to `data/chat_log.jsonl` the moment the answer finishes, together with
whatever is known about who asked: their name/email/company if they filled in
the optional "who's asking" card, plus IP, browser, OS, device, page, referrer,
timezone and the model that answered.

The visitor has no way to reach any of it. Their browser keeps a local copy of
their own conversation for convenience, but the record here is yours and only
`ADMIN_TOKEN` opens it.

**Console:** open `/admin.html` on the deployed site (e.g.
`https://riteshkr.info/admin.html`), paste the token, and you get search,
paging, a one-click Excel download and a delete-everything button. It is not
linked from anywhere on the site and is marked `noindex`.

**Or from the shell:**

```bash
# Download the workbook
curl -OJ "https://your-service.onrender.com/api/admin/chats/export?token=$ADMIN_TOKEN"

# Read it as JSON
curl -H "X-Admin-Token: $ADMIN_TOKEN" \
  "https://your-service.onrender.com/api/admin/chats?limit=20&search=acme"

# Erase everything (irreversible — export first)
curl -X DELETE -H "X-Admin-Token: $ADMIN_TOKEN" \
  "https://your-service.onrender.com/api/admin/chats?confirm=DELETE-ALL"
```

The `.xlsx` has one row per question and 33 columns, filtered and frozen so it
is usable the moment it opens. Without `openpyxl` installed the same endpoint
serves CSV instead, which Excel reads natively.

> **Free-tier warning.** Render wipes the filesystem on every deploy and cold
> start, so on the free plan the log only survives until the next restart.
> Either download the Excel regularly, or move to a paid instance, mount a disk
> and set `CHAT_LOG_PATH=/var/data/chat_log.jsonl` (see `render.yaml`).

City / region / country / ISP stay blank unless your host forwards geo headers.
Set `GEO_LOOKUP_ENABLED=true` to fill them by looking each IP up at ip-api.com —
off by default, because it means sending visitor IPs to a third party.

## Deploy to Render

1. Push this repo to GitHub.
2. Render → **New → Web Service** → connect the repo.
3. Root directory `backend`, build `pip install -r requirements.txt`,
   start `uvicorn app.main:app --host 0.0.0.0 --port $PORT`.
   (Or just point Render at [`render.yaml`](render.yaml) as a Blueprint.)
4. Add the env var `GROQ_API_KEY`, and set `ALLOWED_ORIGINS` to your frontend URL.
5. Health check path: `/api/health`.

A `Dockerfile` is included for Koyeb / Railway / Fly, which take the same env vars.

> Render's free tier sleeps after ~15 minutes idle, so the first request can take
> 30-60 seconds. The frontend surfaces this as "the backend may be waking up".

## Configuration

Every value in `.env.example` is optional except `GROQ_API_KEY`. Notable ones:

| Variable                | Default                     | Meaning                            |
| ----------------------- | --------------------------- | ---------------------------------- |
| `GROQ_MODEL`            | `llama-3.3-70b-versatile`   | Any Groq chat model                |
| `LLM_TEMPERATURE`       | `0.3`                       | Low, to keep answers factual       |
| `MAX_HISTORY_MESSAGES`  | `20`                        | How much conversation memory to replay |
| `RATE_LIMIT_REQUESTS`   | `30` per 60s per IP         | Protects the free API key          |
| `ADMIN_TOKEN`           | unset (owner routes off)    | Profile edits **and** the chat log |
| `CHAT_LOG_ENABLED`      | `true`                      | Record questions at all            |
| `CHAT_LOG_PATH`         | `./data/chat_log.jsonl`     | Point at a mounted disk to keep history across deploys |
| `CHAT_LOG_MAX_ROWS`     | `20000`                     | Oldest rows trimmed past this; `0` = forever |
| `GEO_LOOKUP_ENABLED`    | `false`                     | Resolve visitor IPs to a city via ip-api.com |

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

### `POST /api/chat`

```jsonc
{
  "message": "Which project was the hardest?",
  "history": [
    { "role": "user", "content": "Tell me about his projects." },
    { "role": "assistant", "content": "Ritesh has shipped..." }
  ],
  "job_description": null,        // optional — puts a JD in context
  "language": "auto"              // "auto" | "en" | "hi"
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
| `ADMIN_TOKEN`           | unset (admin routes off)    | Enables profile reload/replace     |

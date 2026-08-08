# 🚀 Ritesh Kumar — AI Portfolio

A 3D interactive portfolio with an **AI representative** built in: instead of
reading a resume, recruiters can chat with an AI that answers questions about the
candidate — grounded strictly in a structured profile, and honest enough to say
*"I don't know"* when the answer isn't there.

**Live:** [riteshkr.info](https://riteshkr.info) · 

---

## What the AI does

| Capability                                      | How it works                                                                                                                   |
| ----------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| **Answers questions about the candidate** | Streams token-by-token from the Groq API, grounded in`backend/data/profile.json`                                             |
| **Never hallucinates**                    | The system prompt forbids inventing facts, estimating, rounding metrics or assuming adjacent tech; unknown ⇒ it says so       |
| **Remembers the conversation**            | Prior turns are replayed, so*"which one was the hardest?"* resolves against what was already discussed                       |
| **Survives rate limits**                  | An ordered chain of 5 Groq models — a 429 puts one on cooldown and the next answers, so the chat keeps working                |
| **Scores a job description**              | Paste a JD → 0-100 suitability score, matching skills,**missing** skills, strengths, concerns, interview recommendation |
| **Generates interview questions**         | Questions anchored to real projects and metrics, each labelled with what it probes                                             |
| **Speaks and listens**                    | Voice input (Web Speech API) and text-to-speech for answers                                                                    |
| **Exports the chat**                      | Print-to-PDF transcript of the conversation                                                                                    |

---

## Architecture

```
Portfolio 2.0/
├── backend/                    # FastAPI service (see backend/README.md)
│   ├── app/
│   │   ├── main.py             # routes, CORS, rate limiting, SSE streaming
│   │   ├── prompts.py          # the system prompt / anti-hallucination rules
│   │   ├── llm.py              # Groq client + model failover & cooldowns
│   │   ├── profile_store.py    # loads/validates/renders the profile
│   │   ├── schemas.py          # Pydantic models
│   │   └── config.py           # env-driven settings
│   ├── data/profile.json       # ← the single source of truth
│   ├── requirements.txt
│   ├── render.yaml             # one-click Render blueprint
│   └── Dockerfile
├── src/
│   ├── components/
│   │   ├── AIRepresentative.jsx    # the chat section (tabs, composer, toolbar)
│   │   └── ai/
│   │       ├── useChat.js          # streaming, memory, persistence, abort
│   │       ├── ChatBubble.jsx      # message + copy / listen actions
│   │       ├── JobMatchPanel.jsx   # JD scoring + interview questions
│   │       ├── MarkdownLite.jsx    # dependency-free markdown renderer
│   │       └── speech.js           # speech-to-text and text-to-speech hooks
│   ├── lib/aiClient.js             # fetch + SSE stream parsing
│   └── components/…                # the rest of the portfolio (Hero, Projects, …)
└── public/
```

---

## Run it locally

### 1. Backend

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate            # macOS/Linux: source .venv/bin/activate
pip install -r requirements.txt

copy .env.example .env            # macOS/Linux: cp .env.example .env
# add your free key from https://console.groq.com/keys

uvicorn app.main:app --reload --port 8000
```

Check it: [http://localhost:8000/api/health](http://localhost:8000/api/health) · docs at `/docs`

### 2. Frontend

```bash
npm install
cp .env.example .env              # VITE_AI_API_URL=http://localhost:8000
npm run dev                       # http://localhost:3000
```

Scroll to **Ask AI**, or click *Ask AI* in the navbar.

---

## Model fallback chain

Groq meters free-tier usage *per model* — each one has its own tokens-per-day
budget — so a single model eventually returns 429 under load. The chain is an
ordered list of nine links across two providers: six Groq models, then three
Gemini ones on a completely separate Google quota. The first healthy link
answers; any link that gets rate-limited is sidelined for a cooldown (honouring
`Retry-After`) while the next takes over. Visitors never see the failure, and
`GET /api/health` reports the live state of every link.

Both providers are called through their OpenAI-compatible `chat/completions`
endpoint, so one streaming code path serves both — they differ only by URL, key
and model id. Either provider is optional: with no `GEMINI_API_KEY` the Gemini
links simply drop out of the chain, and the service runs on Groq alone.

Because the two providers report the same problem differently — Groq answers
`401` for a bad key, Gemini answers `400 "Please pass a valid API key"` — both
are treated as failover conditions with a long cooldown. One provider's broken
credentials can never silence the other.

Two extra behaviours make the chain hold up in practice:

- **Failover happens only before the first token.** Once an answer is streaming,
  switching models would restart it mid-sentence, so a mid-stream failure is
  reported instead.
- **Models that reject the full prompt (HTTP 413) are retried immediately with a
  compact one** — 41% smaller, same facts — and remembered, so the smaller
  models stay usable instead of dropping out of the chain.

These six are every chat model Groq exposes that can serve this workload. The
rest of the catalogue cannot:

| Model                                     | Why it's excluded                                                                                                                                                                                                                                         |
| ----------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `groq/compound`, `groq/compound-mini` | Route to`llama-3.3-70b-versatile` internally and spend its quota, so they add no capacity when that model is the one that ran out. Their 429 names it explicitly. They also carry built-in web search, which could pull facts from outside the profile. |
| `whisper-large-v3*`                     | Speech-to-text                                                                                                                                                                                                                                            |
| `canopylabs/orpheus-*`                  | Text-to-speech                                                                                                                                                                                                                                            |
| `meta-llama/llama-prompt-guard-2-*`     | 512-token classifiers                                                                                                                                                                                                                                     |
| `allam-2-7b`                            | 4k context — smaller than the prompt itself                                                                                                                                                                                                              |

---

## Deploy

**Backend → Render** (free): New Web Service → root directory `backend`,
build `pip install -r requirements.txt`, start
`uvicorn app.main:app --host 0.0.0.0 --port $PORT`, health check `/api/health`.
Set `GROQ_API_KEY` and `ALLOWED_ORIGINS` (your frontend URL). The included
`render.yaml` works as a Blueprint, and the `Dockerfile` covers Koyeb / Railway / Fly.

**Frontend → Vercel** (free): import the repo, framework *Vite*, build
`npm run build`, output `dist`. Add the environment variable
`VITE_AI_API_URL=https://your-service.onrender.com`, then redeploy.

> Render's free tier sleeps after ~15 min idle — the first request can take
> 30-60s. The UI says so instead of just failing.

---

## Updating the candidate data

Everything the AI knows lives in [`backend/data/profile.json`](backend/data/profile.json)
— basics, education, skills, experience, projects, publications, achievements,
certifications, leadership, links. Edit it and restart; no prompt or code changes.

It is validated by Pydantic at startup, so a typo fails loudly instead of quietly
producing an AI that knows nothing. With `ADMIN_TOKEN` set you can even swap the
profile on a running deployment:

```bash
curl -X PUT https://your-service.onrender.com/api/profile \
  -H "X-Admin-Token: $ADMIN_TOKEN" -H "Content-Type: application/json" \
  --data @backend/data/profile.json
```

The `not_in_profile` list (salary, notice period, visa status, references) names
things the AI must explicitly decline to answer.

> **Never commit `.env`** — it holds the Groq API key. Both `.env` files are
> gitignored; only `.env.example` is tracked.

---

## Tech stack

**Frontend** — React 18, Vite 5, Tailwind CSS 3, Framer Motion, GSAP,
Three.js / React Three Fiber, Lucide icons
**Backend** — FastAPI, Pydantic v2, httpx (async SSE), Uvicorn
**LLM** — Groq API, streaming + JSON mode, 5-model failover chain
**Hosting** — Vercel (frontend), Render (backend)

## Portfolio features

3D particle background, glassmorphism UI, dark/light theme, scroll-triggered
reveals, smooth scrolling (Lenis), an interactive skill explorer that links each
skill to the projects it was used in, a scroll progress indicator, and full
responsiveness from mobile to desktop.

---

## Author

**Ritesh Kumar** — B.Tech CSE, Arka Jain University (CGPA 8.47, graduating May 2026)

- Portfolio: [riteshkr.info](https://riteshkr.info)
- GitHub: [RiteshKumar2e](https://github.com/RiteshKumar2e)
- LinkedIn: [riteshkumar-tech](https://www.linkedin.com/in/riteshkumar-tech)
- Email: riteshkumar90359@gmail.com

## License

MIT

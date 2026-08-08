<div align="center">

# 🚀 Ritesh Kumar — AI Portfolio

**A 3D interactive portfolio with a built-in AI representative.**
Instead of reading a resume, recruiters chat with an AI that answers questions about the candidate — grounded strictly in a structured profile, and honest enough to say *"I don't know"* when the answer isn't there.

[![Live](https://img.shields.io/badge/Live-riteshkr.info-6366f1?style=flat-square)](https://riteshkr.info)
[![React](https://img.shields.io/badge/React-18-61dafb?style=flat-square&logo=react&logoColor=white)](https://react.dev)
[![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=flat-square&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![Vite](https://img.shields.io/badge/Vite-5-646cff?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev)
[![License: MIT](https://img.shields.io/badge/License-MIT-green?style=flat-square)](#license)

[**Live Demo**](https://riteshkr.info) · [**Report a Bug**](https://github.com/RiteshKumar2e) · [**Contact**](#author)

</div>

---

## Table of Contents

- [Overview](#overview)
- [What the AI Does](#what-the-ai-does)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [Model Fallback Chain](#model-fallback-chain)
- [Deployment](#deployment)
- [Updating the Candidate Data](#updating-the-candidate-data)
- [Tech Stack](#tech-stack)
- [Portfolio Features](#portfolio-features)
- [Author](#author)
- [License](#license)

---

## Overview

This project reimagines the developer portfolio as a conversation. A 3D, animated frontend showcases the work; a grounded AI representative lets visitors *interrogate* it — asking about projects, skills, and experience, scoring a job description against the candidate, or generating interview questions.

The AI never invents facts. Every answer is grounded in a single structured profile (`backend/data/profile.json`), and the system is engineered to degrade gracefully under real-world load through a multi-provider model failover chain.

---

## What the AI Does

| Capability | How it works |
| --- | --- |
| **Answers questions about the candidate** | Streams token-by-token from the Groq API, grounded in `backend/data/profile.json`. |
| **Never hallucinates** | The system prompt forbids inventing facts, estimating, rounding metrics, or assuming adjacent tech — anything unknown is declined explicitly. |
| **Remembers the conversation** | Prior turns are replayed, so *"which one was the hardest?"* resolves against what was already discussed. |
| **Survives rate limits** | An ordered chain of models across two providers — a `429` sidelines one link and the next answers, so the chat keeps working. |
| **Scores a job description** | Paste a JD → a 0–100 suitability score with matching skills, **missing** skills, strengths, concerns, and an interview recommendation. |
| **Generates interview questions** | Questions anchored to real projects and metrics, each labelled with what it probes. |
| **Speaks and listens** | Voice input via the Web Speech API, plus text-to-speech for answers. |
| **Exports the chat** | Print-to-PDF transcript of the conversation. |

---

## Architecture

```
Portfolio 2.0/
├── backend/                       # FastAPI service (see backend/README.md)
│   ├── app/
│   │   ├── main.py                # routes, CORS, rate limiting, SSE streaming
│   │   ├── prompts.py             # system prompt / anti-hallucination rules
│   │   ├── llm.py                 # LLM client + model failover & cooldowns
│   │   ├── profile_store.py       # loads / validates / renders the profile
│   │   ├── schemas.py             # Pydantic models
│   │   └── config.py              # env-driven settings
│   ├── data/profile.json          # ← the single source of truth
│   ├── requirements.txt
│   ├── render.yaml                # one-click Render blueprint
│   └── Dockerfile
├── src/
│   ├── components/
│   │   ├── AIRepresentative.jsx    # chat section (tabs, composer, toolbar)
│   │   └── ai/
│   │       ├── useChat.js          # streaming, memory, persistence, abort
│   │       ├── ChatBubble.jsx      # message + copy / listen actions
│   │       ├── JobMatchPanel.jsx   # JD scoring + interview questions
│   │       ├── MarkdownLite.jsx    # dependency-free markdown renderer
│   │       └── speech.js           # speech-to-text and text-to-speech hooks
│   ├── lib/aiClient.js             # fetch + SSE stream parsing
│   └── components/…                # rest of the portfolio (Hero, Projects, …)
└── public/
```

---

## Getting Started

### Prerequisites

- **Node.js** 18+ and npm
- **Python** 3.10+
- A free **Groq API key** — [console.groq.com/keys](https://console.groq.com/keys)
- *(Optional)* a **Gemini API key** to extend the failover chain

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

Verify: [http://localhost:8000/api/health](http://localhost:8000/api/health) · interactive docs at `/docs`.

### 2. Frontend

```bash
npm install
cp .env.example .env               # VITE_AI_API_URL=http://localhost:8000
npm run dev                        # http://localhost:3000
```

Scroll to **Ask AI**, or click *Ask AI* in the navbar.

---

## Model Fallback Chain

Groq meters free-tier usage *per model* — each has its own tokens-per-day budget — so a single model eventually returns `429` under load. The chain solves this with an ordered list of **nine links across two providers**: six Groq models, followed by three Gemini models on a completely separate Google quota. The first healthy link answers; any link that gets rate-limited is sidelined for a cooldown (honouring `Retry-After`) while the next takes over. Visitors never see the failure, and `GET /api/health` reports the live state of every link.

Both providers are called through their OpenAI-compatible `chat/completions` endpoint, so one streaming code path serves both — they differ only by URL, key, and model id. Either provider is optional: with no `GEMINI_API_KEY`, the Gemini links simply drop out and the service runs on Groq alone.

Because the two providers report the same problem differently — Groq answers `401` for a bad key, Gemini answers `400 "Please pass a valid API key"` — both are treated as failover conditions with a long cooldown. One provider's broken credentials can never silence the other.

Two behaviours make the chain hold up in practice:

- **Failover happens only before the first token.** Once an answer is streaming, switching models would restart it mid-sentence, so a mid-stream failure is reported instead.
- **Models that reject the full prompt (`413`) are retried immediately with a compact prompt** — 41% smaller, same facts — and remembered, so the smaller models stay usable instead of dropping out.

These six are every chat model Groq exposes that can serve this workload. The rest of the catalogue cannot:

| Model | Why it's excluded |
| --- | --- |
| `groq/compound`, `groq/compound-mini` | Route to `llama-3.3-70b-versatile` internally and spend its quota, adding no capacity when that model is the one that ran out. They also carry built-in web search, which could pull facts from outside the profile. |
| `whisper-large-v3*` | Speech-to-text. |
| `canopylabs/orpheus-*` | Text-to-speech. |
| `meta-llama/llama-prompt-guard-2-*` | 512-token classifiers. |
| `allam-2-7b` | 4k context — smaller than the prompt itself. |

---

## Deployment

### Backend → Render (free tier)

New **Web Service** with root directory `backend`:

- **Build:** `pip install -r requirements.txt`
- **Start:** `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
- **Health check:** `/api/health`
- **Env vars:** `GROQ_API_KEY`, `ALLOWED_ORIGINS` (your frontend URL)

The included `render.yaml` works as a Blueprint, and the `Dockerfile` covers Koyeb / Railway / Fly.

### Frontend → Vercel (free tier)

Import the repo with framework preset **Vite**:

- **Build:** `npm run build`
- **Output:** `dist`
- **Env var:** `VITE_AI_API_URL=https://your-service.onrender.com`

Then redeploy.

> ⚠️ Render's free tier sleeps after ~15 min idle — the first request can take 30–60s. The UI communicates this instead of just failing.

---

## Updating the Candidate Data

Everything the AI knows lives in [`backend/data/profile.json`](backend/data/profile.json) — basics, education, skills, experience, projects, publications, achievements, certifications, leadership, and links. Edit it and restart; no prompt or code changes required.

The profile is validated by Pydantic at startup, so a typo fails loudly instead of quietly producing an AI that knows nothing. With `ADMIN_TOKEN` set, you can swap the profile on a running deployment:

```bash
curl -X PUT https://your-service.onrender.com/api/profile \
  -H "X-Admin-Token: $ADMIN_TOKEN" -H "Content-Type: application/json" \
  --data @backend/data/profile.json
```

The `not_in_profile` list (salary, notice period, visa status, references) names the things the AI must explicitly decline to answer.

> 🔒 **Never commit `.env`** — it holds the API keys. Both `.env` files are gitignored; only `.env.example` is tracked.

---

## Tech Stack

| Layer | Technologies |
| --- | --- |
| **Frontend** | React 18, Vite 5, Tailwind CSS 3, Framer Motion, GSAP, Three.js / React Three Fiber, Lucide icons |
| **Backend** | FastAPI, Pydantic v2, httpx (async SSE), Uvicorn |
| **LLM** | Groq + Gemini APIs — streaming, JSON mode, nine-link failover chain |
| **Hosting** | Vercel (frontend), Render (backend) |

---

## Portfolio Features

3D particle background · glassmorphism UI · dark / light theme · scroll-triggered reveals · smooth scrolling (Lenis) · an interactive skill explorer that links each skill to the projects it was used in · scroll progress indicator · full responsiveness from mobile to desktop.

---

## Author

**Ritesh Kumar** — B.Tech CSE, Arka Jain University (CGPA 8.47, graduating May 2026)

- 🌐 Portfolio: [riteshkr.info](https://riteshkr.info)
- 💻 GitHub: [@RiteshKumar2e](https://github.com/RiteshKumar2e)
- 💼 LinkedIn: [riteshkumar-tech](https://www.linkedin.com/in/riteshkumar-tech)
- ✉️ Email: [riteshkumar90359@gmail.com](mailto:riteshkumar90359@gmail.com)

---

## License

Distributed under the **MIT License**. See [`LICENSE`](LICENSE) for details.

<div align="center">

*Built with React, FastAPI, and a healthy distrust of hallucinating AIs.*

</div>
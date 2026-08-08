# Backend ko Render pe deploy karna

Frontend Vercel pe already live hai. Ab sirf FastAPI backend (`backend/`) ko Render pe
host karna hai, phir Vercel ko uska URL batana hai.

Poora kaam ~15 minute ka hai. Sab kuch free tier pe chalta hai.

---

## Step 0 — Pehle GitHub pe push karo (ye zaroori hai)

Render sirf GitHub/GitLab repo se deploy karta hai. Abhi is project me **koi git remote nahi
hai** — `git remote -v` khali aata hai. To pehle repo banao aur push karo.

```bash
cd "c:\Users\anmol\OneDrive\Desktop\Portfolio 2.0"

git add -A
git commit -m "Add AI representative: FastAPI backend + chat UI"
```

Ab GitHub pe ek repo banao (naam jaise `ai-portfolio`), phir:

```bash
git remote add origin https://github.com/RiteshKumar2e/<repo-naam>.git
git push -u origin main
```

> **Pehle ye check karo:** `git status` me `.env` ya `backend/.env` **nahi** dikhna chahiye.
> Usme aapki Groq API key hai. Dono gitignored hain, par push se pehle ek baar dekh lena.
> Agar galti se chali jaye to key turant [console.groq.com/keys](https://console.groq.com/keys)
> se rotate karni padegi.

Agar frontend ka repo alag hai (jisse Vercel deploy hota hai), to bhi ek hi repo me sab
rakhna theek hai — Render ko sirf `backend/` folder chahiye, baaki ignore kar dega.

---

## Step 1 — Render pe Web Service banao

1. [render.com](https://render.com) pe GitHub se sign in karo.
2. **New → Web Service** → apna repo connect karo (pehli baar me GitHub access dena padega).
3. Settings bharo:

| Field | Value |
| --- | --- |
| **Name** | `ai-portfolio-api` (koi bhi naam) |
| **Region** | `Singapore` (India ke sabse paas) |
| **Branch** | `main` |
| **Root Directory** | `backend` ← **ye bahut zaroori hai** |
| **Runtime** | `Python 3` |
| **Build Command** | `pip install -r requirements.txt` |
| **Start Command** | `uvicorn app.main:app --host 0.0.0.0 --port $PORT` |
| **Instance Type** | `Free` |

> **Root Directory `backend` set karna mat bhoolna.** Warna Render repo ke root me
> `requirements.txt` dhoondhega, nahi milega, aur build fail ho jayega.

4. **Advanced** me **Health Check Path** = `/api/health` daal do. Isse Render ko pata
   chalta hai ki service sach me chalu hui ya nahi.

---

## Step 2 — Environment variables daalo

Render dashboard me **Environment** tab → **Add Environment Variable**:

| Key | Value | Zaroori? |
| --- | --- | --- |
| `GROQ_API_KEY` | apni key (`gsk_...`) — `backend/.env` se copy kar lo | **haan** |
| `GROQ_MODELS` | `llama-3.3-70b-versatile,openai/gpt-oss-120b,qwen/qwen3.6-27b,openai/gpt-oss-20b,llama-3.1-8b-instant,openai/gpt-oss-safeguard-20b` | recommended |
| `GEMINI_API_KEY` | [aistudio.google.com/apikey](https://aistudio.google.com/apikey) se free key | recommended |
| `ALLOWED_ORIGINS` | `https://riteshkr.info,https://www.riteshkr.info` | **haan** |
| `PYTHON_VERSION` | `3.11.9` | recommended |
| `ADMIN_TOKEN` | `backend/.env` wala token | optional |

**`GROQ_MODELS` zaroor daalo** — nahi to default chain chalegi (wahi 5 models), jo theek
hai, par ek hi `GROQ_MODEL` (singular) **kabhi mat** daalna: usse rate-limit wala failover
band ho jayega aur 429 seedhe visitor ko dikhega.

**`GEMINI_API_KEY` daalna bahut faydemand hai.** Google ka free tier Groq se bilkul alag
quota hai, to jis din saare 6 Groq models ka daily budget khatam ho jayega, chat phir bhi
Gemini se chalti rahegi. Bina key ke bhi sab theek chalega — Gemini wale links chain se
apne aap nikal jayenge.

**`ALLOWED_ORIGINS` me wahi domain likho jo browser ke address bar me dikhta hai.**
Agar aapka site `riteshkr.info` pe hai to wahi. Vercel ke preview URLs (`*.vercel.app`)
code me already allowed hain, unhe alag se likhne ki zaroorat nahi.

**Save karte hi Render khud redeploy kar dega.**

> Chhota shortcut: `backend/render.yaml` file already bani hui hai. Render pe
> **New → Blueprint** choose karke repo dene se ye saari settings apne aap bhar jayengi —
> sirf `GROQ_API_KEY` haath se daalni padegi (wo jaan-boojh kar `sync: false` rakhi hai).

---

## Step 3 — Deploy check karo

Pehla build ~2-4 minute lega. Logs me `Application startup complete` dikhna chahiye.

Phir browser me kholo:

```
https://<aapka-service>.onrender.com/api/health
```

Aisa JSON aana chahiye:

```json
{
  "status": "ok",
  "llm_configured": true,
  "models": ["llama-3.3-70b-versatile", "openai/gpt-oss-120b", "..."],
  "model_health": [...],
  "profile": { "name": "Ritesh Kumar", "projects": 10 }
}
```

- `"llm_configured": true` → API key sahi lagi hai.
- Agar `false` aaye → `GROQ_API_KEY` set nahi hui ya khali hai.

Chat bhi seedhe test kar sakte ho:

```bash
curl -N -X POST https://<aapka-service>.onrender.com/api/chat \
  -H "Content-Type: application/json" \
  -d "{\"message\":\"Tell me about this candidate.\"}"
```

API docs bhi live milenge: `https://<aapka-service>.onrender.com/docs`

---

## Step 4 — Vercel ko backend ka URL batao

Ye aakhri aur sabse zaroori step hai.

1. Vercel → apna project → **Settings → Environment Variables**
2. Add karo:

   | Key | Value | Environments |
   | --- | --- | --- |
   | `VITE_AI_API_URL` | `https://<aapka-service>.onrender.com` | Production, Preview, Development |

   URL ke end me slash **mat** lagana.

3. **Deployments → latest → Redeploy** karo.

> **Ye step skip mat karna.** Vite environment variables ko **build ke waqt** code me
> bake kar deta hai, runtime pe nahi padhta. Sirf variable add karne se kuch nahi hoga —
> jab tak dobara build nahi hoga, site purane `localhost:8000` pe hi call karti rahegi.

Site khol ke **Ask AI** section dekho — status dot **"AI online"** (hara) dikhna chahiye.

---

## Free tier ki ek baat

Render ka free plan ~15 minute inactivity ke baad service ko **sula deta hai**. Uske baad
pehli request 30-60 second le sakti hai jab tak service uthti hai.

UI isse handle karta hai — visitor ko error ke bajaye ye message dikhta hai:
*"It may be starting up (free hosting sleeps after inactivity) — try again in a few seconds."*

Agar isse bachna hai to paid plan ($7/month) lena padega. Cron se ping karke jagaye rakhna
Render ki free-tier policy ke against hai, isliye wo suggest nahi kar raha.

---

## Kuch galat ho to

| Problem | Wajah aur hal |
| --- | --- |
| Build fail: `requirements.txt not found` | **Root Directory** `backend` set nahi kiya |
| `Application failed to respond` / port error | Start command me `--port $PORT` hona chahiye, koi fixed number nahi |
| Browser console me **CORS error** | `ALLOWED_ORIGINS` me aapka asli domain nahi hai. Exact origin likho (`https://riteshkr.info`), path ya trailing slash ke bina |
| Chat me *"AI is not configured"* | `GROQ_API_KEY` Render pe set nahi hui |
| Chat me *"credentials were rejected"* | Key galat ya revoke ho chuki hai — Groq console se nayi banao |
| Site abhi bhi localhost pe call kar rahi | Vercel pe `VITE_AI_API_URL` daalne ke baad **redeploy** nahi kiya |
| Har request pe 429 | Ek hi `GROQ_MODEL` set kar diya hai — `GROQ_MODELS` (plural, poori list) use karo |
| Pehli request 30-60s slow | Free tier ka cold start — normal hai |

---

## Baad me profile update karni ho

`backend/data/profile.json` edit karke push kar do — Render apne aap redeploy karega.

Ya bina redeploy ke, agar `ADMIN_TOKEN` set hai:

```bash
curl -X PUT https://<aapka-service>.onrender.com/api/profile \
  -H "X-Admin-Token: <aapka-token>" \
  -H "Content-Type: application/json" \
  --data @backend/data/profile.json
```

Galat profile 422 error ke saath reject ho jayegi aur purani wali live rahegi.

# Arthurian AI Resume — Project Overview

> **Last Updated:** 2026-03-03  
> **Purpose:** Complete technical & product reference for the Arthurian AI Korean Resume service. Written so any developer or AI can understand, extend, or debug this project without prior context.

---

## 1. Service Summary

**Arthurian AI Resume** converts an English/international resume (PDF) into a **professional Korean 이력서 (résumé)** that meets Korean corporate HR standards, using Claude AI.

**Target Users:** Foreigners and expats applying to Korean companies who do not know how to format a Korean resume.

**Core Value Prop:** Upload your English PDF → AI translates and restructures it into Korean HR-compliant format → Download or print instantly.

---

## 2. Links & Accounts

| Item | Value |
|------|-------|
| **GitHub Repo** | https://github.com/MCuffs/resume |
| **Vercel Production** | https://arthurian-5b3z.vercel.app |
| **Custom Domain** | https://www.arthrian.cloud |
| **Vercel Project** | `arthurian-5b3z` — team: `mansu's projects` |
| **Vercel Branch** | `main` (auto-deploys on push) |
| **Google Analytics** | `G-3X1VV003WH` |

---

## 3. Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, TypeScript, Vite |
| Styling | Tailwind CSS, Lucide React, Framer Motion |
| Routing | React Router DOM v7 |
| AI | Anthropic Claude (`claude-3-5-sonnet-20241022`) |
| Payment | PayPal React SDK (`@paypal/react-paypal-js`) |
| DB (optional) | Supabase (session/transaction tracking) |
| PDF Parsing (local) | `pdfjs-dist` via Express server |
| PDF Parsing (Vercel) | `pdf2json` via serverless function |
| Backend (local) | Express.js (`server/index.cjs`, port 3001) |
| Backend (Vercel) | Serverless functions in `api/` folder |
| Deployment | Vercel (auto-deploy from GitHub `main`) |

---

## 4. Repository Structure

```
resume-main/
├── api/                        # Vercel Serverless Functions (production)
│   ├── parse-resume.ts         # POST /api/parse-resume — extracts text from PDF
│   └── generate-resume.ts      # POST /api/generate-resume — Claude AI translation
├── server/
│   └── index.cjs               # Express backend for LOCAL development (port 3001)
├── src/
│   ├── pages/
│   │   ├── Home.tsx            # Landing page — file upload + "Run AI Pipeline" button
│   │   └── ResumePreview.tsx   # Preview/result page — PayPal payment + AI output
│   ├── App.tsx                 # Router (/ and /preview routes)
│   └── main.tsx                # React entry point
├── public/                     # Static assets
├── index.html                  # SPA entry — SEO meta tags, analytics scripts
├── vite.config.ts              # Vite config + dev proxy for /api → localhost:3001
├── vercel.json                 # Vercel routing config
├── .env                        # Local secrets (gitignored)
├── .env.example                # Template for required env vars
└── package.json                # Scripts: dev, build, preview
```

---

## 5. User Flow (End-to-End)

```
[Home Page /]
    │
    ├─ User uploads English PDF
    │
    ├─ Clicks "Run AI Pipeline"
    │       │
    │       └─ POST /api/parse-resume
    │               ├─ Extracts raw text from PDF
    │               ├─ Creates pending Supabase transaction (optional)
    │               └─ Returns { text, sessionId }
    │
    ├─ localStorage.setItem('rawResumeText', text)
    │
    └─ navigate('/preview')

[Preview Page /preview]
    │
    ├─ Reads rawResumeText from localStorage
    │
    ├─ Shows BLURRED resume preview with lock overlay
    │
    ├─ Bottom sticky bar shows PayPal button (₩4,900 / $3.99 USD)
    │
    └─ User completes PayPal payment
            │
            └─ POST /api/generate-resume
                    ├─ { rawText, sessionId, orderId }
                    ├─ Verifies payment via orderId
                    ├─ Calls Claude AI with system prompt
                    └─ Returns { data: KoreanResumeJSON }

[Unlock Complete]
    └─ Resume displayed in full → User can Print / Download PDF
```

---

## 6. Pricing

| Service | Price |
|---------|-------|
| AI Korean Resume (PDF translation) | ₩4,900 / $3.99 USD (via PayPal) |
| Korean Resume Review (by HR expert) | ₩29,000 (inquiry form → email) |
| Custom Interview Questions | ₩69,000 (inquiry form → email) |

---

## 7. Environment Variables

### Required for Production (set in Vercel Dashboard)

| Variable | Purpose |
|----------|---------|
| `ANTHROPIC_API_KEY` | Claude AI API key for resume generation |
| `VITE_PAYPAL_CLIENT_ID` | PayPal client ID for payment processing |
| `SUPABASE_URL` | Supabase project URL (optional, for session tracking) |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase admin key (optional) |

### For Local Development
Create `.env` file in project root:
```env
ANTHROPIC_API_KEY=sk-ant-api03-...
VITE_PAYPAL_CLIENT_ID=AX...
SUPABASE_URL=https://xxx.supabase.co        # optional
SUPABASE_SERVICE_ROLE_KEY=...               # optional
```

---

## 8. Local Development Guide

```bash
# 1. Install dependencies
npm install

# 2. Create .env file with required keys (see Section 7)

# 3. Start both servers with one command
npm run dev
# → [API] Express server running on http://localhost:3001
# → [VITE] Frontend running on http://localhost:5173
```

Vite automatically proxies `/api/parse-resume` and `/api/generate-resume` to `localhost:3001`. No separate backend start needed.

---

## 9. Deployment to Vercel

1. Push to `main` branch → Vercel auto-deploys
2. **On first setup**, go to Vercel Dashboard → Settings → Environment Variables → add `ANTHROPIC_API_KEY` and `VITE_PAYPAL_CLIENT_ID`
3. On Vercel, the `api/` serverless functions replace the Express server

> ⚠️ Do NOT commit `.env` — it's in `.gitignore`

---

## 10. AI System Prompt (Claude)

The prompt lives in `server/index.cjs` (local) and `api/generate-resume.ts` (Vercel).

**Role:** Expert Korean Resume Translator & Career Consultant  
**Model:** `claude-3-5-sonnet-20241022`  
**Temperature:** 0.2 (low = consistent, professional output)  
**Max tokens:** 4096

**Output JSON Schema:**
```json
{
  "personalInfo": { "name", "gender", "birthYear", "phone", "email", "address", "summary" },
  "education": [{ "schoolName", "degree", "major", "period", "status" }],
  "experience": [{ "companyName", "period", "totalDuration", "projects": [{ "projectName", "period", "role", "achievements": [] }] }],
  "extracurricular": [{ "title", "period", "description" }],
  "certifications": [],
  "skills": [],
  "keywords": [],
  "selfIntroduction": "3-4 paragraph Korean 자기소개서"
}
```

If Claude API fails, the server returns a **hardcoded mock result** so the UI never breaks during development.

---

## 11. Known Issues & Notes

- **PayPal in sandbox mode** if `VITE_PAYPAL_CLIENT_ID` is not set (defaults to `"test"`)
- **Supabase is optional** — if keys are missing, session tracking is skipped but AI generation still works
- **Demo flow:** "View Demo Output" button on Home page bypasses API and directly loads mock Korean resume data into localStorage. This does NOT trigger PayPal.
- **localStorage cleanup:** Home page clears `parsedResume` on mount to prevent demo data leaking into real upload flow.

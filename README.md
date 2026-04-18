# TACHYON

> *A transmission from your future self, traveling backwards through time.*

**Earth Day 2026** — Answer 8 questions about your lifestyle today. Receive three AI-generated transmissions from yourself in 2050, each representing a different future based on the choices you make now.

🔗 **[tachyon-five.vercel.app](https://tachyon-five.vercel.app)**

---

## What It Does

TACHYON intercepts three signals from your future self via tachyon particles:

| Signal | Path | Integrity | Origin |
|---|---|---|---|
| 🔴 Transmission 1 | Unchanged | 55–65% | City displaced inland `[relocated]` |
| 🟡 Transmission 2 | One committed change | 74–82% | Same area, intact |
| 🟢 Transmission 3 | Radical shift | 90–96% | Original city, intact |

Signal integrity is a metaphor — never explained, always felt. The `[relocated]` tag in the metadata is climate displacement, implied. The `[CORRUPTED]` fragments in the dark timeline are rendered as live-glitching characters in the UI.

The last question — *one thing you'd genuinely commit to* — is asked before you read any transmission. You commit first. That makes the hopeful signal feel earned.

---

## Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 14 (App Router, TypeScript) |
| AI | Gemini 2.5 Flash (`@google/genai`) |
| Auth | Auth0 v4 (`@auth0/nextjs-auth0`) |
| Database | Supabase (Postgres + JSONB) |
| Styling | Tailwind + custom terminal CSS |
| Fonts | VT323 + Share Tech Mono |
| Deploy | Vercel |

---

## Project Structure

```
tachyon/
├── app/
│   ├── layout.tsx                  # Root layout — Auth0Provider, terminal.css
│   ├── page.tsx                    # Phase state machine: intro → form → intercepting → viewing → share
│   ├── api/
│   │   ├── transmit/route.ts       # POST — Auth0 gate + Gemini call
│   │   └── save/route.ts           # POST — saves signal to Supabase, returns slug
│   └── signal/[slug]/
│       ├── page.tsx                # Server component — fetches signal by slug
│       └── SignalViewer.tsx        # Client component — tabbed transmission viewer
├── components/
│   ├── Providers.tsx               # Auth0Provider wrapper
│   ├── IntroScreen.tsx             # Landing with login/logout state
│   ├── FormScreen.tsx              # 8-step form with choice grids + keyboard nav
│   ├── InterceptingScreen.tsx      # Terminal loading animation, waits for API
│   ├── ViewingScreen.tsx           # Typewriter reveal + metadata block
│   ├── ShareScreen.tsx             # Tabbed card view + shareable link
│   ├── GlitchedText.tsx            # Animated glitch character cycling
│   └── ParsedText.tsx              # Splits [CORRUPTED] tags → GlitchedText
├── lib/
│   ├── prompts.ts                  # Gemini prompt builders + TypeScript types
│   ├── supabase.ts                 # Client, saveSignal, getSignalBySlug, generateSlug
│   └── constants.ts                # UI constants, path metadata, helpers
├── styles/
│   └── terminal.css                # CRT scanlines, phosphor glow, sweep animations
└── middleware.ts                   # Auth0 middleware — /auth/* routes + API protection
```

---

## Local Development

### Prerequisites

- Node.js 18+
- [Google AI Studio](https://aistudio.google.com) API key
- [Auth0](https://auth0.com) Regular Web Application
- [Supabase](https://supabase.com) project

### 1. Clone and install

```bash
git clone https://github.com/sushilkulkarni1389/tachyon.git
cd tachyon
npm install
```

### 2. Environment variables

Create `.env.local`:

```env
# Gemini
GEMINI_API_KEY=your_gemini_api_key

# Auth0 (v4 SDK — uses /auth/* not /api/auth/*)
AUTH0_SECRET=your_random_32_char_secret
AUTH0_DOMAIN=your-tenant.us.auth0.com
AUTH0_CLIENT_ID=your_client_id
AUTH0_CLIENT_SECRET=your_client_secret
APP_BASE_URL=http://localhost:3000

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

> **Note:** If `AUTH0_SECRET` is not set, the auth gate is skipped in local dev. API routes are open and the login button won't function.

### 3. Configure Auth0

In Auth0 dashboard → Applications → your app → Settings:

| Field | Value |
|---|---|
| Allowed Callback URLs | `http://localhost:3000/auth/callback` |
| Allowed Logout URLs | `http://localhost:3000` |
| Allowed Web Origins | `http://localhost:3000` |

> **Important:** Auth0 v4 SDK uses `/auth/callback`, **not** `/api/auth/callback`. This is the most common setup mistake.

### 4. Set up Supabase

Run in Supabase dashboard → SQL Editor:

```sql
CREATE TABLE signals (
  id          uuid primary key default gen_random_uuid(),
  user_id     text,
  answers     jsonb not null,
  transmissions jsonb not null,
  slug        text unique not null,
  created_at  timestamp with time zone default now()
);

CREATE INDEX signals_slug_idx ON signals(slug);
```

### 5. Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Deployment

### Vercel (recommended)

1. Push to GitHub and import the repo in [Vercel](https://vercel.com)
2. Add all `.env.local` variables in Vercel → Settings → Environment Variables
3. Change `APP_BASE_URL` to your production URL: `https://your-app.vercel.app`
4. In Auth0 dashboard, add production URLs alongside localhost:
   - Callback: `https://your-app.vercel.app/auth/callback`
   - Logout: `https://your-app.vercel.app`
5. Deploy

> Environment variable changes require a redeploy to take effect.

---

## API Reference

### `POST /api/transmit`

Generates three transmissions via Gemini 2.5 Flash. Requires Auth0 session in production.

**Request body:** `TachyonAnswers`
```typescript
{
  name: string
  age: string
  location: string       // "City, Country"
  transport: string
  diet: string
  flights: string
  energy: string
  commitment: string     // the emotional anchor
}
```

**Response:** `TachyonResponse`
```typescript
{
  transmissions: [Transmission, Transmission, Transmission]
}
```

### `POST /api/save`

Saves a completed signal to Supabase. Fire-and-forget — failure never blocks the user experience.

**Request:** `{ answers, transmissions }`  
**Response:** `{ ok: true, slug }` or `{ ok: false, error }`

### `GET /signal/[slug]`

Public server-rendered page. Fetches and displays a saved signal with all three transmissions. No auth required.

---

## How the Prompt Works

The entire generation is one API call returning structured JSON. The key architectural decision: **the system prompt is deliberately not theatrical.**

Early versions framed the system role as "TACHYON signal reconstruction engine" — and Gemini interpreted that as permission to scramble the prose itself. Every letter rearranged. The fix was a neutral system role + one complete few-shot example showing exactly what correct output looks like. The creative framing lives in the user prompt as context, not identity.

See [`lib/prompts.ts`](lib/prompts.ts) for the full implementation.

---

## License

MIT
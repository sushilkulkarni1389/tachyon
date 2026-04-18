# TACHYON — Transmissions from 2050

A signal from your future self, traveling backwards through time. An Earth Day 2026 experience.

Users answer 8 questions about their lifestyle, then receive three AI-generated transmissions from their future self in 2050 — each representing a different timeline based on the choices they make today.

**Stack:** Next.js 14 (App Router) / TypeScript / Gemini 2.5 Flash / Auth0 / Supabase / Vercel

## Architecture

```
app/
  layout.tsx              Root layout — Auth0Provider, terminal.css
  page.tsx                Phase state machine (intro -> form -> intercepting -> viewing -> share)
  api/
    transmit/route.ts     POST — Auth0 gate, Gemini call with fallback model
    save/route.ts         POST — Saves signal to Supabase, returns slug
  signal/[slug]/
    page.tsx              Server component — fetches signal by slug
    SignalViewer.tsx       Client component — tabbed transmission viewer

components/
  Providers.tsx           Auth0Provider wrapper
  IntroScreen.tsx         Landing screen with auth state (login/logout)
  FormScreen.tsx          8-step questionnaire with choice grids, keyboard nav
  InterceptingScreen.tsx  Fake terminal loading animation, waits for API
  ViewingScreen.tsx       Typewriter text reveal with metadata block
  ShareScreen.tsx         Tabbed card view, pull quote, shareable link
  GlitchedText.tsx        Animated glitch character cycling
  ParsedText.tsx          Splits [CORRUPTED]/[SIGNAL DEGRADED] tags into GlitchedText

lib/
  prompts.ts              System + user prompt builders, TachyonAnswers/Transmission types
  supabase.ts             Supabase client, saveSignal, getSignalBySlug, generateSlug
  constants.ts            Shared UI constants (questions, path metadata, helpers)

styles/
  terminal.css            Full retro terminal UI (CRT scanlines, glow, animations)

middleware.ts             Auth0 middleware — handles /auth/* routes, protects API routes
```

## Getting Started

### Prerequisites

- Node.js 18+
- Auth0 account with a Regular Web Application
- Supabase project
- Google AI Studio API key (Gemini)

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment variables

Copy `.env.local.example` or create `.env.local`:

```env
# Gemini
GEMINI_API_KEY=your_gemini_api_key

# Auth0 (v4 SDK — uses /auth/* routes, not /api/auth/*)
AUTH0_SECRET=<random 32+ char string>
AUTH0_DOMAIN=your-tenant.us.auth0.com
AUTH0_CLIENT_ID=your_client_id
AUTH0_CLIENT_SECRET=your_client_secret
APP_BASE_URL=http://localhost:3000

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

### 3. Configure Auth0

In your Auth0 dashboard (Applications > Settings):

| Field | Local | Production |
|---|---|---|
| **Allowed Callback URLs** | `http://localhost:3000/auth/callback` | `https://your-domain.vercel.app/auth/callback` |
| **Allowed Logout URLs** | `http://localhost:3000` | `https://your-domain.vercel.app` |
| **Allowed Web Origins** | `http://localhost:3000` | `https://your-domain.vercel.app` |
| **Application Login URI** | *(leave empty)* | *(leave empty)* |

**Important:** Auth0 v4 SDK uses `/auth/*` routes, **not** `/api/auth/*`.

### 4. Set up Supabase

Run this SQL in your Supabase dashboard (SQL Editor):

```sql
CREATE TABLE signals (
  id uuid primary key default gen_random_uuid(),
  user_id text,
  answers jsonb not null,
  transmissions jsonb not null,
  slug text unique not null,
  created_at timestamp with time zone default now()
);
CREATE INDEX signals_slug_idx ON signals(slug);
```

### 5. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

**Local dev without Auth0:** If `AUTH0_SECRET` is not set, the auth gate is skipped and API routes are open. The login button will still appear but won't function without valid Auth0 credentials.

## Deployment (Vercel)

1. Push to GitHub and connect the repo to Vercel
2. Add all environment variables from `.env.local` to Vercel project settings
3. Set `APP_BASE_URL` to your production URL (e.g. `https://tachyon-five.vercel.app`)
4. Update Auth0 allowed callback/logout URLs to include the production domain
5. Deploy

## How It Works

1. **Intro** — User sees the terminal landing screen and logs in via Auth0
2. **Form** — 8 questions: name, age, location, transport, diet, flights, energy, commitment
3. **Intercepting** — Fake terminal animation plays while Gemini generates transmissions
4. **Viewing** — Three transmissions revealed one at a time with typewriter effect:
   - **Path 1 (Unchanged)** — Dark timeline with `[CORRUPTED]` signal fragments
   - **Path 2 (One Change)** — The user's commitment rippled in unexpected ways
   - **Path 3 (Radical Shift)** — The world held; specific small joys returned
5. **Share** — Tabbed card view with shareable link (`/signal/[slug]`)

## API Routes

### POST /api/transmit

Generates three transmissions via Gemini. Auth0 session required in production. Falls back from `gemini-2.5-flash` to `gemini-3-flash-preview` on failure.

**Request:** `TachyonAnswers` JSON body
**Response:** `TachyonResponse` with 3 transmissions

### POST /api/save

Saves a completed signal to Supabase. Fire-and-forget from the client — failure doesn't block the user experience.

**Request:** `{ answers, transmissions }`
**Response:** `{ ok: true, slug }`

### GET /signal/[slug]

Public server-rendered page displaying a saved signal with all 3 transmissions.

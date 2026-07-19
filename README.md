# CareerSaathi

AI-powered career coaching platform — track applications, generate tailored cover letters, and practice mock interviews with an AI coach.

## Features

- **Job Catalog** — 20 seeded positions across 7 companies; search, filter by category/location, sort, pagination
- **AI Content Generator** — generates cover letters, resume bullet points, or LinkedIn summaries; streams output; saves to tracker
- **AI Mock Interview Coach** — interactive streaming chat scoped to job postings; adaptive difficulty; persistent conversations; suggested prompt chips
- **Application Tracker** — status pipeline (Saved → Applied → Interviewing → Offer); ink-stroke progress visualization; one-click job tracking from listings
- **Blog** — career advice articles with category filtering and search
- **Auth** — email/password, Google OAuth, and one-click demo account

## Tech Stack

| Layer           | Technology                                    |
| --------------- | --------------------------------------------- |
| Framework       | Next.js 16 (App Router) + React 19            |
| Language        | TypeScript                                    |
| Styling         | Tailwind CSS v4 + shadcn/ui                   |
| Database        | MongoDB (raw driver, no ORM)                  |
| Auth            | Better Auth (JWT + JWKS verification)         |
| AI              | Vercel AI SDK (Google Gemini + Groq fallback) |
| Icons           | Hugeicons                                     |
| Testing         | Playwright (E2E)                              |
| Package Manager | pnpm                                          |

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)
- pnpm

### Installation

```bash
pnpm install
```

### Environment Variables

Create a `.env.local` file in the project root:

```env
# MongoDB connection string
MONGODB_URI=mongodb://localhost:27017/careersaathi

# Better Auth secret (used for JWT signing)
BETTER_AUTH_SECRET=your-secret-key

# Google OAuth (for social login)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# AI providers (Groq is tried first as free fallback, then Gemini)
GROQ_API_KEY=your-groq-api-key
GOOGLE_GENERATIVE_AI_API_KEY=your-gemini-api-key

# App URL (used for auth redirects)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Seed Database

Populates MongoDB with 20 job postings and a demo user account:

```bash
pnpm seed
```

### Run Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
career-saathi/
├── app/
│   ├── (auth)/              # Login, register (redirect to dashboard if logged in)
│   ├── (protected)/         # Dashboard, generator, coach, applications (JWT required)
│   ├── (public)/            # Jobs, blog, about, privacy (no auth required)
│   ├── api/                 # Route handlers (auth, jobs, applications, AI)
│   ├── layout.tsx           # Root layout (fonts, navbar, footer, toaster)
│   ├── page.tsx             # Landing page
│   └── not-found.tsx        # Custom 404
├── components/
│   ├── ui/                  # shadcn/ui primitives (button, card, input, etc.)
│   ├── Navbar.tsx           # Server wrapper
│   ├── NavbarClient.tsx     # Client navbar with auth-aware links
│   ├── job-card.tsx         # Reusable job listing card
│   ├── track-button.tsx     # One-click job tracking button
│   ├── status-badge.tsx     # Color-coded application status
│   └── ink-stroke-progress.tsx  # Custom SVG progress indicator
├── lib/
│   ├── auth.ts              # Better Auth server config (JWT + Bearer plugins)
│   ├── auth-client.ts       # Better Auth client config
│   ├── session.ts           # JWT verification via JWKS (jose)
│   ├── db.ts                # MongoDB singleton connection
│   ├── ai-models.ts         # AI model fallback chain
│   ├── coach-prompt.ts      # Mock interview system prompt builder
│   ├── blog-data.ts         # Static blog content
│   ├── types.ts             # TypeScript type definitions
│   └── utils.ts             # cn(), setJwtCookie(), clearJwtCookie()
├── scripts/
│   └── seed.ts              # Database seed script
├── tests/
│   └── auth.spec.ts         # Playwright E2E tests (35+ tests)
├── proxy.ts                 # Route protection (Next.js 16 proxy convention)
└── playwright.config.ts     # Playwright configuration
```

## Architecture

### Auth Flow

1. User logs in via email/password, Google OAuth, or demo account
2. Better Auth issues a JWT, which is stored in a `jwt` cookie by the client
3. `proxy.ts` intercepts requests to protected paths (`/dashboard`, `/generator`, `/coach`, `/applications`) and verifies the JWT via JWKS
4. Unauthenticated users are redirected to `/login?callbackUrl=<original-path>`
5. API routes use `requireSession()` for JWT verification — browser navigations are rejected with 401

### AI Integration

The AI layer uses a **model fallback chain** to handle rate limits gracefully:

1. **Groq** (llama-3.3-70b-versatile) — tried first (free tier)
2. **Google Gemini 2.0 Flash** — fallback on 429/quota errors
3. **Google Gemini 1.5 Flash** — final fallback

All AI endpoints stream responses using Vercel AI SDK's `streamText()`.

### Database Collections

| Collection          | Purpose                                            |
| ------------------- | -------------------------------------------------- |
| `user`              | User accounts (managed by Better Auth)             |
| `session`           | Auth sessions (managed by Better Auth)             |
| `jobPosting`        | Job listings (seeded + user-created custom jobs)   |
| `application`       | User-tracked job applications with status pipeline |
| `coachConversation` | AI mock interview conversation history             |

## API Routes

| Method   | Path                             | Description                                               |
| -------- | -------------------------------- | --------------------------------------------------------- |
| `*`      | `/api/auth/[...all]`             | Better Auth catch-all (login, register, session, etc.)    |
| `GET`    | `/api/jobs`                      | Paginated job listings with search/filter                 |
| `GET`    | `/api/jobs/[id]`                 | Job detail + related jobs                                 |
| `GET`    | `/api/applications`              | User's tracked applications (populated with job details)  |
| `POST`   | `/api/applications`              | Create application (existing jobId or custom job)         |
| `PATCH`  | `/api/applications/[id]`         | Update application status/notes/generated content         |
| `DELETE` | `/api/applications/[id]`         | Remove application                                        |
| `POST`   | `/api/ai/generate`               | Generate cover letter / resume bullets / LinkedIn summary |
| `POST`   | `/api/ai/coach`                  | AI mock interview chat turn (streaming)                   |
| `GET`    | `/api/ai/coach/[conversationId]` | Fetch or create a conversation                            |

## Testing

```bash
# Install Playwright browsers (first time only)
npx playwright install chromium

# Run all tests
pnpm exec playwright test

# Run with UI mode
pnpm exec playwright test --ui
```

Tests cover: public pages, auth flows, protected route redirects, API protection, logout, navigation, responsive layouts, and security (open redirect protection).

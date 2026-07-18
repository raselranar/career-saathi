# AGENT.md — CareerSaathi

> This file is the single source of truth for building this project. Read it fully before writing any code. It is written for an AI coding agent (Claude Code, Cursor, etc.) pairing with the developer — follow it section by section, don't skip ahead.

---

## 1. Project Overview

**Name:** CareerSaathi ("Saathi" = companion — an AI companion for your job search)

**One-liner:** An AI-powered career coach that reviews job postings, generates tailored cover letters/resume bullets for a specific role, and runs live mock interviews scoped to that role.

**Problem it solves:** Job seekers write generic cover letters and walk into interviews unprepared because tailoring content and practicing per-role takes too long to do by hand for every application.

**Why this is agentic, not a ChatGPT wrapper:**

- The Content Generator reasons over structured context (job description + user's skills) to produce role-specific output, not generic text.
- The Mock Interview Coach keeps conversation memory, adapts its next question based on the candidate's last answer, and gives feedback — real follow-up reasoning, not single-shot Q&A.

**Explicitly NOT reused from:** IdeaVault, SunCart, KeenKeeper, or Khamar Bazaar. Different domain, different data model, different core loop (interview practice vs. marketplace browsing).

---

## 2. Tech Stack (locked — don't deviate mid-build)

| Layer     | Choice                                                                   |
| --------- | ------------------------------------------------------------------------ |
| Frontend  | Next.js 16 (App Router), TypeScript                                      |
| Styling   | Tailwind CSS + shadcn/ui                                                 |
| Forms     | react-hook-form + zod                                                    |
| Charts    | Recharts (application-status dashboard)                                  |
| Backend   | Next.js Route Handlers only — **no separate Express server**             |
| Database  | MongoDB (native driver or Mongoose — pick one, stay consistent)          |
| Auth      | Better Auth — email/password + Google OAuth + JWT plugin                 |
| AI SDK    | Vercel `ai` package                                                      |
| LLM       | Google Gemini (`@ai-sdk/google`, model `gemini-2.5-flash`)               |
| Streaming | `streamText` (server) + `useChat` from `ai/react` (client) for the coach |

---

## 3. Design System

Avoid default "AI SaaS" looks (cream+terracotta, black+neon, indigo-purple gradient). Theme is "ink & manuscript" — the product's job is to help someone write their career story well, so the palette borrows from editorial/print rather than a generic dashboard. Full detail (including Tailwind v4 `@theme` tokens) lives in `SKILL.md` — this is the summary.

- **Primary — Ink Navy `#1B2A4A`** — trust, confidence
- **Secondary — Coral `#E4572E`** — CTAs, "Interviewing" status, moments that need energy
- **Accent — Brass `#B08D57`** — used sparingly: quiet highlights, dividers
- **Neutral — "paper"** — white `#FFFFFF` base, `#F7F7F8` surfaces (cool near-white, not cream), graphite text scale

**Typography:**

- Display (public/marketing pages only, never inside the authenticated app): **Newsreader** — editorial serif, loaded via `next/font/google`
- Body: **Geist Sans** (bundled with Next.js)
- Data/stats: **Geist Mono**

**Signature element:** a hand-drawn **ink-stroke** underline — draws in once beneath the hero headline, then reappears literally as the connecting line between application stages (Applied → Interviewing → Offer) on `/applications/manage`. Don't repeat it decoratively elsewhere.

**Implementation rule:** no Tailwind arbitrary-value classes (`bg-[#1B2A4A]`, etc.) anywhere — every color/font/radius must be a named token in the `@theme` block (see `SKILL.md` §11). Add missing values to the theme instead of inlining them.

**Card rule:** every card (job, blog, testimonial) shares identical height, `rounded-xl` radius, and shadow. Desktop = 4 per row. Skeleton loader while fetching. No lorem ipsum — job postings are seeded with realistic sample data, not placeholder text.

---

## 4. Site Map

**Public:** `/`, `/jobs`, `/jobs/[id]`, `/about`, `/blog`, `/blog/[slug]`, `/privacy`, `/login`, `/register`

**Protected (redirect → `/login`):** `/dashboard`, `/generator`, `/coach`, `/coach/[jobId]`, `/applications/add`, `/applications/manage`

---

## 5. Data Models

```typescript
interface User {
  _id: ObjectId;
  name: string;
  email: string;
  image?: string;
  createdAt: Date;
}

interface JobPosting {
  _id: ObjectId;
  title: string;
  company: string;
  companyLogoUrl?: string;
  location: string;
  category: string; // "Engineering" | "Design" | "Marketing" | ...
  employmentType: "full-time" | "part-time" | "internship" | "remote";
  salaryRange?: string;
  shortDescription: string;
  fullDescription: string; // feeds AI context for generator + coach
  postedAt: Date;
}

interface Application {
  _id: ObjectId;
  userId: ObjectId;
  jobId: ObjectId;
  status: "saved" | "applied" | "interviewing" | "offer" | "rejected";
  notes?: string;
  generatedCoverLetter?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface CoachConversation {
  _id: ObjectId;
  userId: ObjectId;
  jobId?: ObjectId;
  messages: { role: "user" | "assistant"; content: string; createdAt: Date }[];
  createdAt: Date;
}
```

---

## 6. Auth Strategy

- Better Auth: email/password + Google OAuth, JWT plugin for stateless API verification
- **Demo login button** auto-fills a seeded demo account (`demo@careersaathi.app`) — no admin panel needed; job postings are seeded via a script, not admin-authored
- Single `user` role is sufficient for this project's scope

---

## 7. Page-by-Page Spec

### `/` (Home)

- Navbar: logged out → Jobs, How It Works, Blog (3). Logged in → + Dashboard, Coach, Applications (5+). Sticky.
- Hero (60–70vh): headline + CTA, ink-stroke underline animates in beneath the headline
- 7+ sections: How It Works · Features (Generator, Coach, Tracker) · Stats · Testimonials · Blog preview · FAQ · Newsletter · Final CTA
- Footer: real internal links, contact + socials

### `/jobs` (listing)

- Search bar; filters: category + location (min 2 fields); sort: newest/salary; pagination
- Cards: logo, title, company, location, salary, "View Details" — 4/row desktop, skeleton loader

### `/jobs/[id]` (details, public)

- Full description, key info panel, related jobs
- CTA: "Generate tailored cover letter for this role" → `/generator?jobId=...`
- CTA: "Practice interview for this role" → `/coach/[jobId]`

### `/applications/add` (protected)

- Fields: title, short description, full JD, target date/priority, optional company logo URL

### `/applications/manage` (protected)

- Table/grid of tracked applications with status (ink-stroke progress indicator connecting stages), View/Delete actions

### Additional pages

- `/about`, `/blog` (+ `/blog/[slug]`), `/privacy` — real content, no placeholders

---

## 8. AI Agent Features

### A. AI Content Generator — `/generator`

- Inputs: target job title, company (optional, or pulled from a selected `JobPosting`), key skills, tone (Formal / Friendly / Confident), output type (Cover Letter / Resume Bullets / LinkedIn Summary), length (Short/Medium/Long)
- Server builds a structured prompt combining inputs + job's `fullDescription` as context
- "Regenerate" re-runs with the same inputs; result is editable and savable to an `Application`

### B. AI Mock Interview Coach — `/coach/[jobId]`

- System prompt scopes the interviewer persona to that specific role
- Asks one question at a time; **adapts the next question based on the candidate's last answer** and gives brief feedback — this is the agentic reasoning piece
- Full `CoachConversation` history sent back each turn (context awareness across turns)
- Streamed token-by-token via `streamText` + `useChat`
- Suggested follow-up chips ("Ask a harder question", "Feedback on that answer", "Switch to behavioral") + typing indicator

---

## 9. API Routes

| Route                                | Purpose                           |
| ------------------------------------ | --------------------------------- |
| `POST /api/auth/[...all]`            | Better Auth handler               |
| `GET /api/jobs`                      | list + search + filter + paginate |
| `GET /api/jobs/[id]`                 | job detail                        |
| `GET/POST /api/applications`         | list mine / add                   |
| `DELETE /api/applications/[id]`      | remove                            |
| `POST /api/ai/generate`              | content generator                 |
| `POST /api/ai/coach`                 | streaming chat turn               |
| `GET /api/ai/coach/[conversationId]` | load history                      |

---

## 10. Environment Variables

```
MONGODB_URI=
BETTER_AUTH_SECRET=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_GENERATIVE_AI_API_KEY=
NEXT_PUBLIC_APP_URL=
```

---

## 11. Build Order

Short phases on purpose — pause after each to actually read/understand the generated code before moving on.

1. Scaffold Next.js + Tailwind + shadcn(always try to use shadcn first , if not available then use custom css) + MongoDB connection
2. Better Auth (email/password → Google OAuth → demo login) + seed script for jobs + demo user
3. `/jobs` listing + `/jobs/[id]` details (no AI yet — prove the data layer first)
4. `/applications/add` + `/applications/manage` (protected CRUD)
5. AI Content Generator (`/generator`) — simplest AI feature first
6. AI Mock Interview Coach (`/coach`) — streaming + memory, most complex piece
7. Landing page + About/Blog/Privacy
8. Responsive pass, skeleton loaders, empty states, final polish

---

## 12. Definition of Done

- [ ] All pages in the site map exist and are reachable
- [ ] Both AI features work end-to-end with real streaming/reasoning behavior
- [ ] Max 3 primary colors + neutral, consistent card sizing throughout
- [ ] Fully responsive: mobile / tablet / desktop
- [ ] No placeholder/lorem ipsum content anywhere
- [ ] Demo login works with one click
- [ ] Protected routes redirect to `/login` when logged out
- [ ] Filtering, sorting, and pagination all functional on `/jobs`

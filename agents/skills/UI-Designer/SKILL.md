# SKILL.md — CareerSaathi Design System

> Companion to `AGENT.md`. This is the design contract — component states, spacing, motion, and voice — so every screen looks like it came from one hand.

---

## 1. Design Rationale

The first draft of this system leaned on an earthy trail/hiking metaphor (deep green, gold, rust). That's too close to the mood of prior projects and, more importantly, it wasn't actually about _this_ product — CareerSaathi's core value isn't "the journey," it's the writing: a tailored cover letter, a rewritten resume bullet, a rehearsed answer.

New direction: **ink & manuscript.** The product helps someone write their career story well, so the visual language borrows from editorial/print — a confident ink-navy instead of a trail-green, a warm coral for the moments that need energy (a CTA, an "interviewing" status), and a quiet brass for restraint. The signature idea is a **hand-drawn ink stroke** — it underlines the hero headline like a pen confirming a sentence, and the same stroke becomes the connector between application stages on the tracker. One motif, two jobs, no decoration for its own sake.

This also fully replaces the previous palette family (green/gold/rust) with a different hue family (navy/coral/brass) so it doesn't read as a reskin.

**Implementation rule — read before building any component:**
Never use Tailwind arbitrary-value classes — no `bg-[#1B2A4A]`, no `text-[15px]`, no `p-[18px]`, anywhere in this project. Every color, font, radius, and spacing value a component needs must already exist as a named token in the `@theme` block in §11. If a screen needs a value that isn't there, add it to the theme first — don't inline it. Arbitrary values are how design systems quietly drift out of sync; a closed token set is what keeps 40+ screens looking like one product.

---

## 2. Color System

### Core palette

| Token       | Hex       | Role                                                      |
| ----------- | --------- | --------------------------------------------------------- |
| `ink-700`   | `#1B2A4A` | Primary — nav, primary buttons, headline text on light bg |
| `ink-500`   | `#33456E` | Primary hover/interactive state                           |
| `ink-300`   | `#6B7A9E` | Primary tint — "Applied" status, subtle fills             |
| `ink-100`   | `#C8CEDE` | Light fills, selected-state backgrounds                   |
| `ink-50`    | `#EAECF2` | Faint tint backgrounds (hero, callouts)                   |
| `ink-900`   | `#0E1830` | Deepest — dark surfaces if ever needed                    |
| `coral-700` | `#B03D1D` | Secondary text-on-light (chip labels, hover)              |
| `coral-500` | `#E4572E` | Secondary — CTAs that need energy, "Interviewing" status  |
| `coral-200` | `#F6BFA9` | Chip/badge fill                                           |
| `coral-50`  | `#FDEDE8` | Chip/badge background                                     |
| `brass-700` | `#8A6B3D` | Accent text — used sparingly                              |
| `brass-500` | `#B08D57` | Accent — quiet highlights, dividers with intent           |
| `brass-200` | `#DCC792` | Accent tint                                               |
| `brass-50`  | `#F4EFE6` | Accent background                                         |
| `paper-900` | `#1C1C1F` | Primary body text                                         |
| `paper-700` | `#52545E` | Secondary text                                            |
| `paper-500` | `#8B8D97` | Placeholder text, disabled, muted meta                    |
| `paper-300` | `#C7C9D1` | Borders, dividers                                         |
| `paper-100` | `#ECEDF0` | Card borders, subtle backgrounds                          |
| `paper-50`  | `#F7F7F8` | Page/section background (cool near-white, not cream)      |
| `paper-0`   | `#FFFFFF` | Card/surface background                                   |

Four token families total (ink, coral, brass, paper) — this is the full "3 primary + neutral" the brief requires; every value above is a tint/shade of one of those four, nothing else.

### Application status → color (deliberate, not arbitrary)

| Status       | Color       | Why                                                                                                     |
| ------------ | ----------- | ------------------------------------------------------------------------------------------------------- |
| Saved        | `paper-300` | Neutral — not yet a commitment                                                                          |
| Applied      | `ink-300`   | In motion, quiet                                                                                        |
| Interviewing | `coral-500` | Active, warm, needs attention                                                                           |
| Offer        | `ink-700`   | Full-strength primary — the finished chapter                                                            |
| Rejected     | `paper-500` | **Deliberately neutral, not red.** A rejection is hard enough without the UI shaming it in alarm-color. |

### Accessibility

- `paper-900` on `paper-0`: contrast ~16.8:1
- `ink-700` on `paper-0`: contrast ~11.9:1
- Both clear WCAG AA for body text with margin. Don't set `coral-500` or `brass-500` as standalone body text on white — both are for fills/chips with dark text on top, not text color on light backgrounds.

---

## 3. Typography

| Role                        | Face       | Size / Line-height | Weight                |
| --------------------------- | ---------- | ------------------ | --------------------- |
| Display XL (hero)           | Newsreader | 56px / 64px        | 400                   |
| Display L (section headers) | Newsreader | 40px / 48px        | 500                   |
| H1                          | Geist Sans | 32px / 40px        | 600                   |
| H2                          | Geist Sans | 24px / 32px        | 600                   |
| H3 (card titles)            | Geist Sans | 20px / 28px        | 600                   |
| Body L                      | Geist Sans | 18px / 28px        | 400                   |
| Body                        | Geist Sans | 16px / 24px        | 400                   |
| Small / meta                | Geist Sans | 14px / 20px        | 400                   |
| Stats, dates, salary        | Geist Mono | 13px / 18px        | 500, +0.02em tracking |

**Rule:** Newsreader appears only on the public marketing pages (home, blog, about) — never inside the authenticated product. Inside the app it's Geist top to bottom. Keeps the serif feeling like a considered choice, not decoration.

Note: Newsreader isn't bundled with Next.js like Geist is — load it explicitly via `next/font/google`. Flag this to whoever owns `AGENT.md` §3, since it supersedes the earlier Fraunces choice; the two files should agree on one display face.

---

## 4. Spacing & Layout

- Base unit: **4px**. Scale: 4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96
- Container: max-width 1280px, gutter 24px mobile / 64px desktop
- Grid: 12 columns desktop, 4 columns mobile, 24px gutter
- Card grid: 4/row ≥1024px, 2/row 640–1023px, 1/row <640px
- Radius tokens: `radius-xl` (12px) for cards & inputs, `radius-lg` (8px) for buttons, full pill for badges

---

## 5. Components

### Buttons

| Variant     | Background                    | Text        | Hover         | Use                               |
| ----------- | ----------------------------- | ----------- | ------------- | --------------------------------- |
| Primary     | `ink-700`                     | `paper-0`   | `ink-500`     | Main actions ("Generate", "Save") |
| Secondary   | `paper-0`, `ink-700` border   | `ink-700`   | `paper-50` bg | Secondary actions                 |
| Ghost       | transparent                   | `ink-700`   | underline     | "View Details", inline links      |
| Destructive | `paper-0`, `coral-700` border | `coral-700` | `coral-50` bg | Delete application                |
| Disabled    | `paper-100`                   | `paper-500` | —             | —                                 |

Loading state: spinner replaces label, button width stays fixed — no layout shift.

### Job / Blog / Testimonial cards

Fixed height per type, `radius-xl`, `1px paper-100` border. Hover: `translateY(-2px)` + soft shadow, 150ms ease-out.

Job card anatomy (top to bottom): 40×40 logo (`radius-lg`, falls back to an initial-letter avatar on `ink-700` if no logo URL) → title (H3) → company + location (Small, `paper-500`) → salary chip (`brass-50` bg / `brass-700` text) → "View Details" ghost button, bottom-right.

### Status badge

Pill, Geist Mono 13px, fill = status color at 15% opacity, text = full-strength status color. See status table in §2.

### Forms (shadcn base)

Input height 44px, border `paper-300`, focus ring `ink-500` 2px. Error: border `coral-700` + helper text in `coral-700` below the field, plus an inline icon (never color alone). Label: Geist 500 14px `paper-700`, 8px above input.

### Navbar

72px desktop / 64px mobile, `paper-0` background, `1px paper-100` bottom border, sticky. Active link: `ink-700` text + 2px `coral-500` underline (a small echo of the ink-stroke motif). Mobile: hamburger → full-height drawer.

---

## 6. Iconography

`lucide-react`, 20px, stroke-width **2** (slightly heavier than default — reads more "penned," fits the ink motif), default `paper-700`, `ink-700` on hover/active.

---

## 7. Motion

- Micro-interactions (hover, focus): 150ms ease-out
- Section reveal on scroll: 400ms ease-out, 8px translateY + fade, cards stagger 60ms apart
- **Signature ink-stroke**: an SVG path beneath the hero headline draws left-to-right once on load using `stroke-dasharray`/`stroke-dashoffset`, 900ms ease-in-out, then stays static. Respects `prefers-reduced-motion` — renders fully drawn, no animation, when set.
- Coach typing indicator: 3-dot pulse, 400ms loop
- No parallax, no scroll-jacking. People use this while anxious about a job search — motion stays calm, never showy.

---

## 8. Imagery

- Company logos: user-provided URL → falls back to a generated initial-letter avatar (`ink-700` circle, white initial), never a generic broken-image icon.
- No stock photography of staged handshakes/boardrooms. Empty-state illustrations are single ink-stroke line drawings (same stroke motif as §7) in `ink-700` — not mascots, not stock art.

---

## 9. Voice & Microcopy

- Buttons name the action precisely: **"Generate Cover Letter"**, not "Submit". **"Save Application"**, not "Add".
- Empty states instruct, don't joke: _"No applications yet. Browse jobs and save one to start tracking."_ + a CTA button.
- Errors state what happened and what to do, no apology: _"Couldn't generate content. Check your inputs and try again."_
- Status labels use the candidate's own words — "Saved," "Applied," "Interviewing," "Offer," "Rejected" — never internal jargon like `pipeline_stage`.

---

## 10. Key Screen Notes

- **Hero:** headline (Display XL, Newsreader) left-aligned on desktop, the ink-stroke draws in beneath it on load, single primary CTA — no competing secondary CTA.
- **`/jobs`:** search bar full-width above filters; filters as a horizontal bar on desktop, collapsible sheet on mobile.
- **`/coach/[jobId]`:** chat fills the viewport minus a slim header naming the role being practiced; suggested-prompt chips float above the input, not inline in the message list.
- **`/applications/manage`:** the ink-stroke renders as the connecting line between status stages per row, with a filled dot at the candidate's current stage — the signature motif doing real work, not decoration.

---

## 11. Implementation Tokens (Tailwind v4, CSS-first)

Tailwind v4 defines theme values in CSS via `@theme`, not `tailwind.config.js` — utilities like `bg-ink-700` or `font-display` are generated automatically from the tokens below, which is exactly why arbitrary bracket classes should never be needed here.

```css
/* app/globals.css */
@import "tailwindcss";

@theme {
  --color-ink-50: #eaecf2;
  --color-ink-100: #c8cede;
  --color-ink-300: #6b7a9e;
  --color-ink-500: #33456e;
  --color-ink-700: #1b2a4a;
  --color-ink-900: #0e1830;

  --color-coral-50: #fdede8;
  --color-coral-200: #f6bfa9;
  --color-coral-500: #e4572e;
  --color-coral-700: #b03d1d;

  --color-brass-50: #f4efe6;
  --color-brass-200: #dcc792;
  --color-brass-500: #b08d57;
  --color-brass-700: #8a6b3d;

  --color-paper-0: #ffffff;
  --color-paper-50: #f7f7f8;
  --color-paper-100: #ecedf0;
  --color-paper-300: #c7c9d1;
  --color-paper-500: #8b8d97;
  --color-paper-700: #52545e;
  --color-paper-900: #1c1c1f;

  --font-display: "Newsreader", serif;
  --font-sans: "Geist Sans", sans-serif;
  --font-mono: "Geist Mono", monospace;

  --radius-xl: 12px;
  --radius-lg: 8px;
}
```

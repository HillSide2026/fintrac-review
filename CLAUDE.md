# CLAUDE.md — fintrac-review

## What This Is

Next.js 14 embed-first intake app for **Levine Law**. Collects information from Canadian FINTRAC reporting entities seeking an AML/ATF compliance program effectiveness review, runs an internal Claude assessment, and routes leads to GHL and Airtable. Designed to run inside an iframe on a GHL landing page.

## Stack

- Next.js 14, React 18, TypeScript
- Tailwind CSS (installed, but components use **inline styles only** — do not introduce Tailwind utility classes in components)
- Anthropic API (raw fetch, no SDK) — internal assessment only, never shown to client
- GoHighLevel webhook
- Airtable REST API

## Key Files

| Path | Purpose |
|------|---------|
| `components/assessment-experience.tsx` | Entire client-facing UI — 6-step form + confirmation screen |
| `app/api/assessment/route.ts` | POST handler: validate → summarize → assess → GHL + Airtable |
| `lib/types.ts` | All TypeScript types |
| `lib/intake.ts` | Step definitions, initial state, `createIntakeSummary`, label maps |
| `lib/validation.ts` | Server-side `parseFintracIntakeAnswers` |
| `lib/anthropic.ts` | `createInternalAssessment` — Claude API call + JSON extraction |
| `lib/integrations/ghl.ts` | `sendLeadToGhl` |
| `lib/integrations/airtable.ts` | `storeIntakeInAirtable` |
| `next.config.js` | `Content-Security-Policy: frame-ancestors` via `EMBED_ALLOWED_ORIGINS` |

## Design System — READ THIS BEFORE WRITING ANY UI

**Stack:** Next.js 14 + React 18 + TypeScript + Tailwind CSS (installed; not used in components — see below).

**Styling rule:** All component styling is **inline styles only**. Do not use Tailwind utility classes inside `.tsx` component files. Tailwind is present for globals/reset only (`app/globals.css`).

**Components:** `components/assessment-experience.tsx` — reuse `Field`, `TextInput`, `TextArea`, `SelectInput`, `Checkbox`, `Radio`, `ProgramStatusGroup`. Never create a new primitive if one of these fits. If you think you need a new one, stop and ask.

**Shared style objects (single source of truth):**

```ts
inputStyle   // all text inputs, textareas, selects
labelStyle   // all <label> elements
sectionStyle // flex column gap:16px — step content wrapper
dividerStyle // borderTop + paddingTop — sub-section separator
```

Always import and extend these. Never redefine them inline per-field.

**Color tokens** (use these exact hex values — no deviations):

| Role | Value |
|------|-------|
| Body text default | `#0f172a` (set in globals) |
| Primary text | `#111827` |
| Secondary text | `#374151` |
| Muted / labels | `#6b7280` |
| Input border | `#d1d5db` |
| Divider / track | `#e5e7eb` |
| Surface (cards) | `#f9fafb` |
| Primary action | `#1d4771` (Levine Law brand navy — `rgb(29,71,113)`) |
| Confirm/submit | `#16a34a` |
| Success bg / border / text | `#f0fdf4` / `#bbf7d0` / `#166534` |
| Warning bg / border / text | `#fffbeb` / `#fde68a` / `#92400e` |
| Error bg / border / text | `#fef2f2` / `#fecaca` / `#b91c1c` |

**Type scale:**

| Size | Use |
|------|-----|
| `15px / 600` | Form title |
| `13px / 600` | Section headings (uppercase, `letterSpacing: 0.05em`) |
| `14px / 400` | Inputs, checkbox/radio labels |
| `13px / 400` | Body copy, field keys in summary |
| `12px / 500` | Sub-section headings (uppercase, `letterSpacing: 0.04em`), meta |

Font: `system-ui, sans-serif` — no web fonts.

**Spacing:** `4px` base unit. Allowed gap/padding values: `4`, `8`, `12`, `14`, `16`, `20`, `24`, `28`. Nothing else.

**Border radius:** `6px` for inputs and buttons. `8px` for banners. No `border-radius: 50%` or pill shapes.

**Layout:** Max-width `560px` (form) / `600px` (confirmation). Page padding `24px 20px`.

**Quality floor (every screen, non-negotiable):**
- Correct and usable at 375px width.
- Every interactive element must have a visible `:focus-visible` outline — handled globally in `app/globals.css` (`outline: 2px solid #1d4771; outline-offset: 2px`). Do **not** set `outline: none` in `inputStyle` or any inline style.
- Respects `prefers-reduced-motion` — no transitions on elements that move content.
- Text contrast meets WCAG AA against its background.

**Banned (flag these if a request implies them):**
- Tailwind utility classes in component files (`className="..."` anywhere in `assessment-experience.tsx`).
- Arbitrary Tailwind values (`bg-[#...]`, `p-[13px]`).
- New color values not in the token table above.
- Inline `style={{}}` blocks that duplicate or contradict `inputStyle` / `labelStyle`.
- New primitive input components without first checking if an existing one covers the need.
- Any design framework, animation library, or icon set not already present.

## Implementation Constraints

- **Do not redesign, restyle, or invent anything user-facing.** Preserve the current visual design, copy, layout, colors, spacing, typography, and components unless explicitly told otherwise.
- Do not expose API keys or secrets client-side. All integrations run server-side in `app/api/`.
- The Claude assessment is for internal team use only — never return it to the client.
- The embed resize logic (`fintrac:embed-resize` postMessage) must remain in place and must fire on every content height change.

## Environment Variables

| Variable | Required | Notes |
|----------|----------|-------|
| `ANTHROPIC_API_KEY` | Optional | If absent, assessment step is skipped silently |
| `ANTHROPIC_MODEL` | Optional | Defaults to `claude-sonnet-4-6` |
| `GHL_WEBHOOK_URL` | Optional | If absent, GHL delivery is skipped |
| `AIRTABLE_API_KEY` | Optional | Both Airtable vars required to enable storage |
| `AIRTABLE_BASE_ID` | Optional | — |
| `AIRTABLE_TABLE_NAME` | Optional | Defaults to `FINTRAC Intakes` |
| `EMBED_ALLOWED_ORIGINS` | Optional | Comma-separated iframe parent origins; drives CSP `frame-ancestors` |

### Airtable Table Fields

The table must have exactly these field names (not what the README says — the README is wrong):

`org_name`, `contact_name`, `email`, `entity_type`, `province`, `urgency`, `preferred_scope`, `answers`, `assessment`, `created_at`

## Scripts

```bash
npm run dev        # local dev server
npm run build      # production build
npm run lint       # ESLint
npm run typecheck  # tsc --noEmit
```

## Known Backlog

- `AGENTS.md` is stale (references old `incorp` incorporation repo) — can be deleted or replaced by this file
- `package.json` name is `"incorp"` — should be updated
- `app/layout.tsx` metadata is stale ("Canadian Startup Clinic") — update title/description
- No client-side validation — form allows empty submission; server catches it but UX is poor
- No test suite — `parseFintracIntakeAnswers` and `createIntakeSummary` are good unit test candidates
- Planned: Supabase/PostgreSQL governance database (see `fintrac-effectiveness-review/SKILL.md` for schema sketch)

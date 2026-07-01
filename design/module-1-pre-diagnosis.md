# Design: Module 1 — Pre-Diagnosis

## What this builds

A free, public-facing AML compliance self-assessment tool embedded at `/pre-diagnosis`. Prospects answer 20 questions across 5 PCMLTFA pillars (4 questions per pillar, scored 0–4), supply their org name, entity type, and email, and submit. The server scores each pillar, derives an overall percentage and risk band, calls Claude with a constrained prompt to generate preliminary signals and gap areas (never legal conclusions), stores the full report in Airtable's `Pre-Diagnosis Reports` table, sends a lead notification to GHL, then redirects the user to `/pre-diagnosis/results/[token]`. The results page is a server component that fetches the report by token and renders: overall band, per-pillar signals, 3–5 likely gap areas, a recommended next step, a CTA to `/consultation?token=`, and the mandatory lawyer-review disclaimer on every surface. This is Module 1 of three and lives independently of the existing intake form at `/`.

---

## Files to create

| File | Role |
|------|------|
| `lib/integrations/airtable-prediagnosis.ts` | `storePreDiagnosisReport` (POST) and `getPreDiagnosisReport` (GET by token) |
| `components/pre-diagnosis/pillar-signal.tsx` | Renders a single pillar row: label + signal badge |
| `components/pre-diagnosis/preliminary-report.tsx` | Full results layout: band header, pillar signals list, gap areas, next step, disclaimer, CTA |

## Files to modify

| File | Change |
|------|--------|
| `lib/pre-diagnosis/types.ts` | Add `DiagnosisAnswers`, `PillarSignal`; correct field names (`pct` not `score`, `overallPct` not `overallScore`, `likelyGapAreas` not `topGaps`, add `pillarSignals` to `DiagnosisReport`) |
| `lib/pre-diagnosis/validation.ts` | Replace stub with full `parseDiagnosisPayload` implementation |
| `lib/pre-diagnosis/report.ts` | Implement real Claude call; fix field name mismatches; wire fallback |
| `app/api/pre-diagnosis/route.ts` | Fix import paths; wire full pipeline: score → Claude → Airtable → GHL → return `{ token }` |
| `app/api/pre-diagnosis/[token]/route.ts` | Implement GET using `getPreDiagnosisReport` |
| `components/pre-diagnosis/pillar-card.tsx` | Delete — superseded by `pillar-signal.tsx` |
| `components/pre-diagnosis/results-report.tsx` | Replace with `preliminary-report.tsx` content; fix import path |
| `components/pre-diagnosis/diagnosis-experience.tsx` | Full 6-step form implementation |
| `app/pre-diagnosis/page.tsx` | Import and render `DiagnosisExperience`; remove stub |
| `app/pre-diagnosis/results/[token]/page.tsx` | Server component: fetch report, render `PreliminaryReport` or "not found" |

---

## TypeScript shapes

All types live in `lib/pre-diagnosis/types.ts`.

```ts
export type DiagnosisPillar =
  | "policies"
  | "risk_assessment"
  | "training"
  | "monitoring"
  | "compliance_officer";

export type RiskRating =
  | "strong"
  | "gaps_identified"
  | "material_deficiencies";

export type PillarSignal =
  | "foundations_present"
  | "area_of_concern"
  | "risk_indicator";

export type DiagnosisQuestion = {
  id: string;
  pillar: DiagnosisPillar;
  question: string;
  options: { value: number; label: string }[];
};

export type DiagnosisPayload = {
  orgName: string;
  entityType: string;
  contactEmail: string;
  answers: Record<string, number>; // questionId → 0–4
};

// Explicit parsed/validated shape
export type DiagnosisAnswers = {
  orgName: string;
  entityType: string;
  contactEmail: string;
  answers: Record<string, number>;
};

export type DiagnosisPillarResult = {
  pillar: DiagnosisPillar;
  label: string;
  rawScore: number;
  maxScore: number;
  pct: number;
  narrative: string; // added by report.ts after Claude call
};

export type DiagnosisClaudeOutput = {
  overallBand: RiskRating;
  pillarSignals: Record<DiagnosisPillar, PillarSignal>;
  likelyGapAreas: string[];
  recommendedNextStep: string;
};

export type DiagnosisReport = {
  token: string;
  orgName: string;
  entityType: string;
  contactEmail: string;
  overallRating: RiskRating;
  overallPct: number;
  pillarSignals: Record<DiagnosisPillar, PillarSignal>;
  pillars: DiagnosisPillarResult[];
  likelyGapAreas: string[];
  recommendedNextStep: string;
  createdAt: string;
};
```

Key function signatures:

```ts
// lib/pre-diagnosis/validation.ts
export function parseDiagnosisPayload(payload: unknown): DiagnosisAnswers

// lib/pre-diagnosis/scoring.ts (keep as-is)
export function scoreDiagnosis(payload: DiagnosisPayload): Omit<DiagnosisPillarResult, "narrative">[]
export function deriveOverallPct(pillarResults: Omit<DiagnosisPillarResult, "narrative">[]): number
export function deriveRating(overallPct: number): RiskRating

// lib/pre-diagnosis/report.ts
export async function buildDiagnosisReport(
  token: string,
  answers: DiagnosisAnswers,
  pillarResults: Omit<DiagnosisPillarResult, "narrative">[],
): Promise<DiagnosisReport>

// lib/integrations/airtable-prediagnosis.ts
export async function storePreDiagnosisReport(report: DiagnosisReport): Promise<void>
export async function getPreDiagnosisReport(token: string): Promise<DiagnosisReport | null>
```

---

## Component structure

### `components/pre-diagnosis/diagnosis-experience.tsx`

`"use client"`. Props: none (self-contained).

State:
- `step: number` — 0-indexed (0 = contact info, 1–5 = one pillar per step)
- `orgName: string`, `entityType: string`, `contactEmail: string`
- `answers: Record<string, number>` — questionId → 0–4
- `isPending: boolean`
- `error: string | null`

Step structure:
- **Step 0**: Contact info — `TextInput` for org name, `SelectInput` for entity type, `TextInput type="email"` for email
- **Steps 1–5**: One PCMLTFA pillar per step. Each question uses `Field` + `Radio` components in a `div` with `flexDirection: column, gap: 8px`. Pattern copied verbatim from the urgency radio group in `assessment-experience.tsx`.

On submit: POST to `/api/pre-diagnosis`, redirect to `/pre-diagnosis/results/${data.token}`.

ResizeObserver postMessage (`fintrac:embed-resize`) copied verbatim from `assessment-experience.tsx`.

Primitives reused: `Field`, `TextInput`, `SelectInput`, `Radio`. No new primitives.

### `components/pre-diagnosis/pillar-signal.tsx`

Props:
```ts
type PillarSignalProps = {
  pillar: DiagnosisPillar;
  label: string;
  signal: PillarSignal;
};
```

Layout: `display: flex, justifyContent: space-between, alignItems: center, padding: 10px 0, borderBottom: 1px solid #e5e7eb`.

Badge: `fontSize: 12px, fontWeight: 500, padding: 2px 8px, borderRadius: 6px, border: 1px solid`.

Badge styles:
- `foundations_present`: text `#166534`, bg `#f0fdf4`, border `#bbf7d0` — "Foundations Present"
- `area_of_concern`: **[SEE OPEN DECISION]** — amber tokens or neutral fallback
- `risk_indicator`: text `#b91c1c`, bg `#fef2f2`, border `#fecaca` — "Risk Indicator"

### `components/pre-diagnosis/preliminary-report.tsx`

Props: `{ report: DiagnosisReport }`. Server-safe, no `"use client"`.

Sections (top to bottom):
1. Header: `"AML Compliance Health Check — Preliminary Findings"` at `15px/600/#1d4771`
2. Overall band banner (`borderRadius: 8px, padding: 14px 16px`) — three color states matching `RiskRating`
3. Section heading "Pillar Signals" — `13px/600/#1d4771`, uppercase
4. Five `PillarSignal` components in `PILLAR_ORDER`
5. Section heading "Likely Gap Areas" with `dividerStyle`
6. `likelyGapAreas` as `<ul>` — `14px/400/#374151, paddingLeft: 20px, lineHeight: 1.5`
7. Recommended next step — italic `13px/400/#374151`
8. CTA `<a>` linking to `/consultation?token=…` — `background: #1d4771, color: #fff, padding: 10px 20px, borderRadius: 6px, fontSize: 14px, fontWeight: 500`
9. Disclaimer — `12px/400/#6b7280, fontStyle: italic, borderTop: 1px solid #e5e7eb, paddingTop: 16px, marginTop: 24px, lineHeight: 1.6`

---

## API contracts

### POST `/api/pre-diagnosis`

Request (`DiagnosisPayload`):
```ts
{
  orgName: string;        // required, non-empty
  entityType: string;     // required, non-empty
  contactEmail: string;   // required, basic format check
  answers: Record<string, number>; // missing IDs default to 0
}
```

Success `200`: `{ token: string }`
Error `400`: `{ error: string }`

Side effects (in order):
1. `parseDiagnosisPayload` — validate
2. `scoreDiagnosis` — per-pillar scoring
3. `deriveOverallPct` + `deriveRating`
4. `buildDiagnosisReport` — Claude call (800 max_tokens). Fallback if no API key.
5. `storePreDiagnosisReport` — Airtable. Fatal if it throws (token unrecoverable).
6. GHL webhook — inline in route, non-fatal. Skip if no `GHL_WEBHOOK_URL`.
7. Return `{ token }`

### GET `/api/pre-diagnosis/[token]`

Success `200`: `DiagnosisReport`
Error `404`: `{ error: "Report not found." }`
Error `400`: `{ error: "Token required." }`

### `lib/integrations/airtable-prediagnosis.ts` — Airtable fields

| Field | Source |
|-------|--------|
| `token` | `report.token` |
| `org_name` | `report.orgName` |
| `entity_type` | `report.entityType` |
| `contact_email` | `report.contactEmail` |
| `overall_rating` | `report.overallRating` |
| `overall_pct` | `report.overallPct` |
| `report_json` | `JSON.stringify(report)` |
| `created_at` | `report.createdAt` |

Table name env var: `AIRTABLE_PREDIAGNOSIS_TABLE_NAME` (default: `"Pre-Diagnosis Reports"`).

### Claude call (`lib/pre-diagnosis/report.ts`)

System prompt verbatim from MODULES.md. Max tokens: 800. Model: `ANTHROPIC_MODEL || "claude-sonnet-4-6"`. JSON extraction: copy `extractJson` pattern from `lib/anthropic.ts`.

Fallback (no key or Claude throws): `overallBand` = score-derived rating, all `pillarSignals` = `"area_of_concern"`, `likelyGapAreas: []`, generic `recommendedNextStep`.

---

## Design system notes

- Inline styles only — no Tailwind in `.tsx` files
- Copy `inputStyle`, `labelStyle`, `sectionStyle`, `dividerStyle` locally from `assessment-experience.tsx` — no shared import file yet
- `fintrac:embed-resize` postMessage must fire on every height change in `DiagnosisExperience`
- Max-width: `560px` form / `600px` results
- No `outline: none` anywhere
- **Amber token open decision** — do not invent values; see Open Decisions

---

## Implementation sequence

| Step | File | Depends on |
|------|------|------------|
| 1 | `lib/pre-diagnosis/types.ts` | — |
| 2 | `lib/pre-diagnosis/validation.ts` | Step 1 |
| 3 | `lib/pre-diagnosis/report.ts` | Step 1 |
| 4 | `lib/integrations/airtable-prediagnosis.ts` | Step 1 |
| 5 | `app/api/pre-diagnosis/route.ts` | Steps 1–4 |
| 6 | `app/api/pre-diagnosis/[token]/route.ts` | Step 4 |
| 7 | `components/pre-diagnosis/pillar-signal.tsx` | Step 1 + amber decision |
| 8 | `components/pre-diagnosis/preliminary-report.tsx` | Steps 1, 7 |
| 9 | `components/pre-diagnosis/diagnosis-experience.tsx` | Step 1 |
| 10 | `app/pre-diagnosis/page.tsx` | Step 9 |
| 11 | `app/pre-diagnosis/results/[token]/page.tsx` | Steps 6, 8 |
| 12 | Delete `components/pre-diagnosis/pillar-card.tsx` | Step 7 |

---

## Open decisions

**One decision required before steps 7–8 (pillar-signal component and results page):**

**Amber color tokens** — the "Area of Concern" and "Gaps Likely" band states need a warning/amber color set. The current CLAUDE.md token table has green and red but no amber. Two options:

- **(a) Approve amber tokens**: add `#92400e` (text) / `#fffbeb` (bg) / `#fde68a` (border) to CLAUDE.md and use them for the "area of concern" badge and "gaps likely" band.
- **(b) Neutral fallback**: use existing tokens — `#374151` text / `#f9fafb` bg / `#d1d5db` border. Visually distinct from green and red by label only.

All other decisions are resolved. Steps 1–6 can be implemented immediately.

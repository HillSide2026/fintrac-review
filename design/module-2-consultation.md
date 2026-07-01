# Design: Module 2 — Consultation

## What this builds

A conversion page at `/consultation` that reads a `?token` query parameter from the URL, fetches the corresponding pre-diagnosis report from Airtable, and assembles four sections: (1) the prospect's preliminary findings echoed in compact form with a disclaimer, (2) what Matthew will cover on the call, (3) what the call is not, and (4) a GHL calendar iframe for booking. The page is a Next.js 14 server component that fetches data at request time — there is no client-side data fetch. It also implements the optional `POST /api/consultation/book` webhook receiver that GHL calls when a booking is confirmed, which writes to the `Consultations` Airtable table and fires a GHL lead notification for Hugh's call-prep workflow. This page belongs to Module 2 of three and converts Module 1 (Pre-Diagnosis) pipeline completions into booked calls.

---

## Files to create

| File | Role |
|------|------|
| `lib/integrations/airtable-consultation.ts` | `storeConsultationBooking` — writes a record to the `Consultations` table |
| `components/consultation/findings-summary.tsx` | Receives `DiagnosisReport`; renders compact risk band + pillar signals + disclaimer |
| `components/consultation/call-agenda.tsx` | Static sections 2 and 3 — "What We'll Review" and "What This Call Is Not" |

## Files to modify

| File | Change |
|------|--------|
| `lib/consultation/types.ts` | Extend with `ConsultationBookingPayload` (GHL inbound webhook shape) |
| `app/consultation/page.tsx` | Replace stub with server component: reads `?token`, fetches report, renders 4-section layout |
| `components/consultation/booking-widget.tsx` | Replace stub with real GHL calendar iframe implementation |
| `app/api/consultation/book/route.ts` | Replace stub with full implementation: validate, Airtable write, GHL notify |

---

## TypeScript shapes

### `lib/consultation/types.ts` (additions to existing file)

```ts
// Existing types stay in place:
// ConsultationRequest, ConsultationRecord

// New: shape GHL posts to /api/consultation/book on booking confirmed
export type ConsultationBookingPayload = {
  diagnosisToken: string;       // required — links booking to pre-diagnosis report
  contactEmail?: string;        // forwarded from GHL booking form, optional
  contactName?: string;         // forwarded from GHL booking form, optional
  callDate?: string;            // ISO 8601, provided by GHL on confirmation
  notes?: string;               // any notes the prospect entered in the booking widget
};
```

### `lib/integrations/airtable-consultation.ts`

```ts
// Airtable `Consultations` table fields (from MODULES.md):
// id, diagnosis_token, call_date, status, notes, created_at

export async function storeConsultationBooking(
  payload: ConsultationBookingPayload,
): Promise<void>
```

The function follows the same pattern as `storePreDiagnosisReport` in `airtable-prediagnosis.ts`:
- Reads `AIRTABLE_API_KEY`, `AIRTABLE_BASE_ID`
- Table name env var: `AIRTABLE_CONSULTATION_TABLE_NAME` (default: `"Consultations"`)
- If either credential is absent, returns silently (does not throw)
- On HTTP error, throws with the response body

Fields written to Airtable:

| Airtable field | Source |
|---------------|--------|
| `diagnosis_token` | `payload.diagnosisToken` |
| `call_date` | `payload.callDate ?? ""` |
| `status` | `"booked"` (literal) |
| `notes` | `payload.notes ?? ""` |
| `created_at` | `new Date().toISOString()` |

Note: `id` is Airtable's auto-generated record ID; do not write it.

### `app/consultation/page.tsx` (server component, no shape export needed)

Internal data: `DiagnosisReport | null` from `getPreDiagnosisReport(token)`.

Props: Next.js page props — `{ searchParams: { token?: string } }`.

### `components/consultation/findings-summary.tsx`

```ts
type FindingsSummaryProps = {
  report: DiagnosisReport;
};
export function FindingsSummary({ report }: FindingsSummaryProps): JSX.Element
```

### `components/consultation/call-agenda.tsx`

```ts
// No props — fully static content
export function CallAgenda(): JSX.Element
```

### `components/consultation/booking-widget.tsx`

```ts
type BookingWidgetProps = {
  diagnosisToken?: string;
};
// Already exists as a stub — replace body only
export function BookingWidget({ diagnosisToken }: BookingWidgetProps): JSX.Element
```

### `app/api/consultation/book/route.ts`

```ts
// Inbound request body (GHL webhook POST):
// ConsultationBookingPayload (parsed from JSON)

// Success response: { ok: true }
// Error response: { error: string } with status 400
```

---

## Component structure

### `components/consultation/findings-summary.tsx`

Server-safe (no `"use client"`). Receives the full `DiagnosisReport`.

Renders (top to bottom):
1. Section heading: `"Your Preliminary Findings"` — `13px / 600 / #1d4771`, uppercase, `letterSpacing: 0.05em`
2. Attribution line: `"Based on your self-reported responses, our preliminary screening identified the following signals."` — `13px / 400 / #374151`
3. Overall band banner — `borderRadius: 8px, padding: 14px 16px`. Use the same three-state `BAND_STYLES` map already defined in `preliminary-report.tsx`. Import `RiskRating` from `@/lib/pre-diagnosis/types`. Do NOT duplicate the map — instead move `BAND_STYLES` to a new shared location (see Design System Notes).
4. Five `PillarSignalRow` rows — import `PillarSignalRow` from `@/components/pre-diagnosis/pillar-signal`. Use `PILLAR_ORDER` and `PILLAR_LABELS` from `@/lib/pre-diagnosis/questions`.
5. Disclaimer paragraph — same text constant as in `preliminary-report.tsx`. Move `DISCLAIMER` to a shared constant (see Design System Notes). Style: `12px / 400 / #6b7280, fontStyle: italic, borderTop: 1px solid #e5e7eb, paddingTop: 16px, lineHeight: 1.6`.

New display pattern not covered by existing primitives: the section heading style (`13px / 600 / uppercase / #1d4771`) is a reused pattern from `preliminary-report.tsx` — implement it as a local `const sectionHeadingStyle` object, not a new primitive component.

Existing primitives reused: `PillarSignalRow` (from pre-diagnosis). No new input/form primitives needed.

### `components/consultation/call-agenda.tsx`

Server-safe. No props. Two sub-sections separated by `dividerStyle` (borderTop + paddingTop).

**Section 2 — What We'll Review on the Call**

Heading: `"What We'll Review on the Call"` — `13px / 600 / #1d4771`, uppercase.

Bullet list (`<ul>` with `paddingLeft: 20px, fontSize: 14px, color: #374151, lineHeight: 1.6, margin: 0`):
- Your organization's specific PCMLTFA obligations by entity type
- Which of the identified signals warrant immediate attention
- How your program compares to what FINTRAC examiners typically look for
- Practical options for strengthening your program
- Whether a formal effectiveness review is warranted

**Section 3 — What This Call Is Not**

Heading: `"What This Call Is Not"` — same heading style.

Separated by `dividerStyle`. Bullet list, same style:
- This is not a formal effectiveness review or legal opinion
- It does not constitute legal advice
- No solicitor-client relationship is formed until an engagement letter is signed
- This is a complimentary, exploratory conversation

No new primitives. This component is entirely static copy.

### `components/consultation/booking-widget.tsx` (replacement body)

`"use client"` — already marked. Props: `{ diagnosisToken?: string }`.

Renders:
1. Paragraph: Matthew's one-line bio. Copy: `"Matthew Levine is a Canadian AML compliance lawyer with extensive experience advising reporting entities subject to FINTRAC/PCMLTFA."` — `14px / 400 / #374151`.
2. Framing line: `"30-minute consultation with Matthew Levine — complimentary, no obligation."` — `13px / 400 / #6b7280`.
3. GHL calendar `<iframe>`:
   - `src`: `process.env.NEXT_PUBLIC_GHL_CALENDAR_URL` (see Environment Variables below). If the env var is absent, render a fallback message: `"Booking calendar is not configured."` in `13px / #6b7280`.
   - Append `?token=${diagnosisToken}` to the URL when `diagnosisToken` is set, so GHL receives it in the booking metadata.
   - `width: "100%"`, `height: "700px"`, `border: "none"`, `borderRadius: "8px"`.
   - No sandbox attribute — GHL requires full iframe permissions for its calendar widget.
4. Wrapper `<div>` with `display: flex, flexDirection: column, gap: 12px`.

Note on `NEXT_PUBLIC_GHL_CALENDAR_URL`: this must be a `NEXT_PUBLIC_` variable because the component is a client component that reads it at runtime. The value is safe to expose — it is a public booking page URL.

### `app/consultation/page.tsx` (server component, full replacement)

Server component (no `"use client"`). Reads `searchParams.token`.

**Token absent or report not found:**
Render an error state — same pattern as `app/pre-diagnosis/results/[token]/page.tsx`:
```
<main> with maxWidth: 600px, margin: 0 auto, padding: 24px 20px, color: #111827
  <p> "Report Not Found" — 15px / 600 / #1d4771
  <p> "This link may have expired or may be invalid. Return to the <a>health check</a> to generate a new report." — 14px / #6b7280
```
Link `href="/pre-diagnosis"` with `color: #1d4771`.

**Report found:**
```
<main> maxWidth: 600px, margin: 0 auto, padding: 24px 20px, display: flex, flexDirection: column, gap: 28px, color: #111827

  <FindingsSummary report={report} />
  <CallAgenda />
  Section 4 heading: "Book Your Expert Review" — 13px / 600 / #1d4771, uppercase, letterSpacing: 0.05em
  <BookingWidget diagnosisToken={token} />
```

Section 4 heading is rendered inline in the page component (not in `BookingWidget`) so the page controls the heading hierarchy and spacing. `BookingWidget` renders the bio, framing line, and iframe only.

Page `maxWidth` is `600px` (results/conversion convention), not `560px` (form convention).

---

## API contracts

### `POST /api/consultation/book`

**Purpose:** GHL webhook receiver called when a booking is confirmed. Stores the booking in Airtable and fires a GHL lead notification for Hugh's call-prep workflow.

**Request body** (JSON): `ConsultationBookingPayload`
```ts
{
  diagnosisToken: string;   // required — validated; 400 if absent or empty
  contactEmail?: string;
  contactName?: string;
  callDate?: string;
  notes?: string;
}
```

**Validation** (inline in route, not a separate lib function — logic is simple):
- `diagnosisToken` must be a non-empty string. If absent or empty: `{ error: "diagnosisToken is required." }` with status 400.
- All other fields are optional; missing fields are stored as empty strings.

**Side effects (in order):**
1. `storeConsultationBooking(payload)` — Airtable write. If it throws, return `{ error: message }` status 500.
2. GHL lead notification — inline `fetch` to `GHL_WEBHOOK_URL` (server-side env var, not `NEXT_PUBLIC_`). Non-fatal: wrapped in try/catch with `.catch(() => {})`. Payload:
```ts
{
  source: "fintrac-consultation-booked",
  createdAt: new Date().toISOString(),
  diagnosisToken: payload.diagnosisToken,
  contactEmail: payload.contactEmail ?? "",
  contactName: payload.contactName ?? "",
  callDate: payload.callDate ?? "",
  notes: payload.notes ?? "",
}
```

**Success response:** `{ ok: true }` status 200.

**Error responses:**
- `400`: validation failure — `{ error: string }`
- `500`: Airtable write failure — `{ error: string }`

**No GET route** on this path — not needed.

### `lib/integrations/airtable-consultation.ts`

Uses same `AIRTABLE_API_KEY` and `AIRTABLE_BASE_ID` env vars as all other Airtable integrations. Does not throw on missing credentials — returns silently (same pattern as `storePreDiagnosisReport`). Throws on HTTP error.

---

## Design system notes

**Color tokens** — all values from CLAUDE.md token table. No new values needed.

The amber tokens (`#92400e` / `#fffbeb` / `#fde68a`) introduced by the Module 1 open decision are already in use in `pillar-signal.tsx` and `preliminary-report.tsx`. This module reuses them via `PillarSignalRow` directly — no re-declaration needed.

**Shared constants to extract** (required before implementing `findings-summary.tsx`):

Two constants currently defined locally in `preliminary-report.tsx` are needed here:

1. `BAND_STYLES: Record<RiskRating, BandStyle>` — the three-state color map for the overall band banner.
2. `DISCLAIMER: string` — the lawyer-review disclaimer text.

Move these to `lib/pre-diagnosis/report-constants.ts` (new file, step 1 of implementation sequence). Both `preliminary-report.tsx` and `findings-summary.tsx` import from this shared location. This avoids duplicating the disclaimer text and band styles.

**Style objects:**
- `findings-summary.tsx` and `call-agenda.tsx` define local `sectionHeadingStyle` const (same values used in `preliminary-report.tsx`: `fontSize: 13px, fontWeight: 600, color: #1d4771, textTransform: uppercase, letterSpacing: 0.05em, margin: 0`). Do not import from another component — copy locally as a const.
- `dividerStyle` pattern (used in `call-agenda.tsx` between sections 2 and 3): `borderTop: 1px solid #e5e7eb, paddingTop: 16px`.

**Spacing:**
- Page gap between sections: `28px` (from allowed values, fits the conversion page weight).
- Gap within `findings-summary.tsx` internal sections: `16px`.
- Gap within `call-agenda.tsx` between heading and list: `8px`. Between sections 2 and 3: `dividerStyle` (paddingTop `16px`).
- `BookingWidget` internal gap: `12px`.

**Max-width:** `600px` for this page (conversion page, not a form).

**No `outline: none`** anywhere. No Tailwind utility classes. No new color values.

**Banned patterns:** Do not add `sandbox` to the GHL iframe — GHL calendar widgets require unrestricted iframe context.

---

## Implementation sequence

| Step | File | Depends on |
|------|------|------------|
| 1 | `lib/pre-diagnosis/report-constants.ts` (new) — extract `BAND_STYLES` and `DISCLAIMER` | — |
| 2 | `components/pre-diagnosis/preliminary-report.tsx` (modify) — import `BAND_STYLES` and `DISCLAIMER` from step 1 instead of defining locally | Step 1 |
| 3 | `lib/consultation/types.ts` (modify) — add `ConsultationBookingPayload` | — |
| 4 | `lib/integrations/airtable-consultation.ts` (new) — `storeConsultationBooking` | Step 3 |
| 5 | `app/api/consultation/book/route.ts` (modify) — full implementation | Steps 3, 4 |
| 6 | `components/consultation/findings-summary.tsx` (new) | Steps 1, 2 |
| 7 | `components/consultation/call-agenda.tsx` (new) | — |
| 8 | `components/consultation/booking-widget.tsx` (modify) — replace stub body | — |
| 9 | `app/consultation/page.tsx` (modify) — replace stub with server component | Steps 6, 7, 8 |

Steps 1–2 are a hard prerequisite for step 6. Steps 3–4 are a hard prerequisite for step 5. Steps 6, 7, 8 are independent of each other and can be done in any order, but all must precede step 9.

---

## Environment variables

| Variable | Required | Notes |
|----------|----------|-------|
| `NEXT_PUBLIC_GHL_CALENDAR_URL` | Optional | GHL calendar embed URL; if absent, widget shows fallback message |
| `AIRTABLE_CONSULTATION_TABLE_NAME` | Optional | Defaults to `"Consultations"` |
| `GHL_WEBHOOK_URL` | Optional (existing) | Used server-side for consultation booking notification |
| `AIRTABLE_API_KEY` | Optional (existing) | Required for Airtable writes |
| `AIRTABLE_BASE_ID` | Optional (existing) | Required for Airtable writes |

Add `NEXT_PUBLIC_GHL_CALENDAR_URL` to `.env.example` (or equivalent) so the deployment checklist is clear. It is the only new env var this module introduces.

---

## Open decisions

None. All decisions are resolved:

- **GHL calendar** confirmed as the scheduling tool (MODULES.md architecture decisions).
- **Amber tokens** confirmed in use from Module 1 (already present in `pillar-signal.tsx` and `preliminary-report.tsx`).
- **No sandbox on GHL iframe** — GHL calendar requires full iframe permissions; this is the correct behavior.
- **`NEXT_PUBLIC_GHL_CALENDAR_URL` exposure** — the calendar URL is a public booking page; `NEXT_PUBLIC_` exposure is appropriate and safe.
- **`BAND_STYLES` and `DISCLAIMER` extraction** — a necessary refactor to avoid duplication; no design decision required, just mechanical extraction.
- **Section 4 heading in page vs. widget** — heading rendered in `app/consultation/page.tsx` so the page controls the layout hierarchy.
- **`POST /api/consultation/book` is optional infrastructure** — GHL may or may not call it depending on webhook configuration; the page functions without it.

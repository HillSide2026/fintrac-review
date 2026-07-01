# MODULES.md — fintrac-review

Three modules layer on top of the existing intake form to form the full value ladder.

| Module | Route | Status | Purpose |
|--------|-------|--------|---------|
| Intake | `/` | Live | Lead qualification — feeds Hugh |
| Pre-Diagnosis | `/pre-diagnosis` | Building | Loss leader — preliminary 5-pillar signals |
| Consultation | `/consultation` | Building | Convert preliminary findings into a booked call |
| Program | `/program/[clientId]` | Building | AML Compliance Operating System for active engagements |

---

## Architecture decisions

| Decision | Resolution |
|----------|------------|
| Scheduling tool | GHL calendar embed — `BookingWidget` wraps GHL iframe |
| Data layer | Airtable throughout — no Supabase |
| Client auth | MVP: opaque UUID URL (no login). Revisit at scale. |
| Open source additions | `@tanstack/react-query` for Module 3 optimistic updates only. No component libraries — inline styles throughout. |

### Airtable tables

| Table | Module | Key fields |
|-------|--------|------------|
| `FINTRAC Intakes` | Intake | existing |
| `Pre-Diagnosis Reports` | 1 | `token`, `org_name`, `entity_type`, `contact_email`, `overall_rating`, `overall_pct`, `report_json`, `created_at` |
| `Consultations` | 2 | `id`, `diagnosis_token`, `call_date`, `status`, `notes`, `created_at` |
| `Programs` | 3 | `client_id`, `org_name`, `entity_type`, `diagnosis_token`, `status`, `start_date`, `target_date` |
| `Remediation Items` | 3 | `program_id`, `pillar`, `description`, `priority`, `status`, `due_date`, `notes` |

---

## Repo structure

```
fintrac-effectiveness-review/

├── lib/pre-diagnosis/
│   ├── types.ts            — DiagnosisPayload, PillarResult, PreliminaryReport
│   ├── questions.ts        — 20-question bank (draft, pending Matthew review)
│   ├── scoring.ts          — per-pillar %, overall %, risk band
│   ├── validation.ts       — parse + validate inbound payload
│   └── report.ts           — constrained Claude call → preliminary signals only

├── app/pre-diagnosis/
│   ├── page.tsx            — renders DiagnosisExperience (embed target)
│   └── results/[token]/
│       └── page.tsx        — server component, fetches + renders PreliminaryReport

├── components/pre-diagnosis/
│   ├── diagnosis-experience.tsx   — 6-step form
│   ├── preliminary-report.tsx     — report display (signals only, no legal conclusions)
│   └── pillar-signal.tsx          — single pillar row: name + signal label

├── lib/consultation/
│   └── types.ts

├── app/consultation/
│   └── page.tsx            — conversion page (4-section structure)

├── components/consultation/
│   ├── findings-summary.tsx       — echoes risk band + pillar signals
│   ├── call-agenda.tsx            — "what we'll cover / what this isn't"
│   └── booking-widget.tsx         — GHL calendar iframe

├── lib/program/
│   ├── types.ts            — Program, RemediationItem
│   └── db.ts               — Airtable query helpers

├── app/program/
│   └── [clientId]/
│       ├── page.tsx         — dashboard
│       ├── remediation/
│       │   └── page.tsx     — remediation tracker
│       └── documents/
│           └── page.tsx     — document links

├── components/program/
│   ├── program-dashboard.tsx      — status + pillar health indicators
│   └── remediation-tracker.tsx    — checklist, inline status updates (client component)

├── lib/integrations/
│   ├── airtable.ts                — existing (intake)
│   ├── airtable-prediagnosis.ts   — store + retrieve pre-diagnosis reports
│   ├── airtable-program.ts        — program + remediation item CRUD
│   └── ghl.ts                     — existing

├── app/api/
│   ├── assessment/route.ts        — existing
│   ├── pre-diagnosis/
│   │   ├── route.ts               — POST: score → Claude → Airtable → GHL
│   │   └── [token]/route.ts       — GET: fetch by token
│   ├── consultation/
│   │   └── book/route.ts          — POST: store booking, notify GHL
│   └── program/
│       └── [clientId]/route.ts    — GET program + items; PATCH item status
```

---

## Module 1 — Pre-Diagnosis (Loss Leader)

### What it is

A free preliminary AML compliance screening tool. The prospect self-assesses across 5 PCMLTFA pillars. Claude generates constrained preliminary signals. The report demonstrates Levine Law's expertise and creates the need for a consultation — it does not deliver the full analysis.

### What the report includes

- **Overall risk band** — one of three: Program Foundations Present (green) / Gaps Likely (amber) / Risk Indicators Present (red)
- **Pillar-level signals** — one signal per pillar (not a score, not a percentage): Foundations Present / Area of Concern / Risk Indicator
- **3–5 likely gap areas** — described in terms of regulatory exposure, not remediation steps
- **One recommendation** — book a consultation for expert review

### What the report does NOT include

- "You are compliant" / "You are non-compliant" language
- Specific legal conclusions
- Detailed remediation roadmap
- Numeric scores or percentages
- Advice on what to fix

### Lawyer-review language (required everywhere)

Every output surface carries:
> *These preliminary findings are based on self-reported responses and are for informational purposes only. They do not constitute legal advice, a formal effectiveness review, or a compliance opinion. All findings require review by a qualified AML compliance lawyer before any conclusions can be drawn. No solicitor-client relationship is formed by this tool.*

### Claude prompt constraints

System: *You are generating preliminary AML compliance signals for a Canadian reporting entity subject to FINTRAC/PCMLTFA. This is a screening tool only. Do not reach legal conclusions. Do not assess compliance status. Do not provide remediation advice. Identify signals and risk indicators only, framed as areas that may warrant expert review. All output is preliminary and requires human review by a qualified lawyer.*

Output JSON shape:
```json
{
  "overallBand": "gaps_likely",
  "pillarSignals": {
    "policies": "area_of_concern",
    "risk_assessment": "foundations_present",
    "training": "risk_indicator",
    "monitoring": "area_of_concern",
    "compliance_officer": "foundations_present"
  },
  "likelyGapAreas": [
    "Training program currency and documentation",
    "Transaction monitoring thresholds and escalation process",
    "STR filing procedures"
  ],
  "recommendedNextStep": "A consultation with a qualified AML compliance lawyer would help clarify which of these signals represent material gaps and what, if anything, requires prompt attention."
}
```

### Implementation sequence

1. `lib/pre-diagnosis/questions.ts` — draft question bank (done, pending Matthew review)
2. `lib/pre-diagnosis/scoring.ts` — risk band derivation (done)
3. `lib/pre-diagnosis/types.ts` — types (done)
4. `lib/pre-diagnosis/validation.ts`
5. `lib/pre-diagnosis/report.ts` — constrained Claude call
6. `lib/integrations/airtable-prediagnosis.ts`
7. `app/api/pre-diagnosis/route.ts`
8. `app/api/pre-diagnosis/[token]/route.ts`
9. `components/pre-diagnosis/pillar-signal.tsx`
10. `components/pre-diagnosis/preliminary-report.tsx`
11. `components/pre-diagnosis/diagnosis-experience.tsx`
12. `app/pre-diagnosis/page.tsx`
13. `app/pre-diagnosis/results/[token]/page.tsx`

### Open source

No dependencies required. Form pattern comes from `assessment-experience.tsx`. Signal display is pure CSS (inline styles). No charting library.

Reference repos (patterns only — study, don't copy):
- **SurveyJS** — best reference for dynamic forms, survey logic, multi-step questionnaires, and JSON-driven question banks
- **marcosfitzsimons/multi-step-form** — Next.js + Tailwind + shadcn pattern for a polished form wizard
- **eduardogomesf/multi-step-form** — simpler Next.js 13 TypeScript reference

Key takeaway: questions must be JSON-driven (`lib/pre-diagnosis/questions.ts`), not hardcoded into components.

### Backlog

- **Question bank** — pending Matthew Levine review and approval before production use. Current draft covers correct regulatory territory but specific question wording and scoring rubrics require his sign-off.

---

## Module 2 — Consultation

### What it is

A conversion page, not a calendar page. The prospect lands here from the pre-diagnosis CTA. The page uses their preliminary findings to create urgency and context, then converts them into a booked call.

### Page structure (4 sections)

**1. Your Preliminary Findings**
Echoes the risk band and pillar signals from the pre-diagnosis report. Language: "Based on your self-reported responses, our preliminary screening identified the following signals." Includes the full lawyer-review disclaimer.

**2. What We'll Review on the Call**
Specific, credible list of what Matthew will actually cover:
- Your organization's specific PCMLTFA obligations by entity type
- Which of the identified signals warrant immediate attention
- How your program compares to what FINTRAC examiners typically look for
- Practical options for strengthening your program
- Whether a formal effectiveness review is warranted

**3. What This Call Is Not**
Sets expectations and manages liability:
- This is not a formal effectiveness review or legal opinion
- It does not constitute legal advice
- No solicitor-client relationship is formed until an engagement letter is signed
- This is a complimentary, exploratory conversation

**4. Book Expert Review**
Matthew's one-line bio. GHL calendar iframe. Clear framing: "30-minute consultation with Matthew Levine — complimentary, no obligation."

### Implementation

- `components/consultation/findings-summary.tsx` — receives `PreliminaryReport`, renders risk band + pillar signals in compact format with disclaimer
- `components/consultation/call-agenda.tsx` — static sections 2 and 3
- `components/consultation/booking-widget.tsx` — GHL calendar iframe, reads `NEXT_PUBLIC_GHL_CALENDAR_URL`
- `app/consultation/page.tsx` — server component: reads `?token` from URL, fetches pre-diagnosis report from Airtable, assembles all four sections
- `app/api/consultation/book/route.ts` — optional: GHL posts here on booking confirmed → store in Airtable + trigger Hugh call-prep

### Open source

No dependencies required. All content is static or fetched server-side.

Reference repos (patterns only):
- **NextCRM** — strong reference for CRM, project management, document storage, and client records in a modern Next.js stack

Key takeaway: the consultation page should be treated as a "case record" or "opportunity," not just a calendar iframe. The preliminary findings it echoes are the primary conversion mechanism.

---

## Module 3 — AML Compliance Operating System

### What it is

The delivery platform for active engagements. After a consultation converts, Matthew creates a program in Airtable. The client accesses their program via a UUID URL. This is positioned as an ongoing operating system, not a one-time deliverable.

Framing: *Your AML Compliance Operating System* — the platform through which Levine Law manages your program design and remediation, tracks progress, and maintains your documentation.

### Access model

MVP: programs accessed at `/program/[clientId]` where `clientId` is a UUID. Matthew creates the Airtable record, shares the URL. No login for MVP. Auth revisited when volume warrants it.

### Page structure

**Dashboard** (`/program/[clientId]`)
- Program status (scoping / active / review / complete)
- Per-pillar health indicators (drawn from remediation item completion by pillar)
- Open critical items
- Target date progress

**Remediation Tracker** (`/program/[clientId]/remediation`)
- Items grouped by pillar
- Each item: description, priority badge, status selector, due date, notes
- Client and Matthew can update status
- Optimistic UI — update fires Airtable PATCH in background

**Documents** (`/program/[clientId]/documents`)
- Links to program documents (policy drafts, risk assessments, training records)
- Stored as URLs in Airtable — links to GHL, Google Drive, or wherever Matthew stores them
- No file upload in MVP (Airtable URL fields)

### Implementation

1. `lib/integrations/airtable-program.ts` — `getProgram`, `getRemediationItems`, `updateRemediationItemStatus`
2. `lib/program/db.ts` — wrappers
3. `app/api/program/[clientId]/route.ts` — GET (program + items) and PATCH (item status)
4. `components/program/program-dashboard.tsx` — status + pillar health
5. `components/program/remediation-tracker.tsx` — client component with `@tanstack/react-query` for optimistic updates
6. All three page files

### Open source

Add `@tanstack/react-query` (MIT) for the remediation tracker — the only place where optimistic updates are complex enough to justify a dependency. Everything else stays dependency-free.

Reference repos (patterns only):
- **TaskTrackr Next.js 13** — useful for task CRUD, status updates, and simple client-side task management
- **risk-register-app** — good conceptual model for risk scoring, risk registers, dashboards, probability/impact, and prioritization
- **awesome-compliance** — useful map of open-source GRC/compliance tools to study before overbuilding
- **CIA Compliance Manager** — useful reference for mapping posture, controls, business impact, and compliance alignment

---

## Positioning note

The pre-diagnosis preliminary disclaimer ("requires human review by a qualified AML compliance lawyer") is not just a liability hedge — it's a positioning statement. It signals that this is **operator-grade legal infrastructure**, not a generic compliance checklist. The disclaimer elevates the tool; it does not undermine it.

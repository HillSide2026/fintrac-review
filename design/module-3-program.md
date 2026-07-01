# Design: Module 3 — AML Compliance Operating System

## What this builds

The delivery platform for active Levine Law engagements. After a consultation converts, Matthew creates two Airtable records manually — one in `Programs` and one or more in `Remediation Items`. The client receives a UUID URL (`/program/[clientId]`) which acts as their private dashboard. No login is required for MVP; the opaque UUID is the access credential. The platform consists of three pages: a **Dashboard** showing program status and per-pillar health drawn from remediation item completion; a **Remediation Tracker** where both Matthew and the client can update item status with optimistic UI backed by `@tanstack/react-query`; and a **Documents** page listing links to policy drafts, risk assessments, and training records stored as URLs in a third Airtable table (`Program Documents`). All data flows through a single API route (`/api/program/[clientId]`) — GET returns the full program record plus all items and documents, PATCH updates a single remediation item's status. All Airtable calls are server-side only. This is Module 3 and depends on no prior module being complete — it reads directly from Airtable records Matthew creates manually.

---

## Files to create

| File | Role |
|------|------|
| `lib/integrations/airtable-program.ts` | `getProgram`, `getRemediationItems`, `getDocumentRecords`, `updateRemediationItemStatus` — all Airtable REST calls for Module 3 |
| `lib/program/pillar-health.ts` | `computePillarHealth(items: RemediationItem[]): PillarHealth[]` — pure function, no I/O |

## Files to modify

| File | Change |
|------|--------|
| `lib/program/types.ts` | Add `PillarHealth`, `ProgramWithItems`, `PatchItemBody` types; add optional `docType` field to `DocumentRecord` |
| `lib/program/db.ts` | Replace stubs with real implementations calling `airtable-program.ts` |
| `app/api/program/[clientId]/route.ts` | Implement GET (program + items + documents) and PATCH (item status) |
| `app/program/[clientId]/page.tsx` | Server component: fetch data, render `ProgramDashboard` or 404 |
| `app/program/[clientId]/remediation/page.tsx` | Server component: fetch data, pass to `RemediationTracker` inside QueryClientProvider wrapper |
| `app/program/[clientId]/documents/page.tsx` | Server component: fetch data, render `DocumentManager` |
| `components/program/program-dashboard.tsx` | Full implementation: status banner, pillar health rows, open critical items list, target date progress |
| `components/program/remediation-tracker.tsx` | Full implementation: client component with react-query optimistic updates |
| `components/program/document-manager.tsx` | Full implementation: grouped document links by pillar |
| `package.json` | Add `@tanstack/react-query` and `@tanstack/react-query-devtools` to dependencies |

---

## TypeScript shapes

All new types are added to `lib/program/types.ts`. Existing types (`RemediationPriority`, `RemediationStatus`, `RemediationItem`, `ProgramStatus`, `Program`, `DocumentRecord`) are preserved unchanged except where noted.

### Addition to `DocumentRecord`

```ts
// Add optional docType field to existing DocumentRecord
export type DocumentType =
  | "policy"
  | "risk_assessment"
  | "training_record"
  | "procedure"
  | "other";

export type DocumentRecord = {
  id: string;
  programId: string;
  name: string;
  pillar: string;        // matches DiagnosisPillar values or "general"
  docType: DocumentType; // new — defaults to "other" if Airtable field absent
  uploadedAt: string;
  url: string;
};
```

### New types

```ts
// Pillar health derived from remediation items
export type PillarHealth = {
  pillar: string;             // e.g. "policies", "risk_assessment", etc.
  label: string;              // human-readable, e.g. "Policies & Procedures"
  total: number;              // count of all items for this pillar
  complete: number;           // count of items with status === "complete"
  hasCritical: boolean;       // true if any item with priority === "critical" is not complete
  pct: number;                // Math.round((complete / total) * 100), or 100 if total === 0
};

// API GET response
export type ProgramWithItems = {
  program: Program;
  items: RemediationItem[];
  documents: DocumentRecord[];
  pillarHealth: PillarHealth[];
};

// PATCH request body
export type PatchItemBody = {
  itemId: string;
  status: RemediationStatus;
};

// PATCH response body
export type PatchItemResponse = {
  ok: true;
  itemId: string;
  status: RemediationStatus;
};
```

### `lib/program/pillar-health.ts`

```ts
import { PILLAR_LABELS, PILLAR_ORDER } from "@/lib/pre-diagnosis/questions";
import type { RemediationItem } from "./types";
import type { PillarHealth } from "./types";

export function computePillarHealth(items: RemediationItem[]): PillarHealth[] {
  // For each pillar in PILLAR_ORDER, compute complete/total/hasCritical/pct.
  // Items with pillars not in PILLAR_ORDER are grouped under a synthetic
  // "other" entry appended at the end (only if such items exist).
  // Returns array in PILLAR_ORDER order, then "other" if needed.
}
```

Implementation notes for `computePillarHealth`:
- Use `PILLAR_ORDER` and `PILLAR_LABELS` from `lib/pre-diagnosis/questions.ts` as the canonical pillar list and label source.
- Group items by `item.pillar`. Pillars that have no items are still included with `total: 0`, `complete: 0`, `hasCritical: false`, `pct: 100`.
- `hasCritical` is `true` if any item with `priority === "critical"` has `status !== "complete"`.
- Items whose `pillar` value does not appear in `PILLAR_ORDER` are grouped under a final synthetic entry: `{ pillar: "other", label: "Other", ... }`.

### `lib/integrations/airtable-program.ts` — function signatures

```ts
// Config helper — same pattern as airtable-prediagnosis.ts
function getConfig(): { apiKey: string | undefined; baseId: string | undefined };

// Fetch the Program record from Airtable by client_id field
export async function getProgram(clientId: string): Promise<Program | null>;

// Fetch all Remediation Items for a given Airtable Programs record ID (not client_id)
export async function getRemediationItems(programAirtableId: string): Promise<RemediationItem[]>;

// Fetch all Program Documents for a given Airtable Programs record ID
export async function getDocumentRecords(programAirtableId: string): Promise<DocumentRecord[]>;

// PATCH a single Remediation Items record status field
export async function updateRemediationItemStatus(
  itemAirtableId: string,
  status: RemediationStatus,
): Promise<void>;
```

### `lib/program/db.ts` — updated wrappers

```ts
// Replace existing stubs with real implementations
export async function getProgram(clientId: string): Promise<Program | null>;
export async function updateRemediationItem(
  _programId: string,
  item: Partial<RemediationItem> & { id: string },
): Promise<void>;
// New addition:
export async function getProgramWithItems(clientId: string): Promise<ProgramWithItems | null>;
```

---

## Airtable integration details

### Environment variables

The following env vars are added (all optional — routes skip gracefully when absent):

| Variable | Default | Notes |
|----------|---------|-------|
| `AIRTABLE_PROGRAMS_TABLE_NAME` | `Programs` | Airtable table for program records |
| `AIRTABLE_REMEDIATION_TABLE_NAME` | `Remediation Items` | Airtable table for remediation items |
| `AIRTABLE_DOCUMENTS_TABLE_NAME` | `Program Documents` | Airtable table for document URL records |

These join the existing `AIRTABLE_API_KEY` and `AIRTABLE_BASE_ID`.

### Airtable field mapping

**Programs table** → `Program` type:

| Airtable field | TypeScript field | Notes |
|----------------|-----------------|-------|
| `client_id` | `clientId` | UUID string; filter key for GET |
| `org_name` | `orgName` | string |
| `entity_type` | `entityType` | string |
| `diagnosis_token` | `diagnosisToken` | string; may be empty |
| `status` | `status` | `ProgramStatus` literal |
| `start_date` | `startDate` | ISO date string |
| `target_date` | `targetDate` | ISO date string |
| *(Airtable record id)* | `id` | `record.id` from Airtable response |

**Remediation Items table** → `RemediationItem` type:

| Airtable field | TypeScript field | Notes |
|----------------|-----------------|-------|
| `program_id` | — | Airtable linked record array; filter by `Programs` record id |
| `pillar` | `pillar` | string |
| `description` | `description` | string |
| `priority` | `priority` | `RemediationPriority` literal |
| `status` | `status` | `RemediationStatus` literal |
| `due_date` | `dueDate` | ISO date string; may be empty string |
| `notes` | `notes` | string; may be empty string |
| *(Airtable record id)* | `id` | `record.id` |

**Program Documents table** → `DocumentRecord` type:

| Airtable field | TypeScript field | Notes |
|----------------|-----------------|-------|
| `program_id` | — | linked record array; filter by `Programs` record id |
| `name` | `name` | string |
| `pillar` | `pillar` | string; may be `"general"` |
| `doc_type` | `docType` | `DocumentType` literal; defaults to `"other"` if missing |
| `url` | `url` | string |
| `uploaded_at` | `uploadedAt` | ISO date string |
| *(Airtable record id)* | `id` | `record.id` |

### Airtable filter formulas

- `getProgram(clientId)`: `filterByFormula={client_id}="${clientId}"&maxRecords=1`
- `getRemediationItems(programAirtableId)`: Use `filterByFormula=FIND("${programAirtableId}",ARRAYJOIN({program_id}))` — this handles the linked-record array field
- `getDocumentRecords(programAirtableId)`: Same pattern as remediation items
- `updateRemediationItemStatus(itemAirtableId, status)`: PATCH to `https://api.airtable.com/v0/${baseId}/${tableName}/${itemAirtableId}` with body `{ fields: { status } }`

### Graceful degradation

All four functions silently return `null` / `[]` / no-op when `AIRTABLE_API_KEY` or `AIRTABLE_BASE_ID` is absent — matching the pattern in `airtable-prediagnosis.ts`. Errors from Airtable on GET are caught and return `null`/`[]` (not thrown). Errors on PATCH are thrown — the API route catches them and returns a 502.

---

## API contracts

### GET `/api/program/[clientId]`

**Request:** No body. `clientId` from URL path param.

**Response 200:**
```ts
{
  program: Program;
  items: RemediationItem[];
  documents: DocumentRecord[];
  pillarHealth: PillarHealth[];
}
```

**Response 404:**
```json
{ "error": "Program not found." }
```

**Response 503:**
```json
{ "error": "Data layer not configured." }
```
Returned when both `AIRTABLE_API_KEY` and `AIRTABLE_BASE_ID` are absent.

**Side effects:** None. Read-only.

**Implementation notes:**
1. Call `getProgram(clientId)` — if `null`, return 404.
2. Call `getRemediationItems(program.id)` and `getDocumentRecords(program.id)` in `Promise.all`.
3. Call `computePillarHealth(items)`.
4. Return all four fields as JSON.

---

### PATCH `/api/program/[clientId]`

**Request body:**
```ts
{ itemId: string; status: RemediationStatus }
```

**Validation:** `itemId` must be a non-empty string. `status` must be one of `"not_started" | "in_progress" | "complete"`. Return 400 with `{ error: string }` if either fails.

**Response 200:**
```ts
{ ok: true; itemId: string; status: RemediationStatus }
```

**Response 400:**
```json
{ "error": "Invalid status value." }
```

**Response 502:**
```json
{ "error": "Failed to update item." }
```
Returned when `updateRemediationItemStatus` throws.

**Side effects:** Updates the `status` field of the Airtable `Remediation Items` record identified by `itemId`.

**Note on authorization:** MVP has no auth. The `clientId` path param is present in the URL but is not used to verify ownership of `itemId` — this is an acceptable MVP tradeoff given the opaque UUID access model. Document this in a code comment.

---

## Component structure

### `components/program/program-dashboard.tsx`

**Directive:** `"use client"` — remove; this component receives pre-fetched data and has no interactivity. It is a pure render component called from a server page.

**Props:**
```ts
type ProgramDashboardProps = {
  program: Program;
  pillarHealth: PillarHealth[];
  items: RemediationItem[];
};
```

**Renders (top to bottom):**

1. **Page title** — `"Your AML Compliance Operating System"` — `15px / 600 / #1d4771`

2. **Program status banner** — full-width banner at `8px` border-radius using color tokens:
   - `scoping`: warning bg `#fffbeb` / border `#fde68a` / text `#92400e` — label: "Program Scoping"
   - `active`: success bg `#f0fdf4` / border `#bbf7d0` / text `#166534` — label: "Active"
   - `review`: surface bg `#f9fafb` / border `#d1d5db` / text `#374151` — label: "Under Review"
   - `complete`: success bg `#f0fdf4` / border `#bbf7d0` / text `#166534` — label: "Complete"
   - `paused`: warning bg `#fffbeb` / border `#fde68a` / text `#92400e` — label: "Paused"
   
   Banner layout: `14px / 16px padding / border-radius: 8px`. Content: `"Program Status: [label]"` in `14px / 600`.

3. **Target date row** — below banner, `12px / #6b7280`. Text: `"Program period: [startDate] → [targetDate]"`. Dates formatted `YYYY-MM-DD` (no locale formatting — avoids hydration mismatch).

4. **Pillar Health section** — section heading `"Pillar Health"` `13px / 600 / #1d4771 / uppercase / letterSpacing: 0.05em`. Then one `PillarHealthRow` per `PillarHealth` entry. Render using the same row pattern as `PillarSignalRow` in `pillar-signal.tsx`: `justifyContent: space-between`, `alignItems: center`, `padding: 10px 0`, `borderBottom: 1px solid #e5e7eb`.

   **PillarHealthRow** — inline sub-component (not exported separately). Left: pillar label `14px / #374151`. Right: a completion badge rendered as:
   - `pct === 100` and not `hasCritical`: success badge `#166534 / #f0fdf4 / #bbf7d0` — label: "Complete"
   - `hasCritical`: error badge `#b91c1c / #fef2f2 / #fecaca` — label: "Critical Item Open"
   - `pct >= 50`: warning badge `#92400e / #fffbeb / #fde68a` — label: `"${pct}% done"`
   - `pct < 50`: error badge `#b91c1c / #fef2f2 / #fecaca` — label: `"${pct}% done"`
   
   Badge style: `12px / 500 / padding: 2px 8px / border-radius: 6px / border: 1px solid [border]` — identical to `PillarSignalRow`'s badge.

5. **Open Critical Items section** — only rendered if any item has `priority === "critical"` and `status !== "complete"`. Section heading `"Open Critical Items"` same style as Pillar Health heading. Each item rendered as a row: description `13px / #374151`, right-aligned due date `12px / #6b7280`. Divider between sections: `borderTop: 1px solid #e5e7eb / paddingTop: 16px`.

6. **Navigation links** — two links at bottom: `"View Remediation Tracker →"` and `"View Documents →"`. Rendered as `<a>` with `color: #1d4771 / fontSize: 14px / textDecoration: none`. Both use relative paths: `./remediation` and `./documents`. Side by side with `gap: 24px`.

**Layout container:** `fontFamily: system-ui, sans-serif / maxWidth: 720px / margin: 0 auto / padding: 24px 20px / display: flex / flexDirection: column / gap: 24px / color: #111827`.

Note: `720px` max-width matches the existing skeleton pages — this is wider than the intake form's `560px` because the dashboard is an authenticated portal, not a public embed.

---

### `components/program/remediation-tracker.tsx`

**Directive:** `"use client"` — keep. This is the only component in the project that uses `@tanstack/react-query`.

**Props:**
```ts
type RemediationTrackerProps = {
  clientId: string;
  initialItems: RemediationItem[];
};
```

**React Query setup:**

The component must be wrapped in a `QueryClientProvider`. Because Next.js server components cannot hold a `QueryClient`, the provider is set up in the page component (see pages section). `RemediationTracker` itself calls `useQuery` and `useMutation` directly — it does not create the `QueryClient`.

```ts
// Query key
const queryKey = ["program", clientId, "items"] as const;

// useQuery — seed with initialItems from server render
const { data: items } = useQuery({
  queryKey,
  queryFn: async () => {
    const res = await fetch(`/api/program/${clientId}`);
    if (!res.ok) throw new Error("Failed to fetch");
    const data = (await res.json()) as ProgramWithItems;
    return data.items;
  },
  initialData: initialItems,
  staleTime: 30_000, // 30 seconds
});

// useMutation — optimistic update
const mutation = useMutation({
  mutationFn: async ({ itemId, status }: PatchItemBody) => {
    const res = await fetch(`/api/program/${clientId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ itemId, status }),
    });
    if (!res.ok) throw new Error("Update failed");
    return (await res.json()) as PatchItemResponse;
  },
  onMutate: async ({ itemId, status }) => {
    // Cancel any in-flight refetches
    await queryClient.cancelQueries({ queryKey });
    // Snapshot previous state
    const previous = queryClient.getQueryData<RemediationItem[]>(queryKey);
    // Optimistically update
    queryClient.setQueryData<RemediationItem[]>(queryKey, (old) =>
      old?.map((item) => (item.id === itemId ? { ...item, status } : item)) ?? []
    );
    return { previous };
  },
  onError: (_err, _vars, context) => {
    // Rollback on error
    if (context?.previous) {
      queryClient.setQueryData(queryKey, context.previous);
    }
  },
  onSettled: () => {
    // Invalidate to sync with server
    void queryClient.invalidateQueries({ queryKey });
  },
});
```

`useQueryClient()` is called at the top of the component to get `queryClient`.

**Renders:**

Page title: `"Remediation Tracker"` — `15px / 600 / #1d4771`. Back link above title: `"← Dashboard"` pointing to `../` (parent route) — `13px / #1d4771 / textDecoration: none`.

Items are grouped by pillar using a `Map<string, RemediationItem[]>` constructed from the `items` array. Pillar order follows `PILLAR_ORDER` from `lib/pre-diagnosis/questions.ts`, with any unrecognized pillars appended.

For each pillar group:
- Section heading: pillar label from `PILLAR_LABELS` — `13px / 600 / #1d4771 / uppercase / letterSpacing: 0.05em`. If pillar not in `PILLAR_LABELS`, use the raw pillar string.
- Each `RemediationItemRow` (inline sub-component):
  - Layout: `display: flex / flexDirection: column / gap: 8px / padding: 12px 0 / borderBottom: 1px solid #e5e7eb`
  - Top row: description (`14px / #111827`) — spans full width
  - Bottom row: `display: flex / justifyContent: space-between / alignItems: center / gap: 8px / flexWrap: wrap`
    - Left cluster: priority badge + due date
    - Right: status selector

**Priority badge** — inline, no separate component. Same badge pattern as `PillarSignalRow`:
  - `critical`: `#b91c1c / #fef2f2 / #fecaca` — label: "Critical"
  - `high`: `#92400e / #fffbeb / #fde68a` — label: "High"
  - `medium`: `#374151 / #f9fafb / #d1d5db` — label: "Medium"
  - `low`: `#6b7280 / #f9fafb / #e5e7eb` — label: "Low"
  
  Style: `12px / 500 / padding: 2px 8px / border-radius: 6px / border: 1px solid [border]`

**Due date** — `12px / #6b7280` — text: `"Due: [dueDate]"` or omitted if `dueDate` is empty string.

**Status selector** — a `<select>` element using the existing `inputStyle` shape (border `#d1d5db`, border-radius `6px`, `14px`, `padding: 8px 12px`) with options:
  - `not_started` → "Not Started"
  - `in_progress` → "In Progress"
  - `complete` → "Complete"
  
  `value` bound to `item.status`. `onChange` calls `mutation.mutate({ itemId: item.id, status: e.target.value as RemediationStatus })`. The select is `disabled` while `mutation.isPending && mutation.variables?.itemId === item.id` — this prevents double-mutation on the same item. Do not set `outline: none`.

**Loading/error state:** If `mutation.isError`, render a small error banner below the tracker title: `8px border-radius / #fef2f2 bg / #fecaca border / #b91c1c text / 13px` — text: `"Status update failed. Your change has been reverted."`. This clears when the next mutation fires. No full-page loading state — `initialData` ensures immediate render.

**Empty state:** If `items` is empty or undefined, render: `"No remediation items have been added to this program yet."` — `13px / #6b7280`.

---

### `components/program/document-manager.tsx`

**Directive:** `"use client"` — remove. No interactivity.

**Props:**
```ts
type DocumentManagerProps = {
  documents: DocumentRecord[];
};
```

**Renders:**

Page title: `"Program Documents"` — `15px / 600 / #1d4771`. Back link above title: `"← Dashboard"` — `13px / #1d4771 / textDecoration: none / href: "../"`.

Documents are grouped by `pillar`. Pillar order follows `PILLAR_ORDER`, then `"general"`, then any unrecognized values.

For each pillar group with at least one document:
- Section heading: pillar label from `PILLAR_LABELS` (or `"General"` for `"general"`, or the raw string for unknowns) — `13px / 600 / #1d4771 / uppercase / letterSpacing: 0.05em`
- Each document rendered as a row (`padding: 10px 0 / borderBottom: 1px solid #e5e7eb / display: flex / justifyContent: space-between / alignItems: center`):
  - Left: document name as an `<a href={doc.url} target="_blank" rel="noopener noreferrer">` — `14px / #1d4771 / textDecoration: none`. On hover (handled globally via CSS, not inline `onMouseEnter`) the link gains underline — but do not add inline hover styles. The global `a` styling in `globals.css` handles this.
  - Right: doc type label — `12px / #6b7280` — mapped from `docType`:
    - `policy` → "Policy"
    - `risk_assessment` → "Risk Assessment"
    - `training_record` → "Training Record"
    - `procedure` → "Procedure"
    - `other` → "Document"

**Empty state:** If no documents, render: `"No documents have been linked to this program yet."` — `13px / #6b7280`.

**Layout container:** Same as `ProgramDashboard`: `fontFamily / maxWidth: 720px / margin: 0 auto / padding: 24px 20px / display: flex / flexDirection: column / gap: 24px / color: #111827`.

---

## Page components

### `app/program/[clientId]/page.tsx`

Server component (no `"use client"`). Replace the existing skeleton entirely.

```ts
import { getProgramWithItems } from "@/lib/program/db";
import { ProgramDashboard } from "@/components/program/program-dashboard";
import { notFound } from "next/navigation";

export default async function ProgramPage({ params }: { params: { clientId: string } }) {
  const data = await getProgramWithItems(params.clientId);
  if (!data) notFound();

  return (
    <main style={{ fontFamily: "system-ui, sans-serif" }}>
      <ProgramDashboard
        program={data.program}
        pillarHealth={data.pillarHealth}
        items={data.items}
      />
    </main>
  );
}
```

The `<main>` wrapper has no additional style beyond `fontFamily` — layout is owned by `ProgramDashboard`.

---

### `app/program/[clientId]/remediation/page.tsx`

Server component. Fetches data, then renders a thin client wrapper that provides the `QueryClient`, then renders `RemediationTracker` with `initialItems`.

Because `QueryClientProvider` requires a client component, create a thin wrapper component. This wrapper lives **inline in this file** (not exported as a separate file) using `"use client"` at the top of a sub-module pattern — but in Next.js App Router this is not possible inline. Instead:

Create `components/program/query-provider.tsx` as an additional file (see Files to create table update below):

```ts
// components/program/query-provider.tsx
"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export function ProgramQueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
```

The remediation page:
```ts
import { getProgramWithItems } from "@/lib/program/db";
import { ProgramQueryProvider } from "@/components/program/query-provider";
import { RemediationTracker } from "@/components/program/remediation-tracker";
import { notFound } from "next/navigation";

export default async function RemediationPage({ params }: { params: { clientId: string } }) {
  const data = await getProgramWithItems(params.clientId);
  if (!data) notFound();

  return (
    <main style={{ fontFamily: "system-ui, sans-serif" }}>
      <ProgramQueryProvider>
        <RemediationTracker
          clientId={params.clientId}
          initialItems={data.items}
        />
      </ProgramQueryProvider>
    </main>
  );
}
```

---

### `app/program/[clientId]/documents/page.tsx`

Server component. Replace skeleton:

```ts
import { getProgramWithItems } from "@/lib/program/db";
import { DocumentManager } from "@/components/program/document-manager";
import { notFound } from "next/navigation";

export default async function DocumentsPage({ params }: { params: { clientId: string } }) {
  const data = await getProgramWithItems(params.clientId);
  if (!data) notFound();

  return (
    <main style={{ fontFamily: "system-ui, sans-serif" }}>
      <DocumentManager documents={data.documents} />
    </main>
  );
}
```

---

## Updated files list (including `query-provider.tsx`)

**Files to create** (updated):

| File | Role |
|------|------|
| `lib/integrations/airtable-program.ts` | Airtable CRUD for Programs, Remediation Items, Program Documents |
| `lib/program/pillar-health.ts` | Pure `computePillarHealth` function |
| `components/program/query-provider.tsx` | `"use client"` QueryClientProvider wrapper for the remediation page |

---

## Design system notes

**Color tokens used (exact values, no deviations):**

| Purpose | Token |
|---------|-------|
| Page titles, section headings, nav links | `#1d4771` |
| Primary text (descriptions) | `#111827` |
| Secondary text (row text) | `#374151` |
| Muted (dates, doc types) | `#6b7280` |
| Input borders (select) | `#d1d5db` |
| Row dividers | `#e5e7eb` |
| Card/surface background | `#f9fafb` |
| Success badge bg/border/text | `#f0fdf4` / `#bbf7d0` / `#166534` |
| Warning badge bg/border/text | `#fffbeb` / `#fde68a` / `#92400e` |
| Error badge bg/border/text | `#fef2f2` / `#fecaca` / `#b91c1c` |
| Medium priority badge | `#f9fafb` / `#d1d5db` / `#374151` |
| Low priority badge | `#f9fafb` / `#e5e7eb` / `#6b7280` |

**No new color values.** Medium and Low priority badges reuse surface and divider tokens already in the table.

**Spacing:** All gap/padding values are drawn from the allowed set: `4`, `8`, `12`, `14`, `16`, `20`, `24`, `28`. The status selector padding is `8px 12px`. Row padding is `10px 0` or `12px 0`. Page padding is `24px 20px`. No other values.

**Border radius:** `6px` for badges, buttons, and the status select. `8px` for the status banner and error banner. No exceptions.

**Typography:** All sizes from the design system type scale. No new font sizes. Row labels `14px`, meta text `12px`, section headings `13px / 600 / uppercase`.

**Max-width:** `720px` for all three program pages — matching the existing skeleton. This differs from the intake (`560px`) and results (`600px`) pages by design: program portal is a wider, denser interface.

**Shared style objects:** The status `<select>` must use `inputStyle` (imported from `assessment-experience.tsx` if extracted to `lib/styles.ts` — see note below). If `inputStyle` is not yet extracted to a shared module, the implementer must define the select style to match `inputStyle` exactly: `border: 1px solid #d1d5db / borderRadius: 6px / fontSize: 14px / padding: 8px 12px / color: #111827 / background: #fff`. Do not add `outline: none`.

**Banned patterns confirmed absent from this design:**
- No Tailwind utility classes in any component file
- No new color hex values
- No `border-radius: 50%`
- No animation or transition libraries
- No new primitive input components (status selector uses native `<select>`)

---

## Implementation sequence

Each step is atomic. Steps 1–4 are purely server-side with no UI dependency. Steps 5–7 build the Airtable layer. Steps 8–10 build the API. Steps 11–14 build UI components. Steps 15–17 wire pages.

**Step 1: Install `@tanstack/react-query`**
```bash
npm install @tanstack/react-query
```
Update `package.json`. This must happen before any import of `react-query` types.

**Step 2: Update `lib/program/types.ts`**
Add `DocumentType`, update `DocumentRecord` (add `docType` field), add `PillarHealth`, `ProgramWithItems`, `PatchItemBody`, `PatchItemResponse`. Do not remove or rename existing types.

**Step 3: Create `lib/program/pillar-health.ts`**
Implement `computePillarHealth`. Import `PILLAR_LABELS` and `PILLAR_ORDER` from `@/lib/pre-diagnosis/questions`. No I/O. Pure function only.

**Step 4: Create `lib/integrations/airtable-program.ts`**
Implement `getConfig`, `getProgram`, `getRemediationItems`, `getDocumentRecords`, `updateRemediationItemStatus`. Follow the exact structure of `airtable-prediagnosis.ts`: same `AirtableRecord` / `AirtableListResponse` local types, same `getConfig()` pattern, same graceful skip when credentials absent.

Depends on: Step 2 (types).

**Step 5: Update `lib/program/db.ts`**
Replace stubs. Implement `getProgram` (calls `airtable-program.ts`), `updateRemediationItem` (calls `updateRemediationItemStatus`), add `getProgramWithItems` which calls `getProgram` then `Promise.all([getRemediationItems, getDocumentRecords])` then `computePillarHealth`.

Depends on: Steps 2, 3, 4.

**Step 6: Update `app/api/program/[clientId]/route.ts`**
Implement `GET`: call `getProgramWithItems`, return 404/503/200. Implement `PATCH`: parse and validate body, call `updateRemediationItem`, return 200/400/502.

Depends on: Step 5.

**Step 7: Create `components/program/query-provider.tsx`**
The `"use client"` `ProgramQueryProvider` component. No dependencies on other new files.

Depends on: Step 1.

**Step 8: Update `components/program/program-dashboard.tsx`**
Remove `"use client"`. Implement full dashboard: status banner, target date row, pillar health rows, open critical items, nav links. Import `PILLAR_LABELS` and `PILLAR_ORDER` for ordering.

Depends on: Step 2.

**Step 9: Update `components/program/remediation-tracker.tsx`**
Keep `"use client"`. Implement full tracker with `useQuery`, `useMutation`, `useQueryClient`. Import `PILLAR_LABELS`, `PILLAR_ORDER` for grouping. Import types from `lib/program/types`.

Depends on: Steps 1, 2, 7.

**Step 10: Update `components/program/document-manager.tsx`**
Remove `"use client"`. Implement document list grouped by pillar. Import `PILLAR_LABELS`, `PILLAR_ORDER`.

Depends on: Step 2.

**Step 11: Update `app/program/[clientId]/page.tsx`**
Replace skeleton. Server component calling `getProgramWithItems`, rendering `ProgramDashboard`. Use `notFound()` on null.

Depends on: Steps 5, 8.

**Step 12: Update `app/program/[clientId]/remediation/page.tsx`**
Replace skeleton. Server component calling `getProgramWithItems`, wrapping `RemediationTracker` in `ProgramQueryProvider`.

Depends on: Steps 5, 7, 9.

**Step 13: Update `app/program/[clientId]/documents/page.tsx`**
Replace skeleton. Server component calling `getProgramWithItems`, rendering `DocumentManager`.

Depends on: Steps 5, 10.

**Step 14: Add env vars to `.env.local` template (documentation only)**
Add `AIRTABLE_PROGRAMS_TABLE_NAME`, `AIRTABLE_REMEDIATION_TABLE_NAME`, `AIRTABLE_DOCUMENTS_TABLE_NAME` to `.env.local.example` or equivalent. Not a blocker.

**Step 15: Run `npm run typecheck` and `npm run lint`**
Fix any type errors before marking implementation complete.

---

## Open decisions

None. All decisions have been resolved:

- **Airtable vs Supabase:** Airtable throughout — resolved in MODULES.md architecture decisions.
- **Auth model:** Opaque UUID URL, no login — resolved in MODULES.md.
- **react-query scope:** Only `RemediationTracker` — resolved in MODULES.md.
- **`program_id` Airtable filter:** Linked-record arrays require `FIND(ARRAYJOIN(...))` formula — resolved above.
- **Pillar label/order source of truth:** Re-use `PILLAR_LABELS` and `PILLAR_ORDER` from `lib/pre-diagnosis/questions.ts` — resolved above. No duplication.
- **`inputStyle` extraction:** If `inputStyle` is not yet a shared export, the implementer defines the select style inline to match — no new shared file required.
- **`"use client"` on dashboard/document-manager:** Removed — these are pure render components with no interactivity.
- **PATCH authorization:** MVP skips ownership check — documented in a code comment per the design.
- **404 behavior:** Next.js `notFound()` — uses the default 404 page. No custom 404 page required for MVP.
- **Empty `dueDate`:** Rendered as absent (no "Due:" row) rather than as a dash or placeholder.
- **Documents with no pillar:** Mapped to `"general"` in Airtable; rendered under a "General" section heading.

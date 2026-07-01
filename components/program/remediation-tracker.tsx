"use client";

import type { RemediationItem } from "@/lib/program/types";

// Phase 3: Remediation checklist
// Groups items by pillar, shows priority + status + due date
// Client and Matthew can update status — optimistic updates via Airtable PATCH

// TODO: implement tracker with PATCH /api/program/[clientId] on status change

export function RemediationTracker({ items }: { items: RemediationItem[] }) {
  void items;
  return <div />;
}

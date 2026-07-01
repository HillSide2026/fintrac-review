"use client";

import type { DocumentRecord } from "@/lib/program/types";

// Phase 3: Document management
// Links to program documents stored as URLs in Airtable (policy drafts, risk assessments, training records)
// No file upload in MVP — documents are URL fields linking to GHL, Google Drive, or wherever Matthew stores them

export function DocumentManager({ documents }: { documents: DocumentRecord[] }) {
  void documents;
  return <div />;
}

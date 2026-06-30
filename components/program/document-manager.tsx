"use client";

import type { DocumentRecord } from "@/lib/program/types";

// Phase 3: Document management
// Upload: policies, procedures, risk assessment, training records
// Stored in Supabase Storage, linked to program + pillar
// Download: signed URLs, no public access

// TODO: implement upload/download UI, Supabase Storage integration

export function DocumentManager({ documents }: { documents: DocumentRecord[] }) {
  void documents;
  return <div />;
}

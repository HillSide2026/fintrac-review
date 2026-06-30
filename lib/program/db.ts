// Airtable query helpers for the Program module — implemented in Phase 3
// Uses existing AIRTABLE_API_KEY + AIRTABLE_BASE_ID env vars
// Tables: "Programs", "Remediation Items", "Program Documents"

import type { Program, RemediationItem } from "./types";

export async function getProgram(_clientId: string): Promise<Program | null> {
  // TODO: implement Airtable GET — filter Programs by client_id
  return null;
}

export async function updateRemediationItem(
  _programId: string,
  _item: Partial<RemediationItem> & { id: string },
): Promise<void> {
  // TODO: implement Airtable PATCH — update Remediation Items record
}

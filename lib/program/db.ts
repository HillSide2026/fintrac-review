// Supabase client and query helpers — implemented in Phase 3
// Requires: SUPABASE_URL, SUPABASE_SERVICE_KEY env vars

import type { Program, RemediationItem } from "./types";

export async function getProgram(_clientId: string): Promise<Program | null> {
  // TODO: implement Supabase query
  return null;
}

export async function updateRemediationItem(
  _programId: string,
  _item: Partial<RemediationItem> & { id: string },
): Promise<void> {
  // TODO: implement Supabase mutation
}

import type { Program, RemediationItem, ProgramWithItems } from "./types";
import {
  getProgram as airtableGetProgram,
  getRemediationItems,
  getDocumentRecords,
  updateRemediationItemStatus,
} from "@/lib/integrations/airtable-program";
import { computePillarHealth } from "./pillar-health";

export async function getProgram(clientId: string): Promise<Program | null> {
  return airtableGetProgram(clientId);
}

export async function updateRemediationItem(
  _programId: string,
  item: Partial<RemediationItem> & { id: string },
): Promise<void> {
  if (!item.status) return;
  await updateRemediationItemStatus(item.id, item.status);
}

export async function getProgramWithItems(
  clientId: string,
): Promise<ProgramWithItems | null> {
  const program = await airtableGetProgram(clientId);
  if (!program) return null;

  const [items, documents] = await Promise.all([
    getRemediationItems(program.id),
    getDocumentRecords(program.id),
  ]);

  const pillarHealth = computePillarHealth(items);

  return { program, items, documents, pillarHealth };
}

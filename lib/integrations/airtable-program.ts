import type {
  Program,
  ProgramStatus,
  RemediationItem,
  RemediationPriority,
  RemediationStatus,
  DocumentRecord,
  DocumentType,
} from "@/lib/program/types";

type AirtableRecord = {
  id: string;
  fields: Record<string, unknown>;
};

type AirtableListResponse = {
  records: AirtableRecord[];
};

function getConfig() {
  return {
    apiKey: process.env.AIRTABLE_API_KEY,
    baseId: process.env.AIRTABLE_BASE_ID,
    programsTable: process.env.AIRTABLE_PROGRAMS_TABLE_NAME ?? "Programs",
    remediationTable:
      process.env.AIRTABLE_REMEDIATION_TABLE_NAME ?? "Remediation Items",
    documentsTable:
      process.env.AIRTABLE_DOCUMENTS_TABLE_NAME ?? "Program Documents",
  };
}

function str(val: unknown, fallback = ""): string {
  return typeof val === "string" ? val : fallback;
}

function mapProgram(record: AirtableRecord): Program {
  const f = record.fields;
  return {
    id: record.id,
    clientId: str(f.client_id),
    orgName: str(f.org_name),
    entityType: str(f.entity_type),
    diagnosisToken: str(f.diagnosis_token),
    status: str(f.status, "scoping") as ProgramStatus,
    startDate: str(f.start_date),
    targetDate: str(f.target_date),
    remediationItems: [],
  };
}

function mapRemediationItem(record: AirtableRecord): RemediationItem {
  const f = record.fields;
  return {
    id: record.id,
    pillar: str(f.pillar),
    description: str(f.description),
    priority: str(f.priority, "medium") as RemediationPriority,
    status: str(f.status, "not_started") as RemediationStatus,
    dueDate: str(f.due_date),
    notes: str(f.notes),
  };
}

function mapDocumentRecord(record: AirtableRecord): DocumentRecord {
  const f = record.fields;
  return {
    id: record.id,
    programId: str(f.program_id),
    name: str(f.name),
    pillar: str(f.pillar, "general"),
    docType: (str(f.doc_type) || "other") as DocumentType,
    url: str(f.url),
    uploadedAt: str(f.uploaded_at),
  };
}

export async function getProgram(clientId: string): Promise<Program | null> {
  const { apiKey, baseId, programsTable } = getConfig();
  if (!apiKey || !baseId) return null;

  const filter = encodeURIComponent(`{client_id}="${clientId}"`);
  const url = `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(programsTable)}?filterByFormula=${filter}&maxRecords=1`;

  try {
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${apiKey}` },
    });
    if (!res.ok) return null;
    const data = (await res.json()) as AirtableListResponse;
    const record = data.records?.[0];
    if (!record) return null;
    return mapProgram(record);
  } catch {
    return null;
  }
}

export async function getRemediationItems(
  programAirtableId: string,
): Promise<RemediationItem[]> {
  const { apiKey, baseId, remediationTable } = getConfig();
  if (!apiKey || !baseId) return [];

  const filter = encodeURIComponent(
    `FIND("${programAirtableId}",ARRAYJOIN({program_id}))`,
  );
  const url = `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(remediationTable)}?filterByFormula=${filter}`;

  try {
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${apiKey}` },
    });
    if (!res.ok) return [];
    const data = (await res.json()) as AirtableListResponse;
    return (data.records ?? []).map(mapRemediationItem);
  } catch {
    return [];
  }
}

export async function getDocumentRecords(
  programAirtableId: string,
): Promise<DocumentRecord[]> {
  const { apiKey, baseId, documentsTable } = getConfig();
  if (!apiKey || !baseId) return [];

  const filter = encodeURIComponent(
    `FIND("${programAirtableId}",ARRAYJOIN({program_id}))`,
  );
  const url = `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(documentsTable)}?filterByFormula=${filter}`;

  try {
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${apiKey}` },
    });
    if (!res.ok) return [];
    const data = (await res.json()) as AirtableListResponse;
    return (data.records ?? []).map(mapDocumentRecord);
  } catch {
    return [];
  }
}

export async function updateRemediationItemStatus(
  itemAirtableId: string,
  status: RemediationStatus,
): Promise<void> {
  const { apiKey, baseId, remediationTable } = getConfig();
  if (!apiKey || !baseId) return;

  const url = `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(remediationTable)}/${itemAirtableId}`;

  const res = await fetch(url, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ fields: { status } }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Airtable PATCH failed: ${body}`);
  }
}

import type { DiagnosisReport } from "@/lib/pre-diagnosis/types";

type AirtableRecord = {
  fields: Record<string, unknown>;
};

type AirtableListResponse = {
  records: AirtableRecord[];
};

function getConfig() {
  return {
    apiKey: process.env.AIRTABLE_API_KEY,
    baseId: process.env.AIRTABLE_BASE_ID,
    tableName:
      process.env.AIRTABLE_PREDIAGNOSIS_TABLE_NAME || "Pre-Diagnosis Reports",
  };
}

export async function storePreDiagnosisReport(report: DiagnosisReport): Promise<void> {
  const { apiKey, baseId, tableName } = getConfig();

  if (!apiKey || !baseId) return;

  const response = await fetch(
    `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(tableName)}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        records: [
          {
            fields: {
              token: report.token,
              org_name: report.orgName,
              entity_type: report.entityType,
              contact_email: report.contactEmail,
              overall_rating: report.overallRating,
              overall_pct: report.overallPct,
              report_json: JSON.stringify(report),
              created_at: report.createdAt,
            },
          },
        ],
      }),
    },
  );

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Airtable request failed: ${errorBody}`);
  }
}

export async function getPreDiagnosisReport(
  token: string,
): Promise<DiagnosisReport | null> {
  const { apiKey, baseId, tableName } = getConfig();

  if (!apiKey || !baseId) {
    return null;
  }

  const filterFormula = encodeURIComponent(`{token} = "${token}"`);
  const url = `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(tableName)}?filterByFormula=${filterFormula}&maxRecords=1`;

  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${apiKey}` },
  });

  if (!response.ok) {
    return null;
  }

  const data = (await response.json()) as AirtableListResponse;
  const record = data.records?.[0];
  if (!record) return null;

  const reportJson = record.fields.report_json;
  if (typeof reportJson !== "string") return null;

  try {
    return JSON.parse(reportJson) as DiagnosisReport;
  } catch {
    return null;
  }
}

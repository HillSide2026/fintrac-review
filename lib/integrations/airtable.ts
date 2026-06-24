import type {
  AssessmentResult,
  FintracIntakeAnswers,
  LeadCaptureResult,
} from "@/lib/types";
import { deriveOrgName } from "@/lib/intake";

type AirtablePayload = {
  answers: FintracIntakeAnswers;
  assessment: AssessmentResult | null;
};

export async function storeIntakeInAirtable({
  answers,
  assessment,
}: AirtablePayload): Promise<LeadCaptureResult> {
  const apiKey = process.env.AIRTABLE_API_KEY;
  const baseId = process.env.AIRTABLE_BASE_ID;
  const tableName = process.env.AIRTABLE_TABLE_NAME || "FINTRAC Intakes";

  if (!apiKey || !baseId) {
    return {
      target: "airtable",
      status: "skipped",
      message: "Airtable credentials are not configured.",
    };
  }

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
              org_name: deriveOrgName(answers),
              contact_name: answers.orgProfile.contactName,
              email: answers.orgProfile.email,
              entity_type: answers.reportingEntity.entityType,
              province: answers.orgProfile.province,
              urgency: answers.serviceScope.urgency,
              preferred_scope: answers.serviceScope.preferredScope,
              answers: JSON.stringify(answers, null, 2),
              assessment: assessment ? JSON.stringify(assessment, null, 2) : "",
              created_at: new Date().toISOString(),
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

  return {
    target: "airtable",
    status: "sent",
  };
}

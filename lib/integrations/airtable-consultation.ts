import type { ConsultationBookingPayload } from "@/lib/consultation/types";

function getConfig() {
  return {
    apiKey: process.env.AIRTABLE_API_KEY,
    baseId: process.env.AIRTABLE_BASE_ID,
    tableName:
      process.env.AIRTABLE_CONSULTATION_TABLE_NAME || "Consultations",
  };
}

export async function storeConsultationBooking(
  payload: ConsultationBookingPayload,
): Promise<void> {
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
              diagnosis_token: payload.diagnosisToken,
              call_date: payload.callDate ?? "",
              status: "booked",
              notes: payload.notes ?? "",
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
}

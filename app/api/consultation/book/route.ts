import { NextResponse } from "next/server";
import type { ConsultationBookingPayload } from "@/lib/consultation/types";
import { storeConsultationBooking } from "@/lib/integrations/airtable-consultation";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const p = (body ?? {}) as Record<string, unknown>;

  const diagnosisToken =
    typeof p.diagnosisToken === "string" ? p.diagnosisToken.trim() : "";
  if (!diagnosisToken) {
    return NextResponse.json(
      { error: "diagnosisToken is required." },
      { status: 400 },
    );
  }

  const payload: ConsultationBookingPayload = {
    diagnosisToken,
    contactEmail: typeof p.contactEmail === "string" ? p.contactEmail : undefined,
    contactName: typeof p.contactName === "string" ? p.contactName : undefined,
    callDate: typeof p.callDate === "string" ? p.callDate : undefined,
    notes: typeof p.notes === "string" ? p.notes : undefined,
  };

  try {
    await storeConsultationBooking(payload);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Airtable write failed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }

  const ghlUrl = process.env.GHL_WEBHOOK_URL;
  if (ghlUrl) {
    fetch(ghlUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        source: "fintrac-consultation-booked",
        createdAt: new Date().toISOString(),
        diagnosisToken: payload.diagnosisToken,
        contactEmail: payload.contactEmail ?? "",
        contactName: payload.contactName ?? "",
        callDate: payload.callDate ?? "",
        notes: payload.notes ?? "",
      }),
    }).catch(() => {});
  }

  return NextResponse.json({ ok: true });
}

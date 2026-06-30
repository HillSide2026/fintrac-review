import { NextResponse } from "next/server";

// TODO: validate ConsultationRequest, store in Airtable, notify GHL / trigger Hugh outreach
export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    void body;
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected error.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

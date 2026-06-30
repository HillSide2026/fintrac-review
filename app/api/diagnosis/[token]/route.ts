import { NextResponse } from "next/server";

// TODO: retrieve diagnosis report from Airtable by token
export async function GET(
  _request: Request,
  { params }: { params: { token: string } },
) {
  const { token } = params;

  if (!token) {
    return NextResponse.json({ error: "Token required." }, { status: 400 });
  }

  // TODO: fetch from Airtable / Supabase
  return NextResponse.json({ error: "Not implemented." }, { status: 501 });
}

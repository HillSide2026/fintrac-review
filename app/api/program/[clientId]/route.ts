import { NextResponse } from "next/server";

// TODO: fetch program + remediation items from Airtable by client_id
export async function GET(
  _request: Request,
  { params }: { params: { clientId: string } },
) {
  const { clientId } = params;
  void clientId;
  return NextResponse.json({ error: "Not implemented." }, { status: 501 });
}

export async function PATCH(
  _request: Request,
  { params }: { params: { clientId: string } },
) {
  const { clientId } = params;
  void clientId;
  return NextResponse.json({ error: "Not implemented." }, { status: 501 });
}

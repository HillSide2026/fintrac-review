import { NextResponse } from "next/server";

// TODO: auth-gate, fetch program from Supabase
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

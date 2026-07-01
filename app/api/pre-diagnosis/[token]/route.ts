import { NextResponse } from "next/server";
import { getPreDiagnosisReport } from "@/lib/integrations/airtable-prediagnosis";

export async function GET(
  _request: Request,
  { params }: { params: { token: string } },
) {
  const { token } = params;

  if (!token) {
    return NextResponse.json({ error: "Token required." }, { status: 400 });
  }

  const report = await getPreDiagnosisReport(token);

  if (!report) {
    return NextResponse.json({ error: "Report not found." }, { status: 404 });
  }

  return NextResponse.json(report);
}

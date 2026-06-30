import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { parseDiagnosisAnswers } from "@/lib/diagnosis/validation";
import { scoreDiagnosis } from "@/lib/diagnosis/scoring";
import { buildDiagnosisReport } from "@/lib/diagnosis/report";

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    const answers = parseDiagnosisAnswers(body);
    const pillarResults = scoreDiagnosis(answers);
    const token = randomUUID();
    const report = await buildDiagnosisReport(token, answers, pillarResults);

    // TODO: store report in Airtable + send to GHL

    return NextResponse.json({ token, report });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected error.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

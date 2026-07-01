import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { parseDiagnosisAnswers } from "@/lib/pre-diagnosis/validation";
import { scoreDiagnosis } from "@/lib/pre-diagnosis/scoring";
import { buildDiagnosisReport } from "@/lib/pre-diagnosis/report";
import { storePreDiagnosisReport } from "@/lib/integrations/airtable-prediagnosis";

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    const answers = parseDiagnosisAnswers(body);
    const pillarResults = scoreDiagnosis(answers);
    const token = randomUUID();
    const report = await buildDiagnosisReport(token, answers, pillarResults);

    await storePreDiagnosisReport(report);

    const webhookUrl = process.env.GHL_WEBHOOK_URL;
    if (webhookUrl) {
      fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: "fintrac-pre-diagnosis",
          createdAt: report.createdAt,
          contact: {
            company: report.orgName,
            email: report.contactEmail,
          },
          token: report.token,
          overallRating: report.overallRating,
          overallPct: report.overallPct,
        }),
      }).catch(() => {});
    }

    return NextResponse.json({ token });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected error.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

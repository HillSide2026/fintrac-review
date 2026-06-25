import type {
  AssessmentResult,
  FintracIntakeAnswers,
  IntakeSummary,
  LeadCaptureResult,
} from "@/lib/types";
import { deriveOrgName } from "@/lib/intake";

type GhlPayload = {
  answers: FintracIntakeAnswers;
  summary: IntakeSummary;
  assessment: AssessmentResult | null;
};

export async function sendLeadToGhl({
  answers,
  summary,
  assessment,
}: GhlPayload): Promise<LeadCaptureResult> {
  const webhookUrl = process.env.GHL_WEBHOOK_URL;

  if (!webhookUrl) {
    return {
      target: "ghl",
      status: "skipped",
      message: "GHL webhook URL is not configured.",
    };
  }

  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      source: "fintrac-effectiveness-review",
      createdAt: new Date().toISOString(),
      contact: {
        company: deriveOrgName(answers),
      },
      answers,
      summary,
      assessment,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`GHL request failed: ${errorBody}`);
  }

  return {
    target: "ghl",
    status: "sent",
  };
}

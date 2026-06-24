import { createIntakeSummary } from "@/lib/intake";
import type { AssessmentResult, FintracIntakeAnswers } from "@/lib/types";

const ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages";

type AnthropicResponse = {
  content?: Array<{
    type: string;
    text?: string;
  }>;
};

function buildPrompt(answers: FintracIntakeAnswers) {
  const summary = createIntakeSummary(answers);
  const formattedSummary = Object.entries(summary)
    .map(([section, fields]) => {
      const fieldLines = Object.entries(fields)
        .map(([label, value]) => `  - ${label}: ${value}`)
        .join("\n");
      return `${section}:\n${fieldLines}`;
    })
    .join("\n\n");

  return `
Review this FINTRAC effectiveness review intake for a Canadian reporting entity. Identify:
- Program gaps relative to PCMLTFA / PCMLTFR requirements
- Compliance risks
- Missing information needed to scope the review
- Scoping notes and recommendations for our team

Return valid JSON only with this shape:
{
  "summary": "string",
  "programGaps": ["string"],
  "risks": ["string"],
  "missingInformation": ["string"],
  "scopingNotes": ["string"]
}

These notes are for internal compliance team use only. Do not address the client directly.

Intake:
${formattedSummary}
`.trim();
}

function extractJson(text: string) {
  const cleaned = text.replace(/```json|```/g, "").trim();

  try {
    return JSON.parse(cleaned) as AssessmentResult;
  } catch {
    const firstBrace = cleaned.indexOf("{");
    const lastBrace = cleaned.lastIndexOf("}");

    if (firstBrace === -1 || lastBrace === -1) {
      throw new Error("Claude returned a response without valid JSON.");
    }

    return JSON.parse(
      cleaned.slice(firstBrace, lastBrace + 1),
    ) as AssessmentResult;
  }
}

function normalizeAssessment(result: AssessmentResult): AssessmentResult {
  return {
    summary: result.summary ?? "",
    programGaps: Array.isArray(result.programGaps) ? result.programGaps : [],
    risks: Array.isArray(result.risks) ? result.risks : [],
    missingInformation: Array.isArray(result.missingInformation)
      ? result.missingInformation
      : [],
    scopingNotes: Array.isArray(result.scopingNotes) ? result.scopingNotes : [],
  };
}

export async function createInternalAssessment(
  answers: FintracIntakeAnswers,
): Promise<AssessmentResult | null> {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    return null;
  }

  const response = await fetch(ANTHROPIC_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: process.env.ANTHROPIC_MODEL || "claude-sonnet-4-6",
      max_tokens: 1200,
      system:
        "You analyze FINTRAC AML/ATF compliance program readiness for Canadian reporting entities. Your output is for internal legal and compliance team use. Be concise, structured, and practical.",
      messages: [
        {
          role: "user",
          content: buildPrompt(answers),
        },
      ],
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Claude request failed: ${errorBody}`);
  }

  const data = (await response.json()) as AnthropicResponse;
  const text = data.content
    ?.filter((item) => item.type === "text" && item.text)
    .map((item) => item.text)
    .join("\n")
    .trim();

  if (!text) {
    throw new Error("Claude returned an empty response.");
  }

  return normalizeAssessment(extractJson(text));
}

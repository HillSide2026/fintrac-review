import type {
  DiagnosisAnswers,
  DiagnosisClaudeOutput,
  DiagnosisPillar,
  DiagnosisPillarResult,
  DiagnosisReport,
  PillarSignal,
  RiskRating,
} from "./types";
import { PILLAR_LABELS, PILLAR_ORDER } from "./questions";
import { deriveOverallPct, deriveRating } from "./scoring";

const ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages";

type AnthropicResponse = {
  content?: Array<{ type: string; text?: string }>;
};

function buildUserPrompt(
  answers: DiagnosisAnswers,
  pillarResults: Omit<DiagnosisPillarResult, "narrative">[],
): string {
  const pillarSummary = pillarResults
    .map((p) => `${p.label}: ${p.pct}% (${p.rawScore}/${p.maxScore})`)
    .join("\n");

  const provinces = answers.operatingProvinces.length > 0
    ? answers.operatingProvinces.join(", ")
    : "Not specified";

  const msbActivities = answers.msbActivities.length > 0
    ? answers.msbActivities.join(", ")
    : "None / not an MSB";

  const fintracRegistered = answers.fintracRegisteredActivities.length > 0
    ? answers.fintracRegisteredActivities.join(", ")
    : "None / not registered as MSB";

  return `Organization: ${answers.orgName}
Entity type: ${answers.entityType}
Registered: ${answers.registrationYear}
Size: ${answers.employeeCount} employees
Operating provinces: ${provinces}
MSB activities conducted: ${msbActivities}
FINTRAC-registered MSB activities: ${fintracRegistered}

Pillar scores (self-reported):
${pillarSummary}

Return valid JSON only with this exact shape:
{
  "overallBand": "strong" | "gaps_identified" | "material_deficiencies",
  "pillarSignals": {
    "policies": "foundations_present" | "area_of_concern" | "risk_indicator",
    "risk_assessment": "foundations_present" | "area_of_concern" | "risk_indicator",
    "training": "foundations_present" | "area_of_concern" | "risk_indicator",
    "monitoring": "foundations_present" | "area_of_concern" | "risk_indicator",
    "compliance_officer": "foundations_present" | "area_of_concern" | "risk_indicator"
  },
  "likelyGapAreas": ["string (3-5 items)"],
  "recommendedNextStep": "string"
}`;
}

function extractClaudeOutput(text: string): DiagnosisClaudeOutput {
  const cleaned = text.replace(/```json|```/g, "").trim();

  let parsed: unknown;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    const firstBrace = cleaned.indexOf("{");
    const lastBrace = cleaned.lastIndexOf("}");
    if (firstBrace === -1 || lastBrace === -1) {
      throw new Error("Claude returned a response without valid JSON.");
    }
    parsed = JSON.parse(cleaned.slice(firstBrace, lastBrace + 1));
  }

  const raw = parsed as Record<string, unknown>;

  const validBands: RiskRating[] = ["strong", "gaps_identified", "material_deficiencies"];
  const overallBand = validBands.includes(raw.overallBand as RiskRating)
    ? (raw.overallBand as RiskRating)
    : "gaps_identified";

  const validSignals: PillarSignal[] = [
    "foundations_present",
    "area_of_concern",
    "risk_indicator",
  ];
  const rawSignals =
    raw.pillarSignals && typeof raw.pillarSignals === "object"
      ? (raw.pillarSignals as Record<string, unknown>)
      : {};
  const pillarSignals = {} as Record<DiagnosisPillar, PillarSignal>;
  for (const pillar of PILLAR_ORDER) {
    const sig = rawSignals[pillar];
    pillarSignals[pillar] = validSignals.includes(sig as PillarSignal)
      ? (sig as PillarSignal)
      : "area_of_concern";
  }

  const likelyGapAreas = Array.isArray(raw.likelyGapAreas)
    ? (raw.likelyGapAreas as string[]).filter((s) => typeof s === "string")
    : [];

  const recommendedNextStep =
    typeof raw.recommendedNextStep === "string" ? raw.recommendedNextStep : "";

  return { overallBand, pillarSignals, likelyGapAreas, recommendedNextStep };
}

function buildFallback(overallPct: number): DiagnosisClaudeOutput {
  const overallBand = deriveRating(overallPct);
  const pillarSignals = {} as Record<DiagnosisPillar, PillarSignal>;
  for (const pillar of PILLAR_ORDER) {
    pillarSignals[pillar] = "area_of_concern";
  }
  return {
    overallBand,
    pillarSignals,
    likelyGapAreas: [],
    recommendedNextStep:
      "A consultation with a qualified AML compliance lawyer would help clarify which areas represent material gaps and what, if anything, requires prompt attention.",
  };
}

async function callClaude(
  answers: DiagnosisAnswers,
  pillarResults: Omit<DiagnosisPillarResult, "narrative">[],
): Promise<DiagnosisClaudeOutput> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    const overallPct = deriveOverallPct(pillarResults);
    return buildFallback(overallPct);
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
      max_tokens: 800,
      system:
        "You are generating preliminary AML compliance signals for a Canadian reporting entity subject to FINTRAC/PCMLTFA. This is a screening tool only. Do not reach legal conclusions. Do not assess compliance status. Do not provide remediation advice. Identify signals and risk indicators only, framed as areas that may warrant expert review. All output is preliminary and requires human review by a qualified lawyer. Return valid JSON only.",
      messages: [{ role: "user", content: buildUserPrompt(answers, pillarResults) }],
    }),
  });

  if (!response.ok) {
    const overallPct = deriveOverallPct(pillarResults);
    return buildFallback(overallPct);
  }

  const data = (await response.json()) as AnthropicResponse;
  const text = data.content
    ?.filter((item) => item.type === "text" && item.text)
    .map((item) => item.text)
    .join("\n")
    .trim();

  if (!text) {
    const overallPct = deriveOverallPct(pillarResults);
    return buildFallback(overallPct);
  }

  try {
    return extractClaudeOutput(text);
  } catch {
    const overallPct = deriveOverallPct(pillarResults);
    return buildFallback(overallPct);
  }
}

export async function buildDiagnosisReport(
  token: string,
  answers: DiagnosisAnswers,
  pillarResults: Omit<DiagnosisPillarResult, "narrative">[],
): Promise<DiagnosisReport> {
  const overallPct = deriveOverallPct(pillarResults);
  const claudeOutput = await callClaude(answers, pillarResults);

  const pillarsWithLabels: DiagnosisPillarResult[] = pillarResults.map((p) => ({
    ...p,
    label: PILLAR_LABELS[p.pillar],
    narrative: claudeOutput.pillarSignals[p.pillar],
  }));

  return {
    token,
    orgName: answers.orgName,
    entityType: answers.entityType,
    contactEmail: answers.contactEmail,
    overallRating: claudeOutput.overallBand,
    overallPct,
    pillarSignals: claudeOutput.pillarSignals,
    pillars: pillarsWithLabels,
    likelyGapAreas: claudeOutput.likelyGapAreas,
    recommendedNextStep: claudeOutput.recommendedNextStep,
    createdAt: new Date().toISOString(),
  };
}

import type { DiagnosisAnswers, DiagnosisPillarResult, DiagnosisReport } from "./types";
import { deriveRating } from "./scoring";

// TODO: call Claude to generate per-pillar narrative and top gaps
async function generateNarratives(
  _answers: DiagnosisAnswers,
  _pillarResults: DiagnosisPillarResult[],
): Promise<{ narratives: Record<string, string>; topGaps: string[]; nextStep: string }> {
  return { narratives: {}, topGaps: [], nextStep: "" };
}

export async function buildDiagnosisReport(
  token: string,
  answers: DiagnosisAnswers,
  pillarResults: DiagnosisPillarResult[],
): Promise<DiagnosisReport> {
  const overallScore = pillarResults.reduce((sum, p) => sum + p.score, 0);
  const maxScore = pillarResults.length * 4;
  const overallRating = deriveRating(overallScore, maxScore);
  const { narratives, topGaps, nextStep } = await generateNarratives(answers, pillarResults);

  return {
    token,
    orgName: answers.orgName,
    entityType: answers.entityType,
    overallRating,
    overallScore,
    pillars: pillarResults.map((p) => ({
      ...p,
      narrative: narratives[p.pillar] ?? "",
    })),
    topGaps,
    recommendedNextStep: nextStep,
    createdAt: new Date().toISOString(),
  };
}

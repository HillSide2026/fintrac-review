import type {
  DiagnosisPillar,
  DiagnosisPillarResult,
  DiagnosisPayload,
  RiskRating,
} from "./types";
import { DIAGNOSIS_QUESTIONS, PILLAR_LABELS, PILLAR_ORDER } from "./questions";

export function deriveRating(overallPct: number): RiskRating {
  if (overallPct >= 75) return "strong";
  if (overallPct >= 40) return "gaps_identified";
  return "material_deficiencies";
}

function scorePillar(
  pillar: DiagnosisPillar,
  answers: Record<string, number>,
): { rawScore: number; maxScore: number; pct: number } {
  const questions = DIAGNOSIS_QUESTIONS.filter((q) => q.pillar === pillar);
  const rawScore = questions.reduce((sum, q) => sum + (answers[q.id] ?? 0), 0);
  const maxScore = questions.length * 4;
  const pct = maxScore > 0 ? Math.round((rawScore / maxScore) * 100) : 0;
  return { rawScore, maxScore, pct };
}

export function scoreDiagnosis(
  payload: DiagnosisPayload,
): Omit<DiagnosisPillarResult, "narrative">[] {
  return PILLAR_ORDER.map((pillar) => {
    const { rawScore, maxScore, pct } = scorePillar(pillar, payload.answers);
    return { pillar, label: PILLAR_LABELS[pillar], rawScore, maxScore, pct };
  });
}

export function deriveOverallPct(
  pillarResults: Omit<DiagnosisPillarResult, "narrative">[],
): number {
  const totalRaw = pillarResults.reduce((s, p) => s + p.rawScore, 0);
  const totalMax = pillarResults.reduce((s, p) => s + p.maxScore, 0);
  return totalMax > 0 ? Math.round((totalRaw / totalMax) * 100) : 0;
}

import type { DiagnosisAnswers, DiagnosisPillarResult, PillarScore, RiskRating } from "./types";

export const PILLAR_LABELS: Record<string, string> = {
  policies: "Policies & Procedures",
  risk_assessment: "Risk Assessment",
  training: "Training Program",
  monitoring: "Ongoing Monitoring",
  compliance_officer: "Compliance Officer",
};

// TODO: implement per-pillar scoring logic based on question responses
export function scorePillar(_pillar: string, _responses: Record<string, string>): PillarScore {
  return 2;
}

export function deriveRating(totalScore: number, maxScore: number): RiskRating {
  const pct = totalScore / maxScore;
  if (pct >= 0.75) return "strong";
  if (pct >= 0.40) return "gaps_identified";
  return "material_deficiencies";
}

// TODO: implement full scoring pipeline
export function scoreDiagnosis(_answers: DiagnosisAnswers): DiagnosisPillarResult[] {
  return [];
}

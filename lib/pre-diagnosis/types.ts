export type DiagnosisPillar =
  | "policies"
  | "risk_assessment"
  | "training"
  | "monitoring"
  | "compliance_officer";

export type RiskRating =
  | "strong"
  | "gaps_identified"
  | "material_deficiencies";

export type DiagnosisQuestion = {
  id: string;
  pillar: DiagnosisPillar;
  question: string;
  options: { value: number; label: string }[];
};

export type DiagnosisPayload = {
  orgName: string;
  entityType: string;
  contactEmail: string;
  answers: Record<string, number>; // questionId → 0–4
};

export type DiagnosisPillarResult = {
  pillar: DiagnosisPillar;
  label: string;
  rawScore: number;
  maxScore: number;
  pct: number;
  narrative: string;
};

export type DiagnosisReport = {
  token: string;
  orgName: string;
  entityType: string;
  contactEmail: string;
  overallRating: RiskRating;
  overallPct: number;
  pillars: DiagnosisPillarResult[];
  topGaps: string[];
  recommendedNextStep: string;
  createdAt: string;
};

export type DiagnosisClaudeOutput = {
  pillars: Record<string, string>;
  topGaps: string[];
  recommendedNextStep: string;
};

export type DiagnosisPillar =
  | "policies"
  | "risk_assessment"
  | "training"
  | "monitoring"
  | "compliance_officer";

export type PillarScore = 0 | 1 | 2 | 3 | 4;

export type RiskRating = "strong" | "gaps_identified" | "material_deficiencies";

export type PillarAnswers = {
  pillar: DiagnosisPillar;
  responses: Record<string, string>;
};

export type DiagnosisAnswers = {
  orgName: string;
  entityType: string;
  contactEmail: string;
  pillars: PillarAnswers[];
};

export type DiagnosisPillarResult = {
  pillar: DiagnosisPillar;
  label: string;
  score: PillarScore;
  narrative: string;
};

export type DiagnosisReport = {
  token: string;
  orgName: string;
  entityType: string;
  overallRating: RiskRating;
  overallScore: number;
  pillars: DiagnosisPillarResult[];
  topGaps: string[];
  recommendedNextStep: string;
  createdAt: string;
};

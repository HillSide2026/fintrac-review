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

export type PillarSignal =
  | "foundations_present"
  | "area_of_concern"
  | "risk_indicator";

export type DiagnosisQuestion = {
  id: string;
  pillar: DiagnosisPillar;
  question: string;
  options: { value: number; label: string }[];
};

export type EmployeeCount =
  | "1-5"
  | "6-20"
  | "21-50"
  | "51-200"
  | "200+";

export type MsbActivity =
  | "foreign_exchange"
  | "money_transfer"
  | "money_orders"
  | "travellers_cheques"
  | "virtual_currency"
  | "cheque_cashing";

export type DiagnosisPayload = {
  orgName: string;
  entityType: string;
  contactEmail: string;
  registrationYear: string;
  operatingProvinces: string[];
  employeeCount: EmployeeCount;
  msbActivities: MsbActivity[];
  fintracRegisteredActivities: MsbActivity[];
  answers: Record<string, number>;
};

// Validated form of DiagnosisPayload — same shape, returned by parseDiagnosisAnswers
export type DiagnosisAnswers = DiagnosisPayload;

export type DiagnosisPillarResult = {
  pillar: DiagnosisPillar;
  label: string;
  rawScore: number;
  maxScore: number;
  pct: number;
  narrative: string;
};

export type DiagnosisClaudeOutput = {
  overallBand: RiskRating;
  pillarSignals: Record<DiagnosisPillar, PillarSignal>;
  likelyGapAreas: string[];
  recommendedNextStep: string;
};

export type DiagnosisReport = {
  token: string;
  orgName: string;
  entityType: string;
  contactEmail: string;
  overallRating: RiskRating;
  overallPct: number;
  pillarSignals: Record<DiagnosisPillar, PillarSignal>;
  pillars: DiagnosisPillarResult[];
  likelyGapAreas: string[];
  recommendedNextStep: string;
  createdAt: string;
};

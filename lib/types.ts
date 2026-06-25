export type ReportingEntityType =
  | "bank"
  | "credit_union"
  | "life_insurance"
  | "securities_dealer"
  | "money_services_business"
  | "foreign_msb"
  | "real_estate"
  | "accountant"
  | "dpms"
  | "casino"
  | "bc_notary"
  | "other";

export type TriggerReason =
  | "fintrac_communication"
  | "examination_pending"
  | "proactive_assessment"
  | "program_gaps"
  | "not_recently_reviewed"
  | "building_program";

export type ProgramStatus =
  | "established"
  | "partial"
  | "in_development"
  | "none";

export type DocumentAvailability =
  | "available"
  | "partial"
  | "not_available"
  | "unsure";

export type PriorExaminationStatus =
  | "none"
  | "examined_no_findings"
  | "examined_with_findings"
  | "examination_pending";

export type UrgencyLevel = "standard" | "moderate" | "urgent" | "critical";

export type ServiceScope =
  | "full_review"
  | "gap_assessment"
  | "document_review"
  | "targeted"
  | "unsure";

export type OrgProfileAnswers = {
  orgName: string;
};

export type SituationAnswers = {
  entityType: ReportingEntityType;
  entityTypeOther: string;
  triggers: TriggerReason[];
  triggerNotes: string;
};

export type TimingAnswers = {
  urgency: UrgencyLevel;
  additionalNotes: string;
};

export type ComplianceProgramAnswers = {
  policiesStatus: ProgramStatus;
  lastPolicyReview: string;
  riskAssessmentStatus: ProgramStatus;
  trainingStatus: ProgramStatus;
  monitoringStatus: ProgramStatus;
  programNotes: string;
};

export type PriorExaminationAnswers = {
  examinationStatus: PriorExaminationStatus;
  lastExamDate: string;
  findingsSummary: string;
  remediationStatus: string;
};

export type ServiceScopeAnswers = {
  documentsAvailable: DocumentAvailability;
  preferredScope: ServiceScope;
  targetDate: string;
  additionalNotes: string;
};

export type FintracIntakeAnswers = {
  orgProfile: OrgProfileAnswers;
  situation: SituationAnswers;
  timing: TimingAnswers;
  completedStage2: boolean;
  complianceProgram: ComplianceProgramAnswers;
  priorExaminations: PriorExaminationAnswers;
  serviceScope: ServiceScopeAnswers;
};

export type IntakeSummarySection = Record<string, string>;

export type IntakeSummary = Record<string, IntakeSummarySection>;

export type AssessmentResult = {
  summary: string;
  programGaps: string[];
  risks: string[];
  missingInformation: string[];
  scopingNotes: string[];
};

export type LeadCaptureResult = {
  target: "ghl" | "airtable" | "integration";
  status: "sent" | "skipped" | "failed";
  message?: string;
};

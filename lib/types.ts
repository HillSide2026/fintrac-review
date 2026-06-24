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

export type FintracRegistrationStatus =
  | "registered"
  | "not_required"
  | "pending"
  | "unsure";

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
  province: string;
  contactName: string;
  contactTitle: string;
  phone: string;
  email: string;
};

export type ReportingEntityAnswers = {
  entityType: ReportingEntityType;
  entityTypeOther: string;
  registrationStatus: FintracRegistrationStatus;
  registrationNumber: string;
  coName: string;
  coTitle: string;
  coPhone: string;
  coEmail: string;
};

export type ComplianceProgramAnswers = {
  policiesStatus: ProgramStatus;
  lastPolicyReview: string;
  riskAssessmentStatus: ProgramStatus;
  trainingStatus: ProgramStatus;
  monitoringStatus: ProgramStatus;
  programNotes: string;
};

export type ReportingProcessAnswers = {
  filesStrs: boolean;
  filesLctrs: boolean;
  filesEftrs: boolean;
  otherReports: string;
  reportingNotes: string;
  recordkeepingNotes: string;
};

export type PriorExaminationAnswers = {
  examinationStatus: PriorExaminationStatus;
  lastExamDate: string;
  findingsSummary: string;
  remediationStatus: string;
};

export type ServiceScopeAnswers = {
  documentsAvailable: DocumentAvailability;
  urgency: UrgencyLevel;
  targetDate: string;
  preferredScope: ServiceScope;
  additionalNotes: string;
};

export type FintracIntakeAnswers = {
  orgProfile: OrgProfileAnswers;
  reportingEntity: ReportingEntityAnswers;
  complianceProgram: ComplianceProgramAnswers;
  reportingProcesses: ReportingProcessAnswers;
  priorExaminations: PriorExaminationAnswers;
  serviceScope: ServiceScopeAnswers;
};

export type IntakeSummarySection = Record<string, string>;

export type IntakeSummary = {
  "Organization Profile": IntakeSummarySection;
  "Reporting Entity & Registration": IntakeSummarySection;
  "Compliance Program": IntakeSummarySection;
  "Reporting & Recordkeeping": IntakeSummarySection;
  "Prior Examinations": IntakeSummarySection;
  "Scope & Timing": IntakeSummarySection;
};

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

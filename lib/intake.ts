import type { FintracIntakeAnswers, IntakeSummary } from "@/lib/types";

export const STEPS = [
  "Organization Profile",
  "Reporting Entity & Registration",
  "Compliance Program",
  "Reporting & Recordkeeping",
  "Prior Examinations",
  "Scope & Timing",
] as const;

export const INITIAL_INTAKE_ANSWERS: FintracIntakeAnswers = {
  orgProfile: {
    orgName: "",
    province: "",
    contactName: "",
    contactTitle: "",
    phone: "",
    email: "",
  },
  reportingEntity: {
    entityType: "bank",
    entityTypeOther: "",
    registrationStatus: "unsure",
    registrationNumber: "",
    coName: "",
    coTitle: "Chief Compliance Officer",
    coPhone: "",
    coEmail: "",
  },
  complianceProgram: {
    policiesStatus: "established",
    lastPolicyReview: "",
    riskAssessmentStatus: "established",
    trainingStatus: "established",
    monitoringStatus: "established",
    programNotes: "",
  },
  reportingProcesses: {
    filesStrs: false,
    filesLctrs: false,
    filesEftrs: false,
    otherReports: "",
    reportingNotes: "",
    recordkeepingNotes: "",
  },
  priorExaminations: {
    examinationStatus: "none",
    lastExamDate: "",
    findingsSummary: "",
    remediationStatus: "",
  },
  serviceScope: {
    documentsAvailable: "unsure",
    urgency: "standard",
    targetDate: "",
    preferredScope: "unsure",
    additionalNotes: "",
  },
};

const NOT_PROVIDED = "(not provided)";
const NONE = "(none)";
const NA = "(n/a)";

export const ENTITY_TYPE_LABELS: Record<string, string> = {
  bank: "Bank (authorized domestic or foreign)",
  credit_union: "Credit union / caisse populaire",
  life_insurance: "Life insurance company, broker, or agent",
  securities_dealer: "Securities dealer",
  money_services_business: "Money services business (MSB)",
  foreign_msb: "Foreign money services business (FMSB)",
  real_estate: "Real estate developer, broker, or agent",
  accountant: "Accountant / CPA firm",
  dpms: "Dealer in precious metals and stones",
  casino: "Casino",
  bc_notary: "British Columbia notary",
  other: "Other",
};

export const PROGRAM_STATUS_LABELS: Record<string, string> = {
  established: "Established and documented",
  partial: "Partially in place",
  in_development: "In development",
  none: "Not in place",
};

export const REGISTRATION_STATUS_LABELS: Record<string, string> = {
  registered: "Registered with FINTRAC",
  not_required: "Registration not required",
  pending: "Registration pending",
  unsure: "Not sure",
};

export const EXAMINATION_STATUS_LABELS: Record<string, string> = {
  none: "No prior examination",
  examined_no_findings: "Examined — no material findings",
  examined_with_findings: "Examined — findings or directives issued",
  examination_pending: "Examination pending or recently notified",
};

export const DOCUMENT_AVAILABILITY_LABELS: Record<string, string> = {
  available: "Available and ready for review",
  partial: "Partially available",
  not_available: "Not currently available",
  unsure: "Not sure",
};

export const URGENCY_LABELS: Record<string, string> = {
  standard: "Standard (no urgent deadline)",
  moderate: "Moderate (within 60 days)",
  urgent: "Urgent (within 30 days)",
  critical: "Critical (within 2 weeks or examination pending)",
};

export const SERVICE_SCOPE_LABELS: Record<string, string> = {
  full_review: "Full effectiveness review",
  gap_assessment: "Gap assessment against PCMLTFA requirements",
  document_review: "Document review only",
  targeted: "Targeted review of specific program elements",
  unsure: "Unsure — guidance requested",
};

export function createIntakeSummary(
  answers: FintracIntakeAnswers,
): IntakeSummary {
  return {
    "Organization Profile": {
      "Organization Name": answers.orgProfile.orgName || NOT_PROVIDED,
      Province: answers.orgProfile.province || NOT_PROVIDED,
      "Contact Name": answers.orgProfile.contactName || NOT_PROVIDED,
      Title: answers.orgProfile.contactTitle || NOT_PROVIDED,
      Phone: answers.orgProfile.phone || NOT_PROVIDED,
      Email: answers.orgProfile.email || NOT_PROVIDED,
    },
    "Reporting Entity & Registration": {
      "Entity Type":
        ENTITY_TYPE_LABELS[answers.reportingEntity.entityType] ??
        answers.reportingEntity.entityType,
      "Entity Type (Other)":
        answers.reportingEntity.entityType === "other"
          ? answers.reportingEntity.entityTypeOther || NOT_PROVIDED
          : NA,
      "FINTRAC Registration":
        REGISTRATION_STATUS_LABELS[answers.reportingEntity.registrationStatus] ??
        answers.reportingEntity.registrationStatus,
      "Registration Number":
        answers.reportingEntity.registrationStatus === "registered"
          ? answers.reportingEntity.registrationNumber || NOT_PROVIDED
          : NA,
      "Compliance Officer": answers.reportingEntity.coName || NOT_PROVIDED,
      "CO Title": answers.reportingEntity.coTitle || NOT_PROVIDED,
      "CO Phone": answers.reportingEntity.coPhone || NOT_PROVIDED,
      "CO Email": answers.reportingEntity.coEmail || NOT_PROVIDED,
    },
    "Compliance Program": {
      "Policies & Procedures":
        PROGRAM_STATUS_LABELS[answers.complianceProgram.policiesStatus] ??
        answers.complianceProgram.policiesStatus,
      "Last Policy Review":
        answers.complianceProgram.lastPolicyReview || NOT_PROVIDED,
      "Risk Assessment":
        PROGRAM_STATUS_LABELS[answers.complianceProgram.riskAssessmentStatus] ??
        answers.complianceProgram.riskAssessmentStatus,
      "Training Program":
        PROGRAM_STATUS_LABELS[answers.complianceProgram.trainingStatus] ??
        answers.complianceProgram.trainingStatus,
      "Ongoing Monitoring":
        PROGRAM_STATUS_LABELS[answers.complianceProgram.monitoringStatus] ??
        answers.complianceProgram.monitoringStatus,
      "Additional Notes": answers.complianceProgram.programNotes || NONE,
    },
    "Reporting & Recordkeeping": {
      "Files STRs": answers.reportingProcesses.filesStrs ? "Yes" : "No",
      "Files LCTRs": answers.reportingProcesses.filesLctrs ? "Yes" : "No",
      "Files EFTRs": answers.reportingProcesses.filesEftrs ? "Yes" : "No",
      "Other Reports": answers.reportingProcesses.otherReports || NONE,
      "Reporting Process Notes":
        answers.reportingProcesses.reportingNotes || NONE,
      "Recordkeeping Notes":
        answers.reportingProcesses.recordkeepingNotes || NONE,
    },
    "Prior Examinations": {
      "Examination Status":
        EXAMINATION_STATUS_LABELS[answers.priorExaminations.examinationStatus] ??
        answers.priorExaminations.examinationStatus,
      "Last Examination Date":
        answers.priorExaminations.lastExamDate || NOT_PROVIDED,
      "Findings Summary": answers.priorExaminations.findingsSummary || NONE,
      "Remediation Status": answers.priorExaminations.remediationStatus || NONE,
    },
    "Scope & Timing": {
      "Documents Available":
        DOCUMENT_AVAILABILITY_LABELS[answers.serviceScope.documentsAvailable] ??
        answers.serviceScope.documentsAvailable,
      Urgency:
        URGENCY_LABELS[answers.serviceScope.urgency] ??
        answers.serviceScope.urgency,
      "Target Date": answers.serviceScope.targetDate || NOT_PROVIDED,
      "Preferred Scope":
        SERVICE_SCOPE_LABELS[answers.serviceScope.preferredScope] ??
        answers.serviceScope.preferredScope,
      "Additional Notes": answers.serviceScope.additionalNotes || NONE,
    },
  };
}

export function deriveOrgName(answers: FintracIntakeAnswers) {
  return answers.orgProfile.orgName || "";
}

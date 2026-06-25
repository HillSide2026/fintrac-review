import type {
  FintracIntakeAnswers,
  IntakeSummary,
  TriggerReason,
} from "@/lib/types";

export const STEPS = [
  "Getting Started",
  "Your Situation",
  "Compliance Program",
  "Prior FINTRAC Contact",
  "Scope & Documents",
] as const;

export const STAGE_1_STEP_COUNT = 2;

export const INITIAL_INTAKE_ANSWERS: FintracIntakeAnswers = {
  orgProfile: {
    orgName: "",
    contactRole: "",
    orgSize: "",
  },
  situation: {
    entityType: "bank",
    entityTypeOther: "",
    triggers: [],
    triggerNotes: "",
  },
  timing: {
    urgency: "standard",
    successOutcome: "",
  },
  completedStage2: false,
  complianceProgram: {
    policiesStatus: "established",
    lastPolicyReview: "",
    riskAssessmentStatus: "established",
    trainingStatus: "established",
    monitoringStatus: "established",
    programNotes: "",
  },
  priorExaminations: {
    examinationStatus: "none",
    lastExamDate: "",
    findingsSummary: "",
    remediationStatus: "",
  },
  serviceScope: {
    documentsAvailable: "unsure",
    targetDate: "",
    programConcerns: "",
    additionalNotes: "",
  },
};

const NOT_PROVIDED = "(not provided)";
const NONE = "(none)";

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

export const TRIGGER_REASON_LABELS: Record<TriggerReason, string> = {
  fintrac_communication: "We've received communication from FINTRAC",
  examination_pending: "An examination has been notified or is pending",
  proactive_assessment: "We want to proactively assess our program",
  program_gaps: "We're concerned about specific program gaps",
  not_recently_reviewed: "Our program hasn't been reviewed in some time",
  building_program: "We're building our compliance program for the first time",
};

export const PROGRAM_STATUS_LABELS: Record<string, string> = {
  established: "Established and documented",
  partial: "Partially in place",
  in_development: "In development",
  none: "Not in place",
};

export const EXAMINATION_STATUS_LABELS: Record<string, string> = {
  none: "No prior FINTRAC examination",
  examined_no_findings: "Examined — no material findings",
  examined_with_findings: "Examined — findings or compliance orders issued",
  examination_pending: "Examination pending or recently notified",
};

export const DOCUMENT_AVAILABILITY_LABELS: Record<string, string> = {
  available: "Available and ready for review",
  partial: "Partially available",
  not_available: "Not currently available",
  unsure: "Not sure",
};

export const URGENCY_LABELS: Record<string, string> = {
  standard: "Standard — no urgent deadline",
  moderate: "Moderate — within 60 days",
  urgent: "Urgent — within 30 days",
  critical: "Critical — within 2 weeks or examination is imminent",
};

export const CONTACT_ROLE_OPTIONS: { value: string; label: string }[] = [
  { value: "", label: "Select your role" },
  { value: "cco", label: "Chief Compliance Officer" },
  { value: "ceo", label: "CEO / Founder" },
  { value: "cfo", label: "CFO / Finance Lead" },
  { value: "gc", label: "General Counsel" },
  { value: "compliance_manager", label: "Compliance Manager" },
  { value: "other", label: "Other" },
];

export const ORG_SIZE_OPTIONS: { value: string; label: string }[] = [
  { value: "", label: "Select organization size" },
  { value: "under_25", label: "Under 25 employees" },
  { value: "25_100", label: "25–100 employees" },
  { value: "100_500", label: "100–500 employees" },
  { value: "500_plus", label: "500+ employees" },
];

export function createIntakeSummary(
  answers: FintracIntakeAnswers,
): IntakeSummary {
  const summary: IntakeSummary = {
    "Your Organization": {
      Organization: answers.orgProfile.orgName || NOT_PROVIDED,
      ...(answers.orgProfile.contactRole && {
        Role: answers.orgProfile.contactRole,
      }),
      ...(answers.orgProfile.orgSize && {
        "Organization Size": answers.orgProfile.orgSize,
      }),
      "Entity Type":
        ENTITY_TYPE_LABELS[answers.situation.entityType] ??
        answers.situation.entityType,
      ...(answers.situation.entityType === "other" && {
        "Entity Type (Other)":
          answers.situation.entityTypeOther || NOT_PROVIDED,
      }),
    },
    "What Brought You to Us": {
      Triggers:
        answers.situation.triggers.length > 0
          ? answers.situation.triggers
              .map((t) => TRIGGER_REASON_LABELS[t])
              .join("; ")
          : NOT_PROVIDED,
      ...(answers.situation.triggerNotes && {
        "Additional Context": answers.situation.triggerNotes,
      }),
      Urgency:
        URGENCY_LABELS[answers.timing.urgency] ?? answers.timing.urgency,
      ...(answers.timing.successOutcome && {
        "Success Goal": answers.timing.successOutcome,
      }),
    },
  };

  if (answers.completedStage2) {
    summary["Compliance Program"] = {
      "Policies & Procedures":
        PROGRAM_STATUS_LABELS[answers.complianceProgram.policiesStatus] ??
        answers.complianceProgram.policiesStatus,
      "Last Policy Review":
        answers.complianceProgram.lastPolicyReview || NOT_PROVIDED,
      "Risk Assessment":
        PROGRAM_STATUS_LABELS[
          answers.complianceProgram.riskAssessmentStatus
        ] ?? answers.complianceProgram.riskAssessmentStatus,
      "Training Program":
        PROGRAM_STATUS_LABELS[answers.complianceProgram.trainingStatus] ??
        answers.complianceProgram.trainingStatus,
      "Ongoing Monitoring":
        PROGRAM_STATUS_LABELS[answers.complianceProgram.monitoringStatus] ??
        answers.complianceProgram.monitoringStatus,
      ...(answers.complianceProgram.programNotes && {
        Notes: answers.complianceProgram.programNotes,
      }),
    };

    summary["Prior FINTRAC Contact"] = {
      "Examination History":
        EXAMINATION_STATUS_LABELS[
          answers.priorExaminations.examinationStatus
        ] ?? answers.priorExaminations.examinationStatus,
      ...(answers.priorExaminations.examinationStatus !== "none" && {
        "Last Examination Date":
          answers.priorExaminations.lastExamDate || NOT_PROVIDED,
        Findings: answers.priorExaminations.findingsSummary || NONE,
        "Remediation Status":
          answers.priorExaminations.remediationStatus || NONE,
      }),
    };

    summary["Scope & Documents"] = {
      "Documents Available":
        DOCUMENT_AVAILABILITY_LABELS[answers.serviceScope.documentsAvailable] ??
        answers.serviceScope.documentsAvailable,
      ...(answers.serviceScope.targetDate && {
        "Target Date": answers.serviceScope.targetDate,
      }),
      ...(answers.serviceScope.programConcerns && {
        "Program Concerns": answers.serviceScope.programConcerns,
      }),
      ...(answers.serviceScope.additionalNotes && {
        "Additional Notes": answers.serviceScope.additionalNotes,
      }),
    };
  }

  return summary;
}

export function deriveOrgName(answers: FintracIntakeAnswers): string {
  return answers.orgProfile.orgName || "";
}

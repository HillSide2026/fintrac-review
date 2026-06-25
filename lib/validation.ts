import type {
  DocumentAvailability,
  FintracIntakeAnswers,
  PriorExaminationStatus,
  ProgramStatus,
  ReportingEntityType,
  TriggerReason,
  UrgencyLevel,
} from "@/lib/types";

function assertObject(value: unknown, field: string) {
  if (!value || typeof value !== "object") {
    throw new Error(`Invalid value for ${field}.`);
  }
  return value as Record<string, unknown>;
}

function assertString(value: unknown, field: string) {
  if (typeof value !== "string") {
    throw new Error(`Invalid value for ${field}.`);
  }
  return value.trim();
}

function assertBoolean(value: unknown, field: string) {
  if (typeof value !== "boolean") {
    throw new Error(`Invalid value for ${field}.`);
  }
  return value;
}

const ENTITY_TYPES: ReportingEntityType[] = [
  "bank",
  "credit_union",
  "life_insurance",
  "securities_dealer",
  "money_services_business",
  "foreign_msb",
  "real_estate",
  "accountant",
  "dpms",
  "casino",
  "bc_notary",
  "other",
];

function assertReportingEntityType(
  value: unknown,
  field: string,
): ReportingEntityType {
  if (ENTITY_TYPES.includes(value as ReportingEntityType)) {
    return value as ReportingEntityType;
  }
  throw new Error(`Invalid value for ${field}.`);
}

const TRIGGER_REASONS: TriggerReason[] = [
  "fintrac_communication",
  "examination_pending",
  "proactive_assessment",
  "program_gaps",
  "not_recently_reviewed",
  "building_program",
];

function assertTriggerReasons(
  value: unknown,
  field: string,
): TriggerReason[] {
  if (!Array.isArray(value)) {
    throw new Error(`Invalid value for ${field}.`);
  }
  return value.filter((v) =>
    TRIGGER_REASONS.includes(v as TriggerReason),
  ) as TriggerReason[];
}

const URGENCY_LEVELS: UrgencyLevel[] = [
  "standard",
  "moderate",
  "urgent",
  "critical",
];

function assertUrgencyLevel(value: unknown, field: string): UrgencyLevel {
  if (URGENCY_LEVELS.includes(value as UrgencyLevel)) {
    return value as UrgencyLevel;
  }
  throw new Error(`Invalid value for ${field}.`);
}

const PROGRAM_STATUSES: ProgramStatus[] = [
  "established",
  "partial",
  "in_development",
  "none",
];

function assertProgramStatus(value: unknown, field: string): ProgramStatus {
  if (PROGRAM_STATUSES.includes(value as ProgramStatus)) {
    return value as ProgramStatus;
  }
  throw new Error(`Invalid value for ${field}.`);
}

const EXAMINATION_STATUSES: PriorExaminationStatus[] = [
  "none",
  "examined_no_findings",
  "examined_with_findings",
  "examination_pending",
];

function assertPriorExaminationStatus(
  value: unknown,
  field: string,
): PriorExaminationStatus {
  if (EXAMINATION_STATUSES.includes(value as PriorExaminationStatus)) {
    return value as PriorExaminationStatus;
  }
  throw new Error(`Invalid value for ${field}.`);
}

const DOCUMENT_AVAILABILITY: DocumentAvailability[] = [
  "available",
  "partial",
  "not_available",
  "unsure",
];

function assertDocumentAvailability(
  value: unknown,
  field: string,
): DocumentAvailability {
  if (DOCUMENT_AVAILABILITY.includes(value as DocumentAvailability)) {
    return value as DocumentAvailability;
  }
  throw new Error(`Invalid value for ${field}.`);
}

export function parseFintracIntakeAnswers(
  payload: unknown,
): FintracIntakeAnswers {
  const candidate = assertObject(payload, "request body");
  const orgProfile = assertObject(candidate.orgProfile, "Organization Profile");
  const situation = assertObject(candidate.situation, "Situation");
  const timing = assertObject(candidate.timing, "Timing");
  const completedStage2 = assertBoolean(
    candidate.completedStage2,
    "completedStage2",
  );

  const result: FintracIntakeAnswers = {
    orgProfile: {
      orgName: assertString(orgProfile.orgName, "Organization Name"),
      contactRole: assertString(orgProfile.contactRole ?? "", "Contact Role"),
      orgSize: assertString(orgProfile.orgSize ?? "", "Organization Size"),
    },
    situation: {
      entityType: assertReportingEntityType(
        situation.entityType,
        "Entity Type",
      ),
      entityTypeOther: assertString(
        situation.entityTypeOther,
        "Entity Type Other",
      ),
      triggers: assertTriggerReasons(situation.triggers, "Triggers"),
      triggerNotes: assertString(situation.triggerNotes, "Trigger Notes"),
    },
    timing: {
      urgency: assertUrgencyLevel(timing.urgency, "Urgency"),
      successOutcome: assertString(timing.successOutcome ?? "", "Success Outcome"),
    },
    completedStage2,
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

  if (completedStage2) {
    const cp = assertObject(candidate.complianceProgram, "Compliance Program");
    const pe = assertObject(candidate.priorExaminations, "Prior Examinations");
    const ss = assertObject(candidate.serviceScope, "Service Scope");

    result.complianceProgram = {
      policiesStatus: assertProgramStatus(
        cp.policiesStatus,
        "Policies Status",
      ),
      lastPolicyReview: assertString(
        cp.lastPolicyReview,
        "Last Policy Review",
      ),
      riskAssessmentStatus: assertProgramStatus(
        cp.riskAssessmentStatus,
        "Risk Assessment Status",
      ),
      trainingStatus: assertProgramStatus(
        cp.trainingStatus,
        "Training Status",
      ),
      monitoringStatus: assertProgramStatus(
        cp.monitoringStatus,
        "Monitoring Status",
      ),
      programNotes: assertString(cp.programNotes, "Program Notes"),
    };

    result.priorExaminations = {
      examinationStatus: assertPriorExaminationStatus(
        pe.examinationStatus,
        "Examination Status",
      ),
      lastExamDate: assertString(pe.lastExamDate, "Last Exam Date"),
      findingsSummary: assertString(pe.findingsSummary, "Findings Summary"),
      remediationStatus: assertString(
        pe.remediationStatus,
        "Remediation Status",
      ),
    };

    result.serviceScope = {
      documentsAvailable: assertDocumentAvailability(
        ss.documentsAvailable,
        "Documents Available",
      ),
      targetDate: assertString(ss.targetDate, "Target Date"),
      programConcerns: assertString(ss.programConcerns ?? "", "Program Concerns"),
      additionalNotes: assertString(ss.additionalNotes, "Additional Notes"),
    };
  }

  return result;
}

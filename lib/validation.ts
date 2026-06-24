import type {
  DocumentAvailability,
  FintracIntakeAnswers,
  FintracRegistrationStatus,
  PriorExaminationStatus,
  ProgramStatus,
  ReportingEntityType,
  ServiceScope,
  UrgencyLevel,
} from "@/lib/types";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

const REGISTRATION_STATUSES: FintracRegistrationStatus[] = [
  "registered",
  "not_required",
  "pending",
  "unsure",
];

function assertFintracRegistrationStatus(
  value: unknown,
  field: string,
): FintracRegistrationStatus {
  if (REGISTRATION_STATUSES.includes(value as FintracRegistrationStatus)) {
    return value as FintracRegistrationStatus;
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

const SERVICE_SCOPES: ServiceScope[] = [
  "full_review",
  "gap_assessment",
  "document_review",
  "targeted",
  "unsure",
];

function assertServiceScope(value: unknown, field: string): ServiceScope {
  if (SERVICE_SCOPES.includes(value as ServiceScope)) {
    return value as ServiceScope;
  }
  throw new Error(`Invalid value for ${field}.`);
}

export function parseFintracIntakeAnswers(
  payload: unknown,
): FintracIntakeAnswers {
  const candidate = assertObject(payload, "request body");
  const orgProfile = assertObject(candidate.orgProfile, "Organization Profile");
  const reportingEntity = assertObject(
    candidate.reportingEntity,
    "Reporting Entity",
  );
  const complianceProgram = assertObject(
    candidate.complianceProgram,
    "Compliance Program",
  );
  const reportingProcesses = assertObject(
    candidate.reportingProcesses,
    "Reporting Processes",
  );
  const priorExaminations = assertObject(
    candidate.priorExaminations,
    "Prior Examinations",
  );
  const serviceScope = assertObject(candidate.serviceScope, "Service Scope");

  const email = assertString(orgProfile.email, "Contact Email");
  if (email && !EMAIL_PATTERN.test(email)) {
    throw new Error("Contact email address is invalid.");
  }

  return {
    orgProfile: {
      orgName: assertString(orgProfile.orgName, "Organization Name"),
      province: assertString(orgProfile.province, "Province"),
      contactName: assertString(orgProfile.contactName, "Contact Name"),
      contactTitle: assertString(orgProfile.contactTitle, "Contact Title"),
      phone: assertString(orgProfile.phone, "Phone"),
      email,
    },
    reportingEntity: {
      entityType: assertReportingEntityType(
        reportingEntity.entityType,
        "Entity Type",
      ),
      entityTypeOther: assertString(
        reportingEntity.entityTypeOther,
        "Entity Type Other",
      ),
      registrationStatus: assertFintracRegistrationStatus(
        reportingEntity.registrationStatus,
        "Registration Status",
      ),
      registrationNumber: assertString(
        reportingEntity.registrationNumber,
        "Registration Number",
      ),
      coName: assertString(reportingEntity.coName, "Compliance Officer Name"),
      coTitle: assertString(
        reportingEntity.coTitle,
        "Compliance Officer Title",
      ),
      coPhone: assertString(
        reportingEntity.coPhone,
        "Compliance Officer Phone",
      ),
      coEmail: assertString(
        reportingEntity.coEmail,
        "Compliance Officer Email",
      ),
    },
    complianceProgram: {
      policiesStatus: assertProgramStatus(
        complianceProgram.policiesStatus,
        "Policies Status",
      ),
      lastPolicyReview: assertString(
        complianceProgram.lastPolicyReview,
        "Last Policy Review",
      ),
      riskAssessmentStatus: assertProgramStatus(
        complianceProgram.riskAssessmentStatus,
        "Risk Assessment Status",
      ),
      trainingStatus: assertProgramStatus(
        complianceProgram.trainingStatus,
        "Training Status",
      ),
      monitoringStatus: assertProgramStatus(
        complianceProgram.monitoringStatus,
        "Monitoring Status",
      ),
      programNotes: assertString(
        complianceProgram.programNotes,
        "Program Notes",
      ),
    },
    reportingProcesses: {
      filesStrs: assertBoolean(reportingProcesses.filesStrs, "Files STRs"),
      filesLctrs: assertBoolean(reportingProcesses.filesLctrs, "Files LCTRs"),
      filesEftrs: assertBoolean(reportingProcesses.filesEftrs, "Files EFTRs"),
      otherReports: assertString(
        reportingProcesses.otherReports,
        "Other Reports",
      ),
      reportingNotes: assertString(
        reportingProcesses.reportingNotes,
        "Reporting Notes",
      ),
      recordkeepingNotes: assertString(
        reportingProcesses.recordkeepingNotes,
        "Recordkeeping Notes",
      ),
    },
    priorExaminations: {
      examinationStatus: assertPriorExaminationStatus(
        priorExaminations.examinationStatus,
        "Examination Status",
      ),
      lastExamDate: assertString(
        priorExaminations.lastExamDate,
        "Last Exam Date",
      ),
      findingsSummary: assertString(
        priorExaminations.findingsSummary,
        "Findings Summary",
      ),
      remediationStatus: assertString(
        priorExaminations.remediationStatus,
        "Remediation Status",
      ),
    },
    serviceScope: {
      documentsAvailable: assertDocumentAvailability(
        serviceScope.documentsAvailable,
        "Documents Available",
      ),
      urgency: assertUrgencyLevel(serviceScope.urgency, "Urgency"),
      targetDate: assertString(serviceScope.targetDate, "Target Date"),
      preferredScope: assertServiceScope(
        serviceScope.preferredScope,
        "Preferred Scope",
      ),
      additionalNotes: assertString(
        serviceScope.additionalNotes,
        "Additional Notes",
      ),
    },
  };
}

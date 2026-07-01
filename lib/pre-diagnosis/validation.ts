import type { DiagnosisPayload, EmployeeCount, MsbActivity } from "./types";
import { DIAGNOSIS_QUESTIONS, MSB_ACTIVITY_OPTIONS, EMPLOYEE_COUNT_OPTIONS, CANADIAN_PROVINCES } from "./questions";

const VALID_MSB_ACTIVITIES = new Set<string>(MSB_ACTIVITY_OPTIONS.map((o) => o.value));
const VALID_EMPLOYEE_COUNTS = new Set<string>(EMPLOYEE_COUNT_OPTIONS.map((o) => o.value));
const VALID_PROVINCES = new Set<string>(CANADIAN_PROVINCES.map((p) => p.value));

function parseStringArray<T extends string>(
  val: unknown,
  validSet: Set<string>,
): T[] {
  if (!Array.isArray(val)) return [];
  return val.filter((v): v is T => typeof v === "string" && validSet.has(v));
}

export function parseDiagnosisAnswers(payload: unknown): DiagnosisPayload {
  if (!payload || typeof payload !== "object") {
    throw new Error("Invalid request.");
  }
  const p = payload as Record<string, unknown>;

  const orgName = typeof p.orgName === "string" ? p.orgName.trim() : "";
  if (!orgName) throw new Error("Organization name is required.");

  const entityType = typeof p.entityType === "string" ? p.entityType.trim() : "";
  if (!entityType) throw new Error("Entity type is required.");

  const contactEmail = typeof p.contactEmail === "string" ? p.contactEmail.trim() : "";
  if (!contactEmail) throw new Error("Email is required.");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail)) {
    throw new Error("Email format is invalid.");
  }

  const registrationYear = typeof p.registrationYear === "string" ? p.registrationYear.trim() : "";
  if (!registrationYear) throw new Error("Registration year is required.");

  const operatingProvinces = parseStringArray<string>(p.operatingProvinces, VALID_PROVINCES);
  if (operatingProvinces.length === 0) throw new Error("At least one operating province is required.");

  const employeeCount = typeof p.employeeCount === "string" && VALID_EMPLOYEE_COUNTS.has(p.employeeCount)
    ? (p.employeeCount as EmployeeCount)
    : null;
  if (!employeeCount) throw new Error("Employee count is required.");

  const msbActivities = parseStringArray<MsbActivity>(p.msbActivities, VALID_MSB_ACTIVITIES);
  const fintracRegisteredActivities = parseStringArray<MsbActivity>(p.fintracRegisteredActivities, VALID_MSB_ACTIVITIES);

  if (!p.answers || typeof p.answers !== "object" || Array.isArray(p.answers)) {
    throw new Error("answers must be an object mapping question IDs to values 0–4.");
  }

  const raw = p.answers as Record<string, unknown>;
  const answers: Record<string, number> = {};

  for (const question of DIAGNOSIS_QUESTIONS) {
    const val = raw[question.id];
    if (val === undefined || val === null) {
      throw new Error(`Missing answer for question: ${question.id}`);
    }
    const num = Number(val);
    if (!Number.isInteger(num) || num < 0 || num > 4) {
      throw new Error(`Answer for ${question.id} must be an integer 0–4.`);
    }
    answers[question.id] = num;
  }

  return {
    orgName,
    entityType,
    contactEmail,
    registrationYear,
    operatingProvinces,
    employeeCount,
    msbActivities,
    fintracRegisteredActivities,
    answers,
  };
}

import type { DiagnosisAnswers } from "./types";

// TODO: implement full validation
export function parseDiagnosisAnswers(payload: unknown): DiagnosisAnswers {
  if (!payload || typeof payload !== "object") {
    throw new Error("Invalid diagnosis payload.");
  }
  const p = payload as Record<string, unknown>;
  return {
    orgName: typeof p.orgName === "string" ? p.orgName.trim() : "",
    entityType: typeof p.entityType === "string" ? p.entityType.trim() : "",
    contactEmail: typeof p.contactEmail === "string" ? p.contactEmail.trim() : "",
    pillars: Array.isArray(p.pillars) ? p.pillars : [],
  };
}

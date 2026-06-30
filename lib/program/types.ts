export type RemediationPriority = "critical" | "high" | "medium" | "low";

export type RemediationStatus = "not_started" | "in_progress" | "complete";

export type RemediationItem = {
  id: string;
  pillar: string;
  description: string;
  priority: RemediationPriority;
  status: RemediationStatus;
  dueDate: string;
  notes: string;
};

export type ProgramStatus = "scoping" | "active" | "review" | "complete" | "paused";

export type Program = {
  id: string;
  clientId: string;
  orgName: string;
  entityType: string;
  diagnosisToken: string;
  startDate: string;
  targetDate: string;
  status: ProgramStatus;
  remediationItems: RemediationItem[];
};

export type DocumentRecord = {
  id: string;
  programId: string;
  name: string;
  pillar: string;
  uploadedAt: string;
  url: string;
};

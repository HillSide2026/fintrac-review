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

export type DocumentType =
  | "policy"
  | "risk_assessment"
  | "training_record"
  | "procedure"
  | "other";

export type DocumentRecord = {
  id: string;
  programId: string;
  name: string;
  pillar: string;
  docType: DocumentType;
  uploadedAt: string;
  url: string;
};

export type PillarHealth = {
  pillar: string;
  label: string;
  total: number;
  complete: number;
  hasCritical: boolean;
  pct: number;
};

export type ProgramWithItems = {
  program: Program;
  items: RemediationItem[];
  documents: DocumentRecord[];
  pillarHealth: PillarHealth[];
};

export type PatchItemBody = {
  itemId: string;
  status: RemediationStatus;
};

export type PatchItemResponse = {
  ok: true;
  itemId: string;
  status: RemediationStatus;
};

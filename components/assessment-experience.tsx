"use client";

import { INITIAL_INTAKE_ANSWERS, STEPS } from "@/lib/intake";
import type {
  ComplianceProgramAnswers,
  DocumentAvailability,
  FintracIntakeAnswers,
  FintracRegistrationStatus,
  IntakeSummary,
  OrgProfileAnswers,
  PriorExaminationAnswers,
  PriorExaminationStatus,
  ProgramStatus,
  ReportingEntityAnswers,
  ReportingEntityType,
  ReportingProcessAnswers,
  ServiceScope,
  ServiceScopeAnswers,
  UrgencyLevel,
} from "@/lib/types";
import { useEffect, useState, useTransition } from "react";

type ApiResponse = {
  summary: IntakeSummary;
};

const inputStyle = {
  width: "100%",
  padding: "8px 10px",
  borderRadius: "6px",
  border: "1px solid #d1d5db",
  fontSize: "14px",
  boxSizing: "border-box" as const,
  background: "#fff",
  color: "#111827",
};

const labelStyle = {
  fontSize: "13px",
  color: "#6b7280",
  display: "block",
  marginBottom: "4px",
};

function Field({
  children,
  label,
}: {
  children: React.ReactNode;
  label: string;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
      <label style={labelStyle}>{label}</label>
      {children}
    </div>
  );
}

function TextInput({
  onChange,
  placeholder,
  type = "text",
  value,
}: {
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  value: string;
}) {
  return (
    <input
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      style={inputStyle}
      type={type}
      value={value}
    />
  );
}

function TextArea({
  onChange,
  placeholder,
  rows = 3,
  value,
}: {
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  value: string;
}) {
  return (
    <textarea
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      rows={rows}
      style={{ ...inputStyle, resize: "vertical" }}
      value={value}
    />
  );
}

function SelectInput({
  onChange,
  options,
  value,
}: {
  onChange: (value: string) => void;
  options: { label: string; value: string }[];
  value: string;
}) {
  return (
    <select
      onChange={(event) => onChange(event.target.value)}
      style={{ ...inputStyle, appearance: "auto" as const }}
      value={value}
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}

function Checkbox({
  checked,
  label,
  onChange,
}: {
  checked: boolean;
  label: string;
  onChange: (value: boolean) => void;
}) {
  return (
    <label
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        fontSize: "14px",
        cursor: "pointer",
      }}
    >
      <input
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        style={{ width: "16px", height: "16px", cursor: "pointer" }}
        type="checkbox"
      />
      {label}
    </label>
  );
}

function Radio({
  checked,
  label,
  name,
  onChange,
  value,
}: {
  checked: boolean;
  label: string;
  name: string;
  onChange: (value: string) => void;
  value: string;
}) {
  return (
    <label
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        fontSize: "14px",
        cursor: "pointer",
      }}
    >
      <input
        checked={checked}
        name={name}
        onChange={() => onChange(value)}
        style={{ width: "16px", height: "16px", cursor: "pointer" }}
        type="radio"
        value={value}
      />
      {label}
    </label>
  );
}

function ProgramStatusGroup({
  label,
  name,
  onChange,
  value,
}: {
  label: string;
  name: string;
  onChange: (value: ProgramStatus) => void;
  value: ProgramStatus;
}) {
  const options: { value: ProgramStatus; label: string }[] = [
    { value: "established", label: "Established and documented" },
    { value: "partial", label: "Partially in place" },
    { value: "in_development", label: "In development" },
    { value: "none", label: "Not in place" },
  ];

  return (
    <Field label={label}>
      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        {options.map((opt) => (
          <Radio
            key={opt.value}
            checked={value === opt.value}
            label={opt.label}
            name={name}
            onChange={(v) => onChange(v as ProgramStatus)}
            value={opt.value}
          />
        ))}
      </div>
    </Field>
  );
}

const ENTITY_TYPE_OPTIONS: { value: ReportingEntityType; label: string }[] = [
  { value: "bank", label: "Bank (authorized domestic or foreign)" },
  { value: "credit_union", label: "Credit union / caisse populaire" },
  {
    value: "life_insurance",
    label: "Life insurance company, broker, or agent",
  },
  { value: "securities_dealer", label: "Securities dealer" },
  { value: "money_services_business", label: "Money services business (MSB)" },
  {
    value: "foreign_msb",
    label: "Foreign money services business (FMSB)",
  },
  {
    value: "real_estate",
    label: "Real estate developer, broker, or agent",
  },
  { value: "accountant", label: "Accountant / CPA firm" },
  { value: "dpms", label: "Dealer in precious metals and stones" },
  { value: "casino", label: "Casino" },
  { value: "bc_notary", label: "British Columbia notary" },
  { value: "other", label: "Other" },
];

const PROVINCE_OPTIONS = [
  { value: "", label: "Select province / territory" },
  { value: "AB", label: "Alberta" },
  { value: "BC", label: "British Columbia" },
  { value: "MB", label: "Manitoba" },
  { value: "NB", label: "New Brunswick" },
  { value: "NL", label: "Newfoundland and Labrador" },
  { value: "NS", label: "Nova Scotia" },
  { value: "NT", label: "Northwest Territories" },
  { value: "NU", label: "Nunavut" },
  { value: "ON", label: "Ontario" },
  { value: "PE", label: "Prince Edward Island" },
  { value: "QC", label: "Quebec" },
  { value: "SK", label: "Saskatchewan" },
  { value: "YT", label: "Yukon" },
];

const SERVICE_SCOPE_OPTIONS: { value: ServiceScope; label: string }[] = [
  { value: "unsure", label: "Unsure — guidance requested" },
  { value: "full_review", label: "Full effectiveness review" },
  {
    value: "gap_assessment",
    label: "Gap assessment against PCMLTFA requirements",
  },
  { value: "document_review", label: "Document review only" },
  { value: "targeted", label: "Targeted review of specific program elements" },
];

const sectionStyle = {
  display: "flex",
  flexDirection: "column" as const,
  gap: "16px",
};

const dividerStyle = {
  borderTop: "1px solid #e5e7eb",
  paddingTop: "16px",
  marginTop: "2px",
};

export function AssessmentExperience() {
  const [step, setStep] = useState(0);
  const [summary, setSummary] = useState<IntakeSummary | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const [orgProfile, setOrgProfile] = useState(
    INITIAL_INTAKE_ANSWERS.orgProfile,
  );
  const [reportingEntity, setReportingEntity] = useState(
    INITIAL_INTAKE_ANSWERS.reportingEntity,
  );
  const [complianceProgram, setComplianceProgram] = useState(
    INITIAL_INTAKE_ANSWERS.complianceProgram,
  );
  const [reportingProcesses, setReportingProcesses] = useState(
    INITIAL_INTAKE_ANSWERS.reportingProcesses,
  );
  const [priorExaminations, setPriorExaminations] = useState(
    INITIAL_INTAKE_ANSWERS.priorExaminations,
  );
  const [serviceScope, setServiceScope] = useState(
    INITIAL_INTAKE_ANSWERS.serviceScope,
  );

  useEffect(() => {
    if (window.parent === window) {
      return;
    }

    const postHeight = () => {
      const height = Math.max(
        document.body.scrollHeight,
        document.documentElement.scrollHeight,
      );

      window.parent.postMessage(
        {
          type: "fintrac:embed-resize",
          source: "fintrac-effectiveness-review",
          height,
        },
        "*",
      );
    };

    const scheduleResize = () => {
      window.requestAnimationFrame(postHeight);
    };

    const observer = new ResizeObserver(scheduleResize);
    observer.observe(document.body);
    observer.observe(document.documentElement);
    scheduleResize();
    window.addEventListener("load", scheduleResize);

    return () => {
      observer.disconnect();
      window.removeEventListener("load", scheduleResize);
    };
  }, []);

  const progress = ((step + 1) / STEPS.length) * 100;

  const updateOrgProfile = <Key extends keyof OrgProfileAnswers>(
    key: Key,
    value: OrgProfileAnswers[Key],
  ) => {
    setOrgProfile((current) => ({ ...current, [key]: value }));
  };

  const updateReportingEntity = <Key extends keyof ReportingEntityAnswers>(
    key: Key,
    value: ReportingEntityAnswers[Key],
  ) => {
    setReportingEntity((current) => ({ ...current, [key]: value }));
  };

  const updateComplianceProgram = <Key extends keyof ComplianceProgramAnswers>(
    key: Key,
    value: ComplianceProgramAnswers[Key],
  ) => {
    setComplianceProgram((current) => ({ ...current, [key]: value }));
  };

  const updateReportingProcesses = <
    Key extends keyof ReportingProcessAnswers,
  >(
    key: Key,
    value: ReportingProcessAnswers[Key],
  ) => {
    setReportingProcesses((current) => ({ ...current, [key]: value }));
  };

  const updatePriorExaminations = <Key extends keyof PriorExaminationAnswers>(
    key: Key,
    value: PriorExaminationAnswers[Key],
  ) => {
    setPriorExaminations((current) => ({ ...current, [key]: value }));
  };

  const updateServiceScope = <Key extends keyof ServiceScopeAnswers>(
    key: Key,
    value: ServiceScopeAnswers[Key],
  ) => {
    setServiceScope((current) => ({ ...current, [key]: value }));
  };

  const buildPayload = (): FintracIntakeAnswers => ({
    orgProfile,
    reportingEntity,
    complianceProgram,
    reportingProcesses,
    priorExaminations,
    serviceScope,
  });

  const submitIntake = async () => {
    setError(null);

    const response = await fetch("/api/assessment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(buildPayload()),
    });

    const data = (await response.json()) as ApiResponse | { error: string };

    if (!response.ok || "error" in data) {
      throw new Error(
        "error" in data ? data.error : "Unable to submit the intake.",
      );
    }

    setSummary(data.summary);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    startTransition(() => {
      void submitIntake().catch((submissionError) => {
        setError(
          submissionError instanceof Error
            ? submissionError.message
            : "Unable to submit the intake.",
        );
      });
    });
  };

  if (summary) {
    return (
      <div
        style={{
          fontFamily: "system-ui, sans-serif",
          maxWidth: "600px",
          margin: "0 auto",
          padding: "24px 20px",
        }}
      >
        <div style={{ marginBottom: "20px" }}>
          <p style={{ fontWeight: 600, fontSize: "15px", margin: "0 0 2px" }}>
            FINTRAC Effectiveness Review Intake
          </p>
          <p style={{ fontSize: "12px", color: "#6b7280", margin: 0 }}>
            Levine Legal Professional Corporation — confidential
          </p>
        </div>
        <div
          style={{
            background: "#f0fdf4",
            border: "1px solid #bbf7d0",
            borderRadius: "8px",
            padding: "14px 16px",
            marginBottom: "20px",
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: "14px",
              color: "#166534",
              fontWeight: 500,
            }}
          >
            ✓ Intake submitted successfully
          </p>
        </div>
        {Object.entries(summary).map(([section, fields]) => (
          <div key={section} style={{ marginBottom: "18px" }}>
            <p
              style={{
                fontWeight: 600,
                fontSize: "13px",
                color: "#374151",
                margin: "0 0 8px",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              {section}
            </p>
            <div
              style={{
                background: "#f9fafb",
                borderRadius: "6px",
                padding: "12px 14px",
                display: "flex",
                flexDirection: "column",
                gap: "6px",
              }}
            >
              {Object.entries(fields).map(([key, value]) => (
                <div
                  key={key}
                  style={{ display: "flex", gap: "8px", fontSize: "13px" }}
                >
                  <span
                    style={{
                      color: "#6b7280",
                      minWidth: "200px",
                      flexShrink: 0,
                    }}
                  >
                    {key}
                  </span>
                  <span style={{ color: "#111827", whiteSpace: "pre-wrap" }}>
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
        <p
          style={{
            fontSize: "13px",
            color: "#374151",
            fontStyle: "italic",
            marginTop: "24px",
            borderTop: "1px solid #e5e7eb",
            paddingTop: "16px",
          }}
        >
          Your information has been received. A member of our compliance team at
          Levine Legal Professional Corporation will review your file and be in
          touch with you shortly.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        fontFamily: "system-ui, sans-serif",
        maxWidth: "560px",
        margin: "0 auto",
        padding: "24px 20px",
      }}
    >
      <div style={{ marginBottom: "20px" }}>
        <p style={{ fontWeight: 600, fontSize: "15px", margin: "0 0 2px" }}>
          FINTRAC Effectiveness Review Intake
        </p>
        <p style={{ fontSize: "12px", color: "#6b7280", margin: 0 }}>
          Levine Legal Professional Corporation — confidential
        </p>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          marginBottom: "24px",
        }}
      >
        <span style={{ fontSize: "13px", color: "#6b7280", minWidth: "64px" }}>
          Step {step + 1} of {STEPS.length}
        </span>
        <div
          style={{
            flex: 1,
            height: "4px",
            background: "#e5e7eb",
            borderRadius: "4px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${progress}%`,
              background: "#1d4771",
              borderRadius: "4px",
            }}
          />
        </div>
      </div>

      <p style={{ fontSize: "13px", color: "#6b7280", margin: "0 0 16px" }}>
        {STEPS[step]}
      </p>

      {/* Step 0 — Organization Profile */}
      {step === 0 ? (
        <div style={sectionStyle}>
          <Field label="Organization legal name">
            <TextInput
              onChange={(value) => updateOrgProfile("orgName", value)}
              placeholder="ABC Financial Services Inc."
              value={orgProfile.orgName}
            />
          </Field>
          <Field label="Province / territory">
            <SelectInput
              onChange={(value) => updateOrgProfile("province", value)}
              options={PROVINCE_OPTIONS}
              value={orgProfile.province}
            />
          </Field>
          <div style={dividerStyle}>
            <p
              style={{
                fontSize: "12px",
                color: "#6b7280",
                margin: "0 0 12px",
                fontWeight: 500,
                textTransform: "uppercase",
                letterSpacing: "0.04em",
              }}
            >
              Primary contact
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "12px",
                }}
              >
                <Field label="Full name">
                  <TextInput
                    onChange={(value) =>
                      updateOrgProfile("contactName", value)
                    }
                    placeholder="Jane Smith"
                    value={orgProfile.contactName}
                  />
                </Field>
                <Field label="Title / role">
                  <TextInput
                    onChange={(value) =>
                      updateOrgProfile("contactTitle", value)
                    }
                    placeholder="Chief Compliance Officer"
                    value={orgProfile.contactTitle}
                  />
                </Field>
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "12px",
                }}
              >
                <Field label="Phone">
                  <TextInput
                    onChange={(value) => updateOrgProfile("phone", value)}
                    placeholder="416-555-0100"
                    value={orgProfile.phone}
                  />
                </Field>
                <Field label="Email">
                  <TextInput
                    onChange={(value) => updateOrgProfile("email", value)}
                    placeholder="jane@example.com"
                    type="email"
                    value={orgProfile.email}
                  />
                </Field>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {/* Step 1 — Reporting Entity & Registration */}
      {step === 1 ? (
        <div style={sectionStyle}>
          <Field label="Reporting entity type">
            <SelectInput
              onChange={(value) =>
                updateReportingEntity(
                  "entityType",
                  value as ReportingEntityType,
                )
              }
              options={ENTITY_TYPE_OPTIONS}
              value={reportingEntity.entityType}
            />
          </Field>
          {reportingEntity.entityType === "other" ? (
            <Field label="Describe your entity type">
              <TextInput
                onChange={(value) =>
                  updateReportingEntity("entityTypeOther", value)
                }
                placeholder="e.g. Mortgage broker, cheque casher"
                value={reportingEntity.entityTypeOther}
              />
            </Field>
          ) : null}
          <Field label="FINTRAC registration status">
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              {(
                [
                  { value: "registered", label: "Registered with FINTRAC" },
                  { value: "not_required", label: "Registration not required for this entity type" },
                  { value: "pending", label: "Registration pending" },
                  { value: "unsure", label: "Not sure" },
                ] as { value: FintracRegistrationStatus; label: string }[]
              ).map((opt) => (
                <Radio
                  key={opt.value}
                  checked={reportingEntity.registrationStatus === opt.value}
                  label={opt.label}
                  name="registrationStatus"
                  onChange={(v) =>
                    updateReportingEntity(
                      "registrationStatus",
                      v as FintracRegistrationStatus,
                    )
                  }
                  value={opt.value}
                />
              ))}
            </div>
          </Field>
          {reportingEntity.registrationStatus === "registered" ? (
            <Field label="FINTRAC registration number">
              <TextInput
                onChange={(value) =>
                  updateReportingEntity("registrationNumber", value)
                }
                placeholder="e.g. M12345678"
                value={reportingEntity.registrationNumber}
              />
            </Field>
          ) : null}
          <div style={dividerStyle}>
            <p
              style={{
                fontSize: "12px",
                color: "#6b7280",
                margin: "0 0 12px",
                fontWeight: 500,
                textTransform: "uppercase",
                letterSpacing: "0.04em",
              }}
            >
              Compliance officer (if different from primary contact)
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "12px",
                }}
              >
                <Field label="Full name">
                  <TextInput
                    onChange={(value) =>
                      updateReportingEntity("coName", value)
                    }
                    placeholder="John Lee"
                    value={reportingEntity.coName}
                  />
                </Field>
                <Field label="Title">
                  <TextInput
                    onChange={(value) =>
                      updateReportingEntity("coTitle", value)
                    }
                    placeholder="Chief Compliance Officer"
                    value={reportingEntity.coTitle}
                  />
                </Field>
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "12px",
                }}
              >
                <Field label="Phone">
                  <TextInput
                    onChange={(value) =>
                      updateReportingEntity("coPhone", value)
                    }
                    placeholder="416-555-0200"
                    value={reportingEntity.coPhone}
                  />
                </Field>
                <Field label="Email">
                  <TextInput
                    onChange={(value) =>
                      updateReportingEntity("coEmail", value)
                    }
                    placeholder="compliance@example.com"
                    value={reportingEntity.coEmail}
                  />
                </Field>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {/* Step 2 — Compliance Program */}
      {step === 2 ? (
        <div style={sectionStyle}>
          <ProgramStatusGroup
            label="Policies and procedures"
            name="policiesStatus"
            onChange={(value) =>
              updateComplianceProgram("policiesStatus", value)
            }
            value={complianceProgram.policiesStatus}
          />
          <Field label="Date of last policy review (approximate)">
            <TextInput
              onChange={(value) =>
                updateComplianceProgram("lastPolicyReview", value)
              }
              placeholder="e.g. Q4 2024"
              value={complianceProgram.lastPolicyReview}
            />
          </Field>
          <div style={dividerStyle}>
            <ProgramStatusGroup
              label="Risk assessment"
              name="riskAssessmentStatus"
              onChange={(value) =>
                updateComplianceProgram("riskAssessmentStatus", value)
              }
              value={complianceProgram.riskAssessmentStatus}
            />
          </div>
          <div style={dividerStyle}>
            <ProgramStatusGroup
              label="Training program"
              name="trainingStatus"
              onChange={(value) =>
                updateComplianceProgram("trainingStatus", value)
              }
              value={complianceProgram.trainingStatus}
            />
          </div>
          <div style={dividerStyle}>
            <ProgramStatusGroup
              label="Ongoing monitoring"
              name="monitoringStatus"
              onChange={(value) =>
                updateComplianceProgram("monitoringStatus", value)
              }
              value={complianceProgram.monitoringStatus}
            />
          </div>
          <Field label="Additional notes about your compliance program">
            <TextArea
              onChange={(value) =>
                updateComplianceProgram("programNotes", value)
              }
              placeholder="Any context that would help us understand the current state of the program..."
              rows={3}
              value={complianceProgram.programNotes}
            />
          </Field>
        </div>
      ) : null}

      {/* Step 3 — Reporting & Recordkeeping */}
      {step === 3 ? (
        <div style={sectionStyle}>
          <div>
            <p style={{ ...labelStyle, marginBottom: "10px" }}>
              Which transaction reports does your organization file with
              FINTRAC?
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <Checkbox
                checked={reportingProcesses.filesStrs}
                label="Suspicious transaction reports (STRs)"
                onChange={(value) =>
                  updateReportingProcesses("filesStrs", value)
                }
              />
              <Checkbox
                checked={reportingProcesses.filesLctrs}
                label="Large cash transaction reports (LCTRs)"
                onChange={(value) =>
                  updateReportingProcesses("filesLctrs", value)
                }
              />
              <Checkbox
                checked={reportingProcesses.filesEftrs}
                label="Electronic funds transfer reports (EFTRs)"
                onChange={(value) =>
                  updateReportingProcesses("filesEftrs", value)
                }
              />
            </div>
          </div>
          <Field label="Other reports filed (if any)">
            <TextInput
              onChange={(value) =>
                updateReportingProcesses("otherReports", value)
              }
              placeholder="e.g. Casino disbursement reports, virtual currency reports"
              value={reportingProcesses.otherReports}
            />
          </Field>
          <div style={dividerStyle}>
            <Field label="Notes on your current reporting processes">
              <TextArea
                onChange={(value) =>
                  updateReportingProcesses("reportingNotes", value)
                }
                placeholder="How are reports identified, reviewed, and submitted? Any known gaps?"
                rows={3}
                value={reportingProcesses.reportingNotes}
              />
            </Field>
          </div>
          <Field label="Notes on your recordkeeping processes">
            <TextArea
              onChange={(value) =>
                updateReportingProcesses("recordkeepingNotes", value)
              }
              placeholder="How are transaction records and client identification documents retained?"
              rows={3}
              value={reportingProcesses.recordkeepingNotes}
            />
          </Field>
        </div>
      ) : null}

      {/* Step 4 — Prior Examinations */}
      {step === 4 ? (
        <div style={sectionStyle}>
          <Field label="Prior FINTRAC examination history">
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              {(
                [
                  { value: "none", label: "No prior FINTRAC examination" },
                  {
                    value: "examined_no_findings",
                    label: "Examined — no material findings",
                  },
                  {
                    value: "examined_with_findings",
                    label: "Examined — findings or compliance orders issued",
                  },
                  {
                    value: "examination_pending",
                    label: "Examination pending or recently notified",
                  },
                ] as { value: PriorExaminationStatus; label: string }[]
              ).map((opt) => (
                <Radio
                  key={opt.value}
                  checked={priorExaminations.examinationStatus === opt.value}
                  label={opt.label}
                  name="examinationStatus"
                  onChange={(v) =>
                    updatePriorExaminations(
                      "examinationStatus",
                      v as PriorExaminationStatus,
                    )
                  }
                  value={opt.value}
                />
              ))}
            </div>
          </Field>
          {priorExaminations.examinationStatus !== "none" ? (
            <Field label="Date of last examination (approximate)">
              <TextInput
                onChange={(value) =>
                  updatePriorExaminations("lastExamDate", value)
                }
                placeholder="e.g. March 2023"
                value={priorExaminations.lastExamDate}
              />
            </Field>
          ) : null}
          {priorExaminations.examinationStatus ===
          "examined_with_findings" ? (
            <>
              <Field label="Brief summary of findings or orders">
                <TextArea
                  onChange={(value) =>
                    updatePriorExaminations("findingsSummary", value)
                  }
                  placeholder="Describe the nature of findings, any compliance orders, or administrative monetary penalties..."
                  rows={4}
                  value={priorExaminations.findingsSummary}
                />
              </Field>
              <Field label="Current remediation status">
                <TextArea
                  onChange={(value) =>
                    updatePriorExaminations("remediationStatus", value)
                  }
                  placeholder="What steps have been taken to address findings? What remains outstanding?"
                  rows={3}
                  value={priorExaminations.remediationStatus}
                />
              </Field>
            </>
          ) : null}
          {priorExaminations.examinationStatus === "examination_pending" ? (
            <Field label="What do you know about the pending examination?">
              <TextArea
                onChange={(value) =>
                  updatePriorExaminations("findingsSummary", value)
                }
                placeholder="Timeline, scope, any correspondence received from FINTRAC..."
                rows={3}
                value={priorExaminations.findingsSummary}
              />
            </Field>
          ) : null}
        </div>
      ) : null}

      {/* Step 5 — Scope & Timing */}
      {step === 5 ? (
        <div style={sectionStyle}>
          <Field label="Documents and records available for review">
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              {(
                [
                  {
                    value: "available",
                    label: "Available and ready to provide",
                  },
                  {
                    value: "partial",
                    label: "Partially available — some documents to be located",
                  },
                  {
                    value: "not_available",
                    label: "Not currently available",
                  },
                  { value: "unsure", label: "Not sure yet" },
                ] as { value: DocumentAvailability; label: string }[]
              ).map((opt) => (
                <Radio
                  key={opt.value}
                  checked={serviceScope.documentsAvailable === opt.value}
                  label={opt.label}
                  name="documentsAvailable"
                  onChange={(v) =>
                    updateServiceScope(
                      "documentsAvailable",
                      v as DocumentAvailability,
                    )
                  }
                  value={opt.value}
                />
              ))}
            </div>
          </Field>
          <div style={dividerStyle}>
            <Field label="Urgency">
              <div
                style={{ display: "flex", flexDirection: "column", gap: "6px" }}
              >
                {(
                  [
                    {
                      value: "standard",
                      label: "Standard — no urgent deadline",
                    },
                    { value: "moderate", label: "Moderate — within 60 days" },
                    { value: "urgent", label: "Urgent — within 30 days" },
                    {
                      value: "critical",
                      label:
                        "Critical — within 2 weeks or examination pending",
                    },
                  ] as { value: UrgencyLevel; label: string }[]
                ).map((opt) => (
                  <Radio
                    key={opt.value}
                    checked={serviceScope.urgency === opt.value}
                    label={opt.label}
                    name="urgency"
                    onChange={(v) =>
                      updateServiceScope("urgency", v as UrgencyLevel)
                    }
                    value={opt.value}
                  />
                ))}
              </div>
            </Field>
          </div>
          <Field label="Target completion date (if known)">
            <TextInput
              onChange={(value) => updateServiceScope("targetDate", value)}
              placeholder="e.g. September 2026"
              value={serviceScope.targetDate}
            />
          </Field>
          <Field label="Preferred scope of service">
            <SelectInput
              onChange={(value) =>
                updateServiceScope("preferredScope", value as ServiceScope)
              }
              options={SERVICE_SCOPE_OPTIONS}
              value={serviceScope.preferredScope}
            />
          </Field>
          <Field label="Anything else you would like us to know">
            <TextArea
              onChange={(value) =>
                updateServiceScope("additionalNotes", value)
              }
              placeholder="Additional context, specific areas of concern, questions for our team..."
              rows={4}
              value={serviceScope.additionalNotes}
            />
          </Field>
        </div>
      ) : null}

      {error ? (
        <div
          style={{
            marginTop: "20px",
            borderRadius: "8px",
            border: "1px solid #fecaca",
            background: "#fef2f2",
            color: "#b91c1c",
            padding: "12px 14px",
            fontSize: "13px",
          }}
        >
          {error}
        </div>
      ) : null}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "28px",
        }}
      >
        <button
          disabled={isPending || step === 0}
          onClick={() => setStep((current) => Math.max(0, current - 1))}
          style={{
            visibility: step === 0 ? "hidden" : "visible",
            padding: "8px 18px",
            borderRadius: "6px",
            border: "1px solid #d1d5db",
            background: "#fff",
            fontSize: "14px",
            cursor: "pointer",
            color: "#374151",
          }}
          type="button"
        >
          Back
        </button>
        {step < STEPS.length - 1 ? (
          <button
            disabled={isPending}
            onClick={() =>
              setStep((current) => Math.min(STEPS.length - 1, current + 1))
            }
            style={{
              padding: "8px 18px",
              borderRadius: "6px",
              border: "none",
              background: "#1d4771",
              color: "#fff",
              fontSize: "14px",
              cursor: "pointer",
              fontWeight: 500,
            }}
            type="button"
          >
            Next →
          </button>
        ) : (
          <button
            disabled={isPending}
            style={{
              padding: "8px 18px",
              borderRadius: "6px",
              border: "none",
              background: "#16a34a",
              color: "#fff",
              fontSize: "14px",
              cursor: "pointer",
              fontWeight: 500,
            }}
            type="submit"
          >
            {isPending ? "Submitting..." : "Submit ↗"}
          </button>
        )}
      </div>
    </form>
  );
}

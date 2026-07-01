"use client";

import {
  CONTACT_ROLE_OPTIONS,
  ENTITY_TYPE_LABELS,
  INITIAL_INTAKE_ANSWERS,
  ORG_SIZE_OPTIONS,
  STAGE_1_STEP_COUNT,
  STEPS,
  TRIGGER_REASON_LABELS,
  URGENCY_LABELS,
} from "@/lib/intake";
import type {
  ComplianceProgramAnswers,
  DocumentAvailability,
  FintracIntakeAnswers,
  IntakeSummary,
  OrgProfileAnswers,
  PriorExaminationAnswers,
  PriorExaminationStatus,
  ProgramStatus,
  ReportingEntityType,
  ServiceScopeAnswers,
  SituationAnswers,
  TimingAnswers,
  TriggerReason,
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
        alignItems: "flex-start",
        gap: "8px",
        fontSize: "14px",
        cursor: "pointer",
      }}
    >
      <input
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        style={{ width: "16px", height: "16px", marginTop: "2px", cursor: "pointer", flexShrink: 0 }}
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

const ENTITY_TYPE_OPTIONS: { value: ReportingEntityType; label: string }[] =
  Object.entries(ENTITY_TYPE_LABELS).map(([value, label]) => ({
    value: value as ReportingEntityType,
    label,
  }));

const TRIGGER_REASONS = Object.keys(
  TRIGGER_REASON_LABELS,
) as TriggerReason[];


export function AssessmentExperience() {
  const [step, setStep] = useState(0);
  const [inStage2, setInStage2] = useState(false);
  const [summary, setSummary] = useState<IntakeSummary | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const [orgProfile, setOrgProfile] = useState<OrgProfileAnswers>(
    INITIAL_INTAKE_ANSWERS.orgProfile,
  );
  const [situation, setSituation] = useState<SituationAnswers>(
    INITIAL_INTAKE_ANSWERS.situation,
  );
  const [timing, setTiming] = useState<TimingAnswers>(
    INITIAL_INTAKE_ANSWERS.timing,
  );
  const [complianceProgram, setComplianceProgram] =
    useState<ComplianceProgramAnswers>(
      INITIAL_INTAKE_ANSWERS.complianceProgram,
    );
  const [priorExaminations, setPriorExaminations] =
    useState<PriorExaminationAnswers>(INITIAL_INTAKE_ANSWERS.priorExaminations);
  const [serviceScope, setServiceScope] = useState<ServiceScopeAnswers>(
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

  const stageStepCount = inStage2
    ? STEPS.length
    : STAGE_1_STEP_COUNT;
  const progress = ((step + 1) / stageStepCount) * 100;

  const buildPayload = (completedStage2: boolean): FintracIntakeAnswers => ({
    orgProfile,
    situation,
    timing,
    completedStage2,
    complianceProgram,
    priorExaminations,
    serviceScope,
  });

  const submitIntake = async (completedStage2: boolean) => {
    setError(null);

    const response = await fetch("/api/assessment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(buildPayload(completedStage2)),
    });

    const data = (await response.json()) as ApiResponse | { error: string };

    if (!response.ok || "error" in data) {
      throw new Error(
        "error" in data ? data.error : "Unable to submit the intake.",
      );
    }

    setSummary(data.summary);
  };

  const handleSubmit = (completedStage2: boolean) => {
    startTransition(() => {
      void submitIntake(completedStage2).catch((submissionError) => {
        setError(
          submissionError instanceof Error
            ? submissionError.message
            : "Unable to submit the intake.",
        );
      });
    });
  };

  const handleEnterStage2 = () => {
    setInStage2(true);
    setStep(STAGE_1_STEP_COUNT);
  };

  const toggleTrigger = (reason: TriggerReason) => {
    setSituation((current) => ({
      ...current,
      triggers: current.triggers.includes(reason)
        ? current.triggers.filter((t) => t !== reason)
        : [...current.triggers, reason],
    }));
  };

  const isLastStep = step === STEPS.length - 1;
  const isStage1Final = step === STAGE_1_STEP_COUNT - 1;

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
          <p
            style={{
              fontWeight: 600,
              fontSize: "15px",
              margin: "0 0 2px",
              color: "#1d4771",
            }}
          >
            FINTRAC Effectiveness Review
          </p>
          <p style={{ fontSize: "12px", color: "#6b7280", margin: 0 }}>
            Levine Law — confidential
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
            ✓ Submitted successfully
          </p>
        </div>
        {Object.entries(summary).map(([section, fields]) => (
          <div key={section} style={{ marginBottom: "18px" }}>
            <p
              style={{
                fontWeight: 600,
                fontSize: "13px",
                color: "#1d4771",
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
                      minWidth: "180px",
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
          Levine Law will review your file and be in touch with you shortly.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit(isLastStep);
      }}
      style={{
        fontFamily: "system-ui, sans-serif",
        maxWidth: "560px",
        margin: "0 auto",
        padding: "24px 20px",
      }}
    >
      <div style={{ marginBottom: "20px" }}>
        <p
          style={{
            fontWeight: 600,
            fontSize: "15px",
            margin: "0 0 2px",
            color: "#1d4771",
          }}
        >
          FINTRAC Effectiveness Review
        </p>
        <p style={{ fontSize: "12px", color: "#6b7280", margin: 0 }}>
          Levine Law — confidential
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
        <span style={{ fontSize: "13px", color: "#6b7280", minWidth: "72px" }}>
          {inStage2
            ? `Step ${step + 1} of ${STEPS.length}`
            : `Step ${step + 1} of ${STAGE_1_STEP_COUNT}`}
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

      <p
        style={{
          fontSize: "13px",
          fontWeight: 600,
          color: "#1d4771",
          margin: "0 0 16px",
          textTransform: "uppercase",
          letterSpacing: "0.05em",
        }}
      >
        {STEPS[step]}
      </p>

      {inStage2 ? (
        <p style={{ fontSize: "12px", color: "#6b7280", margin: "-8px 0 16px", fontStyle: "italic" }}>
          Optional — helps us arrive at our first conversation better prepared.
          You can go back and submit at any time.
        </p>
      ) : null}

      {/* Step 0 — Getting Started */}
      {step === 0 ? (
        <div style={sectionStyle}>
          <Field label="Organization name">
            <TextInput
              onChange={(value) =>
                setOrgProfile((c) => ({ ...c, orgName: value }))
              }
              placeholder="ABC Financial Services Inc."
              value={orgProfile.orgName}
            />
          </Field>
          <Field label="Your role">
            <SelectInput
              onChange={(value) =>
                setOrgProfile((c) => ({ ...c, contactRole: value }))
              }
              options={CONTACT_ROLE_OPTIONS}
              value={orgProfile.contactRole}
            />
          </Field>
          <Field label="Organization size">
            <SelectInput
              onChange={(value) =>
                setOrgProfile((c) => ({ ...c, orgSize: value }))
              }
              options={ORG_SIZE_OPTIONS}
              value={orgProfile.orgSize}
            />
          </Field>
          <Field label="Entity type under PCMLTFA">
            <SelectInput
              onChange={(value) =>
                setSituation((c) => ({
                  ...c,
                  entityType: value as ReportingEntityType,
                }))
              }
              options={ENTITY_TYPE_OPTIONS}
              value={situation.entityType}
            />
          </Field>
          {situation.entityType === "other" ? (
            <Field label="Describe your entity type">
              <TextInput
                onChange={(value) =>
                  setSituation((c) => ({ ...c, entityTypeOther: value }))
                }
                placeholder="e.g. Mortgage broker, cheque casher"
                value={situation.entityTypeOther}
              />
            </Field>
          ) : null}
        </div>
      ) : null}

      {/* Step 1 — Your Situation */}
      {step === 1 ? (
        <div style={sectionStyle}>
          <div>
            <p style={{ ...labelStyle, marginBottom: "10px" }}>
              What&apos;s prompting you to reach out? (select all that apply)
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {TRIGGER_REASONS.map((reason) => (
                <Checkbox
                  key={reason}
                  checked={situation.triggers.includes(reason)}
                  label={TRIGGER_REASON_LABELS[reason]}
                  onChange={() => toggleTrigger(reason)}
                />
              ))}
            </div>
          </div>
          <Field label="Tell us more (optional)">
            <TextArea
              onChange={(value) =>
                setSituation((c) => ({ ...c, triggerNotes: value }))
              }
              placeholder="Any context that would help us understand your situation..."
              rows={3}
              value={situation.triggerNotes}
            />
          </Field>
          <div style={dividerStyle}>
            <Field label="How soon do you need support?">
              <div
                style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "4px" }}
              >
                {(
                  [
                    { value: "standard", label: URGENCY_LABELS.standard },
                    { value: "moderate", label: URGENCY_LABELS.moderate },
                    { value: "urgent", label: URGENCY_LABELS.urgent },
                    { value: "critical", label: URGENCY_LABELS.critical },
                  ] as { value: UrgencyLevel; label: string }[]
                ).map((opt) => (
                  <Radio
                    key={opt.value}
                    checked={timing.urgency === opt.value}
                    label={opt.label}
                    name="urgency"
                    onChange={(v) =>
                      setTiming((c) => ({ ...c, urgency: v as UrgencyLevel }))
                    }
                    value={opt.value}
                  />
                ))}
              </div>
            </Field>
          </div>
          <Field label="What outcome would make this a success for you? (optional)">
            <TextArea
              onChange={(value) =>
                setTiming((c) => ({ ...c, successOutcome: value }))
              }
              placeholder="e.g. I want to go into an exam knowing we're clean. I need to show the board we've addressed our gaps..."
              rows={3}
              value={timing.successOutcome}
            />
          </Field>
        </div>
      ) : null}

      {/* Step 2 — Compliance Program (Stage 2) */}
      {step === 2 ? (
        <div style={sectionStyle}>
          <ProgramStatusGroup
            label="Policies and procedures"
            name="policiesStatus"
            onChange={(value) =>
              setComplianceProgram((c) => ({ ...c, policiesStatus: value }))
            }
            value={complianceProgram.policiesStatus}
          />
          <Field label="Date of last policy review (approximate)">
            <TextInput
              onChange={(value) =>
                setComplianceProgram((c) => ({ ...c, lastPolicyReview: value }))
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
                setComplianceProgram((c) => ({
                  ...c,
                  riskAssessmentStatus: value,
                }))
              }
              value={complianceProgram.riskAssessmentStatus}
            />
          </div>
          <div style={dividerStyle}>
            <ProgramStatusGroup
              label="Training program"
              name="trainingStatus"
              onChange={(value) =>
                setComplianceProgram((c) => ({ ...c, trainingStatus: value }))
              }
              value={complianceProgram.trainingStatus}
            />
          </div>
          <div style={dividerStyle}>
            <ProgramStatusGroup
              label="Ongoing monitoring"
              name="monitoringStatus"
              onChange={(value) =>
                setComplianceProgram((c) => ({ ...c, monitoringStatus: value }))
              }
              value={complianceProgram.monitoringStatus}
            />
          </div>
          <Field label="Anything else about your compliance program? (optional)">
            <TextArea
              onChange={(value) =>
                setComplianceProgram((c) => ({ ...c, programNotes: value }))
              }
              placeholder="Any context about gaps, recent changes, or areas of concern..."
              rows={3}
              value={complianceProgram.programNotes}
            />
          </Field>
        </div>
      ) : null}

      {/* Step 3 — Prior FINTRAC Contact (Stage 2) */}
      {step === 3 ? (
        <div style={sectionStyle}>
          <Field label="Prior FINTRAC examination history">
            <div
              style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "4px" }}
            >
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
                    setPriorExaminations((c) => ({
                      ...c,
                      examinationStatus: v as PriorExaminationStatus,
                    }))
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
                  setPriorExaminations((c) => ({ ...c, lastExamDate: value }))
                }
                placeholder="e.g. March 2023"
                value={priorExaminations.lastExamDate}
              />
            </Field>
          ) : null}
          {priorExaminations.examinationStatus === "examined_with_findings" ? (
            <>
              <Field label="Brief summary of findings or orders">
                <TextArea
                  onChange={(value) =>
                    setPriorExaminations((c) => ({
                      ...c,
                      findingsSummary: value,
                    }))
                  }
                  placeholder="Describe the nature of findings, any compliance orders, or administrative monetary penalties..."
                  rows={4}
                  value={priorExaminations.findingsSummary}
                />
              </Field>
              <Field label="Current remediation status">
                <TextArea
                  onChange={(value) =>
                    setPriorExaminations((c) => ({
                      ...c,
                      remediationStatus: value,
                    }))
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
                  setPriorExaminations((c) => ({
                    ...c,
                    findingsSummary: value,
                  }))
                }
                placeholder="Timeline, scope, any correspondence received from FINTRAC..."
                rows={3}
                value={priorExaminations.findingsSummary}
              />
            </Field>
          ) : null}
        </div>
      ) : null}

      {/* Step 4 — Scope & Documents (Stage 2) */}
      {step === 4 ? (
        <div style={sectionStyle}>
          <Field label="Documents and records available for review">
            <div
              style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "4px" }}
            >
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
                    setServiceScope((c) => ({
                      ...c,
                      documentsAvailable: v as DocumentAvailability,
                    }))
                  }
                  value={opt.value}
                />
              ))}
            </div>
          </Field>
          <Field label="Target completion date (if known)">
            <TextInput
              onChange={(value) =>
                setServiceScope((c) => ({ ...c, targetDate: value }))
              }
              placeholder="e.g. September 2026"
              value={serviceScope.targetDate}
            />
          </Field>
          <Field label="What part of your program concerns you most? (optional)">
            <TextArea
              onChange={(value) =>
                setServiceScope((c) => ({ ...c, programConcerns: value }))
              }
              placeholder="e.g. Our risk assessment hasn't been updated in years. We're unsure about our STR filing obligations..."
              rows={3}
              value={serviceScope.programConcerns}
            />
          </Field>
          <Field label="Anything else you'd like us to know (optional)">
            <TextArea
              onChange={(value) =>
                setServiceScope((c) => ({ ...c, additionalNotes: value }))
              }
              placeholder="Additional context, questions for our team..."
              rows={3}
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
          alignItems: "center",
          marginTop: "28px",
        }}
      >
        {/* Back button */}
        <button
          disabled={isPending || step === 0}
          onClick={() =>
            setStep((current) => {
              const prev = Math.max(0, current - 1);
              if (current === STAGE_1_STEP_COUNT) setInStage2(false);
              return prev;
            })
          }
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

        {/* Right-side nav */}
        <div style={{ display: "flex", gap: "8px" }}>
          {/* Stage 1 final step: Submit + Add more detail */}
          {isStage1Final && !inStage2 ? (
            <>
              <button
                disabled={isPending}
                onClick={() => handleSubmit(false)}
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
                type="button"
              >
                {isPending ? "Submitting..." : "Submit ↗"}
              </button>
              <button
                disabled={isPending}
                onClick={handleEnterStage2}
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
                Add more detail →
              </button>
            </>
          ) : isLastStep ? (
            /* Stage 2 final step: Submit */
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
          ) : (
            /* All other steps: Next */
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
          )}
        </div>
      </div>
    </form>
  );
}

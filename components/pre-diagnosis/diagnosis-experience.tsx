"use client";

import { useEffect, useRef, useState } from "react";
import {
  CANADIAN_PROVINCES,
  DIAGNOSIS_QUESTIONS,
  EMPLOYEE_COUNT_OPTIONS,
  MSB_ACTIVITY_OPTIONS,
  PILLAR_DESCRIPTIONS,
  PILLAR_LABELS,
  PILLAR_ORDER,
  getRegistrationYears,
} from "@/lib/pre-diagnosis/questions";
import { ENTITY_TYPE_LABELS } from "@/lib/intake";
import type { DiagnosisPillar, EmployeeCount, MsbActivity } from "@/lib/pre-diagnosis/types";

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

const ENTITY_TYPE_OPTIONS = Object.entries(ENTITY_TYPE_LABELS).map(
  ([value, label]) => ({ value, label }),
);

const REGISTRATION_YEAR_OPTIONS = getRegistrationYears().map((y) => ({ value: y, label: y }));

function Field({ children, label }: { children: React.ReactNode; label: string }) {
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
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      style={inputStyle}
      type={type}
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
      onChange={(e) => onChange(e.target.value)}
      style={{ ...inputStyle, appearance: "auto" as const }}
      value={value}
    >
      <option value="">Select…</option>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}

function CheckboxGroup<T extends string>({
  label,
  options,
  selected,
  onChange,
}: {
  label: string;
  options: { value: T; label: string }[];
  selected: T[];
  onChange: (values: T[]) => void;
}) {
  const toggle = (value: T) => {
    if (selected.includes(value)) {
      onChange(selected.filter((v) => v !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
      <span style={labelStyle}>{label}</span>
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {options.map((opt) => (
          <label
            key={opt.value}
            style={{ display: "flex", alignItems: "flex-start", gap: "8px", fontSize: "14px", cursor: "pointer" }}
          >
            <input
              type="checkbox"
              checked={selected.includes(opt.value)}
              onChange={() => toggle(opt.value)}
              style={{ width: "16px", height: "16px", marginTop: "2px", cursor: "pointer", flexShrink: 0 }}
            />
            {opt.label}
          </label>
        ))}
      </div>
    </div>
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
        alignItems: "flex-start",
        gap: "8px",
        fontSize: "14px",
        cursor: "pointer",
      }}
    >
      <input
        checked={checked}
        name={name}
        onChange={() => onChange(value)}
        style={{ width: "16px", height: "16px", marginTop: "2px", cursor: "pointer", flexShrink: 0 }}
        type="radio"
        value={value}
      />
      {label}
    </label>
  );
}

function StepHeading({ label }: { label: string }) {
  return (
    <p
      style={{
        fontSize: "13px",
        fontWeight: 600,
        color: "#1d4771",
        textTransform: "uppercase" as const,
        letterSpacing: "0.05em",
        margin: 0,
      }}
    >
      {label}
    </p>
  );
}

// Steps: 0=contact, 1=business profile, 2=regulatory profile, 3-7=pillars
const TOTAL_STEPS = 8;
const PILLAR_STEP_OFFSET = 3;

export function DiagnosisExperience() {
  const containerRef = useRef<HTMLDivElement>(null);

  const [step, setStep] = useState(0);

  // Step 0 — contact info
  const [orgName, setOrgName] = useState("");
  const [entityType, setEntityType] = useState("");
  const [contactEmail, setContactEmail] = useState("");

  // Step 1 — business profile
  const [registrationYear, setRegistrationYear] = useState("");
  const [operatingProvinces, setOperatingProvinces] = useState<string[]>([]);
  const [employeeCount, setEmployeeCount] = useState<EmployeeCount | "">("");

  // Step 2 — regulatory profile
  const [msbActivities, setMsbActivities] = useState<MsbActivity[]>([]);
  const [fintracRegisteredActivities, setFintracRegisteredActivities] = useState<MsbActivity[]>([]);

  // Steps 3–7 — pillar answers
  const [answers, setAnswers] = useState<Record<string, number>>({});

  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const postHeight = () => {
      const height = Math.max(
        document.body.scrollHeight,
        document.documentElement.scrollHeight,
      );
      window.parent.postMessage(
        { type: "fintrac:embed-resize", source: "fintrac-effectiveness-review", height },
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

  const setAnswer = (questionId: string, value: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const currentPillar: DiagnosisPillar | null =
    step >= PILLAR_STEP_OFFSET && step < PILLAR_STEP_OFFSET + 5
      ? PILLAR_ORDER[step - PILLAR_STEP_OFFSET]
      : null;

  const currentQuestions = currentPillar
    ? DIAGNOSIS_QUESTIONS.filter((q) => q.pillar === currentPillar)
    : [];

  const canAdvance = (): boolean => {
    if (step === 0) {
      return orgName.trim() !== "" && entityType !== "" && contactEmail.trim() !== "";
    }
    if (step === 1) {
      return registrationYear !== "" && operatingProvinces.length > 0 && employeeCount !== "";
    }
    if (step === 2) {
      return true; // MSB fields are optional — non-MSBs can leave them empty
    }
    if (currentPillar) {
      return currentQuestions.every((q) => answers[q.id] !== undefined);
    }
    return false;
  };

  const handleNext = () => {
    if (step < TOTAL_STEPS - 1) {
      setStep((s) => s + 1);
      window.scrollTo({ top: 0 });
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep((s) => s - 1);
      window.scrollTo({ top: 0 });
    }
  };

  const handleSubmit = async () => {
    setIsPending(true);
    setError(null);

    try {
      const response = await fetch("/api/pre-diagnosis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orgName,
          entityType,
          contactEmail,
          registrationYear,
          operatingProvinces,
          employeeCount,
          msbActivities,
          fintracRegisteredActivities,
          answers,
        }),
      });

      const data = (await response.json()) as { token?: string; error?: string };

      if (!response.ok || !data.token) {
        throw new Error(data.error ?? "Something went wrong. Please try again.");
      }

      window.location.href = `/pre-diagnosis/results/${data.token}`;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setIsPending(false);
    }
  };

  const isLastStep = step === TOTAL_STEPS - 1;
  const progress = ((step + 1) / TOTAL_STEPS) * 100;

  return (
    <div
      ref={containerRef}
      style={{
        fontFamily: "system-ui, sans-serif",
        maxWidth: "560px",
        margin: "0 auto",
        padding: "24px 20px",
        color: "#111827",
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: "20px" }}>
        <p style={{ fontSize: "15px", fontWeight: 600, color: "#1d4771", margin: "0 0 4px" }}>
          AML Compliance Health Check
        </p>
        <p style={{ fontSize: "13px", color: "#6b7280", margin: "0 0 12px" }}>
          Step {step + 1} of {TOTAL_STEPS}
        </p>
        <div style={{ height: "4px", borderRadius: "6px", background: "#e5e7eb", overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${progress}%`, background: "#1d4771", borderRadius: "6px" }} />
        </div>
      </div>

      {/* Step 0: Contact info */}
      {step === 0 && (
        <div style={sectionStyle}>
          <StepHeading label="About Your Organization" />
          <Field label="Organization name">
            <TextInput value={orgName} onChange={setOrgName} placeholder="Acme Financial Inc." />
          </Field>
          <Field label="Entity type">
            <SelectInput value={entityType} onChange={setEntityType} options={ENTITY_TYPE_OPTIONS} />
          </Field>
          <Field label="Your email address">
            <TextInput type="email" value={contactEmail} onChange={setContactEmail} placeholder="you@example.com" />
          </Field>
          <p style={{ fontSize: "12px", color: "#6b7280", margin: 0 }}>
            Your results will be available at a private link immediately after submission. No account required.
          </p>
        </div>
      )}

      {/* Step 1: Business profile */}
      {step === 1 && (
        <div style={sectionStyle}>
          <StepHeading label="Business Profile" />
          <Field label="Year registered / incorporated">
            <SelectInput
              value={registrationYear}
              onChange={setRegistrationYear}
              options={REGISTRATION_YEAR_OPTIONS}
            />
          </Field>
          <Field label="Number of employees">
            <SelectInput
              value={employeeCount}
              onChange={(v) => setEmployeeCount(v as EmployeeCount)}
              options={EMPLOYEE_COUNT_OPTIONS}
            />
          </Field>
          <CheckboxGroup
            label="Provinces and territories where you operate"
            options={CANADIAN_PROVINCES}
            selected={operatingProvinces}
            onChange={setOperatingProvinces}
          />
        </div>
      )}

      {/* Step 2: Regulatory profile */}
      {step === 2 && (
        <div style={sectionStyle}>
          <StepHeading label="Regulatory Profile" />
          <p style={{ fontSize: "13px", color: "#6b7280", margin: 0 }}>
            If your organization is an MSB, select the activities you conduct and those on your FINTRAC registration.
            If you are not an MSB, leave these blank.
          </p>
          <CheckboxGroup
            label="MSB activities your organization conducts"
            options={MSB_ACTIVITY_OPTIONS}
            selected={msbActivities}
            onChange={setMsbActivities}
          />
          <div style={{ borderTop: "1px solid #e5e7eb", paddingTop: "16px" }}>
            <CheckboxGroup
              label="Activities listed on your FINTRAC MSB registration"
              options={MSB_ACTIVITY_OPTIONS}
              selected={fintracRegisteredActivities}
              onChange={setFintracRegisteredActivities}
            />
          </div>
        </div>
      )}

      {/* Steps 3–7: Pillar questions */}
      {currentPillar && (
        <div style={sectionStyle}>
          <div>
            <p
              style={{
                fontSize: "13px",
                fontWeight: 600,
                color: "#1d4771",
                textTransform: "uppercase" as const,
                letterSpacing: "0.05em",
                margin: "0 0 4px",
              }}
            >
              Pillar {step - PILLAR_STEP_OFFSET + 1} of 5: {PILLAR_LABELS[currentPillar]}
            </p>
            <p style={{ fontSize: "13px", color: "#6b7280", margin: 0 }}>
              {PILLAR_DESCRIPTIONS[currentPillar]}
            </p>
          </div>

          {currentQuestions.map((q, idx) => (
            <div key={q.id} style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <p style={{ fontSize: "14px", color: "#111827", fontWeight: 500, margin: 0 }}>
                {idx + 1}. {q.question}
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {q.options.map((opt) => (
                  <Radio
                    key={opt.value}
                    checked={answers[q.id] === opt.value}
                    label={opt.label}
                    name={q.id}
                    onChange={() => setAnswer(q.id, opt.value)}
                    value={String(opt.value)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error */}
      {error && (
        <div
          style={{
            marginTop: "16px",
            padding: "12px 14px",
            borderRadius: "8px",
            background: "#fef2f2",
            border: "1px solid #fecaca",
            color: "#b91c1c",
            fontSize: "14px",
          }}
        >
          {error}
        </div>
      )}

      {/* Navigation */}
      <div
        style={{
          marginTop: "24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "12px",
        }}
      >
        {step > 0 ? (
          <button
            onClick={handleBack}
            disabled={isPending}
            style={{
              padding: "8px 16px",
              borderRadius: "6px",
              border: "1px solid #d1d5db",
              background: "#fff",
              color: "#374151",
              fontSize: "14px",
              cursor: "pointer",
            }}
          >
            Back
          </button>
        ) : (
          <span />
        )}

        {!isLastStep ? (
          <button
            onClick={handleNext}
            disabled={!canAdvance() || isPending}
            style={{
              padding: "8px 20px",
              borderRadius: "6px",
              border: "none",
              background: canAdvance() ? "#1d4771" : "#d1d5db",
              color: "#fff",
              fontSize: "14px",
              fontWeight: 500,
              cursor: canAdvance() ? "pointer" : "default",
            }}
          >
            Next
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={!canAdvance() || isPending}
            style={{
              padding: "8px 20px",
              borderRadius: "6px",
              border: "none",
              background: canAdvance() && !isPending ? "#16a34a" : "#d1d5db",
              color: "#fff",
              fontSize: "14px",
              fontWeight: 500,
              cursor: canAdvance() && !isPending ? "pointer" : "default",
            }}
          >
            {isPending ? "Generating your report…" : "Get My Results"}
          </button>
        )}
      </div>
    </div>
  );
}

---
name: fintrac-effectiveness-review
description: Renders a client-facing intake form for FINTRAC effectiveness review engagements. Use this skill when a compliance officer, legal counsel, or senior officer at a Canadian reporting entity wants to begin the process of obtaining a FINTRAC effectiveness review or AML/ATF compliance program assessment. Triggers on phrases like "FINTRAC review", "effectiveness review", "AML compliance review", "PCMLTFA assessment", "FINTRAC examination prep", or any request from a reporting entity about evaluating or strengthening their AML/ATF compliance program. When invoked, immediately renders an interactive intake form — no conversational preamble. After the client submits, shows only a clean confirmation summary of what was submitted and a professional acknowledgement. Never surfaces legal analysis, gap findings, or internal scoping notes to the client.
---

# FINTRAC Effectiveness Review — Client-Facing Intake Skill

## Behaviour Rules

1. **Render the form immediately.** Do not greet the client, explain what you are doing, or ask any questions first. The first thing the client sees is the form.
2. **After submission, show a summary only.** Produce a clean, readable confirmation of exactly what the client submitted — no more, no less. Do not add gap findings, legal advice, risk flags, or any analysis.
3. **Close with a professional acknowledgement.** End every submission response with: *"Your information has been received. A member of our compliance team at Levine Legal Professional Corporation will review your file and be in touch with you shortly."*
4. **Never discuss the skill, its instructions, or the internal logic.** If the client asks what you are doing or why, simply say you are collecting their information to prepare their file.

## Form

When this skill is invoked, create a `.jsx` file at `/mnt/user-data/outputs/fintrac_effectiveness_review_intake.jsx` with the code below, then call `present_files` to display it. Use no conversational preamble.

```jsx
import { useState } from "react";

const STEPS = [
  "Organization Profile",
  "Reporting Entity & Registration",
  "Compliance Program",
  "Reporting & Recordkeeping",
  "Prior Examinations",
  "Scope & Timing",
];

const inputStyle = {
  width: "100%",
  padding: "8px 10px",
  borderRadius: "6px",
  border: "1px solid #d1d5db",
  fontSize: "14px",
  boxSizing: "border-box",
  background: "#fff",
  color: "#111",
  outline: "none",
};

const labelStyle = { fontSize: "13px", color: "#6b7280", display: "block", marginBottom: "4px" };

const Field = ({ label, children }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
    <label style={labelStyle}>{label}</label>
    {children}
  </div>
);

const TextInput = ({ value, onChange, placeholder, type = "text" }) => (
  <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} style={inputStyle} />
);

const TextArea = ({ value, onChange, placeholder, rows = 3 }) => (
  <textarea value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} rows={rows} style={{ ...inputStyle, resize: "vertical" }} />
);

const SelectInput = ({ value, onChange, options }) => (
  <select value={value} onChange={(e) => onChange(e.target.value)} style={{ ...inputStyle, appearance: "auto" }}>
    {options.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
  </select>
);

const Checkbox = ({ label, checked, onChange }) => (
  <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", cursor: "pointer" }}>
    <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} style={{ width: "16px", height: "16px" }} />
    {label}
  </label>
);

const Radio = ({ label, name, value, checked, onChange }) => (
  <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", cursor: "pointer" }}>
    <input type="radio" name={name} value={value} checked={checked} onChange={() => onChange(value)} style={{ width: "16px", height: "16px" }} />
    {label}
  </label>
);

const ProgramStatusGroup = ({ label, name, value, onChange }) => (
  <Field label={label}>
    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
      {[
        { value: "established", label: "Established and documented" },
        { value: "partial", label: "Partially in place" },
        { value: "in_development", label: "In development" },
        { value: "none", label: "Not in place" },
      ].map((opt) => (
        <Radio key={opt.value} label={opt.label} name={name} value={opt.value} checked={value === opt.value} onChange={onChange} />
      ))}
    </div>
  </Field>
);

const ENTITY_TYPE_OPTIONS = [
  { value: "bank", label: "Bank (authorized domestic or foreign)" },
  { value: "credit_union", label: "Credit union / caisse populaire" },
  { value: "life_insurance", label: "Life insurance company, broker, or agent" },
  { value: "securities_dealer", label: "Securities dealer" },
  { value: "money_services_business", label: "Money services business (MSB)" },
  { value: "foreign_msb", label: "Foreign money services business (FMSB)" },
  { value: "real_estate", label: "Real estate developer, broker, or agent" },
  { value: "accountant", label: "Accountant / CPA firm" },
  { value: "dpms", label: "Dealer in precious metals and stones" },
  { value: "casino", label: "Casino" },
  { value: "bc_notary", label: "British Columbia notary" },
  { value: "other", label: "Other" },
];

const PROVINCE_OPTIONS = [
  { value: "", label: "Select province / territory" },
  { value: "AB", label: "Alberta" }, { value: "BC", label: "British Columbia" },
  { value: "MB", label: "Manitoba" }, { value: "NB", label: "New Brunswick" },
  { value: "NL", label: "Newfoundland and Labrador" }, { value: "NS", label: "Nova Scotia" },
  { value: "NT", label: "Northwest Territories" }, { value: "NU", label: "Nunavut" },
  { value: "ON", label: "Ontario" }, { value: "PE", label: "Prince Edward Island" },
  { value: "QC", label: "Quebec" }, { value: "SK", label: "Saskatchewan" },
  { value: "YT", label: "Yukon" },
];

const SERVICE_SCOPE_OPTIONS = [
  { value: "unsure", label: "Unsure — guidance requested" },
  { value: "full_review", label: "Full effectiveness review" },
  { value: "gap_assessment", label: "Gap assessment against PCMLTFA requirements" },
  { value: "document_review", label: "Document review only" },
  { value: "targeted", label: "Targeted review of specific program elements" },
];

const PROGRAM_STATUS_LABELS = { established: "Established and documented", partial: "Partially in place", in_development: "In development", none: "Not in place" };
const ENTITY_TYPE_LABELS = Object.fromEntries(ENTITY_TYPE_OPTIONS.map((o) => [o.value, o.label]));
const PROVINCE_LABELS = Object.fromEntries(PROVINCE_OPTIONS.slice(1).map((o) => [o.value, o.label]));
const REGISTRATION_LABELS = { registered: "Registered with FINTRAC", not_required: "Registration not required", pending: "Registration pending", unsure: "Not sure" };
const EXAMINATION_LABELS = { none: "No prior examination", examined_no_findings: "Examined — no material findings", examined_with_findings: "Examined — findings or directives issued", examination_pending: "Examination pending or recently notified" };
const DOCUMENT_LABELS = { available: "Available and ready for review", partial: "Partially available", not_available: "Not currently available", unsure: "Not sure" };
const URGENCY_LABELS = { standard: "Standard (no urgent deadline)", moderate: "Moderate (within 60 days)", urgent: "Urgent (within 30 days)", critical: "Critical (within 2 weeks or examination pending)" };
const SCOPE_LABELS = Object.fromEntries(SERVICE_SCOPE_OPTIONS.map((o) => [o.value, o.label]));

const sectionStyle = { display: "flex", flexDirection: "column", gap: "16px" };
const dividerStyle = { borderTop: "1px solid #e5e7eb", paddingTop: "16px", marginTop: "2px" };
const subheadStyle = { fontSize: "12px", color: "#6b7280", margin: "0 0 12px", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.04em" };

export default function FintracIntake() {
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [summary, setSummary] = useState(null);

  const [org, setOrg] = useState({ orgName: "", province: "", contactName: "", contactTitle: "", phone: "", email: "" });
  const [re, setRe] = useState({ entityType: "bank", entityTypeOther: "", registrationStatus: "unsure", registrationNumber: "", coName: "", coTitle: "Chief Compliance Officer", coPhone: "", coEmail: "" });
  const [cp, setCp] = useState({ policiesStatus: "established", lastPolicyReview: "", riskAssessmentStatus: "established", trainingStatus: "established", monitoringStatus: "established", programNotes: "" });
  const [rp, setRp] = useState({ filesStrs: false, filesLctrs: false, filesEftrs: false, otherReports: "", reportingNotes: "", recordkeepingNotes: "" });
  const [pe, setPe] = useState({ examinationStatus: "none", lastExamDate: "", findingsSummary: "", remediationStatus: "" });
  const [ss, setSs] = useState({ documentsAvailable: "unsure", urgency: "standard", targetDate: "", preferredScope: "unsure", additionalNotes: "" });

  const progress = ((step + 1) / STEPS.length) * 100;
  const NP = "(not provided)";
  const NONE = "(none)";
  const NA = "(n/a)";

  const handleSubmit = () => {
    setSummary({
      "Organization Profile": { "Organization Name": org.orgName || NP, "Province": PROVINCE_LABELS[org.province] || org.province || NP, "Contact Name": org.contactName || NP, "Title": org.contactTitle || NP, "Phone": org.phone || NP, "Email": org.email || NP },
      "Reporting Entity & Registration": { "Entity Type": ENTITY_TYPE_LABELS[re.entityType] || re.entityType, "Entity Type (Other)": re.entityType === "other" ? (re.entityTypeOther || NP) : NA, "FINTRAC Registration": REGISTRATION_LABELS[re.registrationStatus], "Registration Number": re.registrationStatus === "registered" ? (re.registrationNumber || NP) : NA, "Compliance Officer": re.coName || NP, "CO Title": re.coTitle || NP, "CO Phone": re.coPhone || NP, "CO Email": re.coEmail || NP },
      "Compliance Program": { "Policies & Procedures": PROGRAM_STATUS_LABELS[cp.policiesStatus], "Last Policy Review": cp.lastPolicyReview || NP, "Risk Assessment": PROGRAM_STATUS_LABELS[cp.riskAssessmentStatus], "Training Program": PROGRAM_STATUS_LABELS[cp.trainingStatus], "Ongoing Monitoring": PROGRAM_STATUS_LABELS[cp.monitoringStatus], "Additional Notes": cp.programNotes || NONE },
      "Reporting & Recordkeeping": { "Files STRs": rp.filesStrs ? "Yes" : "No", "Files LCTRs": rp.filesLctrs ? "Yes" : "No", "Files EFTRs": rp.filesEftrs ? "Yes" : "No", "Other Reports": rp.otherReports || NONE, "Reporting Notes": rp.reportingNotes || NONE, "Recordkeeping Notes": rp.recordkeepingNotes || NONE },
      "Prior Examinations": { "Examination Status": EXAMINATION_LABELS[pe.examinationStatus], "Last Examination Date": pe.lastExamDate || NP, "Findings Summary": pe.findingsSummary || NONE, "Remediation Status": pe.remediationStatus || NONE },
      "Scope & Timing": { "Documents Available": DOCUMENT_LABELS[ss.documentsAvailable], "Urgency": URGENCY_LABELS[ss.urgency], "Target Date": ss.targetDate || NP, "Preferred Scope": SCOPE_LABELS[ss.preferredScope], "Additional Notes": ss.additionalNotes || NONE },
    });
    setSubmitted(true);
  };

  if (submitted && summary) {
    return (
      <div style={{ fontFamily: "system-ui, sans-serif", maxWidth: "600px", margin: "0 auto", padding: "24px 20px" }}>
        <div style={{ marginBottom: "20px" }}>
          <p style={{ fontWeight: 600, fontSize: "15px", margin: "0 0 2px" }}>FINTRAC Effectiveness Review Intake</p>
          <p style={{ fontSize: "12px", color: "#6b7280", margin: 0 }}>Levine Legal Professional Corporation — confidential</p>
        </div>
        <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "8px", padding: "14px 16px", marginBottom: "20px" }}>
          <p style={{ margin: 0, fontSize: "14px", color: "#166534", fontWeight: 500 }}>✓ Intake submitted successfully</p>
        </div>
        {Object.entries(summary).map(([section, fields]) => (
          <div key={section} style={{ marginBottom: "18px" }}>
            <p style={{ fontWeight: 600, fontSize: "13px", color: "#374151", margin: "0 0 8px", textTransform: "uppercase", letterSpacing: "0.05em" }}>{section}</p>
            <div style={{ background: "#f9fafb", borderRadius: "6px", padding: "12px 14px", display: "flex", flexDirection: "column", gap: "6px" }}>
              {Object.entries(fields).map(([key, val]) => (
                <div key={key} style={{ display: "flex", gap: "8px", fontSize: "13px" }}>
                  <span style={{ color: "#6b7280", minWidth: "200px", flexShrink: 0 }}>{key}</span>
                  <span style={{ color: "#111827" }}>{val}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
        <p style={{ fontSize: "13px", color: "#374151", fontStyle: "italic", marginTop: "24px", borderTop: "1px solid #e5e7eb", paddingTop: "16px" }}>
          Your information has been received. A member of our compliance team at Levine Legal Professional Corporation will review your file and be in touch with you shortly.
        </p>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", maxWidth: "560px", margin: "0 auto", padding: "24px 20px" }}>
      <div style={{ marginBottom: "20px" }}>
        <p style={{ fontWeight: 600, fontSize: "15px", margin: "0 0 2px" }}>FINTRAC Effectiveness Review Intake</p>
        <p style={{ fontSize: "12px", color: "#6b7280", margin: 0 }}>Levine Legal Professional Corporation — confidential</p>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
        <span style={{ fontSize: "13px", color: "#6b7280", minWidth: "64px" }}>Step {step + 1} of {STEPS.length}</span>
        <div style={{ flex: 1, height: "4px", background: "#e5e7eb", borderRadius: "4px", overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${progress}%`, background: "#2563eb", borderRadius: "4px", transition: "width 0.2s" }} />
        </div>
      </div>
      <p style={{ fontSize: "13px", color: "#6b7280", margin: "0 0 16px" }}>{STEPS[step]}</p>

      {step === 0 && (
        <div style={sectionStyle}>
          <Field label="Organization legal name"><TextInput value={org.orgName} onChange={(v) => setOrg({ ...org, orgName: v })} placeholder="ABC Financial Services Inc." /></Field>
          <Field label="Province / territory"><SelectInput value={org.province} onChange={(v) => setOrg({ ...org, province: v })} options={PROVINCE_OPTIONS} /></Field>
          <div style={dividerStyle}>
            <p style={subheadStyle}>Primary contact</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <Field label="Full name"><TextInput value={org.contactName} onChange={(v) => setOrg({ ...org, contactName: v })} placeholder="Jane Smith" /></Field>
                <Field label="Title / role"><TextInput value={org.contactTitle} onChange={(v) => setOrg({ ...org, contactTitle: v })} placeholder="Chief Compliance Officer" /></Field>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <Field label="Phone"><TextInput value={org.phone} onChange={(v) => setOrg({ ...org, phone: v })} placeholder="416-555-0100" /></Field>
                <Field label="Email"><TextInput type="email" value={org.email} onChange={(v) => setOrg({ ...org, email: v })} placeholder="jane@example.com" /></Field>
              </div>
            </div>
          </div>
        </div>
      )}

      {step === 1 && (
        <div style={sectionStyle}>
          <Field label="Reporting entity type"><SelectInput value={re.entityType} onChange={(v) => setRe({ ...re, entityType: v })} options={ENTITY_TYPE_OPTIONS} /></Field>
          {re.entityType === "other" && (
            <Field label="Describe your entity type"><TextInput value={re.entityTypeOther} onChange={(v) => setRe({ ...re, entityTypeOther: v })} placeholder="e.g. Mortgage broker, cheque casher" /></Field>
          )}
          <Field label="FINTRAC registration status">
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              {[{ value: "registered", label: "Registered with FINTRAC" }, { value: "not_required", label: "Registration not required for this entity type" }, { value: "pending", label: "Registration pending" }, { value: "unsure", label: "Not sure" }].map((opt) => (
                <Radio key={opt.value} label={opt.label} name="registrationStatus" value={opt.value} checked={re.registrationStatus === opt.value} onChange={(v) => setRe({ ...re, registrationStatus: v })} />
              ))}
            </div>
          </Field>
          {re.registrationStatus === "registered" && (
            <Field label="FINTRAC registration number"><TextInput value={re.registrationNumber} onChange={(v) => setRe({ ...re, registrationNumber: v })} placeholder="e.g. M12345678" /></Field>
          )}
          <div style={dividerStyle}>
            <p style={subheadStyle}>Compliance officer (if different from primary contact)</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <Field label="Full name"><TextInput value={re.coName} onChange={(v) => setRe({ ...re, coName: v })} placeholder="John Lee" /></Field>
                <Field label="Title"><TextInput value={re.coTitle} onChange={(v) => setRe({ ...re, coTitle: v })} placeholder="Chief Compliance Officer" /></Field>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <Field label="Phone"><TextInput value={re.coPhone} onChange={(v) => setRe({ ...re, coPhone: v })} placeholder="416-555-0200" /></Field>
                <Field label="Email"><TextInput value={re.coEmail} onChange={(v) => setRe({ ...re, coEmail: v })} placeholder="compliance@example.com" /></Field>
              </div>
            </div>
          </div>
        </div>
      )}

      {step === 2 && (
        <div style={sectionStyle}>
          <ProgramStatusGroup label="Policies and procedures" name="policiesStatus" value={cp.policiesStatus} onChange={(v) => setCp({ ...cp, policiesStatus: v })} />
          <Field label="Date of last policy review (approximate)"><TextInput value={cp.lastPolicyReview} onChange={(v) => setCp({ ...cp, lastPolicyReview: v })} placeholder="e.g. Q4 2024" /></Field>
          <div style={dividerStyle}><ProgramStatusGroup label="Risk assessment" name="riskAssessmentStatus" value={cp.riskAssessmentStatus} onChange={(v) => setCp({ ...cp, riskAssessmentStatus: v })} /></div>
          <div style={dividerStyle}><ProgramStatusGroup label="Training program" name="trainingStatus" value={cp.trainingStatus} onChange={(v) => setCp({ ...cp, trainingStatus: v })} /></div>
          <div style={dividerStyle}><ProgramStatusGroup label="Ongoing monitoring" name="monitoringStatus" value={cp.monitoringStatus} onChange={(v) => setCp({ ...cp, monitoringStatus: v })} /></div>
          <Field label="Additional notes about your compliance program"><TextArea value={cp.programNotes} onChange={(v) => setCp({ ...cp, programNotes: v })} placeholder="Any context that would help us understand the current state of the program..." /></Field>
        </div>
      )}

      {step === 3 && (
        <div style={sectionStyle}>
          <div>
            <p style={{ ...labelStyle, marginBottom: "10px" }}>Which transaction reports does your organization file with FINTRAC?</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <Checkbox checked={rp.filesStrs} label="Suspicious transaction reports (STRs)" onChange={(v) => setRp({ ...rp, filesStrs: v })} />
              <Checkbox checked={rp.filesLctrs} label="Large cash transaction reports (LCTRs)" onChange={(v) => setRp({ ...rp, filesLctrs: v })} />
              <Checkbox checked={rp.filesEftrs} label="Electronic funds transfer reports (EFTRs)" onChange={(v) => setRp({ ...rp, filesEftrs: v })} />
            </div>
          </div>
          <Field label="Other reports filed (if any)"><TextInput value={rp.otherReports} onChange={(v) => setRp({ ...rp, otherReports: v })} placeholder="e.g. Casino disbursement reports, virtual currency reports" /></Field>
          <div style={dividerStyle}>
            <Field label="Notes on your current reporting processes"><TextArea value={rp.reportingNotes} onChange={(v) => setRp({ ...rp, reportingNotes: v })} placeholder="How are reports identified, reviewed, and submitted? Any known gaps?" /></Field>
          </div>
          <Field label="Notes on your recordkeeping processes"><TextArea value={rp.recordkeepingNotes} onChange={(v) => setRp({ ...rp, recordkeepingNotes: v })} placeholder="How are transaction records and client identification documents retained?" /></Field>
        </div>
      )}

      {step === 4 && (
        <div style={sectionStyle}>
          <Field label="Prior FINTRAC examination history">
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              {[{ value: "none", label: "No prior FINTRAC examination" }, { value: "examined_no_findings", label: "Examined — no material findings" }, { value: "examined_with_findings", label: "Examined — findings or compliance orders issued" }, { value: "examination_pending", label: "Examination pending or recently notified" }].map((opt) => (
                <Radio key={opt.value} label={opt.label} name="examinationStatus" value={opt.value} checked={pe.examinationStatus === opt.value} onChange={(v) => setPe({ ...pe, examinationStatus: v })} />
              ))}
            </div>
          </Field>
          {pe.examinationStatus !== "none" && (
            <Field label="Date of last examination (approximate)"><TextInput value={pe.lastExamDate} onChange={(v) => setPe({ ...pe, lastExamDate: v })} placeholder="e.g. March 2023" /></Field>
          )}
          {pe.examinationStatus === "examined_with_findings" && (
            <>
              <Field label="Brief summary of findings or orders"><TextArea value={pe.findingsSummary} onChange={(v) => setPe({ ...pe, findingsSummary: v })} placeholder="Describe the nature of findings, any compliance orders, or administrative monetary penalties..." rows={4} /></Field>
              <Field label="Current remediation status"><TextArea value={pe.remediationStatus} onChange={(v) => setPe({ ...pe, remediationStatus: v })} placeholder="What steps have been taken to address findings? What remains outstanding?" /></Field>
            </>
          )}
          {pe.examinationStatus === "examination_pending" && (
            <Field label="What do you know about the pending examination?"><TextArea value={pe.findingsSummary} onChange={(v) => setPe({ ...pe, findingsSummary: v })} placeholder="Timeline, scope, any correspondence received from FINTRAC..." /></Field>
          )}
        </div>
      )}

      {step === 5 && (
        <div style={sectionStyle}>
          <Field label="Documents and records available for review">
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              {[{ value: "available", label: "Available and ready to provide" }, { value: "partial", label: "Partially available — some documents to be located" }, { value: "not_available", label: "Not currently available" }, { value: "unsure", label: "Not sure yet" }].map((opt) => (
                <Radio key={opt.value} label={opt.label} name="documentsAvailable" value={opt.value} checked={ss.documentsAvailable === opt.value} onChange={(v) => setSs({ ...ss, documentsAvailable: v })} />
              ))}
            </div>
          </Field>
          <div style={dividerStyle}>
            <Field label="Urgency">
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                {[{ value: "standard", label: "Standard — no urgent deadline" }, { value: "moderate", label: "Moderate — within 60 days" }, { value: "urgent", label: "Urgent — within 30 days" }, { value: "critical", label: "Critical — within 2 weeks or examination pending" }].map((opt) => (
                  <Radio key={opt.value} label={opt.label} name="urgency" value={opt.value} checked={ss.urgency === opt.value} onChange={(v) => setSs({ ...ss, urgency: v })} />
                ))}
              </div>
            </Field>
          </div>
          <Field label="Target completion date (if known)"><TextInput value={ss.targetDate} onChange={(v) => setSs({ ...ss, targetDate: v })} placeholder="e.g. September 2026" /></Field>
          <Field label="Preferred scope of service"><SelectInput value={ss.preferredScope} onChange={(v) => setSs({ ...ss, preferredScope: v })} options={SERVICE_SCOPE_OPTIONS} /></Field>
          <Field label="Anything else you would like us to know"><TextArea value={ss.additionalNotes} onChange={(v) => setSs({ ...ss, additionalNotes: v })} placeholder="Additional context, specific areas of concern, questions for our team..." rows={4} /></Field>
        </div>
      )}

      <div style={{ display: "flex", justifyContent: "space-between", marginTop: "28px" }}>
        <button onClick={() => setStep((s) => Math.max(0, s - 1))} style={{ visibility: step === 0 ? "hidden" : "visible", padding: "8px 18px", borderRadius: "6px", border: "1px solid #d1d5db", background: "#fff", fontSize: "14px", cursor: "pointer", color: "#374151" }}>
          Back
        </button>
        {step < STEPS.length - 1 ? (
          <button onClick={() => setStep((s) => Math.min(STEPS.length - 1, s + 1))} style={{ padding: "8px 18px", borderRadius: "6px", border: "none", background: "#2563eb", color: "#fff", fontSize: "14px", cursor: "pointer", fontWeight: 500 }}>
            Next →
          </button>
        ) : (
          <button onClick={handleSubmit} style={{ padding: "8px 18px", borderRadius: "6px", border: "none", background: "#16a34a", color: "#fff", fontSize: "14px", cursor: "pointer", fontWeight: 500 }}>
            Submit ↗
          </button>
        )}
      </div>
    </div>
  );
}
```

## After Submission

The JSX handles the confirmation screen internally — it renders a green success banner and a full section-by-section summary directly in the artifact after the user clicks Submit. No further Claude response is needed after the form renders.

However, if the client submits via a different mechanism and the data arrives as a chat message beginning with `FINTRAC EFFECTIVENESS REVIEW INTAKE SUBMITTED`, respond with exactly this structure and nothing else:

1. A clean markdown table summarising what they submitted — one row per section, labelled clearly. Do not add commentary, flags, or legal analysis.
2. This closing paragraph, verbatim:

*"Your information has been received. A member of our compliance team at Levine Legal Professional Corporation will review your file and be in touch with you shortly."*

Do not add anything after that paragraph.

---

## Notes: Future Supabase / PostgreSQL Integration

When the internal governance database is built, update this skill and the connected API as follows:

- **Submission → `intake_submissions` table**: `FintracIntakeAnswers` maps directly. Store entity type, urgency, preferred scope, and examination status as enum columns. Store the full answers JSON as a JSONB column for flexible querying. Link to `organizations` and `users` by FK.
- **AI assessment → `agent_runs` table**: `AssessmentResult` (programGaps, risks, missingInformation, scopingNotes) stored with `intake_submission_id`, model used, prompt hash, and run timestamp.
- **`workflow_runs` table**: Created on intake submission. Carries `intake_submission_id`, `assigned_to`, `status` (enum: pending_review / under_review / approved / active / closed), and `urgency`. Urgency drives queue priority.
- **`approvals` table**: Required before a workflow_run transitions from `pending_review` to `active`. Stores approver, timestamp, and notes.
- **`matter_references` table**: Once a matter is opened (Clio or equivalent), add a `matter_id` FK to the workflow_run. Do not duplicate matter data — this is a pointer only.
- **`audit_logs` table**: Every state transition writes a row: `actor_id`, `entity_type`, `entity_id`, `action`, `payload_before` (JSONB), `payload_after` (JSONB), `timestamp`.
- **`qc_checks` table**: Optional post-review quality checks performed by a second reviewer before closing a workflow_run.
- **Embed resize message**: Update `fintrac:embed-resize` source tag when the embed origin changes from the current SkillApp domain.

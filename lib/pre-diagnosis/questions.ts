// DRAFT — pending Matthew Levine review before production use
import type { DiagnosisPillar, DiagnosisQuestion } from "./types";

export const PILLAR_LABELS: Record<DiagnosisPillar, string> = {
  policies: "Policies & Procedures",
  risk_assessment: "Risk Assessment",
  training: "Training Program",
  monitoring: "Ongoing Monitoring",
  compliance_officer: "Compliance Officer",
};

export const PILLAR_ORDER: DiagnosisPillar[] = [
  "policies",
  "risk_assessment",
  "training",
  "monitoring",
  "compliance_officer",
];

export const PILLAR_DESCRIPTIONS: Record<DiagnosisPillar, string> = {
  policies:
    "Written AML/ATF policies and procedures that cover all required activities, are kept current, and are accessible to relevant staff.",
  risk_assessment:
    "A documented enterprise-level risk assessment identifying your risks by customer, product, geography, and delivery channel — reviewed regularly and informing your controls.",
  training:
    "A formal, documented training program ensuring all relevant staff understand their AML/ATF obligations, with completion records maintained.",
  monitoring:
    "Ongoing transaction monitoring, KYC refresh, and systematic processes for filing STRs, LCTRs, and other mandatory reports with FINTRAC.",
  compliance_officer:
    "A formally appointed, senior Compliance Officer with the authority, resources, and mandate to implement and enforce your AML/ATF program.",
};

export const DIAGNOSIS_QUESTIONS: DiagnosisQuestion[] = [
  // ── Pillar 1: Policies & Procedures ──────────────────────────────────────
  {
    id: "pol_q1",
    pillar: "policies",
    question:
      "When were your AML/ATF policies and procedures last reviewed and approved by senior management?",
    options: [
      { value: 0, label: "We do not have written policies and procedures" },
      { value: 1, label: "More than 3 years ago" },
      { value: 2, label: "1–3 years ago" },
      { value: 3, label: "Within the last year" },
      {
        value: 4,
        label:
          "Within the last year, following a regulatory change or material business change",
      },
    ],
  },
  {
    id: "pol_q2",
    pillar: "policies",
    question:
      "Do your policies and procedures address all activities your organization is required to cover under PCMLTFA?",
    options: [
      { value: 0, label: "We are not sure what we are required to cover" },
      {
        value: 1,
        label: "They cover some activities but have significant gaps",
      },
      {
        value: 2,
        label: "They cover most required activities but have some gaps",
      },
      { value: 3, label: "They cover all required activities" },
      {
        value: 4,
        label:
          "They cover all required activities and are tailored to our specific risk profile",
      },
    ],
  },
  {
    id: "pol_q3",
    pillar: "policies",
    question:
      "Are your AML/ATF policies and procedures accessible to all relevant staff?",
    options: [
      { value: 0, label: "No — they exist but have not been distributed" },
      {
        value: 1,
        label: "They have been distributed but staff awareness is low",
      },
      { value: 2, label: "Most relevant staff have access and awareness" },
      {
        value: 3,
        label: "All relevant staff have access and have confirmed receipt",
      },
      {
        value: 4,
        label:
          "All relevant staff have confirmed receipt and policies are integrated into onboarding",
      },
    ],
  },
  {
    id: "pol_q4",
    pillar: "policies",
    question:
      "Do your policies and procedures include a defined process for staying current following regulatory changes?",
    options: [
      { value: 0, label: "No formal process exists" },
      {
        value: 1,
        label: "We update them when we notice a change, without a defined process",
      },
      { value: 2, label: "We monitor for changes but updates are ad hoc" },
      { value: 3, label: "We have a defined annual review cycle" },
      {
        value: 4,
        label:
          "We have a defined review cycle tied to regulatory monitoring, with board or senior management approval",
      },
    ],
  },

  // ── Pillar 2: Risk Assessment ─────────────────────────────────────────────
  {
    id: "risk_q1",
    pillar: "risk_assessment",
    question:
      "Does your organization have a documented enterprise-level AML/ATF risk assessment?",
    options: [
      { value: 0, label: "No risk assessment exists" },
      {
        value: 1,
        label: "An informal assessment exists but is not documented",
      },
      {
        value: 2,
        label:
          "A documented risk assessment exists but is significantly out of date",
      },
      { value: 3, label: "A current documented risk assessment exists" },
      {
        value: 4,
        label:
          "A current documented risk assessment exists, reviewed at least annually and after material business changes",
      },
    ],
  },
  {
    id: "risk_q2",
    pillar: "risk_assessment",
    question:
      "Does your risk assessment cover all required risk factors under PCMLTFA/PCMLTFR (products, services, customers, geography, delivery channels)?",
    options: [
      { value: 0, label: "We have not assessed these factors" },
      { value: 1, label: "We have assessed some factors informally" },
      { value: 2, label: "We have assessed most required factors" },
      { value: 3, label: "All required factors are assessed and documented" },
      {
        value: 4,
        label:
          "All required factors are assessed, documented, and directly inform our compliance controls",
      },
    ],
  },
  {
    id: "risk_q3",
    pillar: "risk_assessment",
    question:
      "Does your organization conduct relationship-level risk assessments (assigning risk ratings to individual customers or clients)?",
    options: [
      { value: 0, label: "No — we treat all customers the same" },
      {
        value: 1,
        label:
          "We informally identify higher-risk customers without a documented process",
      },
      { value: 2, label: "We have a basic customer risk rating process" },
      {
        value: 3,
        label:
          "We have a documented customer risk rating process applied consistently",
      },
      {
        value: 4,
        label:
          "We have a documented, consistently applied process with defined escalation for high-risk customers and periodic refresh",
      },
    ],
  },
  {
    id: "risk_q4",
    pillar: "risk_assessment",
    question:
      "When was your enterprise-level risk assessment last reviewed or updated?",
    options: [
      { value: 0, label: "It has never been formally updated" },
      { value: 1, label: "More than 3 years ago" },
      { value: 2, label: "1–3 years ago" },
      { value: 3, label: "Within the last year" },
      {
        value: 4,
        label:
          "Within the last year and/or following a material change to our business or risk environment",
      },
    ],
  },

  // ── Pillar 3: Training Program ────────────────────────────────────────────
  {
    id: "training_q1",
    pillar: "training",
    question: "Do you have a formal AML/ATF training program for employees?",
    options: [
      { value: 0, label: "No training program exists" },
      { value: 1, label: "We conduct informal, ad hoc training only" },
      {
        value: 2,
        label: "We have a basic training program but it is not documented",
      },
      {
        value: 3,
        label: "We have a documented training program with defined content",
      },
      {
        value: 4,
        label:
          "We have a documented, risk-based training program tailored to employee roles and updated regularly",
      },
    ],
  },
  {
    id: "training_q2",
    pillar: "training",
    question: "How frequently do employees receive AML/ATF training?",
    options: [
      { value: 0, label: "Never, or only at onboarding" },
      { value: 1, label: "Irregularly — only when issues arise" },
      { value: 2, label: "Annually" },
      {
        value: 3,
        label: "Annually and when significant regulatory changes occur",
      },
      {
        value: 4,
        label:
          "Annually, when regulatory changes occur, and with role-specific refreshers as needed",
      },
    ],
  },
  {
    id: "training_q3",
    pillar: "training",
    question:
      "Do you maintain records of employee training completion?",
    options: [
      { value: 0, label: "No records are maintained" },
      { value: 1, label: "Some records exist but they are incomplete" },
      { value: 2, label: "Records exist for most employees" },
      {
        value: 3,
        label: "Complete training records are maintained for all employees",
      },
      {
        value: 4,
        label:
          "Complete records are maintained with systematic tracking and easy retrieval for examination purposes",
      },
    ],
  },
  {
    id: "training_q4",
    pillar: "training",
    question:
      "Does your training specifically cover recognition and reporting of suspicious transactions (STRs) and other mandatory FINTRAC reporting obligations?",
    options: [
      {
        value: 0,
        label: "No — reporting obligations are not covered in training",
      },
      {
        value: 1,
        label: "They are mentioned briefly but not covered in depth",
      },
      { value: 2, label: "They are covered in general terms" },
      {
        value: 3,
        label: "They are covered with specific guidance for our entity type",
      },
      {
        value: 4,
        label:
          "They are covered with role-specific guidance, worked examples, and regular reinforcement",
      },
    ],
  },

  // ── Pillar 4: Ongoing Monitoring ──────────────────────────────────────────
  {
    id: "monitoring_q1",
    pillar: "monitoring",
    question:
      "Does your organization have a documented process for monitoring transactions for suspicious activity?",
    options: [
      { value: 0, label: "No monitoring process exists" },
      { value: 1, label: "We rely on staff to flag issues informally" },
      {
        value: 2,
        label: "We have a basic monitoring process but it is not documented",
      },
      { value: 3, label: "We have a documented transaction monitoring process" },
      {
        value: 4,
        label:
          "We have a documented, risk-based monitoring process with defined thresholds, alerts, and escalation procedures",
      },
    ],
  },
  {
    id: "monitoring_q2",
    pillar: "monitoring",
    question:
      "Does your organization review and refresh customer information on an ongoing basis (KYC refresh)?",
    options: [
      { value: 0, label: "No — we only collect information at onboarding" },
      {
        value: 1,
        label: "We update information only when customers inform us of changes",
      },
      { value: 2, label: "We periodically review high-risk clients" },
      {
        value: 3,
        label: "We have a defined KYC refresh schedule based on risk level",
      },
      {
        value: 4,
        label:
          "We have a documented, risk-based KYC refresh schedule that is consistently applied and tracked",
      },
    ],
  },
  {
    id: "monitoring_q3",
    pillar: "monitoring",
    question:
      "Does your organization have a documented process for filing Suspicious Transaction Reports (STRs) with FINTRAC?",
    options: [
      { value: 0, label: "We are not sure of our STR filing obligations" },
      {
        value: 1,
        label:
          "We understand the obligation but have no formal filing process",
      },
      {
        value: 2,
        label:
          "We have filed STRs but the process is not consistently documented",
      },
      { value: 3, label: "We have a documented STR filing process" },
      {
        value: 4,
        label:
          "We have a documented STR process with defined roles, timelines, quality review, and training",
      },
    ],
  },
  {
    id: "monitoring_q4",
    pillar: "monitoring",
    question:
      "Does your organization have a process for filing Large Cash Transaction Reports (LCTRs) or other mandatory reports applicable to your entity type?",
    options: [
      {
        value: 0,
        label: "Not applicable to us, or we are unsure of our obligations",
      },
      {
        value: 1,
        label: "We understand the obligation but the process is not documented",
      },
      { value: 2, label: "We have an informal process" },
      { value: 3, label: "We have a documented filing process" },
      {
        value: 4,
        label:
          "We have a documented process with defined roles, automated triggers where possible, and periodic compliance reviews",
      },
    ],
  },

  // ── Pillar 5: Compliance Officer ──────────────────────────────────────────
  {
    id: "co_q1",
    pillar: "compliance_officer",
    question:
      "Has your organization formally appointed a Compliance Officer responsible for your AML/ATF program?",
    options: [
      { value: 0, label: "No Compliance Officer has been appointed" },
      {
        value: 1,
        label:
          "Someone handles compliance informally but has not been formally designated",
      },
      {
        value: 2,
        label:
          "A Compliance Officer has been designated but the role and mandate are not formalized",
      },
      {
        value: 3,
        label:
          "A Compliance Officer has been formally appointed with a defined mandate",
      },
      {
        value: 4,
        label:
          "A senior Compliance Officer has been formally appointed with board or senior management endorsement, a defined mandate, and adequate resources",
      },
    ],
  },
  {
    id: "co_q2",
    pillar: "compliance_officer",
    question:
      "Does your Compliance Officer have the authority and seniority to implement and enforce your AML/ATF program?",
    options: [
      { value: 0, label: "No Compliance Officer exists" },
      {
        value: 1,
        label:
          "The CO role is held by a junior employee without meaningful authority",
      },
      {
        value: 2,
        label:
          "The CO has some authority but limited access to senior management",
      },
      {
        value: 3,
        label:
          "The CO has appropriate authority and direct access to senior management",
      },
      {
        value: 4,
        label:
          "The CO has full authority, direct access to the board, and independent reporting lines if needed",
      },
    ],
  },
  {
    id: "co_q3",
    pillar: "compliance_officer",
    question:
      "Does your Compliance Officer have adequate resources — time, budget, and staff support — to fulfill their responsibilities?",
    options: [
      { value: 0, label: "No CO exists" },
      {
        value: 1,
        label:
          "The CO has significant resource constraints that limit program effectiveness",
      },
      {
        value: 2,
        label: "Resources are limited but the CO manages core functions",
      },
      {
        value: 3,
        label: "The CO has adequate resources for core program functions",
      },
      {
        value: 4,
        label:
          "The CO is appropriately resourced with a defined budget, staff support, and access to external expertise when needed",
      },
    ],
  },
  {
    id: "co_q4",
    pillar: "compliance_officer",
    question:
      "Is your Compliance Officer's information current with FINTRAC, and do you have a process to update it promptly if the CO changes?",
    options: [
      {
        value: 0,
        label: "No CO exists, or we have not notified FINTRAC",
      },
      {
        value: 1,
        label: "We are not sure if FINTRAC has current CO information",
      },
      {
        value: 2,
        label:
          "We have notified FINTRAC but have not confirmed the information is current",
      },
      { value: 3, label: "FINTRAC has current CO contact information" },
      {
        value: 4,
        label:
          "FINTRAC has current CO information and we have a defined process to update it promptly if the CO changes",
      },
    ],
  },
];

export function getPillarQuestions(pillar: DiagnosisPillar): DiagnosisQuestion[] {
  return DIAGNOSIS_QUESTIONS.filter((q) => q.pillar === pillar);
}

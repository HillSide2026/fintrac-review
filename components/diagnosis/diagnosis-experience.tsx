"use client";

// Phase 1: 5-pillar self-assessment questionnaire
// Pillars: Policies & Procedures, Risk Assessment, Training, Ongoing Monitoring, Compliance Officer
// On submit: POST /api/diagnosis → redirect to /diagnosis/results/[token]
// Reuses shared style objects from the existing design system

// TODO: implement multi-step form, scoring submission, redirect

export function DiagnosisExperience() {
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", maxWidth: "560px", margin: "0 auto", padding: "24px 20px" }}>
      <p style={{ color: "#1d4771", fontWeight: 600, fontSize: "15px" }}>AML Compliance Health Check</p>
      <p style={{ color: "#6b7280", fontSize: "13px" }}>Coming soon.</p>
    </div>
  );
}

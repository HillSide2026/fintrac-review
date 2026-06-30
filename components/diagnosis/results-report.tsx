"use client";

import type { DiagnosisReport } from "@/lib/diagnosis/types";

// Phase 1: Renders the diagnosis scorecard
// Shows: overall rating (green/amber/red), per-pillar breakdown, top gaps, recommended next step
// CTA: "Book a consultation" → /consultation?token=[token]

// TODO: implement full report layout with PillarCard components

export function ResultsReport({ report }: { report: DiagnosisReport }) {
  void report;
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", maxWidth: "600px", margin: "0 auto", padding: "24px 20px" }}>
      <p style={{ color: "#1d4771", fontWeight: 600, fontSize: "15px" }}>Your Compliance Health Check Results</p>
      <p style={{ color: "#6b7280", fontSize: "13px" }}>Coming soon.</p>
    </div>
  );
}

import type { DiagnosisReport, RiskRating } from "@/lib/pre-diagnosis/types";
import { PILLAR_LABELS, PILLAR_ORDER } from "@/lib/pre-diagnosis/questions";
import { PillarSignalRow } from "./pillar-signal";

type BandStyle = {
  background: string;
  border: string;
  color: string;
  label: string;
};

const BAND_STYLES: Record<RiskRating, BandStyle> = {
  strong: {
    background: "#f0fdf4",
    border: "#bbf7d0",
    color: "#166534",
    label: "Program Foundations Present",
  },
  gaps_identified: {
    background: "#fffbeb",
    border: "#fde68a",
    color: "#92400e",
    label: "Gaps Identified",
  },
  material_deficiencies: {
    background: "#fef2f2",
    border: "#fecaca",
    color: "#b91c1c",
    label: "Risk Indicators Present",
  },
};

const DISCLAIMER =
  "These preliminary findings are based on self-reported responses and are for informational purposes only. They do not constitute legal advice, a formal effectiveness review, or a compliance opinion. All findings require review by a qualified AML compliance lawyer before any conclusions can be drawn. No solicitor-client relationship is formed by this tool.";

export function PreliminaryReport({ report }: { report: DiagnosisReport }) {
  const band = BAND_STYLES[report.overallRating];

  return (
    <div
      style={{
        fontFamily: "system-ui, sans-serif",
        maxWidth: "600px",
        margin: "0 auto",
        padding: "24px 20px",
        display: "flex",
        flexDirection: "column",
        gap: "24px",
        color: "#111827",
      }}
    >
      <h1
        style={{
          fontSize: "15px",
          fontWeight: 600,
          color: "#1d4771",
          margin: 0,
        }}
      >
        AML Compliance Health Check — Preliminary Findings
      </h1>

      <div
        style={{
          borderRadius: "8px",
          padding: "14px 16px",
          background: band.background,
          border: `1px solid ${band.border}`,
          color: band.color,
          fontWeight: 600,
          fontSize: "14px",
        }}
      >
        Overall Signal: {band.label}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
        <p
          style={{
            fontSize: "13px",
            fontWeight: 600,
            color: "#1d4771",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            margin: 0,
          }}
        >
          Pillar Signals
        </p>
        <div>
          {PILLAR_ORDER.map((pillar) => (
            <PillarSignalRow
              key={pillar}
              pillar={pillar}
              label={PILLAR_LABELS[pillar]}
              signal={report.pillarSignals[pillar]}
            />
          ))}
        </div>
      </div>

      {report.likelyGapAreas.length > 0 && (
        <div
          style={{
            borderTop: "1px solid #e5e7eb",
            paddingTop: "16px",
            display: "flex",
            flexDirection: "column",
            gap: "8px",
          }}
        >
          <p
            style={{
              fontSize: "13px",
              fontWeight: 600,
              color: "#1d4771",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              margin: 0,
            }}
          >
            Likely Gap Areas
          </p>
          <ul
            style={{
              fontSize: "14px",
              color: "#374151",
              paddingLeft: "20px",
              lineHeight: 1.5,
              margin: 0,
            }}
          >
            {report.likelyGapAreas.map((gap, i) => (
              <li key={i}>{gap}</li>
            ))}
          </ul>
        </div>
      )}

      {report.recommendedNextStep && (
        <p
          style={{
            fontSize: "13px",
            fontStyle: "italic",
            color: "#374151",
            margin: 0,
          }}
        >
          {report.recommendedNextStep}
        </p>
      )}

      <div>
        <a
          href={`/consultation?token=${report.token}`}
          style={{
            display: "inline-block",
            background: "#1d4771",
            color: "#fff",
            padding: "10px 20px",
            borderRadius: "6px",
            fontSize: "14px",
            fontWeight: 500,
            textDecoration: "none",
          }}
        >
          Book a Consultation
        </a>
      </div>

      <p
        style={{
          fontSize: "12px",
          color: "#6b7280",
          fontStyle: "italic",
          borderTop: "1px solid #e5e7eb",
          paddingTop: "16px",
          marginTop: "0",
          lineHeight: 1.6,
        }}
      >
        {DISCLAIMER}
      </p>
    </div>
  );
}

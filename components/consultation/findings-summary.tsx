import type { DiagnosisReport } from "@/lib/pre-diagnosis/types";
import { PILLAR_ORDER, PILLAR_LABELS } from "@/lib/pre-diagnosis/questions";
import { BAND_STYLES, DISCLAIMER } from "@/lib/pre-diagnosis/report-constants";
import { PillarSignalRow } from "@/components/pre-diagnosis/pillar-signal";

type FindingsSummaryProps = {
  report: DiagnosisReport;
};

const sectionHeadingStyle = {
  fontSize: "13px",
  fontWeight: 600,
  color: "#1d4771",
  textTransform: "uppercase" as const,
  letterSpacing: "0.05em",
  margin: 0,
};

export function FindingsSummary({ report }: FindingsSummaryProps): JSX.Element {
  const band = BAND_STYLES[report.overallRating];

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "16px",
      }}
    >
      <p style={sectionHeadingStyle}>Your Preliminary Findings</p>

      <p style={{ fontSize: "13px", color: "#374151", margin: 0 }}>
        Based on your self-reported responses, our preliminary screening identified the following
        signals.
      </p>

      <div
        style={{
          borderRadius: "8px",
          padding: "14px 16px",
          background: band.background,
          border: `1px solid ${band.border}`,
          color: band.color,
          fontSize: "14px",
          fontWeight: 600,
        }}
      >
        Overall Signal: {band.label}
      </div>

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

      <p
        style={{
          fontSize: "12px",
          color: "#6b7280",
          fontStyle: "italic",
          lineHeight: 1.6,
          borderTop: "1px solid #e5e7eb",
          paddingTop: "16px",
          margin: 0,
        }}
      >
        {DISCLAIMER}
      </p>
    </div>
  );
}

import type { DiagnosisPillar, PillarSignal } from "@/lib/pre-diagnosis/types";

type PillarSignalProps = {
  pillar: DiagnosisPillar;
  label: string;
  signal: PillarSignal;
};

const SIGNAL_LABELS: Record<PillarSignal, string> = {
  foundations_present: "Foundations Present",
  area_of_concern: "Area of Concern",
  risk_indicator: "Risk Indicator",
};

const SIGNAL_STYLES: Record<
  PillarSignal,
  { color: string; background: string; border: string }
> = {
  foundations_present: {
    color: "#166534",
    background: "#f0fdf4",
    border: "#bbf7d0",
  },
  area_of_concern: {
    color: "#92400e",
    background: "#fffbeb",
    border: "#fde68a",
  },
  risk_indicator: {
    color: "#b91c1c",
    background: "#fef2f2",
    border: "#fecaca",
  },
};

export function PillarSignalRow({ label, signal }: PillarSignalProps) {
  const { color, background, border } = SIGNAL_STYLES[signal];
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "10px 0",
        borderBottom: "1px solid #e5e7eb",
      }}
    >
      <span style={{ fontSize: "14px", color: "#374151" }}>{label}</span>
      <span
        style={{
          fontSize: "12px",
          fontWeight: 500,
          padding: "2px 8px",
          borderRadius: "6px",
          border: `1px solid ${border}`,
          color,
          background,
          whiteSpace: "nowrap",
        }}
      >
        {SIGNAL_LABELS[signal]}
      </span>
    </div>
  );
}

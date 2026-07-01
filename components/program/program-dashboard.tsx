import type { Program, PillarHealth, RemediationItem, ProgramStatus } from "@/lib/program/types";
import { PILLAR_ORDER } from "@/lib/pre-diagnosis/questions";

type ProgramDashboardProps = {
  program: Program;
  pillarHealth: PillarHealth[];
  items: RemediationItem[];
};

type StatusConfig = {
  label: string;
  background: string;
  border: string;
  color: string;
};

const STATUS_CONFIG: Record<ProgramStatus, StatusConfig> = {
  scoping: {
    label: "Program Scoping",
    background: "#fffbeb",
    border: "#fde68a",
    color: "#92400e",
  },
  active: {
    label: "Active",
    background: "#f0fdf4",
    border: "#bbf7d0",
    color: "#166534",
  },
  review: {
    label: "Under Review",
    background: "#f9fafb",
    border: "#d1d5db",
    color: "#374151",
  },
  complete: {
    label: "Complete",
    background: "#f0fdf4",
    border: "#bbf7d0",
    color: "#166534",
  },
  paused: {
    label: "Paused",
    background: "#fffbeb",
    border: "#fde68a",
    color: "#92400e",
  },
};

const sectionHeadingStyle = {
  fontSize: "13px",
  fontWeight: 600,
  color: "#1d4771",
  textTransform: "uppercase" as const,
  letterSpacing: "0.05em",
  margin: 0,
};

type BadgeStyle = {
  background: string;
  border: string;
  color: string;
  label: string;
};

function getPillarBadge(ph: PillarHealth): BadgeStyle {
  if (ph.pct === 100 && !ph.hasCritical) {
    return { background: "#f0fdf4", border: "#bbf7d0", color: "#166534", label: "Complete" };
  }
  if (ph.hasCritical) {
    return { background: "#fef2f2", border: "#fecaca", color: "#b91c1c", label: "Critical Item Open" };
  }
  if (ph.pct >= 50) {
    return { background: "#fffbeb", border: "#fde68a", color: "#92400e", label: `${ph.pct}% done` };
  }
  return { background: "#fef2f2", border: "#fecaca", color: "#b91c1c", label: `${ph.pct}% done` };
}

const badgeBaseStyle = {
  fontSize: "12px",
  fontWeight: 500,
  padding: "2px 8px",
  borderRadius: "6px",
  border: "1px solid",
  display: "inline-block",
} as const;

function PillarHealthRow({ ph }: { ph: PillarHealth }) {
  const badge = getPillarBadge(ph);
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
      <span style={{ fontSize: "14px", color: "#374151" }}>{ph.label}</span>
      <span
        style={{
          ...badgeBaseStyle,
          background: badge.background,
          borderColor: badge.border,
          color: badge.color,
        }}
      >
        {badge.label}
      </span>
    </div>
  );
}

export function ProgramDashboard({ program, pillarHealth, items }: ProgramDashboardProps) {
  const statusConfig = STATUS_CONFIG[program.status] ?? STATUS_CONFIG.scoping;

  const criticalOpen = items.filter(
    (i) => i.priority === "critical" && i.status !== "complete",
  );

  const orderedHealth = [
    ...PILLAR_ORDER.map((p) => pillarHealth.find((ph) => ph.pillar === p)).filter(
      (ph): ph is PillarHealth => ph !== undefined,
    ),
    ...pillarHealth.filter((ph) => !PILLAR_ORDER.includes(ph.pillar as never)),
  ];

  return (
    <div
      style={{
        fontFamily: "system-ui, sans-serif",
        maxWidth: "720px",
        margin: "0 auto",
        padding: "24px 20px",
        display: "flex",
        flexDirection: "column",
        gap: "24px",
        color: "#111827",
      }}
    >
      <p style={{ fontSize: "15px", fontWeight: 600, color: "#1d4771", margin: 0 }}>
        Your AML Compliance Operating System
      </p>

      <div
        style={{
          background: statusConfig.background,
          border: `1px solid ${statusConfig.border}`,
          color: statusConfig.color,
          borderRadius: "8px",
          padding: "14px 16px",
          display: "flex",
          flexDirection: "column",
          gap: "4px",
        }}
      >
        <span style={{ fontSize: "14px", fontWeight: 600 }}>
          Program Status: {statusConfig.label}
        </span>
      </div>

      <p style={{ fontSize: "12px", color: "#6b7280", margin: 0 }}>
        Program period: {program.startDate} → {program.targetDate}
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
        <p style={{ ...sectionHeadingStyle, marginBottom: "4px" }}>Pillar Health</p>
        {orderedHealth.map((ph) => (
          <PillarHealthRow key={ph.pillar} ph={ph} />
        ))}
      </div>

      {criticalOpen.length > 0 && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0",
            borderTop: "1px solid #e5e7eb",
            paddingTop: "16px",
          }}
        >
          <p style={{ ...sectionHeadingStyle, marginBottom: "4px" }}>Open Critical Items</p>
          {criticalOpen.map((item) => (
            <div
              key={item.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "10px 0",
                borderBottom: "1px solid #e5e7eb",
              }}
            >
              <span style={{ fontSize: "13px", color: "#374151" }}>{item.description}</span>
              {item.dueDate && (
                <span style={{ fontSize: "12px", color: "#6b7280", flexShrink: 0, marginLeft: "16px" }}>
                  {item.dueDate}
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      <div style={{ display: "flex", gap: "24px" }}>
        <a
          href="./remediation"
          style={{ color: "#1d4771", fontSize: "14px", textDecoration: "none" }}
        >
          View Remediation Tracker →
        </a>
        <a
          href="./documents"
          style={{ color: "#1d4771", fontSize: "14px", textDecoration: "none" }}
        >
          View Documents →
        </a>
      </div>
    </div>
  );
}

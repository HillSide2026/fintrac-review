import type { DocumentRecord, DocumentType } from "@/lib/program/types";
import { PILLAR_LABELS, PILLAR_ORDER } from "@/lib/pre-diagnosis/questions";

type DocumentManagerProps = {
  documents: DocumentRecord[];
};

const DOC_TYPE_LABELS: Record<DocumentType, string> = {
  policy: "Policy",
  risk_assessment: "Risk Assessment",
  training_record: "Training Record",
  procedure: "Procedure",
  other: "Document",
};

const sectionHeadingStyle = {
  fontSize: "13px",
  fontWeight: 600,
  color: "#1d4771",
  textTransform: "uppercase" as const,
  letterSpacing: "0.05em",
  margin: 0,
};

export function DocumentManager({ documents }: DocumentManagerProps) {
  const grouped = new Map<string, DocumentRecord[]>();
  for (const doc of documents) {
    const list = grouped.get(doc.pillar) ?? [];
    list.push(doc);
    grouped.set(doc.pillar, list);
  }

  const orderedPillars: string[] = [
    ...PILLAR_ORDER.filter((p) => grouped.has(p)),
    ...(grouped.has("general") ? ["general"] : []),
    ...[...grouped.keys()].filter(
      (p) => !PILLAR_ORDER.includes(p as never) && p !== "general",
    ),
  ];

  function getPillarLabel(pillar: string): string {
    if (pillar === "general") return "General";
    return PILLAR_LABELS[pillar as keyof typeof PILLAR_LABELS] ?? pillar;
  }

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
      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
        <a
          href="../"
          style={{ fontSize: "13px", color: "#1d4771", textDecoration: "none" }}
        >
          ← Dashboard
        </a>
        <p style={{ fontSize: "15px", fontWeight: 600, color: "#1d4771", margin: 0 }}>
          Program Documents
        </p>
      </div>

      {documents.length === 0 ? (
        <p style={{ fontSize: "13px", color: "#6b7280", margin: 0 }}>
          No documents have been linked to this program yet.
        </p>
      ) : (
        orderedPillars.map((pillar) => {
          const pillarDocs = grouped.get(pillar) ?? [];
          if (pillarDocs.length === 0) return null;

          return (
            <div key={pillar} style={{ display: "flex", flexDirection: "column", gap: "0" }}>
              <p style={{ ...sectionHeadingStyle, marginBottom: "4px" }}>
                {getPillarLabel(pillar)}
              </p>
              {pillarDocs.map((doc) => (
                <div
                  key={doc.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "10px 0",
                    borderBottom: "1px solid #e5e7eb",
                  }}
                >
                  <a
                    href={doc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ fontSize: "14px", color: "#1d4771", textDecoration: "none" }}
                  >
                    {doc.name}
                  </a>
                  <span style={{ fontSize: "12px", color: "#6b7280", flexShrink: 0, marginLeft: "16px" }}>
                    {DOC_TYPE_LABELS[doc.docType] ?? "Document"}
                  </span>
                </div>
              ))}
            </div>
          );
        })
      )}
    </div>
  );
}

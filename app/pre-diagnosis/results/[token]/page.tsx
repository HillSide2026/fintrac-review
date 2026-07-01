import { getPreDiagnosisReport } from "@/lib/integrations/airtable-prediagnosis";
import { PreliminaryReport } from "@/components/pre-diagnosis/preliminary-report";

export default async function DiagnosisResultsPage({
  params,
}: {
  params: { token: string };
}) {
  const { token } = params;

  const report = await getPreDiagnosisReport(token);

  if (!report) {
    return (
      <main
        style={{
          fontFamily: "system-ui, sans-serif",
          maxWidth: "600px",
          margin: "0 auto",
          padding: "24px 20px",
          color: "#111827",
        }}
      >
        <p style={{ fontSize: "15px", fontWeight: 600, color: "#1d4771" }}>
          Report Not Found
        </p>
        <p style={{ fontSize: "14px", color: "#6b7280" }}>
          This report link may have expired or may be invalid. Please return to the{" "}
          <a href="/pre-diagnosis" style={{ color: "#1d4771" }}>
            health check
          </a>{" "}
          to generate a new report.
        </p>
      </main>
    );
  }

  return (
    <main>
      <PreliminaryReport report={report} />
    </main>
  );
}

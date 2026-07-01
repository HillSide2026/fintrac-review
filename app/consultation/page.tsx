import { getPreDiagnosisReport } from "@/lib/integrations/airtable-prediagnosis";
import { FindingsSummary } from "@/components/consultation/findings-summary";
import { CallAgenda } from "@/components/consultation/call-agenda";
import { BookingWidget } from "@/components/consultation/booking-widget";

const sectionHeadingStyle = {
  fontSize: "13px",
  fontWeight: 600,
  color: "#1d4771",
  textTransform: "uppercase" as const,
  letterSpacing: "0.05em",
  margin: 0,
};

export default async function ConsultationPage({
  searchParams,
}: {
  searchParams: { token?: string };
}) {
  const token = searchParams.token;
  const report = token ? await getPreDiagnosisReport(token) : null;

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
        <p style={{ fontSize: "15px", fontWeight: 600, color: "#1d4771", margin: "0 0 8px" }}>
          Report Not Found
        </p>
        <p style={{ fontSize: "14px", color: "#6b7280", margin: 0 }}>
          This link may have expired or may be invalid. Return to the{" "}
          <a href="/pre-diagnosis" style={{ color: "#1d4771" }}>
            health check
          </a>{" "}
          to generate a new report.
        </p>
      </main>
    );
  }

  return (
    <main
      style={{
        fontFamily: "system-ui, sans-serif",
        maxWidth: "600px",
        margin: "0 auto",
        padding: "24px 20px",
        display: "flex",
        flexDirection: "column",
        gap: "28px",
        color: "#111827",
      }}
    >
      <FindingsSummary report={report} />
      <CallAgenda />
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <p style={sectionHeadingStyle}>Book Your Expert Review</p>
        <BookingWidget diagnosisToken={token} />
      </div>
    </main>
  );
}

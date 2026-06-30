// Phase 1: Shareable diagnosis results page
// Accessed via token URL — no auth required
// CTA: "Book a consultation" links to /consultation?token=[token]

// TODO: fetch DiagnosisReport via GET /api/diagnosis/[token], render ResultsReport

export default async function DiagnosisResultsPage({ params }: { params: { token: string } }) {
  const { token } = params;
  void token;

  return (
    <main style={{ fontFamily: "system-ui, sans-serif", maxWidth: "600px", margin: "0 auto", padding: "24px 20px" }}>
      <p style={{ color: "#1d4771", fontWeight: 600 }}>AML Compliance Health Check — Results</p>
      <p style={{ color: "#6b7280", fontSize: "13px" }}>Coming soon.</p>
    </main>
  );
}

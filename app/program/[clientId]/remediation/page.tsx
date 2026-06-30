// Phase 3: Remediation tracker
// Shows: checklist of items by pillar, status, assignee, due date
// Both Matthew and client can update status

// TODO: render RemediationTracker component, real-time updates via Supabase

export default async function RemediationPage({ params }: { params: { clientId: string } }) {
  const { clientId } = params;
  void clientId;

  return (
    <main style={{ fontFamily: "system-ui, sans-serif", maxWidth: "720px", margin: "0 auto", padding: "24px 20px" }}>
      <p style={{ color: "#1d4771", fontWeight: 600 }}>Remediation Tracker</p>
      <p style={{ color: "#6b7280", fontSize: "13px" }}>Coming soon.</p>
    </main>
  );
}

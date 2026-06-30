// Phase 3: Client program dashboard
// Shows: program status, overall progress, pillar breakdown, upcoming deadlines

// TODO: fetch Program from Supabase, render ProgramDashboard

export default async function ProgramPage({ params }: { params: { clientId: string } }) {
  const { clientId } = params;
  void clientId;

  return (
    <main style={{ fontFamily: "system-ui, sans-serif", maxWidth: "720px", margin: "0 auto", padding: "24px 20px" }}>
      <p style={{ color: "#1d4771", fontWeight: 600 }}>Program Dashboard</p>
      <p style={{ color: "#6b7280", fontSize: "13px" }}>Coming soon.</p>
    </main>
  );
}

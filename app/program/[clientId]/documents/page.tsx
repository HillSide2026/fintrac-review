// Phase 3: Document management
// Upload/download: policies, procedures, risk assessment, training records
// Stored in Supabase Storage, indexed by program + pillar

// TODO: render DocumentManager component

export default async function DocumentsPage({ params }: { params: { clientId: string } }) {
  const { clientId } = params;
  void clientId;

  return (
    <main style={{ fontFamily: "system-ui, sans-serif", maxWidth: "720px", margin: "0 auto", padding: "24px 20px" }}>
      <p style={{ color: "#1d4771", fontWeight: 600 }}>Documents</p>
      <p style={{ color: "#6b7280", fontSize: "13px" }}>Coming soon.</p>
    </main>
  );
}

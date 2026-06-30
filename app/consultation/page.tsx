// Phase 2: Consultation booking page
// Entry: CTA from diagnosis results page (?token=[token])
// Embeds scheduling widget (GHL calendar or Calendly)
// On book: POST /api/consultation/book → triggers Hugh outreach to Matthew

// TODO: implement ConsultationOverview + BookingWidget components

export default function ConsultationPage() {
  return (
    <main style={{ fontFamily: "system-ui, sans-serif", maxWidth: "560px", margin: "0 auto", padding: "24px 20px" }}>
      <p style={{ color: "#1d4771", fontWeight: 600 }}>Book a Consultation</p>
      <p style={{ color: "#6b7280", fontSize: "13px" }}>Coming soon.</p>
    </main>
  );
}

"use client";

// Phase 2: Scheduling widget
// Options: embed GHL calendar widget OR Calendly embed
// Passes diagnosisToken as metadata to the booking so Matthew gets context

// TODO: implement scheduling embed, pass token via hidden field or URL param

export function BookingWidget({ diagnosisToken }: { diagnosisToken?: string }) {
  void diagnosisToken;
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", padding: "24px 0" }}>
      <p style={{ color: "#6b7280", fontSize: "13px" }}>Scheduling widget — coming soon.</p>
    </div>
  );
}

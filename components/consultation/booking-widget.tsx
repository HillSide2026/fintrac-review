"use client";

type BookingWidgetProps = {
  diagnosisToken?: string;
};

const calendarUrl = process.env.NEXT_PUBLIC_GHL_CALENDAR_URL;

export function BookingWidget({ diagnosisToken }: BookingWidgetProps): JSX.Element {
  const src = calendarUrl
    ? diagnosisToken
      ? `${calendarUrl}?token=${encodeURIComponent(diagnosisToken)}`
      : calendarUrl
    : null;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      <p style={{ fontSize: "14px", color: "#374151", margin: 0 }}>
        Matthew Levine is a Canadian AML compliance lawyer with extensive experience advising
        reporting entities subject to FINTRAC/PCMLTFA.
      </p>

      <p style={{ fontSize: "13px", color: "#6b7280", margin: 0 }}>
        30-minute consultation with Matthew Levine — complimentary, no obligation.
      </p>

      {src ? (
        <iframe
          src={src}
          style={{
            width: "100%",
            height: "700px",
            border: "none",
            borderRadius: "8px",
          }}
          title="Book a consultation with Matthew Levine"
        />
      ) : (
        <p style={{ fontSize: "13px", color: "#6b7280", margin: 0 }}>
          Booking calendar is not configured.
        </p>
      )}
    </div>
  );
}

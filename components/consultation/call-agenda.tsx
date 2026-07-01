const WILL_COVER = [
  "Your organization's specific PCMLTFA obligations by entity type",
  "Which of the identified signals warrant immediate attention",
  "How your program compares to what FINTRAC examiners typically look for",
  "Practical options for strengthening your program",
  "Whether a formal effectiveness review is warranted",
];

const IS_NOT = [
  "This is not a formal effectiveness review or legal opinion",
  "It does not constitute legal advice",
  "No solicitor-client relationship is formed until an engagement letter is signed",
  "This is a complimentary, exploratory conversation",
];

const sectionHeadingStyle = {
  fontSize: "13px",
  fontWeight: 600,
  color: "#1d4771",
  textTransform: "uppercase" as const,
  letterSpacing: "0.05em",
  margin: 0,
};

const listStyle = {
  paddingLeft: "20px",
  fontSize: "14px",
  color: "#374151",
  lineHeight: 1.6,
  margin: 0,
};

export function CallAgenda(): JSX.Element {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      <p style={sectionHeadingStyle}>What We&apos;ll Review on the Call</p>
      <ul style={listStyle}>
        {WILL_COVER.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>

      <div style={{ borderTop: "1px solid #e5e7eb", paddingTop: "16px", display: "flex", flexDirection: "column", gap: "8px" }}>
        <p style={sectionHeadingStyle}>What This Call Is Not</p>
        <ul style={listStyle}>
          {IS_NOT.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

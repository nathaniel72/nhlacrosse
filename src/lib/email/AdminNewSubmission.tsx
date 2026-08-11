import { Hr, Text } from "@react-email/components";
import * as React from "react";
import { EmailLayout, emailButton, emailText } from "./Layout";

export function AdminNewSubmissionEmail({
  athleteName,
  email,
  phone,
  level,
  position,
  gradYear,
  team,
  budgetLabel,
  playingStyle,
  filmUrl,
  adminUrl,
}: {
  athleteName: string;
  email: string;
  phone?: string | null;
  level: string;
  position: string;
  gradYear?: number | null;
  team?: string | null;
  budgetLabel?: string | null;
  playingStyle: string;
  filmUrl: string;
  adminUrl: string;
}) {
  return (
    <EmailLayout
      preview={`New submission from ${athleteName}`}
      heading="New stringing request"
    >
      <Text style={{ ...emailText, fontWeight: 700, marginBottom: 0 }}>
        {athleteName}
      </Text>
      <Text style={emailText}>
        {level}, {position}
        {gradYear ? ` · Class of ${gradYear}` : ""}
        {team ? ` · ${team}` : ""}
      </Text>
      <Text style={emailText}>
        {email}
        {phone ? ` · ${phone}` : ""}
        {budgetLabel ? ` · Budget: ${budgetLabel}` : ""}
      </Text>

      <a href={filmUrl} style={emailButton}>
        Watch Film
      </a>

      <Hr />

      <Text style={{ ...emailText, fontWeight: 700, marginBottom: 0 }}>
        Playing style
      </Text>
      <Text style={emailText}>{playingStyle}</Text>

      <a href={adminUrl} style={{ ...emailButton, backgroundColor: "#0a0a0a" }}>
        Review &amp; Send Recommendation
      </a>
    </EmailLayout>
  );
}

export default AdminNewSubmissionEmail;

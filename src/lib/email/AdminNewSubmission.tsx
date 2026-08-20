import { Hr, Text } from "@react-email/components";
import * as React from "react";
import { EmailLayout, emailButton, emailText } from "./Layout";

export function AdminNewSubmissionEmail({
  athleteName,
  email,
  phone,
  isRestringOnly,
  level,
  position,
  gradYear,
  team,
  budgetLabel,
  playingStyle,
  filmUrl,
  shippingAddress,
  adminUrl,
}: {
  athleteName: string;
  email: string;
  phone?: string | null;
  isRestringOnly: boolean;
  level: string;
  position: string;
  gradYear?: number | null;
  team?: string | null;
  budgetLabel?: string | null;
  playingStyle: string;
  filmUrl?: string | null;
  shippingAddress: string;
  adminUrl: string;
}) {
  return (
    <EmailLayout
      preview={`New submission from ${athleteName}`}
      heading="New stringing request"
    >
      {isRestringOnly ? (
        <Text style={{ ...emailText, fontWeight: 700, color: "#c22a17", marginBottom: 0 }}>
          RESTRING ONLY — no head recommendation needed
        </Text>
      ) : null}
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

      {filmUrl ? (
        <a href={filmUrl} style={emailButton}>
          Watch Film
        </a>
      ) : (
        <Text style={{ ...emailText, fontStyle: "italic" }}>
          No film submitted — review the playing style notes below.
        </Text>
      )}

      <Hr />

      <Text style={{ ...emailText, fontWeight: 700, marginBottom: 0 }}>
        Playing style
      </Text>
      <Text style={emailText}>{playingStyle}</Text>

      <Text style={{ ...emailText, fontWeight: 700, marginBottom: 0 }}>
        Return shipping address
      </Text>
      <Text style={emailText}>{shippingAddress}</Text>

      <a href={adminUrl} style={{ ...emailButton, backgroundColor: "#0a0a0a" }}>
        Review &amp; Send Recommendation
      </a>
    </EmailLayout>
  );
}

export default AdminNewSubmissionEmail;

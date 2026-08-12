import { Text } from "@react-email/components";
import * as React from "react";
import { EmailLayout, emailText } from "./Layout";

export function TeamInquiryEmail({
  contactName,
  teamOrOrg,
  email,
  phone,
  message,
}: {
  contactName: string;
  teamOrOrg: string;
  email: string;
  phone?: string | null;
  message: string;
}) {
  return (
    <EmailLayout preview={`Team order inquiry from ${contactName}`} heading="Team order inquiry">
      <Text style={{ ...emailText, fontWeight: 700, marginBottom: 0 }}>
        {contactName} — {teamOrOrg}
      </Text>
      <Text style={emailText}>
        {email}
        {phone ? ` · ${phone}` : ""}
      </Text>
      <Text style={emailText}>{message}</Text>
    </EmailLayout>
  );
}

export default TeamInquiryEmail;

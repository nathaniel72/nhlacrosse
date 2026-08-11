import { Text } from "@react-email/components";
import * as React from "react";
import { EmailLayout, emailButton, emailText } from "./Layout";

export function RestringRequestEmail({
  athleteName,
  adminUrl,
}: {
  athleteName: string;
  adminUrl: string;
}) {
  return (
    <EmailLayout
      preview={`${athleteName} requested a free restring`}
      heading="Free restring requested"
    >
      <Text style={emailText}>
        {athleteName} isn&apos;t happy with their pocket and requested a free
        restring under your guarantee.
      </Text>
      <a href={adminUrl} style={emailButton}>
        View Submission
      </a>
    </EmailLayout>
  );
}

export default RestringRequestEmail;

import { Text } from "@react-email/components";
import * as React from "react";
import { EmailLayout, emailText } from "./Layout";

export function SubmissionConfirmationEmail({
  athleteName,
  statusUrl,
}: {
  athleteName: string;
  statusUrl: string;
}) {
  return (
    <EmailLayout
      preview="We received your stringing request"
      heading={`Thanks, ${athleteName} — your film is in`}
    >
      <Text style={emailText}>
        I&apos;ve got your submission and I&apos;ll review your film and put together a
        head and pocket recommendation within 48 hours.
      </Text>
      <Text style={emailText}>
        You&apos;ll get another email as soon as your recommendation is ready, with a
        link to pay the stringing fee and get started.
      </Text>
      <Text style={emailText}>
        You can check the status of your request anytime here:
        <br />
        <a href={statusUrl}>{statusUrl}</a>
      </Text>
    </EmailLayout>
  );
}

export default SubmissionConfirmationEmail;

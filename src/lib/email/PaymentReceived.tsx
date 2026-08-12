import { Text } from "@react-email/components";
import * as React from "react";
import { EmailLayout, emailText } from "./Layout";
import { STRINGER_SHIP_TO, STANDARD_STRINGING_DAYS, RUSH_STRINGING_DAYS } from "@/lib/constants";

export function PaymentReceivedEmail({
  athleteName,
  headName,
  isRestringOnly,
  rushRequested,
  statusUrl,
}: {
  athleteName: string;
  headName: string;
  isRestringOnly?: boolean;
  rushRequested?: boolean;
  statusUrl: string;
}) {
  const turnaround = rushRequested ? RUSH_STRINGING_DAYS : STANDARD_STRINGING_DAYS;

  return (
    <EmailLayout
      preview="Payment received — here's where to ship your head"
      heading={`You're all set, ${athleteName}`}
    >
      <Text style={emailText}>
        {isRestringOnly
          ? `Payment received. Ship your ${headName} to:`
          : `Payment received. Once you order the ${headName}, ship it to:`}
      </Text>
      <Text style={{ ...emailText, fontWeight: 700 }}>
        {STRINGER_SHIP_TO.name}
        <br />
        {STRINGER_SHIP_TO.line1}
        {STRINGER_SHIP_TO.line2 ? (
          <>
            <br />
            {STRINGER_SHIP_TO.line2}
          </>
        ) : null}
        <br />
        {STRINGER_SHIP_TO.city}, {STRINGER_SHIP_TO.state}{" "}
        {STRINGER_SHIP_TO.postalCode}
        <br />
        {STRINGER_SHIP_TO.country}
      </Text>
      <Text style={emailText}>
        Once it arrives I&apos;ll get to stringing — {turnaround}
        {rushRequested ? " (rush)" : ""}, then it ships right back to you. You
        can track progress here:
        <br />
        <a href={statusUrl}>{statusUrl}</a>
      </Text>
    </EmailLayout>
  );
}

export default PaymentReceivedEmail;

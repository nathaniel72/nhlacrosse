import { Text } from "@react-email/components";
import * as React from "react";
import { EmailLayout, emailButton, emailText } from "./Layout";

export function StatusUpdateEmail({
  athleteName,
  statusLabel,
  note,
  trackingNumber,
  trackingCarrier,
  statusUrl,
}: {
  athleteName: string;
  statusLabel: string;
  note?: string | null;
  trackingNumber?: string | null;
  trackingCarrier?: string | null;
  statusUrl: string;
}) {
  return (
    <EmailLayout preview={`Update: ${statusLabel}`} heading={`Update on your stick, ${athleteName}`}>
      <Text style={{ ...emailText, fontWeight: 700 }}>Status: {statusLabel}</Text>
      {note ? <Text style={emailText}>{note}</Text> : null}
      {trackingNumber ? (
        <Text style={emailText}>
          Tracking ({trackingCarrier ?? "carrier"}): {trackingNumber}
        </Text>
      ) : null}
      <a href={statusUrl} style={emailButton}>
        View Full Status
      </a>
    </EmailLayout>
  );
}

export default StatusUpdateEmail;

import { Text } from "@react-email/components";
import * as React from "react";
import { EmailLayout, emailButton, emailText } from "./Layout";
import { STATUS_LABELS } from "@/lib/constants";

type OrderLink = {
  athleteName: string;
  status: string;
  statusUrl: string;
};

export function FindOrderEmail({ orders }: { orders: OrderLink[] }) {
  return (
    <EmailLayout preview="Your stringing request links" heading="Here's where to find your request">
      <Text style={emailText}>
        {orders.length > 1
          ? "You've got a few requests on file — here's a link to each one:"
          : "Here's your link:"}
      </Text>
      {orders.map((o, i) => (
        <Text key={i} style={emailText}>
          <strong>{o.athleteName}</strong> — {STATUS_LABELS[o.status] ?? o.status}
          <br />
          <a href={o.statusUrl}>{o.statusUrl}</a>
        </Text>
      ))}
      <a href={orders[0]?.statusUrl} style={emailButton}>
        View Status
      </a>
    </EmailLayout>
  );
}

export default FindOrderEmail;

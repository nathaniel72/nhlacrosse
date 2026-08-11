import { Hr, Text } from "@react-email/components";
import * as React from "react";
import { EmailLayout, emailButton, emailText } from "./Layout";
import { STRINGER_SHIP_TO, formatCents } from "@/lib/constants";

type HeadOption = {
  name: string;
  notes: string | null;
  purchaseLink: string | null;
  recommended: boolean;
};

type StringOption = {
  name: string;
  color: string | null;
  priceCents: number;
};

export function RecommendationReadyEmail({
  athleteName,
  headOptions,
  pocketNotes,
  stringNotes,
  suggestedStrings,
  priceLabel,
  payUrl,
}: {
  athleteName: string;
  headOptions: HeadOption[];
  pocketNotes: string;
  stringNotes?: string | null;
  suggestedStrings?: StringOption[];
  priceLabel: string;
  payUrl: string;
}) {
  return (
    <EmailLayout
      preview="Your head + pocket recommendation is ready"
      heading={`Here's what I'd run, ${athleteName}`}
    >
      <Text style={emailText}>
        I watched your film and put together{" "}
        {headOptions.length > 1 ? "a few options" : "a recommendation"} built
        around your playing style.
      </Text>
      <Hr />
      {headOptions.map((head, i) => (
        <Text key={i} style={{ ...emailText, marginBottom: 4 }}>
          <strong>
            {head.name}
            {head.recommended && headOptions.length > 1 ? " (top pick)" : ""}
          </strong>
          {head.notes ? <>: {head.notes}</> : null}
          {head.purchaseLink ? (
            <>
              {" — "}
              <a href={head.purchaseLink}>where to buy</a>
            </>
          ) : null}
        </Text>
      ))}
      <Hr />
      <Text style={emailText}>Pocket: {pocketNotes}</Text>
      {stringNotes ? <Text style={emailText}>Strings: {stringNotes}</Text> : null}
      {suggestedStrings && suggestedStrings.length > 0 ? (
        <>
          <Text style={{ ...emailText, fontWeight: 700, marginBottom: 0 }}>
            Strings available from me:
          </Text>
          {suggestedStrings.map((s, i) => (
            <Text key={i} style={emailText}>
              {s.name}
              {s.color ? ` — ${s.color}` : ""} ({formatCents(s.priceCents)}) — add it
              at checkout, or order your own color when you buy the head.
            </Text>
          ))}
        </>
      ) : null}
      <Hr />
      <Text style={emailText}>
        Stringing fee: <strong>{priceLabel}</strong>
      </Text>
      <Text style={{ ...emailText, fontWeight: 700, marginBottom: 0 }}>
        Ship the head you order to:
      </Text>
      <Text style={emailText}>
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
        {STRINGER_SHIP_TO.city}, {STRINGER_SHIP_TO.state} {STRINGER_SHIP_TO.postalCode}
        <br />
        {STRINGER_SHIP_TO.country}
      </Text>
      <Text style={emailText}>
        You can order it any time — no need to wait until you&apos;ve paid. If
        the pocket isn&apos;t right when you get it, I&apos;ll restring it for free.
      </Text>
      <a href={payUrl} style={emailButton}>
        Choose Your Head &amp; Pay Stringing Fee
      </a>
    </EmailLayout>
  );
}

export default RecommendationReadyEmail;

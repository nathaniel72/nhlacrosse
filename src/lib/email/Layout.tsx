import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";
import { SITE_NAME } from "@/lib/constants";

export function EmailLayout({
  preview,
  heading,
  children,
}: {
  preview: string;
  heading: string;
  children: React.ReactNode;
}) {
  return (
    <Html>
      <Head />
      <Preview>{preview}</Preview>
      <Body
        style={{
          backgroundColor: "#0a0a0a",
          fontFamily: "Helvetica, Arial, sans-serif",
          margin: 0,
          padding: "32px 0",
        }}
      >
        <Container
          style={{
            backgroundColor: "#ffffff",
            borderRadius: 12,
            maxWidth: 480,
            margin: "0 auto",
            overflow: "hidden",
          }}
        >
          <Section style={{ backgroundColor: "#0a0a0a", padding: "20px 32px" }}>
            <Text
              style={{
                color: "#2563eb",
                fontWeight: 700,
                fontSize: 14,
                letterSpacing: 1,
                textTransform: "uppercase",
                margin: 0,
              }}
            >
              {SITE_NAME}
            </Text>
          </Section>
          <Section style={{ padding: "28px 32px" }}>
            <Heading
              style={{
                fontSize: 20,
                color: "#0a0a0a",
                marginTop: 0,
                marginBottom: 16,
              }}
            >
              {heading}
            </Heading>
            {children}
          </Section>
          <Section style={{ padding: "0 32px 24px" }}>
            <Text style={{ color: "#94a3b8", fontSize: 12, lineHeight: "18px" }}>
              Save this email — it has your link to check status and pay. Lost
              it?{" "}
              <a
                href={`${process.env.NEXT_PUBLIC_SITE_URL ?? "https://nhlacrosse.com"}/find-order`}
                style={{ color: "#94a3b8" }}
              >
                Recover it here
              </a>
              .
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

export const emailText = {
  color: "#334155",
  fontSize: 15,
  lineHeight: "24px",
};

export const emailButton = {
  backgroundColor: "#2563eb",
  borderRadius: 8,
  color: "#ffffff",
  display: "inline-block",
  fontSize: 15,
  fontWeight: 700,
  padding: "12px 24px",
  textDecoration: "none",
  marginTop: 12,
};

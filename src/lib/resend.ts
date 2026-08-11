import { Resend } from "resend";

const apiKey = process.env.RESEND_API_KEY;

export const resend = apiKey ? new Resend(apiKey) : null;

export const EMAIL_FROM = process.env.EMAIL_FROM ?? "onboarding@resend.dev";

export async function sendEmail(params: {
  to: string;
  subject: string;
  react: React.ReactElement;
}) {
  if (!resend) {
    console.warn(
      `[email] RESEND_API_KEY not set — skipping send to ${params.to}: "${params.subject}"`
    );
    return;
  }

  const { error } = await resend.emails.send({
    from: EMAIL_FROM,
    to: params.to,
    subject: params.subject,
    react: params.react,
  });

  if (error) {
    console.error("[email] send failed", error);
  }
}

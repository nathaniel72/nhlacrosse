import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { teamInquirySchema } from "@/lib/validations";
import { sendEmail } from "@/lib/resend";
import { ADMIN_NOTIFICATION_EMAIL } from "@/lib/constants";
import { TeamInquiryEmail } from "@/lib/email/TeamInquiry";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ message: "Invalid request body" }, { status: 400 });
  }

  const parsed = teamInquirySchema.safeParse(body);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0];
      if (typeof key === "string" && !fieldErrors[key]) {
        fieldErrors[key] = issue.message;
      }
    }
    return NextResponse.json(
      { message: "Please fix the highlighted fields", fieldErrors },
      { status: 400 }
    );
  }

  const data = parsed.data;

  const inquiry = await prisma.teamInquiry.create({
    data: {
      contactName: data.contactName,
      teamOrOrg: data.teamOrOrg,
      email: data.email,
      phone: data.phone || null,
      message: data.message,
    },
  });

  await sendEmail({
    to: ADMIN_NOTIFICATION_EMAIL,
    subject: `Team order inquiry: ${inquiry.teamOrOrg}`,
    react: TeamInquiryEmail({
      contactName: inquiry.contactName,
      teamOrOrg: inquiry.teamOrOrg,
      email: inquiry.email,
      phone: inquiry.phone,
      message: inquiry.message,
    }),
  });

  return NextResponse.json({ ok: true }, { status: 201 });
}

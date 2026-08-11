import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/resend";
import { ADMIN_NOTIFICATION_EMAIL } from "@/lib/constants";
import { RestringRequestEmail } from "@/lib/email/RestringRequest";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const token = body?.token;
  if (!token || typeof token !== "string") {
    return NextResponse.json({ message: "Missing token" }, { status: 400 });
  }

  const submission = await prisma.submission.findUnique({ where: { statusToken: token } });
  if (!submission) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }

  await prisma.submission.update({
    where: { id: submission.id },
    data: {
      restringRequestedAt: new Date(),
      statusEvents: {
        create: { status: submission.status, note: "Free restring requested by athlete" },
      },
    },
  });

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  await sendEmail({
    to: ADMIN_NOTIFICATION_EMAIL,
    subject: `Restring requested: ${submission.athleteName}`,
    react: RestringRequestEmail({
      athleteName: submission.athleteName,
      adminUrl: `${siteUrl}/admin/submissions/${submission.id}`,
    }),
  });

  return NextResponse.json({ ok: true });
}

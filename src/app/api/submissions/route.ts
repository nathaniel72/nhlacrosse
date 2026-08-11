import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { submissionSchema } from "@/lib/validations";
import { sendEmail } from "@/lib/resend";
import {
  ADMIN_NOTIFICATION_EMAIL,
  PLAYER_LEVEL_LABELS,
  formatCents,
} from "@/lib/constants";
import { SubmissionConfirmationEmail } from "@/lib/email/SubmissionConfirmation";
import { AdminNewSubmissionEmail } from "@/lib/email/AdminNewSubmission";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ message: "Invalid request body" }, { status: 400 });
  }

  const parsed = submissionSchema.safeParse(body);

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

  const submission = await prisma.submission.create({
    data: {
      athleteName: data.athleteName,
      email: data.email,
      phone: data.phone || null,
      position: data.position,
      gradYear: data.gradYear ?? null,
      level: data.level,
      team: data.team || null,
      currentStick: data.currentStick || null,
      playingStyle: data.playingStyle,
      filmUrl: data.filmUrl,
      budgetCents: data.budgetCents ?? null,
      additionalNotes: data.additionalNotes || null,
      statusEvents: {
        create: { status: "SUBMITTED" },
      },
    },
  });

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const statusUrl = `${siteUrl}/status/${submission.statusToken}`;
  const adminUrl = `${siteUrl}/admin/submissions/${submission.id}`;

  await Promise.all([
    sendEmail({
      to: submission.email,
      subject: "We received your stringing request",
      react: SubmissionConfirmationEmail({
        athleteName: submission.athleteName,
        statusUrl,
      }),
    }),
    sendEmail({
      to: ADMIN_NOTIFICATION_EMAIL,
      subject: `New submission: ${submission.athleteName}`,
      react: AdminNewSubmissionEmail({
        athleteName: submission.athleteName,
        email: submission.email,
        phone: submission.phone,
        level: PLAYER_LEVEL_LABELS[submission.level] ?? submission.level,
        position: submission.position,
        gradYear: submission.gradYear,
        team: submission.team,
        budgetLabel: submission.budgetCents ? formatCents(submission.budgetCents) : null,
        playingStyle: submission.playingStyle,
        filmUrl: submission.filmUrl,
        adminUrl,
      }),
    }),
  ]);

  return NextResponse.json({ statusToken: submission.statusToken }, { status: 201 });
}

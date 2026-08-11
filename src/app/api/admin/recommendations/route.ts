import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { recommendationSchema } from "@/lib/validations";
import { sendEmail } from "@/lib/resend";
import { formatCents } from "@/lib/constants";
import { RecommendationReadyEmail } from "@/lib/email/RecommendationReady";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  if (!body?.submissionId || typeof body.submissionId !== "string") {
    return NextResponse.json({ message: "Missing submissionId" }, { status: 400 });
  }

  const parsed = recommendationSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { message: parsed.error.issues[0]?.message ?? "Please fix the highlighted fields" },
      { status: 400 }
    );
  }

  const submission = await prisma.submission.findUnique({
    where: { id: body.submissionId },
  });
  if (!submission) {
    return NextResponse.json({ message: "Submission not found" }, { status: 404 });
  }

  const data = parsed.data;

  if (!data.headOptions.some((h) => h.recommended)) {
    data.headOptions[0].recommended = true;
  }

  const existing = await prisma.recommendation.findUnique({
    where: { submissionId: submission.id },
  });
  if (existing) {
    await prisma.headOption.deleteMany({ where: { recommendationId: existing.id } });
  }

  const recommendation = await prisma.recommendation.upsert({
    where: { submissionId: submission.id },
    update: {
      pocketNotes: data.pocketNotes,
      stringNotes: data.stringNotes || null,
      priceCents: data.priceCents,
      sentAt: new Date(),
      headOptions: {
        create: data.headOptions.map((h, i) => ({
          name: h.name,
          notes: h.notes || null,
          purchaseLink: h.purchaseLink || null,
          recommended: h.recommended ?? false,
          sortOrder: i,
        })),
      },
      suggestedStrings: {
        set: data.suggestedStringOptionIds.map((id) => ({ id })),
      },
    },
    create: {
      submissionId: submission.id,
      pocketNotes: data.pocketNotes,
      stringNotes: data.stringNotes || null,
      priceCents: data.priceCents,
      sentAt: new Date(),
      headOptions: {
        create: data.headOptions.map((h, i) => ({
          name: h.name,
          notes: h.notes || null,
          purchaseLink: h.purchaseLink || null,
          recommended: h.recommended ?? false,
          sortOrder: i,
        })),
      },
      suggestedStrings: {
        connect: data.suggestedStringOptionIds.map((id) => ({ id })),
      },
    },
    include: { headOptions: { orderBy: { sortOrder: "asc" } }, suggestedStrings: true },
  });

  await prisma.submission.update({
    where: { id: submission.id },
    data: {
      status: "RECOMMENDATION_SENT",
      statusEvents: {
        create: { status: "RECOMMENDATION_SENT" },
      },
    },
  });

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const payUrl = `${siteUrl}/pay/${submission.statusToken}`;

  await sendEmail({
    to: submission.email,
    subject: "Your head + pocket recommendation is ready",
    react: RecommendationReadyEmail({
      athleteName: submission.athleteName,
      headOptions: recommendation.headOptions,
      pocketNotes: recommendation.pocketNotes,
      stringNotes: recommendation.stringNotes,
      suggestedStrings: recommendation.suggestedStrings,
      priceLabel: formatCents(recommendation.priceCents),
      payUrl,
    }),
  });

  return NextResponse.json({ ok: true });
}

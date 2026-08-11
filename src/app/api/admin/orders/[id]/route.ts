import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/resend";
import { STATUS_LABELS } from "@/lib/constants";
import { StatusUpdateEmail } from "@/lib/email/StatusUpdate";

const ALLOWED_STATUSES = ["HEAD_RECEIVED", "STRINGING", "SHIPPED", "COMPLETE"] as const;

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json().catch(() => null);

  const status = body?.status;
  if (!ALLOWED_STATUSES.includes(status)) {
    return NextResponse.json({ message: "Invalid status" }, { status: 400 });
  }

  const order = await prisma.order.findUnique({
    where: { id },
    include: { submission: true },
  });
  if (!order) {
    return NextResponse.json({ message: "Order not found" }, { status: 404 });
  }

  const trackingNumber = typeof body.trackingNumber === "string" ? body.trackingNumber.trim() : undefined;
  const trackingCarrier = typeof body.trackingCarrier === "string" ? body.trackingCarrier.trim() : undefined;
  const note = typeof body.note === "string" ? body.note.trim() : undefined;

  await prisma.order.update({
    where: { id },
    data: {
      ...(trackingNumber ? { trackingNumber } : {}),
      ...(trackingCarrier ? { trackingCarrier } : {}),
    },
  });

  await prisma.submission.update({
    where: { id: order.submissionId },
    data: {
      status,
      statusEvents: { create: { status, note: note || null } },
    },
  });

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  await sendEmail({
    to: order.submission.email,
    subject: `Update on your stick: ${STATUS_LABELS[status]}`,
    react: StatusUpdateEmail({
      athleteName: order.submission.athleteName,
      statusLabel: STATUS_LABELS[status],
      note,
      trackingNumber: trackingNumber || order.trackingNumber,
      trackingCarrier: trackingCarrier || order.trackingCarrier,
      statusUrl: `${siteUrl}/status/${order.submission.statusToken}`,
    }),
  });

  return NextResponse.json({ ok: true });
}

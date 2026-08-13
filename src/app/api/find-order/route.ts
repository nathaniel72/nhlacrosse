import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { findOrderSchema } from "@/lib/validations";
import { sendEmail } from "@/lib/resend";
import { FindOrderEmail } from "@/lib/email/FindOrder";

const GENERIC_MESSAGE =
  "If we found a request under that email, we've sent a link to it.";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = findOrderSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { message: parsed.error.issues[0]?.message ?? "Enter a valid email" },
      { status: 400 }
    );
  }

  const { email } = parsed.data;

  const submissions = await prisma.submission.findMany({
    where: { email: { equals: email, mode: "insensitive" } },
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  // Always return the same generic message whether or not anything was
  // found, so this endpoint can't be used to check which emails have
  // submitted a request.
  if (submissions.length === 0) {
    return NextResponse.json({ message: GENERIC_MESSAGE });
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  await sendEmail({
    to: email,
    subject: "Your stringing request links",
    react: FindOrderEmail({
      orders: submissions.map((s) => ({
        athleteName: s.athleteName,
        status: s.status,
        statusUrl: `${siteUrl}/status/${s.statusToken}`,
      })),
    }),
  });

  return NextResponse.json({ message: GENERIC_MESSAGE });
}

import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/resend";
import { PaymentReceivedEmail } from "@/lib/email/PaymentReceived";

export async function POST(req: NextRequest) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret || !process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json({ message: "Stripe not configured" }, { status: 503 });
  }

  const signature = req.headers.get("stripe-signature");
  const rawBody = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature ?? "", webhookSecret);
  } catch (err) {
    console.error("[stripe webhook] signature verification failed", err);
    return NextResponse.json({ message: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const submissionId = session.metadata?.submissionId;

    if (submissionId) {
      const submission = await prisma.submission.findUnique({
        where: { id: submissionId },
        include: { order: true },
      });

      if (submission && submission.status !== "PAID") {
        const order = await prisma.order.update({
          where: { submissionId },
          data: {
            paidAt: new Date(),
            stripePaymentIntentId:
              typeof session.payment_intent === "string" ? session.payment_intent : null,
          },
        });

        await prisma.submission.update({
          where: { id: submissionId },
          data: {
            status: "PAID",
            statusEvents: { create: { status: "PAID" } },
          },
        });

        const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
        await sendEmail({
          to: submission.email,
          subject: "Payment received — here's where to ship your head",
          react: PaymentReceivedEmail({
            athleteName: submission.athleteName,
            headName: order.selectedHeadName ?? "your head",
            statusUrl: `${siteUrl}/status/${submission.statusToken}`,
          }),
        });
      }
    }
  }

  return NextResponse.json({ received: true });
}

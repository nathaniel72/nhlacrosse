import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { checkoutSelectionSchema } from "@/lib/validations";
import { RUSH_FEE_CENTS, RUSH_STRINGING_DAYS, STANDARD_STRINGING_DAYS } from "@/lib/constants";

export async function POST(req: NextRequest) {
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json(
      { message: "Payments aren't configured yet. Contact the stringer directly." },
      { status: 503 }
    );
  }

  const body = await req.json().catch(() => null);
  const parsed = checkoutSelectionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ message: "Invalid request" }, { status: 400 });
  }
  const { token, headOptionId, stringOptionIds, rush } = parsed.data;

  const submission = await prisma.submission.findUnique({
    where: { statusToken: token },
    include: {
      recommendation: {
        include: {
          headOptions: true,
          suggestedStrings: { where: { active: true } },
        },
      },
      order: true,
    },
  });

  if (!submission || !submission.recommendation) {
    return NextResponse.json({ message: "Recommendation not found" }, { status: 404 });
  }

  if (submission.order?.paidAt) {
    return NextResponse.json({ message: "This order has already been paid" }, { status: 400 });
  }

  const hasHeadOptions = submission.recommendation.headOptions.length > 0;
  const headOption = hasHeadOptions
    ? submission.recommendation.headOptions.find((h) => h.id === headOptionId)
    : null;
  if (hasHeadOptions && !headOption) {
    return NextResponse.json({ message: "Choose a valid head option" }, { status: 400 });
  }

  const selectedStrings = submission.recommendation.suggestedStrings.filter((s) =>
    stringOptionIds.includes(s.id)
  );

  const amountCents =
    submission.recommendation.priceCents +
    selectedStrings.reduce((sum, s) => sum + s.priceCents, 0) +
    (rush ? RUSH_FEE_CENTS : 0);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  const lineItems = [
    {
      price_data: {
        currency: "usd",
        product_data: {
          name: headOption
            ? `Stringing Fee — ${headOption.name}`
            : "Stringing Fee — Restring",
        },
        unit_amount: submission.recommendation.priceCents,
      },
      quantity: 1,
    },
    ...selectedStrings.map((s) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: `Strings — ${s.name}${s.color ? ` (${s.color})` : ""}`,
        },
        unit_amount: s.priceCents,
      },
      quantity: 1,
    })),
    ...(rush
      ? [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: `Rush Turnaround (${RUSH_STRINGING_DAYS} instead of ${STANDARD_STRINGING_DAYS})`,
              },
              unit_amount: RUSH_FEE_CENTS,
            },
            quantity: 1,
          },
        ]
      : []),
  ];

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: lineItems,
    customer_email: submission.email,
    success_url: `${siteUrl}/status/${token}?paid=1`,
    cancel_url: `${siteUrl}/pay/${token}?canceled=1`,
    metadata: { submissionId: submission.id },
  });

  const orderData = {
    stripeCheckoutSessionId: session.id,
    amountCents,
    selectedHeadName: headOption ? headOption.name : "Existing head (restring)",
    selectedHeadNotes: headOption?.notes ?? null,
    selectedHeadPurchaseLink: headOption?.purchaseLink ?? null,
    selectedStrings: selectedStrings.map((s) => ({
      name: s.name,
      color: s.color,
      priceCents: s.priceCents,
    })),
    rushRequested: rush,
  };

  await prisma.order.upsert({
    where: { submissionId: submission.id },
    update: orderData,
    create: { submissionId: submission.id, ...orderData },
  });

  return NextResponse.json({ url: session.url });
}

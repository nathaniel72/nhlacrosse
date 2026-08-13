import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/Card";
import { PaySelector } from "@/components/PaySelector";
import { STRINGER_SHIP_TO, formatCents } from "@/lib/constants";

export const dynamic = "force-dynamic";

export default async function PayPage({
  params,
}: PageProps<"/pay/[token]">) {
  const { token } = await params;

  const submission = await prisma.submission.findUnique({
    where: { statusToken: token },
    include: {
      recommendation: {
        include: {
          headOptions: { orderBy: { sortOrder: "asc" } },
          suggestedStrings: { where: { active: true } },
        },
      },
      order: true,
    },
  });

  if (!submission || !submission.recommendation) notFound();

  const alreadyPaid = !!submission.order?.paidAt;
  const isRestringOnly = submission.serviceType === "RESTRING_ONLY";

  return (
    <div className="container-page max-w-lg py-16 sm:py-20">
      <p className="text-sm font-semibold uppercase tracking-widest text-accent">
        Your Recommendation
      </p>
      <h1 className="mt-2 text-3xl font-bold text-navy">
        {submission.athleteName}
      </h1>

      <Card className="mt-8">
        {alreadyPaid ? (
          <div className="space-y-3 text-sm">
            {submission.order?.selectedHeadName ? (
              <div>
                <p className="text-muted">Head</p>
                <p className="font-semibold text-navy">
                  {submission.order.selectedHeadName}
                </p>
              </div>
            ) : null}
            <div>
              <p className="text-muted">Pocket</p>
              <p className="text-navy">{submission.recommendation.pocketNotes}</p>
            </div>
            <div className="border-t border-border pt-3">
              <p className="text-muted">Total Paid</p>
              <p className="text-xl font-bold text-navy">
                {formatCents(submission.order?.amountCents ?? 0)}
              </p>
            </div>
            <p className="rounded-lg bg-emerald-50 px-4 py-3 font-medium text-emerald-700">
              Payment received — you&apos;re all set.
            </p>
          </div>
        ) : (
          <PaySelector
            token={token}
            headOptions={submission.recommendation.headOptions}
            suggestedStrings={submission.recommendation.suggestedStrings}
            stringingFeeCents={submission.recommendation.priceCents}
          />
        )}
      </Card>

      <Card className="mt-6">
        <p className="text-muted">
          {isRestringOnly ? "Ship your head to" : "Ship the head you order to"}
        </p>
        <p className="mt-2 font-semibold text-navy">
          {STRINGER_SHIP_TO.name}
          <br />
          {STRINGER_SHIP_TO.line1}
          {STRINGER_SHIP_TO.line2 ? (
            <>
              <br />
              {STRINGER_SHIP_TO.line2}
            </>
          ) : null}
          <br />
          {STRINGER_SHIP_TO.city}, {STRINGER_SHIP_TO.state} {STRINGER_SHIP_TO.postalCode}
          <br />
          {STRINGER_SHIP_TO.country}
        </p>
        <p className="mt-3 text-sm text-muted">
          {isRestringOnly
            ? "Send it whenever works for you."
            : "Order it whenever works for you — you don't need to wait until you've paid the stringing fee."}{" "}
          Once it arrives, I&apos;ll get to stringing and keep you posted.
        </p>
      </Card>

      <p className="mt-6 text-sm text-muted">
        Not sure this is the right call? Reply to your recommendation email
        and we&apos;ll talk it through — every job is backed by a free restring
        if the pocket isn&apos;t right.
      </p>
      <p className="mt-2 text-sm text-muted">
        Bookmark this page to come back later. Lost it?{" "}
        <Link href="/find-order" className="text-accent hover:underline">
          Recover your link
        </Link>
        .
      </p>
    </div>
  );
}

import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/Card";
import { ButtonLink } from "@/components/ui/Button";
import { RestringRequestButton } from "@/components/RestringRequestButton";
import {
  STATUS_LABELS,
  STATUS_ORDER,
  formatCents,
  RESTRING_GUARANTEE_DAYS,
} from "@/lib/constants";

export const dynamic = "force-dynamic";

export default async function StatusPage({
  params,
  searchParams,
}: PageProps<"/status/[token]">) {
  const { token } = await params;
  const { submitted, paid } = await searchParams;

  const submission = await prisma.submission.findUnique({
    where: { statusToken: token },
    include: {
      recommendation: { include: { headOptions: { orderBy: { sortOrder: "asc" } } } },
      order: true,
    },
  });

  if (!submission) notFound();

  const currentIndex = STATUS_ORDER.indexOf(submission.status);
  const canRequestRestring =
    submission.status === "SHIPPED" || submission.status === "COMPLETE";

  return (
    <div className="container-page max-w-lg py-16 sm:py-20">
      {submitted ? (
        <p className="mb-6 rounded-lg bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
          Submission received — I&apos;ll be in touch within 48 hours. Bookmark
          this page (or check your email) to come back and check status or
          pay later.
        </p>
      ) : null}
      {paid ? (
        <p className="mb-6 rounded-lg bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
          Payment received — check your email for shipping instructions.
        </p>
      ) : null}

      <p className="text-sm font-semibold uppercase tracking-widest text-accent">
        Status
      </p>
      <h1 className="mt-2 font-display text-3xl uppercase tracking-tight text-navy">
        {submission.athleteName}
      </h1>

      <Card className="mt-8">
        <ol className="flex flex-col gap-4">
          {STATUS_ORDER.map((status, i) => {
            const done = i <= currentIndex;
            const isCurrent = i === currentIndex;
            return (
              <li key={status} className="flex items-center gap-3">
                <span
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                    done ? "bg-accent text-white" : "bg-surface-muted text-muted"
                  }`}
                >
                  {done ? "✓" : i + 1}
                </span>
                <span
                  className={`text-sm ${
                    isCurrent ? "font-semibold text-navy" : done ? "text-navy" : "text-muted"
                  }`}
                >
                  {STATUS_LABELS[status]}
                </span>
              </li>
            );
          })}
        </ol>
      </Card>

      {submission.recommendation ? (
        <Card className="mt-6">
          <h2 className="font-semibold text-navy">Your Recommendation</h2>
          <div className="mt-3 space-y-2 text-sm">
            {submission.order?.paidAt ? (
              <>
                <p>
                  <span className="text-muted">Head: </span>
                  {submission.order.selectedHeadName}
                </p>
                {Array.isArray(submission.order.selectedStrings) &&
                submission.order.selectedStrings.length > 0 ? (
                  <p>
                    <span className="text-muted">Strings: </span>
                    {(submission.order.selectedStrings as { name: string }[])
                      .map((s) => s.name)
                      .join(", ")}
                  </p>
                ) : null}
                <p>
                  <span className="text-muted">Pocket: </span>
                  {submission.recommendation.pocketNotes}
                </p>
                <p>
                  <span className="text-muted">Total paid: </span>
                  {formatCents(submission.order.amountCents)}
                </p>
              </>
            ) : (
              <>
                <p>
                  <span className="text-muted">Head options: </span>
                  {submission.recommendation.headOptions.map((h) => h.name).join(", ")}
                </p>
                <p>
                  <span className="text-muted">Pocket: </span>
                  {submission.recommendation.pocketNotes}
                </p>
                <p>
                  <span className="text-muted">Stringing fee: </span>
                  {formatCents(submission.recommendation.priceCents)}
                </p>
              </>
            )}
          </div>
          {!submission.order?.paidAt ? (
            <ButtonLink href={`/pay/${token}`} className="mt-4">
              Choose Your Head &amp; Pay
            </ButtonLink>
          ) : null}
        </Card>
      ) : null}

      {submission.order?.trackingNumber ? (
        <Card className="mt-6">
          <h2 className="font-semibold text-navy">Tracking</h2>
          <p className="mt-2 text-sm text-navy">
            {submission.order.trackingCarrier ?? "Carrier"}:{" "}
            {submission.order.trackingNumber}
          </p>
        </Card>
      ) : null}

      {canRequestRestring ? (
        <div className="mt-8">
          <p className="mb-3 text-sm text-muted">
            Pocket not feeling right? It&apos;s on me — one free restring within{" "}
            {RESTRING_GUARANTEE_DAYS} days of delivery.
          </p>
          {submission.restringRequestedAt ? (
            <p className="rounded-lg bg-surface-muted px-4 py-3 text-sm text-muted">
              Restring requested — we&apos;ll be in touch.
            </p>
          ) : (
            <RestringRequestButton token={token} />
          )}
        </div>
      ) : null}

      <p className="mt-10 text-sm text-muted">
        Questions? <Link href="/about" className="text-accent hover:underline">Learn more about how I work</Link>.
      </p>
      <p className="mt-2 text-sm text-muted">
        Bookmark this page to check back later. Lost it?{" "}
        <Link href="/find-order" className="text-accent hover:underline">
          Recover your link
        </Link>
        .
      </p>
    </div>
  );
}

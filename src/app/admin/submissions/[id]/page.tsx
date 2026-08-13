import Link from "next/link";
import { notFound } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { RecommendationForm } from "@/components/admin/RecommendationForm";
import { DeleteSubmissionButton } from "@/components/admin/DeleteSubmissionButton";
import {
  PLAYER_LEVEL_LABELS,
  STATUS_LABELS,
  formatCents,
  formatShippingAddress,
} from "@/lib/constants";

export const dynamic = "force-dynamic";

export default async function AdminSubmissionDetailPage({
  params,
}: PageProps<"/admin/submissions/[id]">) {
  const { id } = await params;

  const [submission, stringCatalog] = await Promise.all([
    prisma.submission.findUnique({
      where: { id },
      include: {
        recommendation: {
          include: {
            headOptions: { orderBy: { sortOrder: "asc" } },
            suggestedStrings: true,
          },
        },
        order: true,
      },
    }),
    prisma.stringOption.findMany({
      where: { active: true },
      orderBy: { sortOrder: "asc" },
    }),
  ]);

  if (!submission) notFound();

  async function markReviewed() {
    "use server";
    await auth();
    await prisma.submission.update({
      where: { id },
      data: {
        status: "REVIEWED",
        statusEvents: { create: { status: "REVIEWED" } },
      },
    });
    revalidatePath(`/admin/submissions/${id}`);
    revalidatePath("/admin");
  }

  const details: [string, string | number | null | undefined][] = [
    ["Email", submission.email],
    ["Phone", submission.phone],
    ["Position", submission.position],
    ["Level", PLAYER_LEVEL_LABELS[submission.level] ?? submission.level],
    ["Grad Year", submission.gradYear],
    ["Team / School", submission.team],
    ["Budget", submission.budgetCents ? formatCents(submission.budgetCents) : null],
  ];

  return (
    <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <Link href="/admin" className="text-sm text-muted hover:text-accent">
              &larr; All submissions
            </Link>
            <h1 className="mt-1 text-2xl font-bold text-navy">
              {submission.athleteName}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            {submission.serviceType === "RESTRING_ONLY" ? (
              <Badge tone="accent">Restring Only</Badge>
            ) : null}
            <Badge>{STATUS_LABELS[submission.status] ?? submission.status}</Badge>
            <DeleteSubmissionButton
              id={submission.id}
              athleteName={submission.athleteName}
              redirectTo="/admin"
            />
          </div>
        </div>

        <Card>
          <h2 className="font-semibold text-navy">Athlete Info</h2>
          <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
            {details.map(([label, value]) =>
              value ? (
                <div key={label}>
                  <dt className="text-muted">{label}</dt>
                  <dd className="font-medium text-navy">{value}</dd>
                </div>
              ) : null
            )}
          </dl>
          {submission.filmUrl ? (
            <a
              href={submission.filmUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-5 inline-flex text-sm font-semibold text-accent hover:underline"
            >
              Watch Film &rarr;
            </a>
          ) : (
            <p className="mt-5 text-sm italic text-muted">No film submitted</p>
          )}
        </Card>

        <Card>
          <h2 className="font-semibold text-navy">Playing Style</h2>
          <p className="mt-2 whitespace-pre-wrap text-sm text-muted">
            {submission.playingStyle}
          </p>
        </Card>

        <Card>
          <h2 className="font-semibold text-navy">Return Shipping Address</h2>
          <p className="mt-2 text-sm text-muted">{formatShippingAddress(submission)}</p>
        </Card>

        {submission.currentStick ? (
          <Card>
            <h2 className="font-semibold text-navy">
              {submission.serviceType === "RESTRING_ONLY" ? "Head Being Sent In" : "Current Stick"}
            </h2>
            <p className="mt-2 whitespace-pre-wrap text-sm text-muted">
              {submission.currentStick}
            </p>
          </Card>
        ) : null}

        {submission.additionalNotes ? (
          <Card>
            <h2 className="font-semibold text-navy">Additional Notes</h2>
            <p className="mt-2 whitespace-pre-wrap text-sm text-muted">
              {submission.additionalNotes}
            </p>
          </Card>
        ) : null}
      </div>

      <div className="flex flex-col gap-6">
        {submission.status === "SUBMITTED" ? (
          <Card>
            <p className="text-sm text-muted">
              Mark this reviewed once you&apos;ve watched the film, or go
              straight to sending a recommendation below.
            </p>
            <form action={markReviewed} className="mt-4">
              <Button type="submit" variant="outline">
                Mark as Reviewed
              </Button>
            </form>
          </Card>
        ) : null}

        <Card>
          <h2 className="font-semibold text-navy">
            {submission.recommendation ? "Recommendation Sent" : "Send Recommendation"}
          </h2>
          {submission.recommendation ? (
            <div className="mt-4 space-y-4 text-sm">
              <div className="space-y-2">
                {submission.recommendation.headOptions.map((head) => (
                  <div key={head.id} className="rounded-lg border border-border p-3">
                    <p className="font-medium text-navy">
                      {head.name}
                      {head.recommended ? (
                        <span className="ml-2 text-xs font-semibold text-accent">
                          TOP PICK
                        </span>
                      ) : null}
                    </p>
                    {head.notes ? <p className="mt-1 text-muted">{head.notes}</p> : null}
                    {head.purchaseLink ? (
                      <a
                        href={head.purchaseLink}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-1 inline-flex text-accent hover:underline"
                      >
                        Purchase link &rarr;
                      </a>
                    ) : null}
                  </div>
                ))}
              </div>
              <p>
                <span className="text-muted">Pocket: </span>
                {submission.recommendation.pocketNotes}
              </p>
              {submission.recommendation.stringNotes ? (
                <p>
                  <span className="text-muted">Strings: </span>
                  {submission.recommendation.stringNotes}
                </p>
              ) : null}
              {submission.recommendation.suggestedStrings.length > 0 ? (
                <p>
                  <span className="text-muted">Offered strings: </span>
                  {submission.recommendation.suggestedStrings
                    .map((s) => `${s.name} (${formatCents(s.priceCents)})`)
                    .join(", ")}
                </p>
              ) : null}
              <p>
                <span className="text-muted">Fee: </span>
                <span className="font-medium text-navy">
                  {formatCents(submission.recommendation.priceCents)}
                </span>
              </p>
            </div>
          ) : (
            <div className="mt-4">
              <RecommendationForm
                submissionId={submission.id}
                position={submission.position}
                isRestringOnly={submission.serviceType === "RESTRING_ONLY"}
                stringCatalog={stringCatalog}
              />
            </div>
          )}
        </Card>

        {submission.order ? (
          <Card>
            <h2 className="font-semibold text-navy">Order</h2>
            <p className="mt-2 text-sm text-muted">
              {submission.order.paidAt
                ? `Paid ${submission.order.paidAt.toLocaleDateString()}`
                : "Payment pending"}
            </p>
            <Link
              href="/admin/orders"
              className="mt-3 inline-flex text-sm font-semibold text-accent hover:underline"
            >
              Manage in Orders &rarr;
            </Link>
          </Card>
        ) : null}
      </div>
    </div>
  );
}

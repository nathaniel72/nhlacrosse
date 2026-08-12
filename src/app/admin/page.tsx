import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { PLAYER_LEVEL_LABELS, REVIEW_SLA_HOURS, STATUS_LABELS } from "@/lib/constants";

export const dynamic = "force-dynamic";

function hoursSince(date: Date) {
  return (Date.now() - date.getTime()) / (1000 * 60 * 60);
}

function statusTone(status: string) {
  if (status === "SUBMITTED" || status === "REVIEWED") return "warn" as const;
  if (status === "COMPLETE") return "success" as const;
  return "accent" as const;
}

export default async function AdminDashboardPage() {
  const submissions = await prisma.submission.findMany({
    orderBy: { createdAt: "asc" },
    include: { recommendation: true, order: true },
  });

  const pending = submissions.filter(
    (s) => s.status === "SUBMITTED" || s.status === "REVIEWED"
  );
  const overdueCount = pending.filter(
    (s) => hoursSince(s.createdAt) > REVIEW_SLA_HOURS
  ).length;

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy">Submissions</h1>
          <p className="mt-1 text-sm text-muted">
            {pending.length} awaiting review
            {overdueCount > 0 ? ` — ${overdueCount} past the 48hr SLA` : ""}
          </p>
        </div>
        <Link href="/admin/orders" className="text-sm font-semibold text-accent">
          View orders &rarr;
        </Link>
      </div>

      <div className="mt-8 flex flex-col gap-3">
        {submissions.length === 0 ? (
          <Card>
            <p className="text-muted">No submissions yet.</p>
          </Card>
        ) : (
          submissions.map((s) => {
            const overdue =
              (s.status === "SUBMITTED" || s.status === "REVIEWED") &&
              hoursSince(s.createdAt) > REVIEW_SLA_HOURS;
            return (
              <Link key={s.id} href={`/admin/submissions/${s.id}`}>
                <Card
                  className={`flex flex-wrap items-center justify-between gap-4 transition hover:border-accent ${
                    overdue ? "border-red-300 bg-red-50" : ""
                  }`}
                >
                  <div>
                    <p className="font-semibold text-navy">{s.athleteName}</p>
                    <p className="text-sm text-muted">
                      {PLAYER_LEVEL_LABELS[s.level] ?? s.level} &middot; {s.position}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    {s.serviceType === "RESTRING_ONLY" ? (
                      <Badge tone="accent">Restring Only</Badge>
                    ) : null}
                    {overdue ? <Badge tone="warn">Past SLA</Badge> : null}
                    <Badge tone={statusTone(s.status)}>
                      {STATUS_LABELS[s.status] ?? s.status}
                    </Badge>
                    <span className="text-xs text-muted">
                      {s.createdAt.toLocaleDateString()}
                    </span>
                  </div>
                </Card>
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
}

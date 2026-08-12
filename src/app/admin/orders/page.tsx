import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { OrderStatusForm } from "@/components/admin/OrderStatusForm";
import { STATUS_LABELS, formatCents, formatShippingAddress } from "@/lib/constants";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    where: { paidAt: { not: null } },
    orderBy: { paidAt: "asc" },
    include: { submission: true },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-navy">Orders</h1>
      <p className="mt-1 text-sm text-muted">Paid orders in the fulfillment pipeline.</p>

      <div className="mt-8 flex flex-col gap-4">
        {orders.length === 0 ? (
          <Card>
            <p className="text-muted">No paid orders yet.</p>
          </Card>
        ) : (
          orders.map((order) => (
            <Card key={order.id}>
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <Link
                    href={`/admin/submissions/${order.submissionId}`}
                    className="font-semibold text-navy hover:text-accent"
                  >
                    {order.submission.athleteName}
                  </Link>
                  <p className="mt-1 text-sm text-muted">
                    {order.selectedHeadName} &middot; {formatCents(order.amountCents)}
                  </p>
                  {Array.isArray(order.selectedStrings) && order.selectedStrings.length > 0 ? (
                    <p className="mt-1 text-sm text-muted">
                      Strings:{" "}
                      {(order.selectedStrings as { name: string }[])
                        .map((s) => s.name)
                        .join(", ")}
                    </p>
                  ) : null}
                  <p className="mt-1 text-sm text-muted">
                    Ship to: {formatShippingAddress(order.submission)}
                  </p>
                  {order.trackingNumber ? (
                    <p className="mt-1 text-sm text-muted">
                      Tracking: {order.trackingCarrier} {order.trackingNumber}
                    </p>
                  ) : null}
                  {order.submission.restringRequestedAt ? (
                    <p className="mt-2">
                      <Badge tone="warn">Restring requested</Badge>
                    </p>
                  ) : null}
                </div>
                <Badge tone="accent">
                  {STATUS_LABELS[order.submission.status] ?? order.submission.status}
                </Badge>
              </div>
              <OrderStatusForm orderId={order.id} currentStatus={order.submission.status} />
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

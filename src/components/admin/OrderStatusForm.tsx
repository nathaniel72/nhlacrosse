"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input, Select } from "@/components/ui/inputs";
import { STATUS_LABELS } from "@/lib/constants";

const NEXT_STATUS: Record<string, string> = {
  PAID: "HEAD_RECEIVED",
  HEAD_RECEIVED: "STRINGING",
  STRINGING: "SHIPPED",
  SHIPPED: "COMPLETE",
};

export function OrderStatusForm({
  orderId,
  currentStatus,
}: {
  orderId: string;
  currentStatus: string;
}) {
  const router = useRouter();
  const nextStatus = NEXT_STATUS[currentStatus];
  const [trackingNumber, setTrackingNumber] = React.useState("");
  const [trackingCarrier, setTrackingCarrier] = React.useState("USPS");
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  if (!nextStatus) return null;

  async function advance() {
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: nextStatus,
          ...(nextStatus === "SHIPPED" ? { trackingNumber, trackingCarrier } : {}),
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.message ?? "Something went wrong.");
        return;
      }
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mt-4 flex flex-col gap-3">
      {nextStatus === "SHIPPED" ? (
        <div className="flex flex-col gap-2 sm:flex-row">
          <Select
            value={trackingCarrier}
            onChange={(e) => setTrackingCarrier(e.target.value)}
            className="sm:w-32"
          >
            <option value="USPS">USPS</option>
            <option value="UPS">UPS</option>
            <option value="FedEx">FedEx</option>
          </Select>
          <Input
            placeholder="Tracking number"
            value={trackingNumber}
            onChange={(e) => setTrackingNumber(e.target.value)}
          />
        </div>
      ) : null}
      {error ? <p className="text-sm font-medium text-red-600">{error}</p> : null}
      <Button
        variant="outline"
        onClick={advance}
        disabled={submitting || (nextStatus === "SHIPPED" && !trackingNumber)}
        className="self-start"
      >
        {submitting ? "Updating..." : `Mark as ${STATUS_LABELS[nextStatus]}`}
      </Button>
    </div>
  );
}

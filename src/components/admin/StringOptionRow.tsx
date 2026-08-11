"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { formatCents } from "@/lib/constants";

export function StringOptionRow({
  id,
  name,
  color,
  priceCents,
  active,
}: {
  id: string;
  name: string;
  color: string | null;
  priceCents: number;
  active: boolean;
}) {
  const router = useRouter();
  const [busy, setBusy] = React.useState(false);

  async function toggleActive() {
    setBusy(true);
    try {
      await fetch(`/api/admin/strings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !active }),
      });
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete() {
    if (!confirm(`Delete "${name}"?`)) return;
    setBusy(true);
    try {
      await fetch(`/api/admin/strings/${id}`, { method: "DELETE" });
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex items-center justify-between rounded-xl border border-border p-4">
      <div>
        <p className="font-semibold text-navy">
          {name}
          {color ? <span className="font-normal text-muted"> — {color}</span> : null}
        </p>
        <p className="text-sm text-muted">{formatCents(priceCents)}</p>
      </div>
      <div className="flex items-center gap-3">
        <Badge tone={active ? "success" : "default"}>{active ? "Active" : "Inactive"}</Badge>
        <Button variant="outline" onClick={toggleActive} disabled={busy} className="px-3 py-1 text-xs">
          {active ? "Deactivate" : "Activate"}
        </Button>
        <Button variant="outline" onClick={handleDelete} disabled={busy} className="px-3 py-1 text-xs">
          Delete
        </Button>
      </div>
    </div>
  );
}

"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export function TestimonialRow({
  id,
  athleteName,
  resultOrTeam,
  quote,
  featured,
}: {
  id: string;
  athleteName: string;
  resultOrTeam: string | null;
  quote: string;
  featured: boolean;
}) {
  const router = useRouter();
  const [busy, setBusy] = React.useState(false);

  async function toggleFeatured() {
    setBusy(true);
    try {
      await fetch(`/api/admin/testimonials/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ featured: !featured }),
      });
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete() {
    if (!confirm(`Delete the testimonial from ${athleteName}?`)) return;
    setBusy(true);
    try {
      await fetch(`/api/admin/testimonials/${id}`, { method: "DELETE" });
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex items-start justify-between gap-4 rounded-xl border border-border p-4">
      <div>
        <p className="font-semibold text-navy">
          {athleteName}
          {resultOrTeam ? <span className="font-normal text-muted"> — {resultOrTeam}</span> : null}
        </p>
        <p className="mt-1 text-sm text-muted">&ldquo;{quote}&rdquo;</p>
      </div>
      <div className="flex shrink-0 flex-col items-end gap-2">
        <Badge tone={featured ? "success" : "default"}>
          {featured ? "Shown on site" : "Hidden"}
        </Badge>
        <div className="flex gap-2">
          <Button variant="outline" onClick={toggleFeatured} disabled={busy} className="px-3 py-1 text-xs">
            {featured ? "Hide" : "Show"}
          </Button>
          <Button variant="outline" onClick={handleDelete} disabled={busy} className="px-3 py-1 text-xs">
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}

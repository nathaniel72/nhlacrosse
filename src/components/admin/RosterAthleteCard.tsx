"use client";

import * as React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

export function RosterAthleteCard({
  id,
  photoUrl,
  athleteName,
  program,
  featured,
}: {
  id: string;
  photoUrl: string;
  athleteName: string;
  program: string | null;
  featured: boolean;
}) {
  const router = useRouter();
  const [busy, setBusy] = React.useState(false);

  async function toggleFeatured() {
    setBusy(true);
    try {
      await fetch(`/api/admin/roster/${id}`, {
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
    if (!confirm(`Remove ${athleteName} from the roster?`)) return;
    setBusy(true);
    try {
      await fetch(`/api/admin/roster/${id}`, { method: "DELETE" });
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface">
      <div className="relative aspect-square w-full bg-surface-muted">
        <Image src={photoUrl} alt={athleteName} fill className="object-cover" />
        <span className="absolute left-2 top-2">
          <Badge tone={featured ? "success" : "default"}>
            {featured ? "Shown on site" : "Hidden"}
          </Badge>
        </span>
      </div>
      <div className="flex flex-col gap-2 p-3">
        <p className="truncate text-sm font-semibold text-navy">{athleteName}</p>
        {program ? <p className="truncate text-xs text-muted">{program}</p> : null}
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            onClick={toggleFeatured}
            disabled={busy}
            className="px-2.5 py-1 text-xs"
          >
            {featured ? "Hide" : "Show"}
          </Button>
          <Button
            variant="outline"
            onClick={handleDelete}
            disabled={busy}
            className="ml-auto px-2.5 py-1 text-xs"
          >
            {busy ? "..." : "Delete"}
          </Button>
        </div>
      </div>
    </div>
  );
}

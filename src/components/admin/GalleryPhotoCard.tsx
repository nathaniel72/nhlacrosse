"use client";

import * as React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

export function GalleryPhotoCard({
  id,
  imageUrl,
  caption,
  headModel,
  heroRole,
}: {
  id: string;
  imageUrl: string;
  caption: string | null;
  headModel: string | null;
  heroRole: "BEFORE" | "AFTER" | null;
}) {
  const router = useRouter();
  const [deleting, setDeleting] = React.useState(false);
  const [updatingRole, setUpdatingRole] = React.useState(false);

  async function handleDelete() {
    if (!confirm("Delete this photo?")) return;
    setDeleting(true);
    try {
      await fetch("/api/admin/gallery", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      router.refresh();
    } finally {
      setDeleting(false);
    }
  }

  async function toggleHeroRole(role: "BEFORE" | "AFTER") {
    setUpdatingRole(true);
    try {
      await fetch("/api/admin/gallery", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, heroRole: heroRole === role ? null : role }),
      });
      router.refresh();
    } finally {
      setUpdatingRole(false);
    }
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface">
      <div className="relative aspect-square w-full bg-surface-muted">
        <Image src={imageUrl} alt={caption ?? headModel ?? "Gallery photo"} fill className="object-cover" />
        {heroRole ? (
          <span className="absolute left-2 top-2">
            <Badge tone="accent">Hero: {heroRole === "BEFORE" ? "Before" : "After"}</Badge>
          </span>
        ) : null}
      </div>
      <div className="flex flex-col gap-2 p-3">
        <p className="truncate text-xs text-muted">{headModel ?? caption ?? ""}</p>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            onClick={() => toggleHeroRole("BEFORE")}
            disabled={updatingRole}
            className={`px-2.5 py-1 text-xs ${heroRole === "BEFORE" ? "border-accent text-accent" : ""}`}
          >
            {heroRole === "BEFORE" ? "Unset Before" : "Set as Before"}
          </Button>
          <Button
            variant="outline"
            onClick={() => toggleHeroRole("AFTER")}
            disabled={updatingRole}
            className={`px-2.5 py-1 text-xs ${heroRole === "AFTER" ? "border-accent text-accent" : ""}`}
          >
            {heroRole === "AFTER" ? "Unset After" : "Set as After"}
          </Button>
          <Button
            variant="outline"
            onClick={handleDelete}
            disabled={deleting}
            className="ml-auto px-2.5 py-1 text-xs"
          >
            {deleting ? "..." : "Delete"}
          </Button>
        </div>
      </div>
    </div>
  );
}

"use client";

import * as React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

export function GalleryPhotoCard({
  id,
  imageUrl,
  caption,
  headModel,
}: {
  id: string;
  imageUrl: string;
  caption: string | null;
  headModel: string | null;
}) {
  const router = useRouter();
  const [deleting, setDeleting] = React.useState(false);

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

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface">
      <div className="relative aspect-square w-full bg-surface-muted">
        <Image src={imageUrl} alt={caption ?? headModel ?? "Gallery photo"} fill className="object-cover" />
      </div>
      <div className="flex items-center justify-between p-3">
        <p className="truncate text-xs text-muted">{headModel ?? caption ?? ""}</p>
        <Button variant="outline" onClick={handleDelete} disabled={deleting} className="px-3 py-1 text-xs">
          {deleting ? "..." : "Delete"}
        </Button>
      </div>
    </div>
  );
}

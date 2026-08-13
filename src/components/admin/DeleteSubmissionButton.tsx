"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

export function DeleteSubmissionButton({
  id,
  athleteName,
  redirectTo,
}: {
  id: string;
  athleteName: string;
  redirectTo?: string;
}) {
  const router = useRouter();
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function handleDelete() {
    if (!confirm(`Delete the submission from ${athleteName}? This can't be undone.`)) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/submissions/${id}`, { method: "DELETE" });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data.message ?? "Something went wrong.");
        return;
      }

      if (redirectTo) {
        router.push(redirectTo);
      } else {
        router.refresh();
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <Button
        type="button"
        variant="outline"
        onClick={handleDelete}
        disabled={busy}
        className="px-3 py-1 text-xs text-red-600 hover:border-red-400 hover:bg-red-50"
      >
        {busy ? "Deleting..." : "Delete"}
      </Button>
      {error ? <p className="text-xs font-medium text-red-600">{error}</p> : null}
    </div>
  );
}

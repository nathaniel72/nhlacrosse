"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/inputs";
import { Button } from "@/components/ui/Button";

export function RosterUploadForm() {
  const router = useRouter();
  const formRef = React.useRef<HTMLFormElement>(null);
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const formData = new FormData(e.currentTarget);
      const res = await fetch("/api/admin/roster", { method: "POST", body: formData });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data.message ?? "Upload failed.");
        return;
      }

      formRef.current?.reset();
      router.refresh();
    } catch {
      setError("Upload failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Field label="Photo" htmlFor="file" required>
        <input
          id="file"
          name="file"
          type="file"
          accept="image/*"
          required
          className="text-sm"
        />
      </Field>
      <Field label="Athlete Name" htmlFor="athleteName" required>
        <Input id="athleteName" name="athleteName" required />
      </Field>
      <Field label="Program" htmlFor="program" hint="e.g. UNC, Duke Commit">
        <Input id="program" name="program" />
      </Field>
      {error ? <p className="text-sm font-medium text-red-600">{error}</p> : null}
      <Button type="submit" disabled={submitting} className="self-start">
        {submitting ? "Uploading..." : "Add to Roster"}
      </Button>
    </form>
  );
}

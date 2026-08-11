"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/inputs";
import { Button } from "@/components/ui/Button";

export function GalleryUploadForm() {
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
      const res = await fetch("/api/admin/gallery", { method: "POST", body: formData });
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
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Head Model" htmlFor="headModel">
          <Input id="headModel" name="headModel" />
        </Field>
        <Field label="Pocket Type" htmlFor="pocketType">
          <Input id="pocketType" name="pocketType" />
        </Field>
      </div>
      <Field label="Caption" htmlFor="caption">
        <Input id="caption" name="caption" />
      </Field>
      <label className="flex items-center gap-2 text-sm text-navy">
        <input type="checkbox" name="featured" className="h-4 w-4" />
        Feature this photo
      </label>
      {error ? <p className="text-sm font-medium text-red-600">{error}</p> : null}
      <Button type="submit" disabled={submitting} className="self-start">
        {submitting ? "Uploading..." : "Upload Photo"}
      </Button>
    </form>
  );
}

"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Field } from "@/components/ui/Field";
import { Input, Textarea } from "@/components/ui/inputs";
import { Button } from "@/components/ui/Button";

export function StringOptionForm() {
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
      const res = await fetch("/api/admin/strings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(formData)),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data.message ?? "Something went wrong.");
        return;
      }

      formRef.current?.reset();
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Field label="Name" htmlFor="name" required>
        <Input id="name" name="name" placeholder="e.g. Semi-Soft Nylon" required />
      </Field>
      <Field label="Color" htmlFor="color">
        <Input id="color" name="color" placeholder="e.g. White / Black" />
      </Field>
      <Field label="Description" htmlFor="description">
        <Textarea id="description" name="description" />
      </Field>
      <Field label="Price ($)" htmlFor="priceCents" required>
        <Input id="priceCents" name="priceCents" type="number" min="0" step="0.01" required />
      </Field>
      {error ? <p className="text-sm font-medium text-red-600">{error}</p> : null}
      <Button type="submit" disabled={submitting} className="self-start">
        {submitting ? "Adding..." : "Add String Option"}
      </Button>
    </form>
  );
}

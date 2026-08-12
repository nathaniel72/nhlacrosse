"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Field } from "@/components/ui/Field";
import { Input, Textarea } from "@/components/ui/inputs";
import { Button } from "@/components/ui/Button";

export function TestimonialForm() {
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
      const res = await fetch("/api/admin/testimonials", {
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
      <Field label="Athlete Name" htmlFor="athleteName" required>
        <Input id="athleteName" name="athleteName" required />
      </Field>
      <Field
        label="Result / Team"
        htmlFor="resultOrTeam"
        hint="e.g. Freshman, State University"
      >
        <Input id="resultOrTeam" name="resultOrTeam" />
      </Field>
      <Field label="Quote" htmlFor="quote" required>
        <Textarea id="quote" name="quote" required />
      </Field>
      {error ? <p className="text-sm font-medium text-red-600">{error}</p> : null}
      <Button type="submit" disabled={submitting} className="self-start">
        {submitting ? "Adding..." : "Add Testimonial"}
      </Button>
    </form>
  );
}

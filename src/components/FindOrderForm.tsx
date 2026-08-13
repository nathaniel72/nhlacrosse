"use client";

import * as React from "react";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/inputs";
import { Button } from "@/components/ui/Button";

export function FindOrderForm() {
  const [email, setEmail] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);
  const [message, setMessage] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setMessage(null);

    try {
      const res = await fetch("/api/find-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data.message ?? "Something went wrong. Please try again.");
        return;
      }

      setMessage(data.message);
    } catch {
      setError("Something went wrong. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (message) {
    return (
      <p className="rounded-lg bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
        {message}
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Field label="Email" htmlFor="email" required>
        <Input
          id="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </Field>
      {error ? <p className="text-sm font-medium text-red-600">{error}</p> : null}
      <Button type="submit" disabled={submitting} className="self-start">
        {submitting ? "Sending..." : "Send My Link"}
      </Button>
    </form>
  );
}

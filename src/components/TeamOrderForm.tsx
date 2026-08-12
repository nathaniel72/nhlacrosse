"use client";

import * as React from "react";
import { Field } from "@/components/ui/Field";
import { Input, Textarea } from "@/components/ui/inputs";
import { Button } from "@/components/ui/Button";

const initialState = {
  contactName: "",
  teamOrOrg: "",
  email: "",
  phone: "",
  message: "",
};

type FieldErrors = Partial<Record<keyof typeof initialState, string>>;

export function TeamOrderForm() {
  const [values, setValues] = React.useState(initialState);
  const [errors, setErrors] = React.useState<FieldErrors>({});
  const [submitting, setSubmitting] = React.useState(false);
  const [formError, setFormError] = React.useState<string | null>(null);
  const [submitted, setSubmitted] = React.useState(false);

  function update<K extends keyof typeof initialState>(key: K, value: string) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setFormError(null);
    setErrors({});

    try {
      const res = await fetch("/api/team-inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json();

      if (!res.ok) {
        if (data.fieldErrors) setErrors(data.fieldErrors);
        setFormError(data.message ?? "Something went wrong. Please try again.");
        return;
      }

      setSubmitted(true);
    } catch {
      setFormError("Something went wrong. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <p className="rounded-lg bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
        Got it — I&apos;ll reach out soon to talk through your team&apos;s needs.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Your Name" htmlFor="contactName" required error={errors.contactName}>
          <Input
            id="contactName"
            required
            value={values.contactName}
            onChange={(e) => update("contactName", e.target.value)}
          />
        </Field>
        <Field label="Team / Organization" htmlFor="teamOrOrg" required error={errors.teamOrOrg}>
          <Input
            id="teamOrOrg"
            required
            value={values.teamOrOrg}
            onChange={(e) => update("teamOrOrg", e.target.value)}
          />
        </Field>
        <Field label="Email" htmlFor="email" required error={errors.email}>
          <Input
            id="email"
            type="email"
            required
            value={values.email}
            onChange={(e) => update("email", e.target.value)}
          />
        </Field>
        <Field label="Phone" htmlFor="phone" error={errors.phone}>
          <Input
            id="phone"
            type="tel"
            value={values.phone}
            onChange={(e) => update("phone", e.target.value)}
          />
        </Field>
      </div>
      <Field
        label="Tell me about your team"
        htmlFor="message"
        required
        error={errors.message}
        hint="Roster size, timeline, positions/levels — whatever's useful"
      >
        <Textarea
          id="message"
          required
          value={values.message}
          onChange={(e) => update("message", e.target.value)}
        />
      </Field>
      {formError ? (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {formError}
        </p>
      ) : null}
      <Button type="submit" disabled={submitting} className="self-start">
        {submitting ? "Sending..." : "Send Inquiry"}
      </Button>
    </form>
  );
}

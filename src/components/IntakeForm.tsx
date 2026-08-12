"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Field } from "@/components/ui/Field";
import { Input, Select, Textarea } from "@/components/ui/inputs";
import { Button } from "@/components/ui/Button";
import { PLAYER_LEVEL_LABELS } from "@/lib/constants";

const POSITIONS = ["Attack", "Midfield", "Defense", "FOGO", "LSM"];

const initialState = {
  athleteName: "",
  email: "",
  phone: "",
  position: "",
  gradYear: "",
  level: "",
  team: "",
  currentStick: "",
  playingStyle: "",
  filmUrl: "",
  budgetCents: "",
  additionalNotes: "",
};

type FieldErrors = Partial<Record<keyof typeof initialState, string>>;

export function IntakeForm() {
  const router = useRouter();
  const [values, setValues] = React.useState(initialState);
  const [errors, setErrors] = React.useState<FieldErrors>({});
  const [submitting, setSubmitting] = React.useState(false);
  const [formError, setFormError] = React.useState<string | null>(null);

  function update<K extends keyof typeof initialState>(key: K, value: string) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setFormError(null);
    setErrors({});

    try {
      const res = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.fieldErrors) {
          setErrors(data.fieldErrors);
        }
        setFormError(data.message ?? "Something went wrong. Please try again.");
        return;
      }

      router.push(`/status/${data.statusToken}?submitted=1`);
    } catch {
      setFormError("Something went wrong. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Athlete Name" htmlFor="athleteName" required error={errors.athleteName}>
          <Input
            id="athleteName"
            required
            value={values.athleteName}
            onChange={(e) => update("athleteName", e.target.value)}
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
        <Field label="Position" htmlFor="position" required error={errors.position}>
          <Select
            id="position"
            required
            value={values.position}
            onChange={(e) => update("position", e.target.value)}
          >
            <option value="">Select position</option>
            {POSITIONS.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Playing Level" htmlFor="level" required error={errors.level}>
          <Select
            id="level"
            required
            value={values.level}
            onChange={(e) => update("level", e.target.value)}
          >
            <option value="">Select level</option>
            {Object.entries(PLAYER_LEVEL_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Grad Year" htmlFor="gradYear" error={errors.gradYear}>
          <Input
            id="gradYear"
            type="number"
            placeholder="2027"
            value={values.gradYear}
            onChange={(e) => update("gradYear", e.target.value)}
          />
        </Field>
        <Field label="Team / School" htmlFor="team" error={errors.team}>
          <Input
            id="team"
            value={values.team}
            onChange={(e) => update("team", e.target.value)}
          />
        </Field>
        <Field label="Budget (optional)" htmlFor="budgetCents" error={errors.budgetCents} hint="Approximate, for the head + stringing fee">
          <Input
            id="budgetCents"
            type="number"
            placeholder="150"
            value={values.budgetCents}
            onChange={(e) => update("budgetCents", e.target.value)}
          />
        </Field>
      </div>

      <Field
        label="Current Stick Setup"
        htmlFor="currentStick"
        error={errors.currentStick}
        hint="Head, shaft, and current pocket, if you have one"
      >
        <Textarea
          id="currentStick"
          value={values.currentStick}
          onChange={(e) => update("currentStick", e.target.value)}
        />
      </Field>

      <Field
        label="Playing Style"
        htmlFor="playingStyle"
        required
        error={errors.playingStyle}
        hint="How you play, what you want to get better at, and what you want out of your new setup"
      >
        <Textarea
          id="playingStyle"
          required
          value={values.playingStyle}
          onChange={(e) => update("playingStyle", e.target.value)}
        />
      </Field>

      <Field
        label="Film Link"
        htmlFor="filmUrl"
        required
        error={errors.filmUrl}
        hint="Hudl, YouTube, Instagram, or Google Drive link to your highlights or game film"
      >
        <Input
          id="filmUrl"
          type="url"
          required
          placeholder="https://"
          value={values.filmUrl}
          onChange={(e) => update("filmUrl", e.target.value)}
        />
      </Field>

      <Field label="Anything Else?" htmlFor="additionalNotes" error={errors.additionalNotes}>
        <Textarea
          id="additionalNotes"
          value={values.additionalNotes}
          onChange={(e) => update("additionalNotes", e.target.value)}
        />
      </Field>

      {formError ? (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {formError}
        </p>
      ) : null}

      <Button type="submit" disabled={submitting} className="self-start">
        {submitting ? "Submitting..." : "Submit for Review"}
      </Button>
      <p className="text-xs text-muted">
        I&apos;ll review your film and send a head + pocket recommendation within
        48 hours.
      </p>
    </form>
  );
}

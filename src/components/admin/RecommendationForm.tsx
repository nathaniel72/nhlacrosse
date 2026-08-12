"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Field } from "@/components/ui/Field";
import { Input, Textarea } from "@/components/ui/inputs";
import { Button } from "@/components/ui/Button";
import { formatCents } from "@/lib/constants";
import { POSITION_GUIDANCE } from "@/lib/positionGuidance";

type HeadOptionDraft = {
  name: string;
  notes: string;
  purchaseLink: string;
  recommended: boolean;
};

const emptyHeadOption: HeadOptionDraft = {
  name: "",
  notes: "",
  purchaseLink: "",
  recommended: false,
};

export function RecommendationForm({
  submissionId,
  position,
  isRestringOnly,
  stringCatalog,
}: {
  submissionId: string;
  position: string;
  isRestringOnly: boolean;
  stringCatalog: { id: string; name: string; color: string | null; priceCents: number }[];
}) {
  const router = useRouter();
  const [headOptions, setHeadOptions] = React.useState<HeadOptionDraft[]>(
    isRestringOnly ? [] : [{ ...emptyHeadOption, recommended: true }]
  );
  const [pocketNotes, setPocketNotes] = React.useState("");
  const [stringNotes, setStringNotes] = React.useState("");
  const [selectedStringIds, setSelectedStringIds] = React.useState<string[]>([]);
  const [priceCents, setPriceCents] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);
  const [formError, setFormError] = React.useState<string | null>(null);

  function updateHead(index: number, patch: Partial<HeadOptionDraft>) {
    setHeadOptions((prev) => prev.map((h, i) => (i === index ? { ...h, ...patch } : h)));
  }

  function setRecommended(index: number) {
    setHeadOptions((prev) => prev.map((h, i) => ({ ...h, recommended: i === index })));
  }

  function addHeadOption() {
    if (headOptions.length >= 5) return;
    setHeadOptions((prev) => [...prev, { ...emptyHeadOption }]);
  }

  function removeHeadOption(index: number) {
    setHeadOptions((prev) => {
      const next = prev.filter((_, i) => i !== index);
      if (!next.some((h) => h.recommended) && next.length > 0) next[0].recommended = true;
      return next;
    });
  }

  function toggleString(id: string) {
    setSelectedStringIds((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setFormError(null);

    try {
      const res = await fetch("/api/admin/recommendations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          submissionId,
          headOptions,
          pocketNotes,
          stringNotes,
          suggestedStringOptionIds: selectedStringIds,
          priceCents,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        setFormError(data.message ?? "Something went wrong.");
        return;
      }

      router.refresh();
    } catch {
      setFormError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {isRestringOnly ? (
        <p className="rounded-lg bg-surface-muted px-4 py-3 text-sm text-muted">
          Restring only — no head to recommend. Just pocket notes, strings,
          and the fee below.
        </p>
      ) : (
      <div className="flex flex-col gap-4">
        <p className="text-sm font-semibold text-navy">Head Options</p>
        {headOptions.map((head, i) => (
          <div key={i} className="rounded-xl border border-border p-4">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-xs font-medium text-muted">
                <input
                  type="radio"
                  name="recommendedHead"
                  checked={head.recommended}
                  onChange={() => setRecommended(i)}
                />
                Top pick
              </label>
              {headOptions.length > 1 ? (
                <button
                  type="button"
                  onClick={() => removeHeadOption(i)}
                  className="text-xs font-medium text-muted hover:text-red-600"
                >
                  Remove
                </button>
              ) : null}
            </div>
            <div className="mt-3 flex flex-col gap-3">
              <Field label="Head Name" htmlFor={`head-name-${i}`} required>
                <Input
                  id={`head-name-${i}`}
                  placeholder="e.g. StringKing Mark 2V"
                  required
                  value={head.name}
                  onChange={(e) => updateHead(i, { name: e.target.value })}
                />
              </Field>
              <Field
                label="Why it fits"
                htmlFor={`head-notes-${i}`}
                hint="Optional — helps the athlete compare options"
              >
                <Textarea
                  id={`head-notes-${i}`}
                  value={head.notes}
                  onChange={(e) => updateHead(i, { notes: e.target.value })}
                />
              </Field>
              <Field label="Where to Buy It (link)" htmlFor={`head-link-${i}`}>
                <Input
                  id={`head-link-${i}`}
                  type="url"
                  placeholder="https://"
                  value={head.purchaseLink}
                  onChange={(e) => updateHead(i, { purchaseLink: e.target.value })}
                />
              </Field>
            </div>
          </div>
        ))}
        {headOptions.length < 5 ? (
          <Button type="button" variant="outline" onClick={addHeadOption} className="self-start">
            + Add Another Head Option
          </Button>
        ) : null}
      </div>
      )}

      <Field label="Pocket Notes" htmlFor="pocketNotes" required>
        {POSITION_GUIDANCE[position] ? (
          <button
            type="button"
            onClick={() => setPocketNotes(POSITION_GUIDANCE[position].pocketNotes)}
            className="inline-flex self-start rounded-full border border-accent px-3 py-1 text-xs font-semibold text-accent hover:bg-accent/10"
          >
            Use {position} starter text
          </button>
        ) : null}
        <Textarea
          id="pocketNotes"
          required
          value={pocketNotes}
          onChange={(e) => setPocketNotes(e.target.value)}
        />
      </Field>

      <Field
        label="String Suggestion (optional notes)"
        htmlFor="stringNotes"
        hint="e.g. gauge, mesh vs traditional, hard vs semi-soft — general guidance for this athlete"
      >
        <Textarea
          id="stringNotes"
          value={stringNotes}
          onChange={(e) => setStringNotes(e.target.value)}
        />
      </Field>

      {stringCatalog.length > 0 ? (
        <div>
          <p className="text-sm font-semibold text-navy">
            Offer Strings From Your Catalog (optional)
          </p>
          <p className="mt-1 text-xs text-muted">
            Checked options let the athlete add these strings to their order.
            If they want a specific color, they can order it themselves when
            they buy the head.
          </p>
          <div className="mt-3 flex flex-col gap-2">
            {stringCatalog.map((s) => (
              <label
                key={s.id}
                className="flex items-center justify-between rounded-lg border border-border px-3 py-2 text-sm"
              >
                <span className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedStringIds.includes(s.id)}
                    onChange={() => toggleString(s.id)}
                  />
                  {s.name}
                  {s.color ? <span className="text-muted"> — {s.color}</span> : null}
                </span>
                <span className="text-muted">{formatCents(s.priceCents)}</span>
              </label>
            ))}
          </div>
        </div>
      ) : null}

      <Field label="Stringing Fee ($)" htmlFor="priceCents" required>
        <Input
          id="priceCents"
          type="number"
          min="0"
          step="0.01"
          required
          value={priceCents}
          onChange={(e) => setPriceCents(e.target.value)}
        />
      </Field>

      {formError ? (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {formError}
        </p>
      ) : null}

      <Button type="submit" disabled={submitting} className="self-start">
        {submitting ? "Sending..." : "Send Recommendation"}
      </Button>
    </form>
  );
}

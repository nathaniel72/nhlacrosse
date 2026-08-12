"use client";

import * as React from "react";
import { Button } from "@/components/ui/Button";
import {
  formatCents,
  RUSH_FEE_CENTS,
  STANDARD_STRINGING_DAYS,
  RUSH_STRINGING_DAYS,
} from "@/lib/constants";

type HeadOption = {
  id: string;
  name: string;
  notes: string | null;
  purchaseLink: string | null;
  recommended: boolean;
};

type StringOption = {
  id: string;
  name: string;
  color: string | null;
  priceCents: number;
};

export function PaySelector({
  token,
  headOptions,
  suggestedStrings,
  stringingFeeCents,
}: {
  token: string;
  headOptions: HeadOption[];
  suggestedStrings: StringOption[];
  stringingFeeCents: number;
}) {
  const defaultHead = headOptions.find((h) => h.recommended) ?? headOptions[0];
  const [selectedHeadId, setSelectedHeadId] = React.useState(defaultHead?.id ?? "");
  const [selectedStringIds, setSelectedStringIds] = React.useState<string[]>([]);
  const [rush, setRush] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  function toggleString(id: string) {
    setSelectedStringIds((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  }

  const stringsTotal = suggestedStrings
    .filter((s) => selectedStringIds.includes(s.id))
    .reduce((sum, s) => sum + s.priceCents, 0);
  const total = stringingFeeCents + stringsTotal + (rush ? RUSH_FEE_CENTS : 0);

  async function handlePay() {
    if (headOptions.length > 0 && !selectedHeadId) {
      setError("Choose a head first.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          headOptionId: selectedHeadId,
          stringOptionIds: selectedStringIds,
          rush,
        }),
      });
      const data = await res.json();

      if (!res.ok || !data.url) {
        setError(data.message ?? "Something went wrong. Please try again.");
        setLoading(false);
        return;
      }

      window.location.href = data.url;
    } catch {
      setError("Something went wrong. Please check your connection and try again.");
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {headOptions.length > 0 ? (
        <div>
          <p className="text-sm font-semibold text-navy">
            {headOptions.length > 1 ? "Choose Your Head" : "Recommended Head"}
          </p>
          <div className="mt-3 flex flex-col gap-3">
            {headOptions.map((head) => {
              const selected = head.id === selectedHeadId;
              return (
                <label
                  key={head.id}
                  className={`flex cursor-pointer flex-col gap-1 rounded-xl border p-4 transition ${
                    selected ? "border-accent ring-2 ring-accent/20" : "border-border"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="headOption"
                      checked={selected}
                      onChange={() => setSelectedHeadId(head.id)}
                    />
                    <span className="font-semibold text-navy">{head.name}</span>
                    {head.recommended ? (
                      <span className="text-xs font-semibold text-accent">TOP PICK</span>
                    ) : null}
                  </span>
                  {head.notes ? (
                    <span className="pl-6 text-sm text-muted">{head.notes}</span>
                  ) : null}
                  {head.purchaseLink ? (
                    <a
                      href={head.purchaseLink}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="pl-6 text-sm font-semibold text-accent hover:underline"
                    >
                      Where to buy it &rarr;
                    </a>
                  ) : null}
                </label>
              );
            })}
          </div>
        </div>
      ) : null}

      {suggestedStrings.length > 0 ? (
        <div>
          <p className="text-sm font-semibold text-navy">Add Strings (optional)</p>
          <p className="mt-1 text-xs text-muted">
            Want a specific color instead? Order your own strings when you buy
            the head — no need to add one here.
          </p>
          <div className="mt-3 flex flex-col gap-2">
            {suggestedStrings.map((s) => (
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

      <div>
        <p className="text-sm font-semibold text-navy">Turnaround</p>
        <label className="mt-3 flex items-center justify-between rounded-lg border border-border px-3 py-2 text-sm">
          <span className="flex items-center gap-2">
            <input type="checkbox" checked={rush} onChange={(e) => setRush(e.target.checked)} />
            Rush it ({RUSH_STRINGING_DAYS} instead of {STANDARD_STRINGING_DAYS})
          </span>
          <span className="text-muted">+{formatCents(RUSH_FEE_CENTS)}</span>
        </label>
      </div>

      <div className="border-t border-border pt-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted">Stringing fee</span>
          <span className="text-navy">{formatCents(stringingFeeCents)}</span>
        </div>
        {stringsTotal > 0 ? (
          <div className="mt-1 flex items-center justify-between text-sm">
            <span className="text-muted">Strings</span>
            <span className="text-navy">{formatCents(stringsTotal)}</span>
          </div>
        ) : null}
        {rush ? (
          <div className="mt-1 flex items-center justify-between text-sm">
            <span className="text-muted">Rush</span>
            <span className="text-navy">+{formatCents(RUSH_FEE_CENTS)}</span>
          </div>
        ) : null}
        <div className="mt-2 flex items-center justify-between">
          <span className="font-semibold text-navy">Total</span>
          <span className="text-xl font-bold text-navy">{formatCents(total)}</span>
        </div>
      </div>

      {error ? <p className="text-sm font-medium text-red-600">{error}</p> : null}

      <Button onClick={handlePay} disabled={loading}>
        {loading ? "Redirecting to checkout..." : "Pay Now"}
      </Button>
    </div>
  );
}

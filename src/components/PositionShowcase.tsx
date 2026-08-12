"use client";

import * as React from "react";
import { Card } from "@/components/ui/Card";
import { POSITION_GUIDANCE } from "@/lib/positionGuidance";

const LABELS = ["Attack", "Midfield", "Defense"] as const;

export function PositionShowcase() {
  const [active, setActive] = React.useState(0);
  const label = LABELS[active];
  const guidance = POSITION_GUIDANCE[label];

  return (
    <div className="grid gap-6 sm:grid-cols-[auto_1fr]">
      <div className="flex gap-2 overflow-x-auto sm:flex-col">
        {LABELS.map((l, i) => (
          <button
            key={l}
            type="button"
            onClick={() => setActive(i)}
            className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition sm:rounded-lg sm:text-left ${
              i === active
                ? "bg-accent text-white"
                : "bg-surface-muted text-navy hover:bg-surface-muted/70"
            }`}
          >
            {l}
          </button>
        ))}
      </div>
      <Card key={label} className="animate-[fadeIn_0.25s_ease]">
        <p className="text-xs font-semibold uppercase tracking-widest text-accent">
          Sample fit &middot; {label}
        </p>
        <p className="mt-2 font-semibold text-navy">{guidance.summary}</p>
        <p className="mt-1 text-sm text-muted">{guidance.pocketNotes}</p>
        <p className="mt-4 text-xs text-muted">
          This is just a starting point — your actual recommendation is built
          from watching your film, not your position alone.
        </p>
      </Card>
    </div>
  );
}

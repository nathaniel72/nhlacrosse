"use client";

import * as React from "react";
import { Card } from "@/components/ui/Card";

// Illustrative example copy — Nathaniel should review/edit this for accuracy
// to how he actually strings each position before treating it as gospel.
const POSITIONS = [
  {
    label: "Attack",
    headStyle: "Compact, mid-pinch head",
    pocket:
      "Low-to-mid pocket with a quick release, built for finishing tight to the cage in traffic.",
  },
  {
    label: "Midfield",
    headStyle: "Balanced, do-it-all head",
    pocket:
      "Slightly deeper pocket with moderate whip — confident cradling in transition, accurate on the run.",
  },
  {
    label: "Defense",
    headStyle: "Wider, durable head",
    pocket:
      "Tighter, more traditional pocket for consistent poke-checks and fast, reliable outlet clears.",
  },
] as const;

export function PositionShowcase() {
  const [active, setActive] = React.useState(0);
  const position = POSITIONS[active];

  return (
    <div className="grid gap-6 sm:grid-cols-[auto_1fr]">
      <div className="flex gap-2 overflow-x-auto sm:flex-col">
        {POSITIONS.map((p, i) => (
          <button
            key={p.label}
            type="button"
            onClick={() => setActive(i)}
            className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition sm:rounded-lg sm:text-left ${
              i === active
                ? "bg-accent text-white"
                : "bg-surface-muted text-navy hover:bg-surface-muted/70"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>
      <Card key={position.label} className="animate-[fadeIn_0.25s_ease]">
        <p className="text-xs font-semibold uppercase tracking-widest text-accent">
          Sample fit &middot; {position.label}
        </p>
        <p className="mt-2 font-semibold text-navy">{position.headStyle}</p>
        <p className="mt-1 text-sm text-muted">{position.pocket}</p>
        <p className="mt-4 text-xs text-muted">
          This is just a starting point — your actual recommendation is built
          from watching your film, not your position alone.
        </p>
      </Card>
    </div>
  );
}

import * as React from "react";

const tones = {
  default: "bg-surface-muted text-navy",
  accent: "bg-accent/10 text-accent",
  warn: "bg-amber-100 text-amber-800",
  success: "bg-emerald-100 text-emerald-800",
};

export function Badge({
  tone = "default",
  children,
}: {
  tone?: keyof typeof tones;
  children: React.ReactNode;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${tones[tone]}`}
    >
      {children}
    </span>
  );
}

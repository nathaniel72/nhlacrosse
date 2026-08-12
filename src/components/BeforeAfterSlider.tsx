"use client";

// Not currently rendered on the home page (Nathaniel didn't like the
// placeholder look). The admin gallery Before/After tagging still works —
// wire this back into src/app/(site)/page.tsx once real photos are tagged.
import * as React from "react";
import Image from "next/image";

function PlaceholderPocket({ variant }: { variant: "before" | "after" }) {
  const worn = variant === "before";
  return (
    <svg viewBox="0 0 300 360" className="h-full w-full" aria-hidden="true">
      <rect width="300" height="360" fill={worn ? "#f4f4f5" : "#eef2ff"} />
      <path
        d="M60 40 C40 90 40 260 90 310 C140 350 200 340 230 290 C260 240 250 100 210 55 C170 15 90 -5 60 40Z"
        fill="none"
        stroke={worn ? "#a1a1aa" : "#0a0a0a"}
        strokeWidth="6"
      />
      {Array.from({ length: 6 }).map((_, row) =>
        Array.from({ length: 5 }).map((__, col) => {
          const x1 = 80 + col * 30;
          const y1 = 70 + row * 40;
          const jitter = worn ? (row + col) % 2 === 0 ? 6 : -6 : 0;
          return (
            <line
              key={`${row}-${col}`}
              x1={x1}
              y1={y1}
              x2={x1 + 26 + jitter}
              y2={y1 + 34}
              stroke={worn ? "#d4d4d8" : "#2563eb"}
              strokeWidth={worn ? 1.5 : 2.5}
              strokeLinecap="round"
              opacity={worn ? 0.7 : 0.9}
            />
          );
        })
      )}
    </svg>
  );
}

export function BeforeAfterSlider({
  beforeSrc,
  afterSrc,
  beforeLabel = "Before",
  afterLabel = "After",
}: {
  beforeSrc?: string | null;
  afterSrc?: string | null;
  beforeLabel?: string;
  afterLabel?: string;
}) {
  const [position, setPosition] = React.useState(50);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const draggingRef = React.useRef(false);
  const hasRealPhotos = !!beforeSrc && !!afterSrc;

  function updateFromClientX(clientX: number) {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPosition(Math.min(100, Math.max(0, pct)));
  }

  function handlePointerDown(e: React.PointerEvent) {
    draggingRef.current = true;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    updateFromClientX(e.clientX);
  }

  function handlePointerMove(e: React.PointerEvent) {
    if (!draggingRef.current) return;
    updateFromClientX(e.clientX);
  }

  function handlePointerUp() {
    draggingRef.current = false;
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowLeft") setPosition((p) => Math.max(0, p - 5));
    if (e.key === "ArrowRight") setPosition((p) => Math.min(100, p + 5));
  }

  return (
    <div
      ref={containerRef}
      className="relative aspect-[5/6] w-full touch-none select-none overflow-hidden rounded-2xl border border-border shadow-sm"
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      <div className="absolute inset-0">
        {hasRealPhotos ? (
          <Image src={afterSrc!} alt={afterLabel} fill className="object-cover" />
        ) : (
          <PlaceholderPocket variant="after" />
        )}
      </div>
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
      >
        {hasRealPhotos ? (
          <Image src={beforeSrc!} alt={beforeLabel} fill className="object-cover" />
        ) : (
          <PlaceholderPocket variant="before" />
        )}
      </div>

      <span className="absolute left-3 top-3 rounded-full bg-navy/80 px-2.5 py-1 text-xs font-semibold text-white">
        {beforeLabel}
      </span>
      <span className="absolute right-3 top-3 rounded-full bg-accent/90 px-2.5 py-1 text-xs font-semibold text-white">
        {afterLabel}
      </span>

      <div
        className="absolute inset-y-0 w-0.5 bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.15)]"
        style={{ left: `${position}%` }}
      >
        <button
          type="button"
          role="slider"
          aria-label="Drag to compare before and after"
          aria-valuenow={Math.round(position)}
          aria-valuemin={0}
          aria-valuemax={100}
          tabIndex={0}
          onPointerDown={handlePointerDown}
          onKeyDown={handleKeyDown}
          className="absolute top-1/2 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize items-center justify-center rounded-full border border-border bg-white text-navy shadow-md focus:outline-none focus:ring-2 focus:ring-accent"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M5 3 1 8l4 5M11 3l4 5-4 5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      {!hasRealPhotos ? (
        <p className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-white/90 px-3 py-1 text-[11px] font-medium text-muted">
          Real photos coming soon — drag to preview
        </p>
      ) : null}
    </div>
  );
}

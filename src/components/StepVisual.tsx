type Variant = "film" | "recommendation" | "shipping";

const wrapClass =
  "relative flex aspect-video w-full items-center justify-center overflow-hidden rounded-xl border border-border bg-surface-muted";

function FilmVisual({ videoSrc }: { videoSrc?: string }) {
  if (videoSrc) {
    return (
      <div className={wrapClass}>
        <video
          src={videoSrc}
          autoPlay
          loop
          muted
          playsInline
          className="h-full w-full object-cover"
        />
      </div>
    );
  }

  return (
    <div className={wrapClass}>
      <div className="flex h-12 w-12 animate-pulse items-center justify-center rounded-full bg-accent/10">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M8 5v14l11-7-11-7Z" fill="var(--accent)" />
        </svg>
      </div>
    </div>
  );
}

function RecommendationVisual() {
  const lines = [
    { width: "70%", delay: "0s" },
    { width: "45%", delay: "0.3s" },
    { width: "58%", delay: "0.6s" },
  ];
  return (
    <div className={wrapClass}>
      <div className="w-2/3 rounded-lg border border-border bg-surface p-4 shadow-sm">
        {lines.map((line, i) => (
          <div
            key={i}
            className="mb-2 h-2 origin-left animate-[growLine_1.8s_ease-in-out_infinite] rounded-full bg-accent/20 last:mb-0"
            style={{ width: line.width, animationDelay: line.delay }}
          />
        ))}
      </div>
      <span className="absolute right-4 top-4 flex h-6 w-6 animate-[popIn_1.8s_ease-in-out_infinite] items-center justify-center rounded-full bg-accent text-white">
        <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
          <path
            d="M3 8.5 6.5 12 13 4.5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    </div>
  );
}

function ShippingVisual() {
  return (
    <div className={wrapClass}>
      <div className="relative h-1 w-2/3 rounded-full bg-border">
        <span className="absolute left-0 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-accent" />
        <span className="absolute right-0 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-navy" />
        <div className="absolute top-1/2 flex h-7 w-7 -translate-y-1/2 animate-[shipMove_2.4s_ease-in-out_infinite] items-center justify-center rounded-full bg-white shadow-md">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path
              d="M3 7.5 12 3l9 4.5-9 4.5-9-4.5Z"
              stroke="var(--accent)"
              strokeWidth="1.6"
              strokeLinejoin="round"
            />
            <path
              d="M3 7.5v9L12 21m0-9v9m9-13.5v9L12 21"
              stroke="var(--accent)"
              strokeWidth="1.6"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}

export function StepVisual({ variant, videoSrc }: { variant: Variant; videoSrc?: string }) {
  if (variant === "film") return <FilmVisual videoSrc={videoSrc} />;
  if (variant === "recommendation") return <RecommendationVisual />;
  return <ShippingVisual />;
}

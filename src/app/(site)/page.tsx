import { prisma } from "@/lib/prisma";
import { IntakeForm } from "@/components/IntakeForm";
import { Card } from "@/components/ui/Card";
import { PositionShowcase } from "@/components/PositionShowcase";
import { Reveal } from "@/components/Reveal";
import { StepVisual } from "@/components/StepVisual";
import { Testimonials } from "@/components/Testimonials";
import { FAQ } from "@/components/FAQ";
import {
  REVIEW_SLA_HOURS,
  RESTRING_GUARANTEE_DAYS,
  BASE_STRINGING_FEE_CENTS,
} from "@/lib/constants";

const trustBadges = [
  "15 Years Stringing",
  `${REVIEW_SLA_HOURS}-Hr Film Review`,
  `${RESTRING_GUARANTEE_DAYS}-Day Guarantee`,
  `From $${BASE_STRINGING_FEE_CENTS / 100}`,
];

const steps = [
  {
    title: "Tell me about your game",
    body: "Fill out the form and drop a link to your film, if you've got one.",
    visual: "film",
  },
  {
    title: "Get a recommendation",
    body: "Within 48 hours I'll send a head + pocket built around how you actually play.",
    visual: "recommendation",
  },
  {
    title: "Order & ship",
    body: "Buy the head and ship it to me. I string it and ship it back within 3-5 days of it arriving.",
    visual: "shipping",
  },
] as const;

export const dynamic = "force-dynamic";

export default async function Home() {
  const testimonials = await prisma.testimonial.findMany({
    where: { featured: true },
    orderBy: { sortOrder: "asc" },
  });

  return (
    <div>
      <section className="hero-texture border-b border-border bg-white">
        <div className="hero-ribbon hidden sm:block" aria-hidden="true" />
        <div className="container-page py-16 sm:py-24">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-accent">
              15 years stringing &middot; former Dick&apos;s Sporting Goods lacrosse specialist
            </p>
            <h1 className="mt-4 font-display text-5xl uppercase leading-[0.98] tracking-tight text-navy sm:text-6xl">
              A stick strung around <span className="text-accent">how you play</span>, not just what&apos;s trending.
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-lg text-muted">
              Send me your film if you&apos;ve got it — I&apos;ll recommend the head
              and pocket that fits your game either way, string it myself, and
              back it with a free restring within 30 days if it isn&apos;t right.
            </p>
            <p className="mt-3 text-sm font-medium text-muted">
              Film review &amp; recommendation: always free. Stringing starts
              at $30, depending on complexity.
            </p>
            <a
              href="#intake-form"
              className="mt-8 inline-flex items-center justify-center rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white transition hover:bg-accent-hover"
            >
              Start Your Request
            </a>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
              {trustBadges.map((badge) => (
                <span
                  key={badge}
                  className="rounded-full border border-border bg-surface-muted px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wide text-navy"
                >
                  {badge}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="container-page py-16 sm:py-20">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-3xl uppercase tracking-tight text-navy sm:text-4xl">
              Built around your position, dialed in on your film
            </h2>
            <p className="mt-2 text-muted">
              Every recommendation starts here, then gets refined once I watch
              how you actually play.
            </p>
          </div>
        </Reveal>
        <Reveal delayMs={100} className="mx-auto mt-8 max-w-2xl">
          <PositionShowcase />
        </Reveal>
      </section>

      <section className="border-t border-border bg-surface-muted py-16 sm:py-20">
        <div className="container-page">
          <div className="grid gap-4 sm:grid-cols-3">
            {steps.map((step, i) => (
              <Reveal key={step.title} delayMs={i * 100}>
                <Card>
                  <StepVisual variant={step.visual} />
                  <div className="mt-4 flex items-start gap-4">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent font-display text-base text-white ring-2 ring-gold ring-offset-2 ring-offset-surface">
                      {i + 1}
                    </span>
                    <div>
                      <h3 className="font-semibold text-navy">{step.title}</h3>
                      <p className="mt-1 text-sm text-muted">{step.body}</p>
                    </div>
                  </div>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <Testimonials testimonials={testimonials} />

      <section id="intake-form" className="container-page py-16 sm:py-20 scroll-mt-16">
        <div className="mx-auto max-w-2xl">
          <h2 className="font-display text-3xl uppercase tracking-tight text-navy sm:text-4xl">
            Tell me about your game
          </h2>
          <p className="mt-2 text-muted">
            The more detail you give me, the better the recommendation. I read
            every submission personally.
          </p>
          <div className="mt-8">
            <IntakeForm />
          </div>
        </div>
      </section>

      <FAQ />
    </div>
  );
}

import { prisma } from "@/lib/prisma";
import { IntakeForm } from "@/components/IntakeForm";
import { Card } from "@/components/ui/Card";
import { BeforeAfterSlider } from "@/components/BeforeAfterSlider";
import { PositionShowcase } from "@/components/PositionShowcase";
import { Reveal } from "@/components/Reveal";

const steps = [
  {
    title: "Submit your film",
    body: "Tell me about your game and drop a link to your highlights or film.",
  },
  {
    title: "Get a recommendation",
    body: "Within 48 hours I'll send a head + pocket built around how you actually play.",
  },
  {
    title: "Order & ship",
    body: "Buy the head and ship it to me. I string it and ship your finished stick back.",
  },
];

export const dynamic = "force-dynamic";

export default async function Home() {
  const [beforePhoto, afterPhoto] = await Promise.all([
    prisma.galleryPhoto.findFirst({ where: { heroRole: "BEFORE" } }),
    prisma.galleryPhoto.findFirst({ where: { heroRole: "AFTER" } }),
  ]);

  return (
    <div>
      <section className="hero-texture border-b border-border bg-white">
        <div className="container-page grid gap-10 py-16 sm:py-24 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-accent">
              15 years stringing &middot; former Dick&apos;s Sporting Goods lacrosse specialist
            </p>
            <h1 className="mt-4 text-4xl font-bold leading-tight text-navy sm:text-5xl">
              A stick strung around <span className="text-accent">how you play</span>, not just what&apos;s trending.
            </h1>
            <p className="mt-5 max-w-xl text-lg text-muted">
              Send me your film. I&apos;ll recommend the head and pocket that fits
              your game, string it myself, and back it with a free restring if
              it isn&apos;t right.
            </p>
            <a
              href="#intake-form"
              className="mt-8 inline-flex items-center justify-center rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white transition hover:bg-accent-hover"
            >
              Start Your Request
            </a>
          </div>
          <BeforeAfterSlider
            beforeSrc={beforePhoto?.imageUrl}
            afterSrc={afterPhoto?.imageUrl}
          />
        </div>
      </section>

      <section className="container-page py-16 sm:py-20">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-bold text-navy sm:text-3xl">
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
                  <div className="flex items-start gap-4">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent text-sm font-bold text-white">
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

      <section id="intake-form" className="container-page py-16 sm:py-20 scroll-mt-16">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-2xl font-bold text-navy sm:text-3xl">
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
    </div>
  );
}

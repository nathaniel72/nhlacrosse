import { Card } from "@/components/ui/Card";

type Testimonial = {
  id: string;
  athleteName: string;
  resultOrTeam: string | null;
  quote: string;
};

export function Testimonials({ testimonials }: { testimonials: Testimonial[] }) {
  if (testimonials.length === 0) return null;

  return (
    <section className="border-t border-border bg-white py-16 sm:py-20">
      <div className="container-page">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-bold text-navy sm:text-3xl">
            What athletes are saying
          </h2>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t) => (
            <Card key={t.id}>
              <p className="text-sm text-navy">&ldquo;{t.quote}&rdquo;</p>
              <p className="mt-3 text-xs font-semibold uppercase tracking-widest text-accent">
                {t.athleteName}
                {t.resultOrTeam ? ` — ${t.resultOrTeam}` : ""}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

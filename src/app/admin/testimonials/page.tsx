import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/Card";
import { TestimonialForm } from "@/components/admin/TestimonialForm";
import { TestimonialRow } from "@/components/admin/TestimonialRow";

export const dynamic = "force-dynamic";

export default async function AdminTestimonialsPage() {
  const testimonials = await prisma.testimonial.findMany({
    orderBy: [{ featured: "desc" }, { sortOrder: "asc" }],
  });

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.5fr]">
      <div>
        <h1 className="text-2xl font-bold text-navy">Testimonials</h1>
        <p className="mt-1 text-sm text-muted">
          Real quotes/results from athletes you&apos;ve strung for. Only
          &ldquo;Shown on site&rdquo; ones appear publicly — make sure the
          athlete is fine being named before adding one.
        </p>
        <Card className="mt-6">
          <TestimonialForm />
        </Card>
      </div>
      <div className="flex flex-col gap-3">
        {testimonials.length === 0 ? (
          <Card>
            <p className="text-muted">No testimonials yet.</p>
          </Card>
        ) : (
          testimonials.map((t) => (
            <TestimonialRow
              key={t.id}
              id={t.id}
              athleteName={t.athleteName}
              resultOrTeam={t.resultOrTeam}
              quote={t.quote}
              featured={t.featured}
            />
          ))
        )}
      </div>
    </div>
  );
}

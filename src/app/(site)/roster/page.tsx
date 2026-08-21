import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { ButtonLink } from "@/components/ui/Button";

export const metadata = {
  title: "Roster",
};

export const dynamic = "force-dynamic";

export default async function RosterPage() {
  const athletes = await prisma.rosterAthlete.findMany({
    where: { featured: true },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });

  return (
    <div className="container-page py-16 sm:py-20">
      <div className="max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-widest text-accent">
          Roster
        </p>
        <h1 className="mt-3 font-display text-3xl uppercase tracking-tight text-navy sm:text-4xl">
          Athletes I&apos;ve strung for
        </h1>
        <p className="mt-3 text-muted">
          A few of the players trusting their setup to a film-based recommendation.
        </p>
      </div>

      {athletes.length === 0 ? (
        <div className="mt-12 rounded-2xl border border-dashed border-border bg-surface-muted p-12 text-center">
          <p className="text-muted">
            The roster is just getting started — check back soon.
          </p>
          <ButtonLink href="/#intake-form" className="mt-6">
            Get Your Stick Strung
          </ButtonLink>
        </div>
      ) : (
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {athletes.map((athlete) => (
            <figure
              key={athlete.id}
              className="overflow-hidden rounded-2xl border border-border bg-surface"
            >
              <div className="relative aspect-square w-full bg-surface-muted">
                <Image
                  src={athlete.photoUrl}
                  alt={athlete.athleteName}
                  fill
                  className="object-cover object-[30%_center]"
                  sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                />
              </div>
              <figcaption className="p-4">
                <p className="font-semibold text-navy">{athlete.athleteName}</p>
                {athlete.program ? (
                  <p className="text-sm text-muted">{athlete.program}</p>
                ) : null}
              </figcaption>
            </figure>
          ))}
        </div>
      )}
    </div>
  );
}

import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/Card";
import { RosterUploadForm } from "@/components/admin/RosterUploadForm";
import { RosterAthleteCard } from "@/components/admin/RosterAthleteCard";

export const dynamic = "force-dynamic";

export default async function AdminRosterPage() {
  const athletes = await prisma.rosterAthlete.findMany({
    orderBy: [{ featured: "desc" }, { sortOrder: "asc" }],
  });

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_2fr]">
      <div>
        <h1 className="text-2xl font-bold text-navy">Roster</h1>
        <p className="mt-1 text-sm text-muted">
          Athletes you&apos;ve strung for, shown on the public /roster page.
          Only add someone once they&apos;re fine being named and pictured.
        </p>
        <Card className="mt-6">
          <RosterUploadForm />
        </Card>
      </div>
      <div>
        {athletes.length === 0 ? (
          <Card>
            <p className="text-muted">No roster athletes yet.</p>
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {athletes.map((athlete) => (
              <RosterAthleteCard
                key={athlete.id}
                id={athlete.id}
                photoUrl={athlete.photoUrl}
                athleteName={athlete.athleteName}
                program={athlete.program}
                featured={athlete.featured}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

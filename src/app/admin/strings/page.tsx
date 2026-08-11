import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/Card";
import { StringOptionForm } from "@/components/admin/StringOptionForm";
import { StringOptionRow } from "@/components/admin/StringOptionRow";

export const dynamic = "force-dynamic";

export default async function AdminStringsPage() {
  const strings = await prisma.stringOption.findMany({
    orderBy: [{ active: "desc" }, { sortOrder: "asc" }],
  });

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.5fr]">
      <div>
        <h1 className="text-2xl font-bold text-navy">String Catalog</h1>
        <p className="mt-1 text-sm text-muted">
          Basic in-stock strings you sell directly. Offer these on individual
          recommendations — athletes wanting a specific color can order it
          themselves when they buy the head.
        </p>
        <Card className="mt-6">
          <StringOptionForm />
        </Card>
      </div>
      <div className="flex flex-col gap-3">
        {strings.length === 0 ? (
          <Card>
            <p className="text-muted">No string options yet.</p>
          </Card>
        ) : (
          strings.map((s) => (
            <StringOptionRow
              key={s.id}
              id={s.id}
              name={s.name}
              color={s.color}
              priceCents={s.priceCents}
              active={s.active}
            />
          ))
        )}
      </div>
    </div>
  );
}

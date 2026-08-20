import { Card } from "@/components/ui/Card";
import { TeamOrderForm } from "@/components/TeamOrderForm";
import { formatCents, TEAM_ORDER_RATE_CENTS, BASE_STRINGING_FEE_CENTS } from "@/lib/constants";

export const metadata = {
  title: "Team Orders",
};

export default function TeamOrdersPage() {
  return (
    <div className="container-page py-16 sm:py-20">
      <div className="mx-auto max-w-xl">
        <p className="text-sm font-semibold uppercase tracking-widest text-accent">
          Team Orders
        </p>
        <h1 className="mt-3 font-display text-3xl uppercase tracking-tight text-navy sm:text-4xl">
          Stringing up a whole roster?
        </h1>
        <p className="mt-4 text-muted">
          Coaching a team and want everyone dialed in before the season?
          Team orders get a discounted rate of {formatCents(TEAM_ORDER_RATE_CENTS)}{" "}
          per stick (vs. {formatCents(BASE_STRINGING_FEE_CENTS)} individually).
          I like to talk through team requests directly rather than run them
          through the standard form — fill this out and I&apos;ll be in touch.
        </p>
        <Card className="mt-8">
          <TeamOrderForm />
        </Card>
      </div>
    </div>
  );
}

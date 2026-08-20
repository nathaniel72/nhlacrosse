import Link from "next/link";
import {
  BASE_STRINGING_FEE_CENTS,
  RESTRING_GUARANTEE_DAYS,
  STANDARD_STRINGING_DAYS,
  RUSH_STRINGING_DAYS,
  RUSH_FEE_CENTS,
  TEAM_ORDER_RATE_CENTS,
  formatCents,
} from "@/lib/constants";

const FAQS = [
  {
    question: "Why NH Lacrosse?",
    answer:
      "Every recommendation is built from watching your actual film and how you play — not a catalog. 15 years stringing, and I string it myself.",
  },
  {
    question: "How long do orders take?",
    answer: `I'll get you a recommendation within 48 hours of your submission. Once your head arrives, stringing takes ${STANDARD_STRINGING_DAYS} (or ${RUSH_STRINGING_DAYS} with rush, +${formatCents(RUSH_FEE_CENTS)}).`,
  },
  {
    question: "Can I send you a head I already own?",
    answer:
      "Yes — pick \"I already have a head\" on the form and I'll skip straight to a pocket recommendation. No need to buy anything new.",
  },
  {
    question: "What if I don't have film?",
    answer:
      "Film helps, but it's optional. Just be as detailed as you can in the Playing Style section and I'll work from that.",
  },
  {
    question: "What's the guarantee?",
    answer: `If the pocket isn't right when you get it, I'll restring it for free within ${RESTRING_GUARANTEE_DAYS} days — one redo, no questions asked.`,
  },
  {
    question: "What does it cost?",
    answer: `Film review and the recommendation are always free. Stringing starts at ${formatCents(BASE_STRINGING_FEE_CENTS)} depending on complexity.`,
  },
  {
    question: "Do you take team orders?",
    answer: (
      <>
        Yes — coaches get a discounted rate of {formatCents(TEAM_ORDER_RATE_CENTS)} per stick.{" "}
        <Link href="/team-orders" className="text-accent hover:underline">
          Get in touch about your team
        </Link>
        .
      </>
    ),
  },
] as const;

export function FAQ() {
  return (
    <section className="border-t border-border bg-surface-muted py-16 sm:py-20">
      <div className="container-page">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-2xl uppercase tracking-tight text-navy sm:text-3xl">
            Frequently asked questions
          </h2>
        </div>
        <div className="mx-auto mt-8 flex max-w-2xl flex-col gap-3">
          {FAQS.map((faq) => (
            <details
              key={faq.question}
              className="group rounded-xl border border-border bg-surface p-4 open:border-accent"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between font-semibold text-navy">
                {faq.question}
                <span className="ml-4 text-accent transition group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 text-sm text-muted">{faq.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

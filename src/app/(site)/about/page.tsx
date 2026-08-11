import { ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export const metadata = {
  title: "About",
};

const highlights = [
  "15 years stringing sticks at every level, from youth to college",
  "Former lacrosse specialist at Dick's Sporting Goods",
  "Obsessive about new gear — heads, pockets, shafts, all of it",
  "Recommendations built from watching your actual film, not guesswork",
];

export default function AboutPage() {
  return (
    <div className="container-page py-16 sm:py-20">
      <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr] lg:items-start">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-accent">
            About
          </p>
          <h1 className="mt-3 text-3xl font-bold text-navy sm:text-4xl">
            Stringing built around how you actually play
          </h1>
          <div className="mt-6 space-y-4 text-muted">
            <p>
              I&apos;ve been stringing lacrosse sticks for 15 years. What started as
              tinkering with my own pocket turned into a full obsession with
              lacrosse gear — I spent time as the lacrosse specialist at my
              local Dick&apos;s Sporting Goods, and I still spend my free time
              learning about every new head, pocket, and shaft that comes out.
            </p>
            <p>
              The thing I care about most is fit. A pocket that&apos;s perfect for a
              step-down shooting midfielder is often the wrong pocket for a
              quarterback attackman heading into a college season. When
              athletes I&apos;ve strung for years send me film of how their game
              has changed, I want to see it; because the right setup changes
              with you.
            </p>
            <p>
              That&apos;s why every request here starts with your film, not a
              catalog. I watch how you play, I recommend a head and a pocket
              that fits it, and I string it myself. If it&apos;s not right when you
              get it, I&apos;ll restring it for free.
            </p>
          </div>
          <ButtonLink href="/#intake-form" className="mt-8">
            Submit Your Film
          </ButtonLink>
        </div>
        <Card>
          <h2 className="font-semibold text-navy">Quick facts</h2>
          <ul className="mt-4 space-y-3 text-sm text-muted">
            {highlights.map((item) => (
              <li key={item} className="flex gap-2">
                <span className="text-accent">&bull;</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}

import Link from "next/link";
import { INSTAGRAM_URL } from "@/lib/constants";

const links = [
  { href: "/", label: "Get Strung" },
  { href: "/gallery", label: "Gallery" },
  { href: "/roster", label: "Roster" },
  { href: "/about", label: "About" },
  { href: "/merch", label: "Merch" },
  { href: "/team-orders", label: "Team Orders" },
];

function InstagramIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="17.5" cy="6.5" r="1.1" fill="currentColor" />
    </svg>
  );
}

export function Nav() {
  return (
    <header className="border-b border-border bg-white text-navy">
      <div className="bg-navy py-1.5 text-center text-[11px] font-semibold uppercase tracking-widest text-white">
        Film Review &amp; Recommendation <span className="text-gold">&mdash;</span> Always Free
      </div>
      <div className="container-page flex h-16 items-center justify-between">
        <Link href="/" className="font-display text-2xl uppercase tracking-tight">
          <span className="text-accent">NH</span> Lacrosse
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-medium sm:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-navy/70 transition hover:text-accent"
            >
              {link.label}
            </Link>
          ))}
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noreferrer"
            aria-label="NH Lacrosse on Instagram"
            className="text-navy/70 transition hover:text-accent"
          >
            <InstagramIcon />
          </a>
        </nav>
        <Link
          href="/#intake-form"
          className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white transition hover:bg-accent-hover sm:hidden"
        >
          Start
        </Link>
      </div>
      <nav className="flex items-center gap-5 overflow-x-auto border-t border-border px-5 py-2 text-sm font-medium sm:hidden">
        {links.map((link) => (
          <Link key={link.href} href={link.href} className="whitespace-nowrap text-navy/70">
            {link.label}
          </Link>
        ))}
        <a
          href={INSTAGRAM_URL}
          target="_blank"
          rel="noreferrer"
          aria-label="NH Lacrosse on Instagram"
          className="shrink-0 text-navy/70"
        >
          <InstagramIcon />
        </a>
      </nav>
    </header>
  );
}

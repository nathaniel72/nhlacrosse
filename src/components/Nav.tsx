import Link from "next/link";

const links = [
  { href: "/", label: "Get Strung" },
  { href: "/gallery", label: "Gallery" },
  { href: "/about", label: "About" },
  { href: "/merch", label: "Merch" },
];

export function Nav() {
  return (
    <header className="border-b border-border bg-white text-navy">
      <div className="container-page flex h-16 items-center justify-between">
        <Link href="/" className="font-bold tracking-tight text-lg">
          <span className="text-accent">NH</span> Lacrosse
        </Link>
        <nav className="hidden gap-6 text-sm font-medium sm:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-navy/70 transition hover:text-accent"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <Link
          href="/#intake-form"
          className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white transition hover:bg-accent-hover sm:hidden"
        >
          Start
        </Link>
      </div>
      <nav className="flex gap-5 overflow-x-auto border-t border-border px-5 py-2 text-sm font-medium sm:hidden">
        {links.map((link) => (
          <Link key={link.href} href={link.href} className="whitespace-nowrap text-navy/70">
            {link.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}

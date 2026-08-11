import Link from "next/link";
import { SITE_NAME } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border bg-white text-muted">
      <div className="container-page flex flex-col gap-4 py-10 text-sm sm:flex-row sm:items-center sm:justify-between">
        <p>
          &copy; {new Date().getFullYear()} {SITE_NAME}. 15 years stringing,
          one pocket at a time.
        </p>
        <div className="flex gap-5">
          <Link href="/gallery" className="hover:text-accent">
            Gallery
          </Link>
          <Link href="/about" className="hover:text-accent">
            About
          </Link>
          <Link href="/#intake-form" className="hover:text-accent">
            Get Strung
          </Link>
        </div>
      </div>
    </footer>
  );
}

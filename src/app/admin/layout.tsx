import type { Metadata } from "next";
import Link from "next/link";
import "../globals.css";
import { auth, signOut } from "@/auth";

export const metadata: Metadata = {
  title: "Admin | NH Lacrosse",
};

const links = [
  { href: "/admin", label: "Submissions" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/strings", label: "Strings" },
  { href: "/admin/testimonials", label: "Testimonials" },
  { href: "/admin/roster", label: "Roster" },
  { href: "/admin/gallery", label: "Gallery" },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full bg-surface-muted">
        <header className="border-b border-border bg-white text-navy">
          <div className="container-page flex min-h-16 flex-wrap items-center justify-between gap-x-6 gap-y-3 py-3">
            <Link href="/admin" className="font-bold">
              Admin
            </Link>
            {session?.user ? (
              <nav className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm font-medium">
                {links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-navy/70 hover:text-accent"
                  >
                    {link.label}
                  </Link>
                ))}
                <form
                  action={async () => {
                    "use server";
                    await signOut({ redirectTo: "/admin/login" });
                  }}
                >
                  <button type="submit" className="text-muted hover:text-accent">
                    Sign out
                  </button>
                </form>
              </nav>
            ) : null}
          </div>
        </header>
        <div className="container-page py-10">{children}</div>
      </body>
    </html>
  );
}

import * as React from "react";
import Link from "next/link";

const variants = {
  primary:
    "bg-accent text-white hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed",
  secondary:
    "bg-navy text-white hover:bg-navy-light disabled:opacity-50 disabled:cursor-not-allowed",
  outline:
    "border border-border text-navy hover:border-accent hover:text-accent disabled:opacity-50",
};

type Variant = keyof typeof variants;

const base =
  "inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition";

export function Button({
  variant = "primary",
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props} />
  );
}

export function ButtonLink({
  variant = "primary",
  className = "",
  href,
  children,
}: {
  variant?: Variant;
  className?: string;
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link href={href} className={`${base} ${variants[variant]} ${className}`}>
      {children}
    </Link>
  );
}

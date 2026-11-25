import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "계정",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-6xl flex-col items-center justify-center bg-background px-6 py-12">
      <Link
        href="/"
        className="mb-6 flex items-center gap-2 font-semibold text-foreground text-lg tracking-tight"
      >
        <svg
          width="32"
          height="32"
          viewBox="0 0 64 64"
          fill="none"
          aria-hidden="true"
          className="h-8 w-8 shrink-0"
        >
          <rect width="64" height="64" rx="16" className="fill-primary" />
          <circle cx="32" cy="32" r="14" className="fill-primary-foreground" />
          <circle cx="32" cy="32" r="6" className="fill-status-valid-fg" />
        </svg>
        <span>알콕 · Alkok</span>
      </Link>
      {children}
    </div>
  );
}

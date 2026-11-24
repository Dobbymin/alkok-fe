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
    <div className="flex min-h-dvh flex-col items-center justify-center bg-background px-4 py-10">
      <Link
        href="/"
        className="mb-6 flex items-center gap-2 font-semibold text-foreground text-lg tracking-tight"
      >
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-primary font-bold text-primary-foreground text-sm">
          A
        </span>
        <span>알콕 · Alkok</span>
      </Link>
      {children}
    </div>
  );
}

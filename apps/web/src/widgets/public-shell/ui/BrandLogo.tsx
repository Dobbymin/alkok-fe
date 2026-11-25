import Link from "next/link";
import { cn } from "@alkok/core";

export const BrandLogo = ({
  className,
  compact = false,
}: {
  className?: string;
  compact?: boolean;
}) => (
  <Link
    href="/"
    className={cn(
      "inline-flex items-center gap-2 rounded-sm font-bold tracking-tight text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
      className,
    )}
    aria-label="알콕(Alkok) 홈으로 이동"
  >
    <svg
      width="24"
      height="24"
      viewBox="0 0 64 64"
      fill="none"
      aria-hidden="true"
      className="h-6 w-6 shrink-0"
    >
      <rect width="64" height="64" rx="16" className="fill-primary" />
      <circle cx="32" cy="32" r="14" className="fill-primary-foreground" />
      <circle cx="32" cy="32" r="6" className="fill-status-valid-fg" />
    </svg>
    {!compact ? (
      <>
        <span className="text-base font-bold">알콕</span>
        <span translate="no" className="text-xs font-medium text-muted-foreground">
          Alkok
        </span>
      </>
    ) : null}
  </Link>
);

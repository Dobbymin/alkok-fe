import Link from "next/link";
import { cn } from "@/shared/lib";

export const BrandLogo = ({ className }: { className?: string }) => (
  <Link
    href="/"
    className={cn(
      "inline-flex items-center gap-2 font-bold tracking-tight text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm",
      className,
    )}
    aria-label="알콕(Alkok) 홈으로 이동"
  >
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className="h-6 w-6 shrink-0"
    >
      <rect width="24" height="24" rx="6" className="fill-primary" />
      <circle cx="12" cy="12" r="4.5" className="fill-primary-foreground" />
    </svg>
    <span className="text-base font-bold">알콕</span>
    <span className="text-xs font-medium text-muted-foreground">Alkok</span>
  </Link>
);

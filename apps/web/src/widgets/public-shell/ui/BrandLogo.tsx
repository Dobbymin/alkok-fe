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
      <rect width="64" height="64" rx="16" fill="#2563EB" />
      <path
        d="M27 55C14.8 55 7.5 49.2 7.5 39.6C7.5 29.8 15 24 24.8 24C29.2 24 31.6 25.4 33.4 27.9C35 30.1 37.3 31.8 40.4 32.3C44.8 33.1 48 37.2 48 42.2C48 50.2 39.6 55 27 55Z"
        fill="#FFFDF5"
      />
      <path
        d="M9.8 44.6C12.8 50 19.2 52.5 27.2 52.5C36.4 52.5 43.4 49 46.2 44.2C45.1 50.8 37.8 55 27 55C17.2 55 10.9 50.6 9.8 44.6Z"
        fill="#EFE4D2"
      />
      <path
        d="M32.8 28.6C34.7 31.1 37.2 32.6 40.3 33.2"
        stroke="#D7C8B2"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <ellipse cx="15.2" cy="43.8" rx="3.2" ry="1.9" fill="#FB7185" opacity="0.58" />
      <ellipse cx="38.2" cy="43.8" rx="3.2" ry="1.9" fill="#FB7185" opacity="0.58" />
      <circle cx="20.6" cy="39.8" r="2.7" fill="#0F172A" />
      <circle cx="19.8" cy="38.9" r="0.85" fill="#FFFFFF" />
      <circle cx="32.8" cy="39.8" r="2.7" fill="#0F172A" />
      <circle cx="32" cy="38.9" r="0.85" fill="#FFFFFF" />
      <ellipse cx="26.7" cy="44.2" rx="2.3" ry="2.7" fill="#0F172A" />
      <circle cx="26.7" cy="45.2" r="1" fill="#FB7185" />
      <g transform="translate(36.8, 28.8) rotate(45)">
        <g
          stroke="#2563EB"
          strokeWidth="2.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        >
          <path d="M-4.6 -1V-8.4M0 0.2V-8.4M4.6 -1V-8.4" />
          <path d="M-4.6 -8.4C-4.6 -11.8 -2.3 -13 0 -13C2.3 -13 4.6 -11.8 4.6 -8.4" />
          <path d="M0 -13V-25.5" />
        </g>
        <g
          stroke="#E2E8F0"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        >
          <path d="M-4.6 -1V-8.4M0 0.2V-8.4M4.6 -1V-8.4" />
          <path d="M-4.6 -8.4C-4.6 -11.8 -2.3 -13 0 -13C2.3 -13 4.6 -11.8 4.6 -8.4" />
        </g>
        <path
          d="M-4.6 -8.4C-4.6 -11.8 -2.3 -13 0 -13C2.3 -13 4.6 -11.8 4.6 -8.4Z"
          fill="#E2E8F0"
        />
        <path
          d="M0 -12.4V-25.2"
          stroke="#F8FAFC"
          strokeWidth="4.2"
          strokeLinecap="round"
        />
      </g>
      <line
        x1="30.8"
        y1="20.4"
        x2="28.6"
        y2="15.4"
        stroke="#FDE047"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <line
        x1="45.4"
        y1="30.4"
        x2="50.4"
        y2="31.2"
        stroke="#FDE047"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
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

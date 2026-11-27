import { cn } from "@alkok/core";

export const AlkokHeroMark = ({
  className,
  maskId = "alkok-hero-mark-mask",
}: {
  className?: string;
  maskId?: string;
}) => (
  <svg
      data-testid="alkok-hero-mark"
      aria-hidden="true"
      viewBox="5 6 54 52"
      fill="none"
      className={cn("shrink-0", className)}
    >
      <defs>
        <mask id={maskId}>
          <rect x="0" y="0" width="64" height="64" fill="white" />
          <g
            transform="translate(36.8, 28.8) rotate(45)"
            stroke="black"
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          >
            <path d="M-4.6 -1V-8.4M0 0.2V-8.4M4.6 -1V-8.4" />
            <path d="M-4.6 -8.4C-4.6 -11.8 -2.3 -13 0 -13C2.3 -13 4.6 -11.8 4.6 -8.4" />
            <path d="M0 -13V-25.5" />
          </g>
        </mask>
      </defs>
      <g mask={`url(#${maskId})`}>
        <path
          d="M27 55C14.8 55 7.5 49.2 7.5 39.6C7.5 29.8 15 24 24.8 24C29.2 24 31.6 25.4 33.4 27.9C35 30.1 37.3 31.8 40.4 32.3C44.8 33.1 48 37.2 48 42.2C48 50.2 39.6 55 27 55Z"
          fill="#FFFDF5"
          strokeWidth="1.2"
          className="stroke-[#DDD2BE] dark:stroke-transparent"
        />
        <path
          d="M9.8 44.6C12.8 50 19.2 52.5 27.2 52.5C36.4 52.5 43.4 49 46.2 44.2C45.1 50.8 37.8 55 27 55C17.2 55 10.9 50.6 9.8 44.6Z"
          fill="#EFE4D2"
        />
        <path
          d="M32.8 28.6C34.7 31.1 37.2 32.6 40.3 33.2"
          strokeWidth="1.7"
          strokeLinecap="round"
          className="stroke-[#C9B99F] dark:stroke-[#D7C8B2]"
        />
        <ellipse cx="15.2" cy="43.8" rx="3.2" ry="1.9" fill="#FB7185" opacity="0.62" />
        <ellipse cx="38.2" cy="43.8" rx="3.2" ry="1.9" fill="#FB7185" opacity="0.62" />
        <circle cx="20.6" cy="39.8" r="2.7" fill="#0F172A" />
        <circle cx="19.8" cy="38.9" r="0.85" fill="#FFFFFF" />
        <circle cx="32.8" cy="39.8" r="2.7" fill="#0F172A" />
        <circle cx="32" cy="38.9" r="0.85" fill="#FFFFFF" />
        <ellipse cx="26.7" cy="44.2" rx="2.3" ry="2.7" fill="#0F172A" />
        <circle cx="26.7" cy="45.2" r="1" fill="#FB7185" />
      </g>
      <g transform="translate(36.8, 28.8) rotate(45)">
        <g
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          className="stroke-[#64748B] dark:stroke-[#CBD5E1]"
        >
          <path d="M-4.6 -1V-8.4M0 0.2V-8.4M4.6 -1V-8.4" />
          <path d="M-4.6 -8.4C-4.6 -11.8 -2.3 -13 0 -13C2.3 -13 4.6 -11.8 4.6 -8.4" />
        </g>
        <path
          d="M-4.6 -8.4C-4.6 -11.8 -2.3 -13 0 -13C2.3 -13 4.6 -11.8 4.6 -8.4Z"
          className="fill-[#64748B] dark:fill-[#CBD5E1]"
        />
        <path
          d="M0 -12.4V-25.2"
          strokeWidth="4.2"
          strokeLinecap="round"
          className="stroke-[#94A3B8] dark:stroke-[#F8FAFC]"
        />
      </g>
      <line
        x1="30.8"
        y1="20.4"
        x2="28.6"
        y2="15.4"
        strokeWidth="2.4"
        strokeLinecap="round"
        className="stroke-[#F59E0B] dark:stroke-[#FDE047]"
      />
      <line
        x1="45.4"
        y1="30.4"
        x2="50.4"
        y2="31.2"
        strokeWidth="2.4"
        strokeLinecap="round"
        className="stroke-[#F59E0B] dark:stroke-[#FDE047]"
      />
    </svg>
);

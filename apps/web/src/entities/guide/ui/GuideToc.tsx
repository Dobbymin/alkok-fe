"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { cn } from "@alkok/core";

export interface TocHeading {
  id: string;
  text: string;
  level: number;
}

export const GuideToc = ({ headings }: { headings: TocHeading[] }) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  if (headings.length === 0) return null;

  const list = (
    <ul className="flex flex-col gap-2 text-xs">
      {headings.map((h) => (
        <li key={h.id} className={cn(h.level >= 3 && "ps-3")}>
          <a
            href={`#${h.id}`}
            className="block rounded-sm py-1 text-muted-foreground transition-colors hover:text-foreground"
          >
            {h.text}
          </a>
        </li>
      ))}
    </ul>
  );

  return (
    <>
      {/* Mobile collapsible TOC */}
      <div className="rounded-xl border border-transparent bg-surface-sunken p-3 dark:border-border lg:hidden">
        <button
          type="button"
          onClick={() => setMobileOpen((prev) => !prev)}
          aria-expanded={mobileOpen}
          className="flex w-full items-center justify-between text-xs font-semibold text-foreground"
        >
          <span>목차</span>
          <ChevronDown
            className={cn(
              "h-4 w-4 transition-transform duration-150 ease-out",
              mobileOpen && "rotate-180",
            )}
            strokeWidth={1.75}
            absoluteStrokeWidth
            aria-hidden="true"
          />
        </button>
        {mobileOpen ? <div className="mt-2 border-t border-separator pt-2">{list}</div> : null}
      </div>

      {/* Desktop sticky TOC */}
      <aside className="hidden lg:block">
        <div className="sticky top-8 rounded-xl border border-transparent bg-surface-sunken p-4 dark:border-border">
          <p className="mb-3 text-xs font-semibold text-foreground">목차</p>
          {list}
        </div>
      </aside>
    </>
  );
};

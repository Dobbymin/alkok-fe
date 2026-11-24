"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { cn } from "@/shared/lib";

export interface TocHeading {
  id: string;
  text: string;
  level: number;
}

export const GuideToc = ({ headings }: { headings: TocHeading[] }) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  if (headings.length === 0) return null;

  const list = (
    <ul className="flex flex-col gap-1.5 text-xs">
      {headings.map((h) => (
        <li key={h.id} className={cn(h.level >= 3 && "pl-3")}>
          <a
            href={`#${h.id}`}
            className="block rounded-sm py-0.5 text-muted-foreground hover:text-foreground"
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
      <div className="rounded-lg border border-border bg-card p-3 lg:hidden">
        <button
          type="button"
          onClick={() => setMobileOpen((prev) => !prev)}
          aria-expanded={mobileOpen}
          className="flex w-full items-center justify-between text-xs font-semibold text-foreground"
        >
          <span>목차</span>
          <ChevronDown
            className={cn(
              "h-4 w-4 transition-transform",
              mobileOpen && "rotate-180",
            )}
            strokeWidth={1.75}
          />
        </button>
        {mobileOpen ? <div className="mt-2 pt-2 border-t border-border">{list}</div> : null}
      </div>

      {/* Desktop sticky TOC */}
      <aside className="hidden lg:block">
        <div className="sticky top-20 rounded-lg border border-border bg-card p-4">
          <p className="mb-2.5 text-xs font-semibold text-foreground">목차</p>
          {list}
        </div>
      </aside>
    </>
  );
};

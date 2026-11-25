import type { ReactNode } from "react";
import { cn } from "@alkok/core";

export interface SplitPaneProps {
  left: ReactNode;
  right: ReactNode;
  className?: string;
}

export const SplitPane = ({ left, right, className }: SplitPaneProps) => (
  <div
    className={cn(
      "grid grid-cols-1 gap-4 lg:grid-cols-2 lg:items-start",
      className,
    )}
  >
    <section className="rounded-xl border border-transparent bg-card p-4 shadow-border">
      {left}
    </section>
    <section className="rounded-xl border border-transparent bg-card p-4 shadow-border">
      {right}
    </section>
  </div>
);

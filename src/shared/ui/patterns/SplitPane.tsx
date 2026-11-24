import type { ReactNode } from "react";
import { cn } from "@/shared/lib";

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
    <section className="rounded-lg border border-border bg-card p-4">
      {left}
    </section>
    <section className="rounded-lg border border-border bg-card p-4">
      {right}
    </section>
  </div>
);

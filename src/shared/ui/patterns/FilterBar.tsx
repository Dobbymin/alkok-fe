import type { ReactNode } from "react";
import { cn } from "@/shared/lib";

export interface FilterBarProps {
  children: ReactNode;
  actions?: ReactNode;
  className?: string;
}

export const FilterBar = ({ children, actions, className }: FilterBarProps) => (
  <div
    className={cn(
      "flex flex-col gap-3 rounded-lg border border-border bg-card p-3 sm:flex-row sm:items-center sm:justify-between",
      className,
    )}
  >
    <div className="flex flex-wrap items-center gap-2">{children}</div>
    {actions ? (
      <div className="flex shrink-0 items-center gap-2">{actions}</div>
    ) : null}
  </div>
);

import type { ReactNode } from "react";
import { cn } from "@alkok/core";

export interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export const EmptyState = ({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) => (
  <div
    className={cn(
      "flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card px-6 py-12 text-center",
      className,
    )}
  >
    {icon ? (
      <div
        aria-hidden="true"
        className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-surface-sunken text-muted-foreground"
      >
        {icon}
      </div>
    ) : null}
    <h3 className="text-balance text-base font-semibold leading-[1.3] text-foreground">
      {title}
    </h3>
    {description ? (
      <p className="mt-1.5 max-w-md text-pretty text-sm leading-[1.5] text-muted-foreground">
        {description}
      </p>
    ) : null}
    {action ? <div className="mt-4 flex flex-wrap justify-center gap-2">{action}</div> : null}
  </div>
);

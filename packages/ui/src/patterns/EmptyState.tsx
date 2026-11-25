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
      "flex flex-col items-center justify-center rounded-2xl border border-transparent bg-surface-sunken px-6 py-12 text-center dark:border-border",
      className,
    )}
  >
    {icon ? (
      <div
        aria-hidden="true"
        className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-card text-muted-foreground"
      >
        {icon}
      </div>
    ) : null}
    <p className="text-balance text-base font-semibold leading-[1.3] text-foreground">
      {title}
    </p>
    {description ? (
      <p className="mt-2 max-w-md text-pretty text-sm leading-[1.5] text-muted-foreground">
        {description}
      </p>
    ) : null}
    {action ? <div className="mt-4 flex flex-wrap justify-center gap-2">{action}</div> : null}
  </div>
);

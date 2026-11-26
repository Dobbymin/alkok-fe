import type { HTMLAttributes } from "react";
import { cn } from "@alkok/core";

export const Skeleton = ({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) => (
  <div
    data-slot="skeleton"
    className={cn(
      "animate-pulse rounded-md bg-foreground/[0.08] dark:bg-foreground/[0.12]",
      className,
    )}
    {...props}
  />
);

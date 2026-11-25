"use client";

import * as ToggleGroupPrimitive from "@radix-ui/react-toggle-group";
import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@alkok/core";

export const ToggleGroup = ({
  className,
  ...props
}: ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Root>) => (
  <ToggleGroupPrimitive.Root
    className={cn("inline-flex flex-wrap items-center gap-1.5", className)}
    {...props}
  />
);

export const ToggleGroupItem = ({
  className,
  ...props
}: ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Item>) => (
  <ToggleGroupPrimitive.Item
    className={cn(
      "inline-flex h-9 items-center justify-center rounded-md border border-border bg-card px-3 text-sm font-medium text-muted-foreground [-webkit-tap-highlight-color:transparent] transition-[color,background-color,border-color] duration-150 ease-out hover:bg-secondary hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-50 data-[state=on]:border-primary data-[state=on]:bg-accent data-[state=on]:text-accent-foreground",
      className,
    )}
    {...props}
  />
);

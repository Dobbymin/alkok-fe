"use client";

import * as PopoverPrimitive from "@radix-ui/react-popover";
import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@alkok/core";

export const Popover = PopoverPrimitive.Root;
export const PopoverTrigger = PopoverPrimitive.Trigger;
export const PopoverAnchor = PopoverPrimitive.Anchor;

export const PopoverContent = ({
  className,
  align = "center",
  sideOffset = 6,
  ...props
}: ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>) => (
  <PopoverPrimitive.Portal>
    <PopoverPrimitive.Content
      align={align}
      sideOffset={sideOffset}
      className={cn(
        "z-50 w-72 origin-[var(--radix-popover-content-transform-origin)] overscroll-contain rounded-lg border border-transparent bg-surface-raised p-4 text-popover-foreground shadow-elevated outline-none",
        className,
      )}
      {...props}
    />
  </PopoverPrimitive.Portal>
);

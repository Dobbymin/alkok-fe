"use client";

import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@alkok/core";

export const TooltipProvider = TooltipPrimitive.Provider;
export const Tooltip = TooltipPrimitive.Root;
export const TooltipTrigger = TooltipPrimitive.Trigger;

export const TooltipContent = ({
  className,
  sideOffset = 4,
  ...props
}: ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>) => (
  <TooltipPrimitive.Portal>
    <TooltipPrimitive.Content
      sideOffset={sideOffset}
      className={cn(
        "z-50 max-w-xs origin-[var(--radix-tooltip-content-transform-origin)] rounded-md border border-transparent bg-surface-raised px-3 py-2 text-xs text-popover-foreground shadow-elevated",
        className,
      )}
      {...props}
    />
  </TooltipPrimitive.Portal>
);

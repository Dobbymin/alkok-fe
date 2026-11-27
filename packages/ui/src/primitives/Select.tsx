"use client";

import * as SelectPrimitive from "@radix-ui/react-select";
import { Check, ChevronDown } from "lucide-react";
import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@alkok/core";

export const Select = SelectPrimitive.Root;
export const SelectGroup = SelectPrimitive.Group;
export const SelectValue = SelectPrimitive.Value;

export const SelectTrigger = ({
  className,
  children,
  ...props
}: ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>) => (
  <SelectPrimitive.Trigger
    className={cn(
      "flex h-10 w-full items-center justify-between gap-2 rounded-md border border-input bg-card pl-3 pr-2 py-1 text-sm text-foreground placeholder:text-muted-foreground transition-[border-color,box-shadow] duration-150 ease-out focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:min-w-0 [&>span]:truncate [&>span]:text-left",
      className,
    )}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      <ChevronDown
        className="h-4 w-4 shrink-0 text-muted-foreground"
        strokeWidth={1.75}
        absoluteStrokeWidth
        aria-hidden="true"
      />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
);

export const SelectContent = ({
  className,
  children,
  position = "popper",
  ...props
}: ComponentPropsWithoutRef<typeof SelectPrimitive.Content>) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      className={cn(
        "relative z-50 max-h-80 min-w-32 origin-[var(--radix-select-content-transform-origin)] overflow-y-auto overscroll-contain rounded-lg border border-transparent bg-surface-raised text-popover-foreground shadow-elevated",
        position === "popper" && "translate-y-1",
        className,
      )}
      position={position}
      {...props}
    >
      <SelectPrimitive.Viewport className="p-1">{children}</SelectPrimitive.Viewport>
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
);

export const SelectItem = ({
  className,
  children,
  ...props
}: ComponentPropsWithoutRef<typeof SelectPrimitive.Item>) => (
  <SelectPrimitive.Item
    className={cn(
      "flex w-full cursor-pointer select-none items-center gap-2 rounded-md px-2 py-2 text-sm outline-none [-webkit-tap-highlight-color:transparent] transition-[color,background-color] duration-150 ease-out focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className,
    )}
    {...props}
  >
    <span className="flex h-4 w-4 shrink-0 items-center justify-center">
      <SelectPrimitive.ItemIndicator>
        <Check className="h-4 w-4" strokeWidth={2} absoluteStrokeWidth aria-hidden="true" />
      </SelectPrimitive.ItemIndicator>
    </span>
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
);

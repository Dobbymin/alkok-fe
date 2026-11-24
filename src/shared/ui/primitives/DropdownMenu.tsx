"use client";

import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/shared/lib";

export const DropdownMenu = DropdownMenuPrimitive.Root;
export const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;
export const DropdownMenuGroup = DropdownMenuPrimitive.Group;

export const DropdownMenuContent = ({
  className,
  sideOffset = 4,
  ...props
}: ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>) => (
  <DropdownMenuPrimitive.Portal>
    <DropdownMenuPrimitive.Content
      sideOffset={sideOffset}
      className={cn(
        "z-50 min-w-[10rem] overflow-hidden rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-md",
        className,
      )}
      {...props}
    />
  </DropdownMenuPrimitive.Portal>
);

export const DropdownMenuItem = ({
  className,
  ...props
}: ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item>) => (
  <DropdownMenuPrimitive.Item
    className={cn(
      "relative flex cursor-pointer select-none items-center gap-2 rounded-sm px-2.5 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className,
    )}
    {...props}
  />
);

export const DropdownMenuSeparator = ({
  className,
  ...props
}: ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator>) => (
  <DropdownMenuPrimitive.Separator
    className={cn("-mx-1 my-1 h-px bg-border", className)}
    {...props}
  />
);

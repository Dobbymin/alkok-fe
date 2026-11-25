"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { cva, type VariantProps } from "class-variance-authority";
import { X } from "lucide-react";
import type { ComponentPropsWithoutRef, HTMLAttributes } from "react";
import { cn } from "@alkok/core";

export const Sheet = DialogPrimitive.Root;
export const SheetTrigger = DialogPrimitive.Trigger;
export const SheetClose = DialogPrimitive.Close;
export const SheetPortal = DialogPrimitive.Portal;

const sheetVariants = cva(
  "fixed z-50 flex flex-col gap-4 overflow-y-auto overscroll-contain border-border bg-surface-raised p-6 text-popover-foreground shadow-elevated transition-[transform,opacity] duration-300 ease-out focus-visible:outline-none",
  {
    variants: {
      side: {
        top: "inset-x-0 top-0 border-b",
        bottom: "inset-x-0 bottom-0 max-h-[85dvh] rounded-t-xl border-t",
        left: "inset-y-0 start-0 h-dvh w-72 border-e",
        right: "inset-y-0 end-0 h-dvh w-72 border-s",
      },
    },
    defaultVariants: {
      side: "right",
    },
  },
);

export const SheetContent = ({
  side = "right",
  className,
  children,
  closeLabel = "닫기",
  ...props
}: ComponentPropsWithoutRef<typeof DialogPrimitive.Content> &
  VariantProps<typeof sheetVariants> & { closeLabel?: string }) => (
  <SheetPortal>
    <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-overlay-scrim backdrop-blur-xs" />
    <DialogPrimitive.Content
      className={cn(sheetVariants({ side }), className)}
      {...props}
    >
      <div className="flex items-center justify-end">
        <DialogPrimitive.Close
          aria-label={closeLabel}
          className="inline-flex h-8 w-8 items-center justify-center rounded-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          <X className="h-4 w-4" strokeWidth={2} absoluteStrokeWidth aria-hidden="true" />
        </DialogPrimitive.Close>
      </div>
      {children}
    </DialogPrimitive.Content>
  </SheetPortal>
);

export const SheetHeader = ({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col gap-2 text-start", className)} {...props} />
);

export const SheetTitle = ({
  className,
  ...props
}: ComponentPropsWithoutRef<typeof DialogPrimitive.Title>) => (
  <DialogPrimitive.Title
    className={cn(
      "text-balance text-base font-semibold leading-[1.3] text-foreground",
      className,
    )}
    {...props}
  />
);

export const SheetDescription = ({
  className,
  ...props
}: ComponentPropsWithoutRef<typeof DialogPrimitive.Description>) => (
  <DialogPrimitive.Description
    className={cn("text-pretty text-sm leading-[1.5] text-muted-foreground", className)}
    {...props}
  />
);

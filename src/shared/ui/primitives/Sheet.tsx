"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { cva, type VariantProps } from "class-variance-authority";
import { X } from "lucide-react";
import type { ComponentPropsWithoutRef, HTMLAttributes } from "react";
import { cn } from "@/shared/lib";

export const Sheet = DialogPrimitive.Root;
export const SheetTrigger = DialogPrimitive.Trigger;
export const SheetClose = DialogPrimitive.Close;
export const SheetPortal = DialogPrimitive.Portal;

const sheetVariants = cva(
  "fixed z-50 flex flex-col gap-4 border-border bg-popover p-6 text-popover-foreground shadow-lg transition ease-in-out focus-visible:outline-none",
  {
    variants: {
      side: {
        top: "inset-x-0 top-0 border-b",
        bottom: "inset-x-0 bottom-0 max-h-[85vh] overflow-y-auto rounded-t-lg border-t",
        left: "inset-y-0 left-0 h-full w-72 border-r",
        right: "inset-y-0 right-0 h-full w-72 border-l",
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
    <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-foreground/40 backdrop-blur-[1px]" />
    <DialogPrimitive.Content
      className={cn(sheetVariants({ side }), className)}
      {...props}
    >
      {children}
      <DialogPrimitive.Close
        aria-label={closeLabel}
        className="absolute right-4 top-4 inline-flex h-8 w-8 items-center justify-center rounded-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <X className="h-4 w-4" strokeWidth={1.75} />
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </SheetPortal>
);

export const SheetHeader = ({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col gap-1.5 text-left", className)} {...props} />
);

export const SheetTitle = ({
  className,
  ...props
}: ComponentPropsWithoutRef<typeof DialogPrimitive.Title>) => (
  <DialogPrimitive.Title
    className={cn("text-base font-semibold text-foreground", className)}
    {...props}
  />
);

export const SheetDescription = ({
  className,
  ...props
}: ComponentPropsWithoutRef<typeof DialogPrimitive.Description>) => (
  <DialogPrimitive.Description
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
);

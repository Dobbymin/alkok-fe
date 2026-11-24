"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import type { ComponentPropsWithoutRef, HTMLAttributes } from "react";
import { cn } from "@/shared/lib";

export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogPortal = DialogPrimitive.Portal;
export const DialogClose = DialogPrimitive.Close;

export const DialogOverlay = ({
  className,
  ...props
}: ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>) => (
  <DialogPrimitive.Overlay
    className={cn(
      "fixed inset-0 z-50 bg-foreground/40 backdrop-blur-[1px]",
      className,
    )}
    {...props}
  />
);

export const DialogContent = ({
  className,
  children,
  closeLabel = "닫기",
  ...props
}: ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & {
  closeLabel?: string;
}) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      className={cn(
        "fixed left-1/2 top-1/2 z-50 grid w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 gap-4 rounded-lg border border-border bg-popover p-6 text-popover-foreground shadow-lg focus-visible:outline-none",
        className,
      )}
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
  </DialogPortal>
);

export const DialogHeader = ({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col gap-1.5 text-left", className)} {...props} />
);

export const DialogFooter = ({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", className)}
    {...props}
  />
);

export const DialogTitle = ({
  className,
  ...props
}: ComponentPropsWithoutRef<typeof DialogPrimitive.Title>) => (
  <DialogPrimitive.Title
    className={cn("text-lg font-semibold leading-none tracking-tight", className)}
    {...props}
  />
);

export const DialogDescription = ({
  className,
  ...props
}: ComponentPropsWithoutRef<typeof DialogPrimitive.Description>) => (
  <DialogPrimitive.Description
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
);

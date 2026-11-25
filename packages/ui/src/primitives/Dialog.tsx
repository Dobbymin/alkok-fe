"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import type { ComponentPropsWithoutRef, HTMLAttributes } from "react";
import { cn } from "@alkok/core";

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
      "fixed inset-0 z-50 bg-overlay-scrim",
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
    <div className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center p-4">
      <DialogPrimitive.Content
        className={cn(
          "pointer-events-auto flex max-h-[90dvh] w-full max-w-lg flex-col gap-4 overflow-y-auto overscroll-contain rounded-xl border border-transparent bg-surface-raised p-6 text-popover-foreground shadow-elevated focus-visible:outline-none",
          className,
        )}
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
    </div>
  </DialogPortal>
);

export const DialogHeader = ({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col gap-2 text-start", className)} {...props} />
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
    className={cn(
      "text-balance text-lg font-semibold leading-[1.25] tracking-[-0.015em]",
      className,
    )}
    {...props}
  />
);

export const DialogDescription = ({
  className,
  ...props
}: ComponentPropsWithoutRef<typeof DialogPrimitive.Description>) => (
  <DialogPrimitive.Description
    className={cn("text-pretty text-sm leading-[1.5] text-muted-foreground", className)}
    {...props}
  />
);

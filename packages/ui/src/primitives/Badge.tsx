import { cva, type VariantProps } from "class-variance-authority";
import type { HTMLAttributes } from "react";
import { cn } from "@alkok/core";

export const badgeVariants = cva(
  "inline-flex items-center gap-1 whitespace-nowrap rounded-sm border px-2 py-1 text-xs font-medium [text-box:trim-both_cap_alphabetic] transition-colors",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground",
        secondary: "border-border bg-secondary text-secondary-foreground",
        outline: "border-border bg-transparent text-foreground",
        valid:
          "border-status-valid-border bg-status-valid-bg text-status-valid-fg",
        review:
          "border-status-review-border bg-status-review-bg text-status-review-fg",
        expired:
          "border-status-expired-border bg-status-expired-bg text-status-expired-fg",
        official:
          "border-transparent bg-badge-official-bg text-badge-official-fg",
        affiliate:
          "border-border bg-badge-affiliate-bg text-badge-affiliate-fg",
      },
    },
    defaultVariants: {
      variant: "secondary",
    },
  },
);

export interface BadgeProps
  extends HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export const Badge = ({ className, variant, ...props }: BadgeProps) => (
  <span className={cn(badgeVariants({ variant }), className)} {...props} />
);

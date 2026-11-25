import { cva, type VariantProps } from "class-variance-authority";
import type { HTMLAttributes } from "react";
import { cn } from "@alkok/core";

export const cardVariants = cva("text-card-foreground", {
  variants: {
    variant: {
      default:
        "rounded-xl border border-transparent bg-card dark:border-border",
      surface:
        "rounded-2xl border border-transparent bg-surface-sunken dark:border-border",
      outline: "rounded-xl border border-border bg-card",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export interface CardProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

export const Card = ({ className, variant, ...props }: CardProps) => (
  <div className={cn(cardVariants({ variant }), className)} {...props} />
);

export const CardHeader = ({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col gap-2 p-5", className)} {...props} />
);

export interface CardTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  as?: "h1" | "h2" | "h3" | "h4";
}

export const CardTitle = ({
  as: Comp = "h3",
  className,
  ...props
}: CardTitleProps) => (
  <Comp
    className={cn(
      "text-balance text-base font-semibold leading-[1.3] tracking-[-0.01em]",
      className,
    )}
    {...props}
  />
);

export const CardDescription = ({
  className,
  ...props
}: HTMLAttributes<HTMLParagraphElement>) => (
  <p
    className={cn("text-pretty text-sm leading-[1.5] text-muted-foreground", className)}
    {...props}
  />
);

export const CardContent = ({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("px-5 pb-5 pt-0", className)} {...props} />
);

export const CardFooter = ({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("flex items-center gap-2 px-5 pb-5 pt-0", className)}
    {...props}
  />
);

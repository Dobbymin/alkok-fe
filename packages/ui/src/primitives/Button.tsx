"use client";

import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "@alkok/core";

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium [-webkit-tap-highlight-color:transparent] transition-[color,background-color,border-color,box-shadow,transform] duration-150 ease-out focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-border bg-card text-foreground hover:bg-secondary",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "text-foreground hover:bg-secondary hover:text-secondary-foreground",
        link: "text-primary underline-offset-4 [text-underline-position:from-font] decoration-from-font hover:underline",
      },
      size: {
        default:
          "h-10 px-4 py-2 has-[>svg:first-child]:ps-3 has-[>svg:last-child]:pe-3",
        sm: "h-8 rounded-sm px-3 text-xs has-[>svg:first-child]:ps-2 has-[>svg:last-child]:pe-2",
        lg: "h-11 rounded-md px-6 has-[>svg:first-child]:ps-5 has-[>svg:last-child]:pe-5",
        icon: "h-10 w-10",
        "icon-sm": "h-8 w-8 rounded-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  /** Opt out of the 0.96 press scale where motion would distract. */
  static?: boolean;
}

export const Button = ({
  className,
  variant,
  size,
  asChild = false,
  static: isStatic = false,
  type = "button",
  ...props
}: ButtonProps) => {
  const Comp = asChild ? Slot : "button";
  const shouldScale = !isStatic && variant !== "link";

  return (
    <Comp
      type={asChild ? undefined : type}
      className={cn(
        buttonVariants({ variant, size }),
        shouldScale && "not-disabled:active:scale-[0.96]",
        className,
      )}
      {...props}
    />
  );
};

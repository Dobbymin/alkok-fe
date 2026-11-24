import type { InputHTMLAttributes } from "react";
import { cn } from "@/shared/lib";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  inputSize?: "default" | "sm";
}

export const Input = ({
  className,
  type = "text",
  inputSize = "default",
  ...props
}: InputProps) => (
  <input
    type={type}
    className={cn(
      "flex w-full rounded-md border border-input bg-card px-3 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
      inputSize === "sm" ? "h-8 text-xs" : "h-10",
      className,
    )}
    {...props}
  />
);

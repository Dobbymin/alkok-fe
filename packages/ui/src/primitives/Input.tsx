import type { InputHTMLAttributes } from "react";
import { cn } from "@alkok/core";

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
      "flex w-full rounded-md border border-input bg-card px-3 text-foreground placeholder:text-muted-foreground transition-[border-color,box-shadow] duration-150 ease-out focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-ring disabled:cursor-not-allowed disabled:opacity-50",
      inputSize === "sm" ? "h-8 text-base sm:text-xs" : "h-10 text-base sm:text-sm",
      className,
    )}
    {...props}
  />
);

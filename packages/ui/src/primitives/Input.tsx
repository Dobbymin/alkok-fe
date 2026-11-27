import type { InputHTMLAttributes, ReactNode } from "react";
import { cn } from "@alkok/core";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  inputSize?: "default" | "sm";
  startIcon?: ReactNode;
  wrapperClassName?: string;
}

export const Input = ({
  className,
  type = "text",
  inputSize = "default",
  startIcon,
  wrapperClassName,
  ...props
}: InputProps) => {
  if (startIcon) {
    return (
      <div
        className={cn(
          "flex w-full items-center gap-2 rounded-md border border-input bg-card px-3 text-foreground transition-[border-color,box-shadow] duration-150 ease-out focus-within:outline-2 focus-within:outline-offset-0 focus-within:outline-ring has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-50 has-[input[aria-invalid=true]]:border-destructive has-[input[aria-invalid=true]]:focus-within:outline-destructive",
          inputSize === "sm" ? "h-8" : "h-10",
          wrapperClassName,
        )}
      >
        <span
          className="flex shrink-0 items-center text-muted-foreground"
          aria-hidden="true"
        >
          {startIcon}
        </span>
        <input
          type={type}
          className={cn(
            "h-full w-full min-w-0 bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none disabled:cursor-not-allowed",
            inputSize === "sm" ? "text-base sm:text-xs" : "text-base sm:text-sm",
            className,
          )}
          {...props}
        />
      </div>
    );
  }

  return (
    <input
      type={type}
      className={cn(
        "flex w-full rounded-md border border-input bg-card px-3 text-foreground placeholder:text-muted-foreground transition-[border-color,box-shadow] duration-150 ease-out focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-ring aria-invalid:border-destructive aria-invalid:focus-visible:outline-destructive disabled:cursor-not-allowed disabled:opacity-50",
        inputSize === "sm" ? "h-8 text-base sm:text-xs" : "h-10 text-base sm:text-sm",
        className,
      )}
      {...props}
    />
  );
};

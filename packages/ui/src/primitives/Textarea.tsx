import type { TextareaHTMLAttributes } from "react";
import { cn } from "@alkok/core";

export const Textarea = ({
  className,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement>) => (
  <textarea
    className={cn(
      "flex min-h-24 w-full rounded-md border border-input bg-card px-3 py-2 text-base text-foreground placeholder:text-muted-foreground transition-[border-color,box-shadow] duration-150 ease-out focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-ring aria-invalid:border-destructive aria-invalid:focus-visible:outline-destructive disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm",
      className,
    )}
    {...props}
  />
);

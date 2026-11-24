import type { ReactNode } from "react";
import { cn } from "@alkok/core";
import { Label } from "./Label";

export interface FieldGroupProps {
  htmlFor?: string;
  label: string;
  required?: boolean;
  hint?: string;
  error?: string;
  errorId?: string;
  className?: string;
  children: ReactNode;
}

export const FieldGroup = ({
  htmlFor,
  label,
  required,
  hint,
  error,
  errorId,
  className,
  children,
}: FieldGroupProps) => (
  <div className={cn("flex flex-col gap-1.5", className)}>
    <Label htmlFor={htmlFor} className="flex items-center gap-1">
      <span>{label}</span>
      {required ? (
        <span className="text-destructive" aria-hidden="true">
          *
        </span>
      ) : null}
    </Label>
    {children}
    {hint && !error ? (
      <p className="text-xs text-muted-foreground">{hint}</p>
    ) : null}
    {error ? (
      <p id={errorId} role="alert" className="text-xs text-destructive">
        {error}
      </p>
    ) : null}
  </div>
);

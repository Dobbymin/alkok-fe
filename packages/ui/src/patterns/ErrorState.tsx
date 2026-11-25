import { AlertCircle } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@alkok/core";
import { Button } from "../primitives/Button";

export interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
  retryLabel?: string;
  action?: ReactNode;
  className?: string;
}

export const ErrorState = ({
  title = "정보를 불러오지 못했습니다.",
  description = "잠시 후 다시 시도해 주세요.",
  onRetry,
  retryLabel = "다시 시도",
  action,
  className,
}: ErrorStateProps) => (
  <div
    role="alert"
    className={cn(
      "flex flex-col items-center justify-center rounded-xl border border-status-expired-border bg-status-expired-bg/50 px-6 py-10 text-center",
      className,
    )}
  >
    <AlertCircle
      className="mb-3 h-8 w-8 text-status-expired-fg"
      strokeWidth={1.75}
      absoluteStrokeWidth
      aria-hidden="true"
    />
    <h3 className="text-balance text-base font-semibold leading-[1.3] text-foreground">
      {title}
    </h3>
    {description ? (
      <p className="mt-1 max-w-md text-pretty text-sm leading-[1.5] text-muted-foreground">
        {description}
      </p>
    ) : null}
    {onRetry || action ? (
      <div className="mt-4 flex flex-wrap justify-center gap-2">
        {onRetry ? (
          <Button variant="outline" size="sm" onClick={onRetry}>
            {retryLabel}
          </Button>
        ) : null}
        {action}
      </div>
    ) : null}
  </div>
);

"use client";

import { Check, Copy } from "lucide-react";
import { useState, type ReactNode } from "react";
import { toast } from "sonner";
import { cn } from "@/shared/lib";
import { Button } from "../primitives/Button";

export interface CopyableCodeBlockProps {
  title?: string;
  code: string;
  renderedCode?: ReactNode;
  copyLabel?: string;
  className?: string;
}

export const CopyableCodeBlock = ({
  title,
  code,
  renderedCode,
  copyLabel = "복사",
  className,
}: CopyableCodeBlockProps) => {
  const [copied, setCopied] = useState(false);
  const [copyFailed, setCopyFailed] = useState(false);

  const handleCopy = async () => {
    try {
      if (!navigator?.clipboard?.writeText) {
        throw new Error("Clipboard API unavailable");
      }
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setCopyFailed(false);
      toast.success("프롬프트를 복사했습니다.");
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopyFailed(true);
      toast.error("자동 복사에 실패했습니다. 텍스트를 직접 선택해 복사해 주세요.");
    }
  };

  return (
    <div
      className={cn(
        "overflow-hidden rounded-lg border border-prompt-border bg-prompt-surface",
        className,
      )}
    >
      <div className="flex items-center justify-between border-b border-prompt-border px-3.5 py-2">
        <span className="text-xs font-semibold text-foreground">
          {title ?? "코드 / 프롬프트"}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={handleCopy}
          aria-label={copied ? "복사 완료" : `${title ?? "내용"} ${copyLabel}`}
          className="h-7 gap-1.5 px-2.5 text-xs"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-status-valid-fg" strokeWidth={1.75} />
              <span>복사됨</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" strokeWidth={1.75} />
              <span>{copyLabel}</span>
            </>
          )}
        </Button>
      </div>
      <pre className="overflow-x-auto p-4 font-mono text-[13px] leading-relaxed text-foreground select-all whitespace-pre-wrap break-words">
        <code>{renderedCode ?? code}</code>
      </pre>
      {copyFailed ? (
        <p className="border-t border-prompt-border bg-status-review-bg px-3.5 py-1.5 text-xs text-status-review-fg">
          브라우저 복사 권한이 제한되어 있습니다. 위 영역을 길게 눌러 직접 복사해 주세요.
        </p>
      ) : null}
    </div>
  );
};

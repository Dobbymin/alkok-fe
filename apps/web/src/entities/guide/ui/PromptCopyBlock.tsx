"use client";

import type { ReactNode } from "react";
import { CopyableCodeBlock } from "@alkok/ui";

export interface PromptCopyBlockProps {
  title?: string;
  content?: string;
  variables?: string[];
  className?: string;
}

function highlightVariables(text: string): ReactNode[] {
  const safeText = text ?? "";
  const parts = safeText.split(/(\[[^\]\n]+\])/g);
  return parts.map((part, idx) => {
    if (/^\[[^\]\n]+\]$/.test(part)) {
      return (
        <mark
          key={idx}
          className="rounded-sm bg-accent px-1 py-1 font-semibold text-accent-foreground"
        >
          {part}
        </mark>
      );
    }
    return <span key={idx}>{part}</span>;
  });
}

export const PromptCopyBlock = ({
  title = "실행 프롬프트",
  content = "",
  variables = [],
  className,
}: PromptCopyBlockProps) => {
  const safeContent = content ?? "";
  return (
    <div className={className}>
      <CopyableCodeBlock
        title={title}
        code={safeContent}
        renderedCode={highlightVariables(safeContent)}
        copyLabel="프롬프트 복사"
      />
      {variables.length > 0 ? (
        <p className="mt-2 text-xs text-muted-foreground">
          입력 변수: {variables.map((v) => `[${v}]`).join(", ")}
        </p>
      ) : null}
    </div>
  );
};

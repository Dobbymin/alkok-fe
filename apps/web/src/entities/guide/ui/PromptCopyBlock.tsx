import type { ReactNode } from "react";
import { CopyableCodeBlock } from "@alkok/ui";

export interface PromptCopyBlockProps {
  title?: string;
  content?: string;
  variables?: string[];
  variableExamples?: Record<string, string>;
  expectedOutput?: string;
  tips?: string;
  className?: string;
}

function highlightVariables(text: string): ReactNode[] {
  const safeText = text ?? "";
  const parts = safeText.split(/(\{\{[^}\n]+\}\}|\[[^\]\n]+\])/g);
  return parts.map((part, idx) => {
    if (/^(\{\{[^}\n]+\}\}|\[[^\]\n]+\])$/.test(part)) {
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
  variableExamples,
  expectedOutput,
  tips,
  className,
}: PromptCopyBlockProps) => {
  const safeContent = content ?? "";
  const exampleEntries = variableExamples
    ? Object.entries(variableExamples).filter(([, v]) => Boolean(v))
    : [];

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
          입력 변수: {variables.map((v) => `{{${v}}}`).join(", ")}
        </p>
      ) : null}
      {exampleEntries.length > 0 ? (
        <div className="mt-2 rounded-lg border border-border bg-surface-sunken p-3 text-xs">
          <p className="font-semibold text-foreground">변수 입력 예시</p>
          <dl className="mt-1.5 grid grid-cols-1 gap-1.5 sm:grid-cols-2">
            {exampleEntries.map(([key, val]) => (
              <div key={key} className="flex flex-wrap gap-1.5">
                <dt className="font-mono font-semibold text-primary">
                  {`{{${key}}}`}
                </dt>
                <dd className="text-muted-foreground">{val}</dd>
              </div>
            ))}
          </dl>
        </div>
      ) : null}
      {expectedOutput || tips ? (
        <div className="mt-2 flex flex-col gap-1.5 rounded-lg border border-border bg-card p-3 text-xs">
          {expectedOutput ? (
            <p className="text-foreground">
              <span className="font-semibold text-primary">기대 결과: </span>
              {expectedOutput}
            </p>
          ) : null}
          {tips ? (
            <p className="text-muted-foreground">
              <span className="font-semibold text-foreground">실행 팁: </span>
              {tips}
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
};

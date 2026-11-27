"use client";

import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { Button, CopyableCodeBlock } from "@alkok/ui";

export interface SkillMdPreviewProps {
  code: string;
  previewLines?: number;
}

export const SkillMdPreview = ({
  code,
  previewLines = 25,
}: SkillMdPreviewProps) => {
  const [expanded, setExpanded] = useState(false);
  const lines = code.split("\n");
  const isTruncated = lines.length > previewLines;
  const displayedCode =
    expanded || !isTruncated ? code : lines.slice(0, previewLines).join("\n");

  return (
    <div className="flex flex-col gap-2">
      <CopyableCodeBlock
        title={`원본 설정 미리보기 (${lines.length}줄)`}
        code={displayedCode}
        copyLabel="원본 복사"
      />
      {isTruncated ? (
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>
            {expanded
              ? `전체 ${lines.length}줄 표시 중`
              : `처음 ${previewLines}줄 · 전체 ${lines.length}줄`}
          </span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setExpanded((prev) => !prev)}
          >
            {expanded ? (
              <>
                접기
                <ChevronUp className="h-3.5 w-3.5" aria-hidden="true" />
              </>
            ) : (
              <>
                전체 보기 ({lines.length}줄)
                <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />
              </>
            )}
          </Button>
        </div>
      ) : null}
    </div>
  );
};

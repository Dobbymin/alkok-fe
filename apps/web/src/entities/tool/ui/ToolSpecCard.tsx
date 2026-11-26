import Link from "next/link";
import type { ReactNode } from "react";
import type { KoreanSupportLevel, ToolDetailData } from "@alkok/core";
import { Badge, Card, CardContent, CardHeader } from "@alkok/ui";

const KOREAN_SUPPORT_LABEL: Record<KoreanSupportLevel, string> = {
  FULL: "한국어 완전 지원",
  PARTIAL: "한국어 부분 지원",
  NONE: "한국어 미지원",
};

function formatVerifiedDate(iso?: string | null): string | null {
  if (!iso) return null;
  return iso.slice(0, 10);
}

export interface ToolSpecCardProps {
  tool: ToolDetailData;
  verificationSlot?: ReactNode;
  bookmarkSlot?: ReactNode;
  compareSlot?: ReactNode;
}

export const ToolSpecCard = ({
  tool,
  verificationSlot,
  bookmarkSlot,
  compareSlot,
}: ToolSpecCardProps) => {
  const verifiedDate = formatVerifiedDate(tool.verifiedAt);
  const primaryStrength = tool.strengths[0] ?? tool.summary;

  return (
    <Card
      variant="outline"
      className="flex h-full flex-col justify-between transition-colors duration-150 ease-out hover:border-primary/40 hover:bg-surface-sunken/50"
    >
      <CardHeader className="gap-2 pb-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1.5">
            <Badge variant="secondary">
              {tool.toolKind === "MODEL" ? "AI 모델" : "AI 도구"}
            </Badge>
            <Badge variant={tool.hasFreePlan ? "valid" : "outline"}>
              {tool.hasFreePlan ? "무료 플랜 있음" : "유료 전용"}
            </Badge>
            <Badge variant="outline">
              {KOREAN_SUPPORT_LABEL[tool.koreanSupport]}
            </Badge>
          </div>
          <div className="flex items-center gap-1">
            {verificationSlot}
            {bookmarkSlot}
          </div>
        </div>

        <div className="flex items-baseline justify-between gap-2">
          <Link
            href={`/tools/${tool.slug}`}
            className="line-clamp-1 text-base font-semibold leading-[1.3] text-foreground transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            {tool.title}
          </Link>
          {tool.providerName ? (
            <span className="shrink-0 text-xs text-muted-foreground">
              {tool.providerName}
            </span>
          ) : null}
        </div>

        <p className="tabular-nums text-xs font-medium text-foreground">
          {tool.pricingSummary}
        </p>

        <p className="line-clamp-2 rounded-md bg-surface-sunken px-3 py-2 text-xs leading-[1.5] text-foreground">
          <span className="font-semibold text-primary">핵심 강점: </span>
          <span>{primaryStrength}</span>
        </p>
      </CardHeader>

      <CardContent className="flex items-center justify-between gap-2 border-t border-separator pt-3">
        <span className="tabular-nums text-xs text-muted-foreground">
          {verifiedDate ? `확인일 ${verifiedDate}` : "확인일 미정"}
        </span>
        {compareSlot}
      </CardContent>
    </Card>
  );
};

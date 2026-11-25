"use client";

import { ExternalLink, Share2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { VerificationBadge } from "@/entities/content";
import type { KoreanSupportLevel, ToolDetailData } from "@alkok/core";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Checkbox,
  EmptyState,
  ErrorState,
  Label,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@alkok/ui";

const KOREAN_LABEL: Record<KoreanSupportLevel, string> = {
  FULL: "완전 지원",
  PARTIAL: "부분 지원",
  NONE: "미지원",
};

interface CompareAxis {
  key: string;
  label: string;
  getComparableText: (tool: ToolDetailData) => string;
  render: (tool: ToolDetailData) => React.ReactNode;
}

const COMPARE_AXES: CompareAxis[] = [
  {
    key: "provider",
    label: "유형 · 제공사",
    getComparableText: (t) => `${t.toolKind}:${t.providerName}`,
    render: (t) => (
      <div className="flex flex-col gap-1">
        <Badge variant="secondary" className="w-fit">
          {t.toolKind === "MODEL" ? "AI 모델" : "AI 도구"}
        </Badge>
        <span className="text-xs font-medium text-foreground">
          {t.providerName}
        </span>
      </div>
    ),
  },
  {
    key: "pricing",
    label: "요금 · 무료 한도",
    getComparableText: (t) => `${t.hasFreePlan}:${t.pricingSummary}`,
    render: (t) => (
      <div className="flex flex-col gap-1">
        <Badge variant={t.hasFreePlan ? "valid" : "outline"} className="w-fit">
          {t.hasFreePlan ? "무료 플랜 있음" : "유료 전용"}
        </Badge>
        <span className="tabular-nums text-xs text-foreground">
          {t.pricingSummary}
        </span>
      </div>
    ),
  },
  {
    key: "korean",
    label: "한국어 지원",
    getComparableText: (t) => t.koreanSupport,
    render: (t) => (
      <span className="text-xs font-medium text-foreground">
        {KOREAN_LABEL[t.koreanSupport]}
      </span>
    ),
  },
  {
    key: "strengths",
    label: "강점 · 적합 업무",
    getComparableText: (t) => t.strengths.join("|"),
    render: (t) => (
      <ul className="list-disc space-y-1 pl-4 text-xs text-foreground">
        {t.strengths.map((s, idx) => (
          <li key={idx}>{s}</li>
        ))}
      </ul>
    ),
  },
  {
    key: "limitations",
    label: "한계 · 주의사항",
    getComparableText: (t) => t.limitations.join("|"),
    render: (t) => (
      <ul className="list-disc space-y-1 pl-4 text-xs text-muted-foreground">
        {t.limitations.map((l, idx) => (
          <li key={idx}>{l}</li>
        ))}
      </ul>
    ),
  },
  {
    key: "platforms",
    label: "제공 형태",
    getComparableText: (t) => t.platforms.join("|"),
    render: (t) => (
      <div className="flex flex-wrap gap-1">
        {t.platforms.map((p) => (
          <Badge key={p} variant="outline" className="text-[11px]">
            {p}
          </Badge>
        ))}
      </div>
    ),
  },
  {
    key: "source",
    label: "출처 · 확인일 · 링크",
    getComparableText: (t) =>
      `${t.verificationStatus}:${t.verifiedAt ?? ""}:${t.officialUrl}`,
    render: (t) => (
      <div className="flex flex-col gap-2">
        <VerificationBadge
          status={t.verificationStatus}
          verifiedAt={t.verifiedAt}
          sourceType={t.sourceType}
          showSourceBadge
        />
        <div className="flex flex-wrap items-center gap-2">
          <a
            href={t.officialUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
          >
            공식 사이트 <ExternalLink className="h-3 w-3" strokeWidth={1.75} />
          </a>
          {t.isAffiliate ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge variant="affiliate" className="cursor-help text-[11px]">
                  제휴 링크
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                제휴 여부와 무관하게 추천·랭킹은 독립적으로 유지됩니다.
              </TooltipContent>
            </Tooltip>
          ) : null}
        </div>
      </div>
    ),
  },
];

export interface ToolCompareTableProps {
  tools: ToolDetailData[];
  isLoading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  onShareUrl?: () => void;
}

export const ToolCompareTable = ({
  tools,
  isLoading = false,
  error = null,
  onRetry,
  onShareUrl,
}: ToolCompareTableProps) => {
  const [diffOnly, setDiffOnly] = useState(false);
  const [mobileMode, setMobileMode] = useState<"cards" | "horizontal">("cards");

  if (isLoading) {
    return <Skeleton className="h-80 w-full" />;
  }

  if (error) {
    return <ErrorState description={error} onRetry={onRetry} />;
  }

  if (tools.length === 0) {
    return (
      <EmptyState
        title="비교할 도구가 선택되지 않았습니다."
        description="도구 디렉터리에서 2~4개의 도구를 담아 비교하거나 인기 프리셋을 선택해 보세요."
      />
    );
  }

  const visibleAxes = diffOnly
    ? COMPARE_AXES.filter((axis) => {
        const values = new Set(tools.map((t) => axis.getComparableText(t)));
        return values.size > 1;
      })
    : COMPARE_AXES;

  const handleCopyUrl = async () => {
    if (onShareUrl) {
      onShareUrl();
      return;
    }
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("비교표 링크를 복사했습니다.");
    } catch {
      toast.error("URL 복사에 실패했습니다.");
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-card p-3">
        <div className="flex items-center gap-2">
          <Checkbox
            id="compare-diff-only"
            aria-label="차이점만 보기"
            checked={diffOnly}
            onCheckedChange={(v) => setDiffOnly(v === true)}
          />
          <Label htmlFor="compare-diff-only" className="text-xs font-medium">
            차이점만 보기
          </Label>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 md:hidden">
            <Button
              variant={mobileMode === "cards" ? "default" : "outline"}
              size="sm"
              onClick={() => setMobileMode("cards")}
            >
              카드 보기
            </Button>
            <Button
              variant={mobileMode === "horizontal" ? "default" : "outline"}
              size="sm"
              onClick={() => setMobileMode("horizontal")}
            >
              횡비교
            </Button>
          </div>
          <Button variant="outline" size="sm" onClick={handleCopyUrl}>
            <Share2 className="h-3.5 w-3.5" strokeWidth={1.75} />
            URL 공유
          </Button>
        </div>
      </div>

      {/* Mobile Card Stack Mode */}
      {mobileMode === "cards" ? (
        <div className="flex flex-col gap-4 md:hidden">
          {tools.map((tool) => (
            <Card key={tool.id}>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{tool.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                {visibleAxes.map((axis) => (
                  <div
                    key={axis.key}
                    className="border-t border-border pt-2.5 first:border-t-0 first:pt-0"
                  >
                    <p className="mb-1 text-xs font-semibold text-muted-foreground">
                      {axis.label}
                    </p>
                    {axis.render(tool)}
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : null}

      {/* Desktop Sticky Table (or Mobile Horizontal Mode) */}
      <div className={mobileMode === "cards" ? "hidden md:block" : "block"}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead
                scope="col"
                className="sticky left-0 z-10 min-w-[116px] whitespace-nowrap bg-muted/95 font-semibold"
              >
                비교 항목
              </TableHead>
              {tools.map((tool) => (
                <TableHead key={tool.id} scope="col" className="min-w-52">
                  <span className="text-sm font-semibold text-foreground">
                    {tool.title}
                  </span>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {visibleAxes.map((axis) => (
              <TableRow key={axis.key}>
                <th
                  scope="row"
                  className="sticky left-0 z-10 min-w-[116px] whitespace-nowrap bg-card px-3 py-3 text-left align-top text-xs font-semibold text-muted-foreground"
                >
                  {axis.label}
                </th>
                {tools.map((tool) => (
                  <TableCell key={tool.id} className="align-top py-3">
                    {axis.render(tool)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

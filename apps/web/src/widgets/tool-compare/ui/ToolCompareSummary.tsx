import type { ComparePresetDefinition } from "@/entities/taxonomy";
import type { ToolDetailData } from "@alkok/core";
import { Badge, Card, CardContent, CardHeader, CardTitle, Skeleton } from "@alkok/ui";

export interface ToolCompareSummaryProps {
  tools: ToolDetailData[];
  matchedPreset?: ComparePresetDefinition;
  isLoading?: boolean;
  toolCount?: number;
}

export const ToolCompareSummary = ({
  tools,
  matchedPreset,
  isLoading = false,
  toolCount = 0,
}: ToolCompareSummaryProps) => {
  if (isLoading && toolCount >= 2) {
    return (
      <Card
        variant="surface"
        role="status"
        aria-label="비교 요약 불러오는 중"
      >
        <CardHeader className="gap-1.5 pb-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <Skeleton className="h-6 w-52" />
            {matchedPreset ? (
              <Skeleton className="h-5 w-32 rounded-full" />
            ) : null}
          </div>
          {matchedPreset?.recommendedSummary ? (
            <Skeleton className="h-5 w-full max-w-2xl" />
          ) : null}
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: Math.min(toolCount, 4) }).map((_, i) => (
              <div
                key={i}
                className="flex min-h-[76px] flex-col gap-1.5 rounded-lg border border-border bg-card p-3"
              >
                <div className="flex items-center justify-between gap-2">
                  <Skeleton className="h-4 w-20" />
                  <div className="flex items-center gap-1">
                    <Skeleton className="h-4 w-9 rounded-full" />
                    <Skeleton className="h-4 w-10 rounded-full" />
                  </div>
                </div>
                <Skeleton className="h-3.5 w-full" />
                <Skeleton className="h-3.5 w-4/5" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (tools.length < 2) return null;

  return (
    <Card variant="surface">
      <CardHeader className="gap-1.5 pb-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <CardTitle as="h2" className="text-base font-semibold">
            어떤 상황에 어떤 도구가 유리한가요?
          </CardTitle>
          {matchedPreset ? (
            <Badge variant="secondary">{matchedPreset.purpose}</Badge>
          ) : null}
        </div>
        {matchedPreset?.recommendedSummary ? (
          <p className="text-sm leading-[1.6] text-foreground">
            {matchedPreset.recommendedSummary}
          </p>
        ) : null}
      </CardHeader>
      <CardContent className="pt-0">
        <ul className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
          {tools.map((tool) => (
            <li
              key={tool.id}
              className="flex min-h-[76px] flex-col gap-1.5 rounded-lg border border-border bg-card p-3"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-semibold text-foreground">
                  {tool.title}
                </span>
                <div className="flex items-center gap-1">
                  {tool.hasFreePlan ? (
                    <Badge variant="valid" className="text-[10px]">
                      무료
                    </Badge>
                  ) : null}
                  {tool.koreanSupport === "FULL" ? (
                    <Badge variant="outline" className="text-[10px]">
                      한국어
                    </Badge>
                  ) : null}
                </div>
              </div>
              <p className="line-clamp-2 text-xs leading-[1.5] text-muted-foreground">
                {tool.strengths[0] ?? tool.summary}
              </p>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

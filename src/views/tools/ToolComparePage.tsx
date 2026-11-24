"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { POPULAR_COMPARE_PRESETS } from "@/entities/taxonomy";
import { useToolCompare } from "@/entities/tool";
import { Button } from "@/shared/ui";
import { ToolCompareTable } from "@/widgets/tool-compare";

export default function ToolComparePage() {
  const searchParams = useSearchParams();
  const slugsRaw = searchParams.get("slugs") ?? "";
  const slugs = slugsRaw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 4);

  const query = useToolCompare(slugs);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">AI 도구·모델 7축 비교표</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          URL을 복사하면 동일한 비교표를 팀원과 바로 공유할 수 있습니다.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-medium text-muted-foreground">
          인기 프리셋:
        </span>
        {POPULAR_COMPARE_PRESETS.map((preset) => (
          <Button key={preset.label} variant="outline" size="sm" asChild>
            <Link href={`/tools/compare?slugs=${preset.slugs.join(",")}`}>
              {preset.label}
            </Link>
          </Button>
        ))}
      </div>

      <ToolCompareTable
        tools={slugs.length > 0 ? (query.data?.data ?? []) : []}
        isLoading={slugs.length > 0 && query.isLoading}
        error={query.isError ? "비교 데이터를 불러오지 못했습니다." : null}
        onRetry={() => query.refetch()}
      />
    </div>
  );
}

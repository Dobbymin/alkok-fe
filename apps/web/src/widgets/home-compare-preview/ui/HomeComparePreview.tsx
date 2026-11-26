"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import type { HomeComparisonPreset } from "@/entities/content";
import {
  mergeComparisonPresets,
  type ComparePresetDefinition,
} from "@/entities/taxonomy";
import { useToolCompare } from "@/entities/tool";
import type { KoreanSupportLevel, ToolDetailData } from "@alkok/core";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  EmptyState,
  Skeleton,
} from "@alkok/ui";

const KOREAN_LABEL: Record<KoreanSupportLevel, string> = {
  FULL: "완전 지원",
  PARTIAL: "부분 지원",
  NONE: "미지원",
};

function formatDate(iso?: string | null): string {
  if (!iso) return "-";
  return iso.slice(0, 10);
}

export interface HomeComparePreviewProps {
  presets?: HomeComparisonPreset[];
  initialTools?: ToolDetailData[];
}

export const HomeComparePreview = ({
  presets,
  initialTools = [],
}: HomeComparePreviewProps) => {
  const effectivePresets = useMemo<ComparePresetDefinition[]>(
    () => mergeComparisonPresets(presets),
    [presets],
  );

  const [activeId, setActiveId] = useState<string>(
    effectivePresets[0]?.id ?? "",
  );

  const activePreset =
    effectivePresets.find((p) => p.id === activeId) ?? effectivePresets[0];

  const initialBySlug = useMemo(
    () => new Map(initialTools.map((t) => [t.slug, t])),
    [initialTools],
  );

  const missingSlugs = useMemo(() => {
    if (!activePreset) return [];
    return activePreset.slugs.filter((slug) => !initialBySlug.has(slug));
  }, [activePreset, initialBySlug]);

  const compareQuery = useToolCompare(missingSlugs);

  const resolvedTools = useMemo(() => {
    if (!activePreset) return [];
    const fetchedBySlug = new Map(
      (compareQuery.data?.data ?? []).map((t) => [t.slug, t]),
    );
    return activePreset.slugs
      .map((slug) => initialBySlug.get(slug) ?? fetchedBySlug.get(slug))
      .filter((t): t is ToolDetailData => Boolean(t));
  }, [activePreset, initialBySlug, compareQuery.data]);

  const isLoading = missingSlugs.length > 0 && compareQuery.isLoading && resolvedTools.length === 0;

  return (
    <Card className="flex h-full flex-col justify-between border border-border bg-card">
      <CardHeader className="gap-3 pb-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <CardTitle as="h2" className="text-base font-semibold">
            라이브 도구 비교 프리뷰
          </CardTitle>
          {activePreset ? (
            <Button variant="ghost" size="sm" asChild className="min-h-11 sm:min-h-8">
              <Link
                href={`/tools/compare?slugs=${activePreset.slugs.join(",")}`}
                className="gap-1 text-xs text-primary"
              >
                7축 전체 비교표 보기
                <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden="true" />
              </Link>
            </Button>
          ) : null}
        </div>

        {effectivePresets.length > 0 ? (
          <div
            role="tablist"
            aria-label="인기 비교 프리셋"
            className="flex flex-wrap gap-1.5"
          >
            {effectivePresets.map((preset) => {
              const selected = preset.id === activePreset?.id;
              return (
                <button
                  key={preset.id}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  onClick={() => setActiveId(preset.id)}
                  className={`min-h-11 rounded-md border px-2.5 py-1 text-left text-xs font-medium transition-colors sm:min-h-8 ${
                    selected
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-background text-muted-foreground hover:bg-surface-sunken hover:text-foreground"
                  }`}
                >
                  {preset.shortLabel}
                </button>
              );
            })}
          </div>
        ) : null}
      </CardHeader>

      <CardContent className="flex flex-col gap-3 pt-0">
        {isLoading ? (
          <div role="status" aria-label="비교 프리뷰 불러오는 중" className="space-y-2">
            <Skeleton className="h-24 w-full rounded-lg" />
            <Skeleton className="h-24 w-full rounded-lg" />
            <span className="sr-only">비교 프리뷰를 불러오고 있습니다.</span>
          </div>
        ) : resolvedTools.length === 0 ? (
          <EmptyState
            title="비교할 도구 데이터를 불러오지 못했습니다."
            description="도구 디렉터리에서 원하는 도구를 직접 담아 비교해 보세요."
            action={
              <Button variant="outline" size="sm" asChild>
                <Link href="/tools">도구 디렉터리 보기</Link>
              </Button>
            }
          />
        ) : (
          <>
            {/* Mobile stacked preview */}
            <div className="flex flex-col gap-2.5 sm:hidden">
              {resolvedTools.map((tool) => (
                <div
                  key={tool.id}
                  className="rounded-lg border border-border bg-surface-sunken p-3"
                >
                  <div className="flex items-center justify-between gap-2">
                    <Link
                      href={`/tools/${tool.slug}`}
                      className="text-sm font-semibold text-foreground hover:text-primary"
                    >
                      {tool.title}
                    </Link>
                    <Badge variant={tool.hasFreePlan ? "valid" : "outline"}>
                      {tool.hasFreePlan ? "무료 플랜" : "유료 전용"}
                    </Badge>
                  </div>
                  <dl className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1 text-xs">
                    <div>
                      <dt className="text-muted-foreground">요금·한도</dt>
                      <dd className="tabular-nums font-medium text-foreground">
                        {tool.pricingSummary}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground">한국어 지원</dt>
                      <dd className="font-medium text-foreground">
                        {KOREAN_LABEL[tool.koreanSupport]}
                      </dd>
                    </div>
                    <div className="col-span-2">
                      <dt className="text-muted-foreground">핵심 강점</dt>
                      <dd className="line-clamp-1 text-foreground">
                        {tool.strengths[0] ?? tool.summary}
                      </dd>
                    </div>
                    <div className="col-span-2 flex items-center justify-between pt-1 text-muted-foreground">
                      <span>최종 확인일</span>
                      <span className="tabular-nums">{formatDate(tool.verifiedAt)}</span>
                    </div>
                  </dl>
                </div>
              ))}
            </div>

            {/* Desktop compact table */}
            <div className="hidden overflow-x-auto sm:block">
              <table className="w-full border-collapse text-left text-xs">
                <thead>
                  <tr className="border-b border-border text-muted-foreground">
                    <th scope="col" className="py-2 pr-3 font-medium">
                      비교 항목
                    </th>
                    {resolvedTools.map((tool) => (
                      <th key={tool.id} scope="col" className="py-2 px-2 font-semibold text-foreground">
                        <Link
                          href={`/tools/${tool.slug}`}
                          className="hover:text-primary hover:underline"
                        >
                          {tool.title}
                        </Link>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-separator">
                  <tr>
                    <th scope="row" className="whitespace-nowrap py-2 pr-3 font-medium text-muted-foreground">
                      요금·무료 한도
                    </th>
                    {resolvedTools.map((tool) => (
                      <td key={tool.id} className="py-2 px-2 align-top">
                        <div className="flex flex-col gap-1">
                          <Badge
                            variant={tool.hasFreePlan ? "valid" : "outline"}
                            className="w-fit text-[11px]"
                          >
                            {tool.hasFreePlan ? "무료 플랜 있음" : "유료 전용"}
                          </Badge>
                          <span className="tabular-nums text-foreground">
                            {tool.pricingSummary}
                          </span>
                        </div>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <th scope="row" className="whitespace-nowrap py-2 pr-3 font-medium text-muted-foreground">
                      한국어 지원
                    </th>
                    {resolvedTools.map((tool) => (
                      <td key={tool.id} className="py-2 px-2 font-medium text-foreground">
                        {KOREAN_LABEL[tool.koreanSupport]}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <th scope="row" className="whitespace-nowrap py-2 pr-3 font-medium text-muted-foreground">
                      핵심 강점
                    </th>
                    {resolvedTools.map((tool) => (
                      <td key={tool.id} className="py-2 px-2 text-foreground">
                        <span className="line-clamp-2">
                          {tool.strengths[0] ?? tool.summary}
                        </span>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <th scope="row" className="whitespace-nowrap py-2 pr-3 font-medium text-muted-foreground">
                      최종 확인일
                    </th>
                    {resolvedTools.map((tool) => (
                      <td key={tool.id} className="tabular-nums py-2 px-2 text-muted-foreground">
                        {formatDate(tool.verifiedAt)}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

"use client";

import { Plus, X } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import {
  findMatchingComparePreset,
  normalizeCompareSlugs,
  POPULAR_COMPARE_PRESETS,
} from "@/entities/taxonomy";
import { useToolCompare, useToolsList } from "@/entities/tool";
import { ToolCompareSummary, ToolCompareTable } from "@/widgets/tool-compare";
import { Badge, Button } from "@alkok/ui";

export default function ToolComparePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const slugsRaw = searchParams.get("slugs") ?? "";
  const slugs = useMemo(() => normalizeCompareSlugs(slugsRaw), [slugsRaw]);

  const [selectedCandidate, setSelectedCandidate] = useState("");

  const query = useToolCompare(slugs);
  const allToolsQuery = useToolsList({ limit: 50, validOnly: false });

  const tools = slugs.length > 0 ? (query.data?.data ?? []) : [];
  const allTools = useMemo(
    () => allToolsQuery.data?.data ?? [],
    [allToolsQuery.data?.data],
  );
  const matchedPreset = useMemo(() => findMatchingComparePreset(slugs), [slugs]);

  const availableToAdd = useMemo(() => {
    const selectedSet = new Set(slugs);
    return allTools.filter((t) => !selectedSet.has(t.slug));
  }, [allTools, slugs]);

  const updateCompareSlugs = (nextSlugs: string[]) => {
    const normalized = normalizeCompareSlugs(nextSlugs);
    if (normalized.length === 0) {
      router.push("/tools/compare");
      return;
    }
    router.push(`/tools/compare?slugs=${normalized.join(",")}`);
  };

  const handleAddTool = () => {
    const targetSlug = selectedCandidate || availableToAdd[0]?.slug;
    if (!targetSlug || slugs.length >= 4) return;
    updateCompareSlugs([...slugs, targetSlug]);
    setSelectedCandidate("");
  };

  const handleRemoveTool = (slugToRemove: string) => {
    updateCompareSlugs(slugs.filter((s) => s !== slugToRemove));
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">AI 도구 한눈에 비교하기</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          업무 목적별 프리셋을 고르거나 최대 4개 도구를 조합해 URL로 바로 공유하세요.
        </p>
      </div>

      {/* Preset Quick Switcher */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-medium text-muted-foreground">
          업무 목적별 프리셋:
        </span>
        {POPULAR_COMPARE_PRESETS.map((preset) => {
          const isActive = matchedPreset?.id === preset.id;
          return (
            <Button
              key={preset.id}
              variant={isActive ? "default" : "outline"}
              size="sm"
              asChild
              className="min-h-11 sm:min-h-8"
            >
              <Link href={`/tools/compare?slugs=${preset.slugs.join(",")}`}>
                {preset.shortLabel}
              </Link>
            </Button>
          );
        })}
      </div>

      {/* Tool Add / Remove Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-surface-sunken p-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="tabular-nums text-xs font-medium text-muted-foreground">
            비교 대상 ({slugs.length}/4):
          </span>
          {slugs.length === 0 ? (
            <span className="text-xs text-muted-foreground">선택된 도구가 없습니다.</span>
          ) : (
            slugs.map((slug) => {
              const matchedTool = tools.find((t) => t.slug === slug) ?? allTools.find((t) => t.slug === slug);
              const label = matchedTool?.title ?? slug;
              return (
                <Badge key={slug} variant="secondary" className="gap-1 pe-1">
                  <span>{label}</span>
                  <button
                    type="button"
                    aria-label={`${label} 비교에서 제거`}
                    onClick={() => handleRemoveTool(slug)}
                    className="inline-flex min-h-8 min-w-8 items-center justify-center rounded-sm hover:bg-muted sm:min-h-5 sm:min-w-5"
                  >
                    <X className="h-3 w-3" strokeWidth={2} aria-hidden="true" />
                  </button>
                </Badge>
              );
            })
          )}
        </div>

        {slugs.length < 4 && availableToAdd.length > 0 ? (
          <div className="flex items-center gap-2">
            <select
              aria-label="비교에 추가할 도구 선택"
              value={selectedCandidate || availableToAdd[0]?.slug || ""}
              onChange={(e) => setSelectedCandidate(e.target.value)}
              className="min-h-11 rounded-md border border-input bg-background px-2.5 text-xs text-foreground sm:min-h-8"
            >
              {availableToAdd.map((tool) => (
                <option key={tool.slug} value={tool.slug}>
                  {tool.title}
                </option>
              ))}
            </select>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={handleAddTool}
              className="min-h-11 sm:min-h-8"
            >
              <Plus className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden="true" />
              도구 추가
            </Button>
          </div>
        ) : null}
      </div>

      {slugs.length === 0 ? (
        <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {POPULAR_COMPARE_PRESETS.map((preset) => (
            <Link
              key={preset.id}
              href={`/tools/compare?slugs=${preset.slugs.join(",")}`}
              className="flex flex-col justify-between gap-2 rounded-xl border border-border bg-card p-4 transition-colors hover:bg-surface-sunken"
            >
              <div className="flex flex-col gap-1">
                <span className="text-sm font-semibold text-foreground">
                  {preset.shortLabel}
                </span>
                <span className="text-xs text-muted-foreground">
                  {preset.purpose}
                </span>
              </div>
              <span className="text-xs font-medium text-primary">
                비교표 열기
              </span>
            </Link>
          ))}
        </section>
      ) : (
        <>
          <ToolCompareSummary tools={tools} matchedPreset={matchedPreset} />
          <ToolCompareTable
            tools={tools}
            isLoading={query.isLoading}
            error={query.isError ? "비교 데이터를 불러오지 못했습니다." : null}
            onRetry={() => query.refetch()}
          />
        </>
      )}
    </div>
  );
}

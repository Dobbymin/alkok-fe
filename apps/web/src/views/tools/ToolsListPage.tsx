"use client";

import Link from "next/link";
import { useState } from "react";
import { ContentCard, ContentCardSkeleton } from "@/entities/content";
import {
  AI_USES,
  POPULAR_COMPARE_PRESETS,
  WORK_DOMAINS,
} from "@/entities/taxonomy";
import { useToolsList } from "@/entities/tool";
import { CompareToggleButton, CompareTray } from "@/features/tool-compare";
import type { ToolKind } from "@alkok/core";
import {
  Button,
  Checkbox,
  EmptyState,
  ErrorState,
  FilterBar,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Tabs,
  TabsList,
  TabsTrigger,
} from "@alkok/ui";

export default function ToolsListPage() {
  const [toolKind, setToolKind] = useState<ToolKind | "ALL">("ALL");
  const [hasFreePlan, setHasFreePlan] = useState(false);
  const [koreanFull, setKoreanFull] = useState(false);
  const [validOnly, setValidOnly] = useState(true);
  const [workDomain, setWorkDomain] = useState("ALL");
  const [aiUse, setAiUse] = useState("ALL");
  const [sort, setSort] = useState<"recommended" | "latest" | "helpful">("recommended");

  const query = useToolsList({
    toolKind: toolKind === "ALL" ? "" : toolKind,
    hasFreePlan,
    koreanFull,
    validOnly,
    workDomain: workDomain === "ALL" ? "" : workDomain,
    aiUse: aiUse === "ALL" ? "" : aiUse,
    sort,
  });

  const tools = query.data?.data ?? [];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">AI 도구·모델 디렉터리</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          무료 플랜·한국어 지원 여부로 필터링하고, 최대 4개(모바일 3개)를 담아 비교하세요.
        </p>
      </div>

      <section
        aria-label="업무 목적별 원클릭 비교 프리셋"
        className="flex flex-col gap-3 rounded-2xl border border-transparent bg-surface-sunken p-4 dark:border-border sm:p-5"
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-sm font-semibold text-foreground">
              업무 목적별 원클릭 7축 비교
            </h2>
            <p className="text-xs text-muted-foreground">
              자주 비교하는 조합을 바로 열어 무료 한도와 한국어 지원을 확인하세요.
            </p>
          </div>
          <Button variant="ghost" size="sm" asChild className="min-h-11 sm:min-h-8">
            <Link href="/tools/compare">비교표 전체 보기</Link>
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {POPULAR_COMPARE_PRESETS.map((preset) => (
            <Button
              key={preset.id}
              variant="outline"
              size="sm"
              asChild
              className="min-h-11 sm:min-h-8"
            >
              <Link href={`/tools/compare?slugs=${preset.slugs.join(",")}`}>
                {preset.shortLabel}
              </Link>
            </Button>
          ))}
        </div>
      </section>

      <Tabs
        value={toolKind}
        onValueChange={(v) => setToolKind(v as ToolKind | "ALL")}
      >
        <TabsList>
          <TabsTrigger value="ALL">전체</TabsTrigger>
          <TabsTrigger value="TOOL">AI 서비스·도구</TabsTrigger>
          <TabsTrigger value="MODEL">AI 모델</TabsTrigger>
        </TabsList>
      </Tabs>

      <FilterBar
        actions={
          <Select
            value={sort}
            onValueChange={(v) =>
              setSort(v as "recommended" | "latest" | "helpful")
            }
          >
            <SelectTrigger aria-label="정렬 기준" className="h-11 w-36 text-xs sm:h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recommended">추천순</SelectItem>
              <SelectItem value="latest">최신 업데이트순</SelectItem>
              <SelectItem value="helpful">도움됨순</SelectItem>
            </SelectContent>
          </Select>
        }
      >
        <div className="flex items-center gap-2">
          <Checkbox
            id="tool-free-plan"
            aria-label="무료 플랜 있음"
            checked={hasFreePlan}
            onCheckedChange={(v) => setHasFreePlan(v === true)}
          />
          <Label htmlFor="tool-free-plan" className="text-xs font-normal">
            무료 플랜 있음
          </Label>
        </div>

        <div className="flex items-center gap-2">
          <Checkbox
            id="tool-korean-full"
            aria-label="한국어 지원"
            checked={koreanFull}
            onCheckedChange={(v) => setKoreanFull(v === true)}
          />
          <Label htmlFor="tool-korean-full" className="text-xs font-normal">
            한국어 지원
          </Label>
        </div>

        <div className="flex items-center gap-2">
          <Checkbox
            id="tool-valid-only"
            aria-label="유효만 보기"
            checked={validOnly}
            onCheckedChange={(v) => setValidOnly(v === true)}
          />
          <Label htmlFor="tool-valid-only" className="text-xs font-normal">
            유효만 보기
          </Label>
        </div>

        <Select value={workDomain} onValueChange={setWorkDomain}>
          <SelectTrigger aria-label="업무 도메인 필터" className="h-11 w-36 text-xs sm:h-9">
            <SelectValue placeholder="업무 도메인" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">전체 업무</SelectItem>
            {WORK_DOMAINS.map((d) => (
              <SelectItem key={d.slug} value={d.slug}>
                {d.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={aiUse} onValueChange={setAiUse}>
          <SelectTrigger aria-label="AI 용도 필터" className="h-11 w-36 text-xs sm:h-9">
            <SelectValue placeholder="AI 용도" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">전체 용도</SelectItem>
            {AI_USES.map((u) => (
              <SelectItem key={u.slug} value={u.slug}>
                {u.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FilterBar>

      {query.isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <ContentCardSkeleton />
          <ContentCardSkeleton />
          <ContentCardSkeleton />
        </div>
      ) : query.isError ? (
        <ErrorState onRetry={() => query.refetch()} />
      ) : tools.length === 0 ? (
        <EmptyState
          title="조건에 맞는 도구·모델이 없습니다."
          action={
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setToolKind("ALL");
                setHasFreePlan(false);
                setKoreanFull(false);
                setValidOnly(false);
                setWorkDomain("ALL");
                setAiUse("ALL");
              }}
            >
              필터 초기화
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool) => (
            <ContentCard
              key={tool.id}
              item={tool}
              footerSlot={
                <CompareToggleButton slug={tool.slug} title={tool.title} />
              }
            />
          ))}
        </div>
      )}

      <CompareTray />
    </div>
  );
}

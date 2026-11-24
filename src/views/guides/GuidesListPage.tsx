"use client";

import { useState } from "react";
import { ContentCard, ContentCardSkeleton } from "@/entities/content";
import { useGuidesList } from "@/entities/guide";
import { AI_USES, WORK_DOMAINS } from "@/entities/taxonomy";
import type { DifficultyLevel, PricingModel } from "@/shared/types";
import {
  Button,
  EmptyState,
  ErrorState,
  FilterBar,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui";

export default function GuidesListPage() {
  const [workDomain, setWorkDomain] = useState("ALL");
  const [aiUse, setAiUse] = useState("ALL");
  const [difficulty, setDifficulty] = useState<DifficultyLevel | "ALL">("ALL");
  const [pricingModel, setPricingModel] = useState<PricingModel | "ALL">("ALL");
  const [sort, setSort] = useState<"recommended" | "latest" | "helpful">("recommended");

  const query = useGuidesList({
    workDomain: workDomain === "ALL" ? "" : workDomain,
    aiUse: aiUse === "ALL" ? "" : aiUse,
    difficulty: difficulty === "ALL" ? "" : difficulty,
    pricingModel: pricingModel === "ALL" ? "" : pricingModel,
    sort,
  });

  const guides = query.data?.data ?? [];

  const resetFilters = () => {
    setWorkDomain("ALL");
    setAiUse("ALL");
    setDifficulty("ALL");
    setPricingModel("ALL");
    setSort("recommended");
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">업무 활용 가이드</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          업무 도메인·용도·난이도별로 바로 복사해 쓰는 실무 가이드를 찾아보세요.
        </p>
      </div>

      <FilterBar
        actions={
          <Select
            value={sort}
            onValueChange={(v) =>
              setSort(v as "recommended" | "latest" | "helpful")
            }
          >
            <SelectTrigger className="h-8 w-32 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recommended">추천순</SelectItem>
              <SelectItem value="latest">최신순</SelectItem>
              <SelectItem value="helpful">도움됨순</SelectItem>
            </SelectContent>
          </Select>
        }
      >
        <Select value={workDomain} onValueChange={setWorkDomain}>
          <SelectTrigger className="h-8 w-40 text-xs">
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
          <SelectTrigger className="h-8 w-40 text-xs">
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

        <Select
          value={difficulty}
          onValueChange={(v) => setDifficulty(v as DifficultyLevel | "ALL")}
        >
          <SelectTrigger className="h-8 w-28 text-xs">
            <SelectValue placeholder="난이도" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">전체 난이도</SelectItem>
            <SelectItem value="BEGINNER">입문</SelectItem>
            <SelectItem value="PRACTICAL">실무</SelectItem>
            <SelectItem value="ADVANCED">응용</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={pricingModel}
          onValueChange={(v) => setPricingModel(v as PricingModel | "ALL")}
        >
          <SelectTrigger className="h-8 w-32 text-xs">
            <SelectValue placeholder="무료/유료" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">전체 가격</SelectItem>
            <SelectItem value="FREE">무료</SelectItem>
            <SelectItem value="FREEMIUM">무료+유료</SelectItem>
            <SelectItem value="PAID">유료</SelectItem>
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
      ) : guides.length === 0 ? (
        <EmptyState
          title="조건에 맞는 가이드가 없습니다."
          description="필터를 초기화해 전체 가이드를 확인해 보세요."
          action={
            <Button variant="outline" size="sm" onClick={resetFilters}>
              필터 초기화
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {guides.map((guide) => (
            <ContentCard key={guide.id} item={guide} />
          ))}
        </div>
      )}
    </div>
  );
}

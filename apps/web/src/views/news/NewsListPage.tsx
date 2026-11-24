"use client";

import { useState } from "react";
import { ContentCard, ContentCardSkeleton } from "@/entities/content";
import { useNewsList } from "@/entities/news";
import { Button, EmptyState, ErrorState, FilterBar, Input } from "@alkok/ui";

export default function NewsListPage() {
  const [tag, setTag] = useState("");
  const query = useNewsList({ tag: tag.trim() });
  const items = query.data?.data ?? [];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">AI 소식</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          원문 전재 없이 실무 직장인 관점의 3줄 요약과 활용 영향을 전달합니다.
        </p>
      </div>

      <FilterBar
        actions={
          tag ? (
            <Button variant="ghost" size="sm" onClick={() => setTag("")}>
              초기화
            </Button>
          ) : null
        }
      >
        <Input
          inputSize="sm"
          value={tag}
          onChange={(e) => setTag(e.target.value)}
          placeholder="태그 필터 (예: openai, gemini)"
          aria-label="소식 태그 필터"
          className="w-64"
        />
      </FilterBar>

      {query.isLoading ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <ContentCardSkeleton />
          <ContentCardSkeleton />
        </div>
      ) : query.isError ? (
        <ErrorState onRetry={() => query.refetch()} />
      ) : items.length === 0 ? (
        <EmptyState
          title="표시할 AI 소식이 없습니다."
          description="다른 태그로 검색하거나 필터를 초기화해 보세요."
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {items.map((item) => (
            <ContentCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}

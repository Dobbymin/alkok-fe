"use client";

import { ThumbsUp } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { VerificationBadge } from "@/entities/content";
import { useNewsList } from "@/entities/news";
import { Button, EmptyState, ErrorState, FilterBar, Input, Skeleton } from "@alkok/ui";

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
          wrapperClassName="w-full sm:w-64"
        />
      </FilterBar>

      {query.isLoading ? (
        <div role="status" aria-label="AI 소식 불러오는 중" className="divide-y divide-separator border-y border-separator">
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex flex-col gap-2 py-6">
              <Skeleton className="h-5 w-28" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-full" />
            </div>
          ))}
          <span className="sr-only">AI 소식을 불러오고 있습니다.</span>
        </div>
      ) : query.isError ? (
        <ErrorState onRetry={() => query.refetch()} />
      ) : items.length === 0 ? (
        <EmptyState
          title="표시할 AI 소식이 없습니다."
          description="다른 태그로 검색하거나 필터를 초기화해 보세요."
          action={
            tag.trim() ? (
              <Button variant="outline" size="sm" onClick={() => setTag("")}>
                필터 초기화
              </Button>
            ) : undefined
          }
        />
      ) : (
        <ul className="divide-y divide-separator border-y border-separator">
          {items.map((item) => (
            <li key={item.id} className="py-6">
              <article className="flex flex-col gap-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <VerificationBadge
                    status={item.verificationStatus}
                    verifiedAt={item.verifiedAt}
                    sourceType={item.sourceType}
                    sourceName={item.sourceName}
                    showSourceBadge
                  />
                  <span className="inline-flex items-center gap-1 tabular-nums text-xs text-muted-foreground">
                    <ThumbsUp className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden="true" />
                    도움됨 {item.helpfulCount}
                  </span>
                </div>
                <h2 className="text-lg font-semibold leading-[1.4] tracking-[-0.01em] text-foreground">
                  <Link
                    href={`/news/${item.slug}`}
                    className="transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                  >
                    {item.title}
                  </Link>
                </h2>
                <p className="line-clamp-2 text-sm leading-[1.6] text-muted-foreground">
                  {item.summary}
                </p>
              </article>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

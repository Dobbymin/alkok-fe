"use client";

import { Search } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, type FormEvent } from "react";
import { ContentCard, ContentCardSkeleton } from "@/entities/content";
import { POPULAR_SEARCH_CHIPS, WORK_DOMAINS } from "@/entities/taxonomy";
import { useUnifiedSearch } from "@/features/quick-search";
import { selectIsAuthenticated, useAuthStore } from "@alkok/core";
import type { ContentType } from "@alkok/core";
import {
  Button,
  Checkbox,
  EmptyState,
  ErrorState,
  FilterBar,
  Input,
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

type SearchTab = "ALL" | ContentType | "VAULT";

export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isAuthenticated = useAuthStore(selectIsAuthenticated);

  const initialQ = searchParams.get("q") ?? "";
  const [inputQ, setInputQ] = useState(initialQ);
  const [tab, setTab] = useState<SearchTab>("ALL");
  const [workDomain, setWorkDomain] = useState<string>("ALL");
  const [validOnly, setValidOnly] = useState(true);

  const activeTab = !isAuthenticated && tab === "VAULT" ? "ALL" : tab;

  const query = useUnifiedSearch({
    q: initialQ,
    type: activeTab,
    workDomain: workDomain === "ALL" ? undefined : workDomain,
    validOnly,
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = inputQ.trim();
    if (!trimmed) return;
    router.push(`/search?q=${encodeURIComponent(trimmed)}`);
  };

  const items = query.data?.data?.items ?? [];
  const vaultItems = query.data?.data?.vaultItems ?? [];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">통합 검색</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          업무 해결 가이드를 우선 정렬하여 보여드립니다.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <Input
          value={inputQ}
          onChange={(e) => setInputQ(e.target.value)}
          placeholder="검색어를 입력하세요"
          aria-label="통합 검색어"
          wrapperClassName="flex-1"
          startIcon={<Search className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />}
        />
        <Button type="submit">검색</Button>
      </form>

      <Tabs value={activeTab} onValueChange={(v) => setTab(v as SearchTab)}>
        <TabsList className="flex-wrap">
          <TabsTrigger value="ALL">전체</TabsTrigger>
          <TabsTrigger value="GUIDE">업무 가이드</TabsTrigger>
          <TabsTrigger value="TOOL">도구·모델</TabsTrigger>
          <TabsTrigger value="NEWS">AI 소식</TabsTrigger>
          {isAuthenticated ? (
            <TabsTrigger value="VAULT">내 보관함</TabsTrigger>
          ) : null}
        </TabsList>
      </Tabs>

      <FilterBar>
        <Select value={workDomain} onValueChange={setWorkDomain}>
          <SelectTrigger aria-label="업무 도메인 필터" className="h-11 w-44 text-xs sm:h-9">
            <SelectValue placeholder="업무 도메인" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">전체 업무 도메인</SelectItem>
            {WORK_DOMAINS.map((d) => (
              <SelectItem key={d.slug} value={d.slug}>
                {d.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex items-center gap-2">
          <Checkbox
            id="search-valid-only"
            checked={validOnly}
            onCheckedChange={(v) => setValidOnly(v === true)}
          />
          <Label htmlFor="search-valid-only" className="text-xs font-normal">
            유효만 보기
          </Label>
        </div>
      </FilterBar>

      {!initialQ.trim() ? (
        <EmptyState
          title="찾고 싶은 업무나 AI 도구를 입력해 보세요."
          description="아래 인기 업무 키워드를 선택하거나 검색어를 입력해 주세요."
          action={
            <>
              {POPULAR_SEARCH_CHIPS.map((chip) => (
                <Button key={chip} variant="secondary" size="sm" asChild>
                  <Link href={`/search?q=${encodeURIComponent(chip)}`}>{chip}</Link>
                </Button>
              ))}
            </>
          }
        />
      ) : query.isLoading ? (
        <div
          role="status"
          aria-label="검색 결과 불러오는 중"
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <ContentCardSkeleton key={i} />
          ))}
          <span className="sr-only">검색 결과를 불러오고 있습니다.</span>
        </div>
      ) : query.isError ? (
        <ErrorState onRetry={() => query.refetch()} />
      ) : items.length === 0 && vaultItems.length === 0 ? (
        <EmptyState
          title={`'${initialQ}'에 대한 검색 결과가 없습니다.`}
          description="필터를 초기화하거나 인기 업무 키워드로 다시 탐색해 보세요."
          action={
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setWorkDomain("ALL");
                  setValidOnly(false);
                }}
              >
                필터 초기화
              </Button>
              <Button variant="secondary" size="sm" asChild>
                <Link href="/guides">추천 가이드 보기</Link>
              </Button>
            </>
          }
        />
      ) : (
        <div className="flex flex-col gap-6">
          {items.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((item) => (
                <ContentCard key={item.id} item={item} />
              ))}
            </div>
          ) : null}

          {isAuthenticated && vaultItems.length > 0 ? (
            <section className="flex flex-col gap-2">
              <h2 className="text-base font-semibold">내 보관함 결과</h2>
              <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {vaultItems.map((v) => (
                  <li key={v.id}>
                    <Link
                      href="/vault"
                      className="block rounded-xl border border-transparent bg-surface-sunken p-4 transition-colors hover:bg-secondary dark:border-border"
                    >
                      <p className="font-medium text-foreground">{v.title}</p>
                      {v.memo ? (
                        <p className="mt-1 text-xs text-muted-foreground">{v.memo}</p>
                      ) : null}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </div>
      )}
    </div>
  );
}

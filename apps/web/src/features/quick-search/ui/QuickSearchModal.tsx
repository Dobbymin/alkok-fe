"use client";

import { ClockCounterClockwise, MagnifyingGlass } from "@phosphor-icons/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { POPULAR_SEARCH_CHIPS } from "@/entities/taxonomy";
import type { ContentType } from "@alkok/core";
import {
  Badge,
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  Input,
  Skeleton,
} from "@alkok/ui";
import { useQuickSearchStore } from "../model/quick-search.store";
import { useSearchSuggest } from "../model/useQuickSearch";

const TYPE_PATH: Record<ContentType, { prefix: string; label: string }> = {
  GUIDE: { prefix: "/guides", label: "가이드" },
  TOOL: { prefix: "/tools", label: "도구" },
  SKILL: { prefix: "/skills", label: "스킬·플러그인" },
  NEWS: { prefix: "/news", label: "소식" },
};

const QUICK_LINKS = [
  { href: "/guides", label: "업무 활용 가이드" },
  { href: "/tools", label: "AI 도구·모델 디렉터리" },
  { href: "/skills", label: "플러그인 · 스킬 · MCP" },
  { href: "/tools/compare", label: "AI 도구 비교하기" },
  { href: "/news", label: "최신 AI 소식" },
] as const;

export const QuickSearchModal = () => {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const open = useQuickSearchStore((s) => s.open);
  const setOpen = useQuickSearchStore((s) => s.setOpen);
  const toggleOpen = useQuickSearchStore((s) => s.toggleOpen);
  const recent = useQuickSearchStore((s) => s.recentSearches);
  const addRecentSearch = useQuickSearchStore((s) => s.addRecentSearch);
  const suggestQuery = useSearchSuggest(query);

  useEffect(() => {
    void useQuickSearchStore.persist.rehydrate();
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        toggleOpen();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [toggleOpen]);

  const submitSearch = (term: string) => {
    const trimmed = term.trim();
    if (!trimmed) return;
    addRecentSearch(trimmed);
    setOpen(false);
    router.push(`/search?q=${encodeURIComponent(trimmed)}`);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    submitSearch(query);
  };

  const suggestions = (suggestQuery.data?.data ?? []).slice(0, 8);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-h-[90dvh] max-w-xl overflow-y-auto overscroll-contain p-4 sm:h-auto sm:p-6">
        <DialogHeader className="sr-only">
          <DialogTitle>통합 빠른 검색</DialogTitle>
          <DialogDescription>
            업무 가이드, AI 도구·모델, 소식을 검색하세요.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <Input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="예: 회의록 정리, PDF 요약, 무료 이미지 생성 도구"
            aria-label="검색어 입력"
            wrapperClassName="flex-1"
            startIcon={
              <MagnifyingGlass
                className="h-4 w-4"
                weight="regular"
                aria-hidden="true"
              />
            }
          />
          <Button type="submit">
            검색
          </Button>
        </form>

        <div className="flex flex-col gap-4 pt-2">
          {query.trim().length > 0 ? (
            <div className="flex flex-col gap-2">
              <p className="text-xs font-semibold text-muted-foreground">
                자동완성 추천 (최대 8건)
              </p>
              {suggestQuery.isFetching ? (
                <div
                  role="status"
                  aria-label="추천 검색어 불러오는 중"
                  className="flex flex-col gap-2"
                >
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between rounded-md px-3 py-2"
                    >
                      <Skeleton className="h-4 w-48" />
                      <Skeleton className="h-5 w-12 rounded-full" />
                    </div>
                  ))}
                  <span className="sr-only">추천 검색어를 불러오고 있습니다.</span>
                </div>
              ) : suggestions.length > 0 ? (
                <ul className="flex flex-col gap-1">
                  {suggestions.map((item) => {
                    const meta = TYPE_PATH[item.type];
                    return (
                      <li key={item.id}>
                        <Link
                          href={`${meta.prefix}/${item.slug}`}
                          onClick={() => setOpen(false)}
                          className="flex items-center justify-between rounded-md px-3 py-2 text-sm hover:bg-secondary"
                        >
                          <span className="truncate font-medium text-foreground">
                            {item.title}
                          </span>
                          <Badge variant="secondary">{meta.label}</Badge>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p className="text-xs text-muted-foreground">
                  일치하는 추천 항목이 없습니다. Enter를 눌러 전체 검색을 실행하세요.
                </p>
              )}
            </div>
          ) : (
            <>
              {recent.length > 0 ? (
                <div className="flex flex-col gap-2">
                  <p className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                    <ClockCounterClockwise
                      className="h-3.5 w-3.5"
                      weight="regular"
                      aria-hidden="true"
                    />
                    최근 검색어
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {recent.map((term) => (
                      <Button
                        key={term}
                        variant="outline"
                        size="sm"
                        onClick={() => submitSearch(term)}
                      >
                        {term}
                      </Button>
                    ))}
                  </div>
                </div>
              ) : null}

              <div className="flex flex-col gap-2">
                <p className="text-xs font-semibold text-muted-foreground">
                  인기 업무 검색어
                </p>
                <div className="flex flex-wrap gap-2">
                  {POPULAR_SEARCH_CHIPS.map((chip) => (
                    <Button
                      key={chip}
                      variant="secondary"
                      size="sm"
                      onClick={() => submitSearch(chip)}
                    >
                      {chip}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-2 border-t border-border pt-3">
                <p className="text-xs font-semibold text-muted-foreground">
                  빠른 이동
                </p>
                <div className="grid grid-cols-1 gap-1 sm:grid-cols-2">
                  {QUICK_LINKS.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className="flex items-center rounded-md px-3 py-2 text-sm text-foreground hover:bg-secondary"
                    >
                      <span>{link.label}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

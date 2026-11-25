"use client";

import { ArrowRight, Clock, Search } from "lucide-react";
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
} from "@alkok/ui";
import { addRecentSearch, getRecentSearches } from "../model/recent-searches";
import { useSearchSuggest } from "../model/useQuickSearch";

const TYPE_PATH: Record<ContentType, { prefix: string; label: string }> = {
  GUIDE: { prefix: "/guides", label: "가이드" },
  TOOL: { prefix: "/tools", label: "도구" },
  NEWS: { prefix: "/news", label: "소식" },
};

const QUICK_LINKS = [
  { href: "/guides", label: "업무 활용 가이드" },
  { href: "/tools", label: "AI 도구·모델 디렉터리" },
  { href: "/tools/compare", label: "도구 7축 비교표" },
  { href: "/news", label: "최신 AI 소식" },
] as const;

export interface QuickSearchModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const QuickSearchModal = ({
  open,
  onOpenChange,
}: QuickSearchModalProps) => {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [recent, setRecent] = useState<string[]>(() => getRecentSearches());
  const suggestQuery = useSearchSuggest(query);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        onOpenChange(!open);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onOpenChange]);

  const submitSearch = (term: string) => {
    const trimmed = term.trim();
    if (!trimmed) return;
    setRecent(addRecentSearch(trimmed));
    onOpenChange(false);
    router.push(`/search?q=${encodeURIComponent(trimmed)}`);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    submitSearch(query);
  };

  const suggestions = (suggestQuery.data?.data ?? []).slice(0, 8);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90dvh] max-w-xl content-start overflow-y-auto overscroll-contain p-4 sm:h-auto sm:p-6">
        <DialogHeader className="sr-only">
          <DialogTitle>통합 빠른 검색</DialogTitle>
          <DialogDescription>
            업무 가이드, AI 도구·모델, 소식을 검색하세요.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex items-center gap-2 pe-8">
          <div className="relative flex-1">
            <Search
              className="pointer-events-none absolute start-3 top-3 h-4 w-4 text-muted-foreground"
              strokeWidth={1.75}
              absoluteStrokeWidth
              aria-hidden="true"
            />
            <Input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="예: 회의록 정리, PDF 요약, 무료 이미지 생성 도구"
              aria-label="검색어 입력"
              className="ps-9"
            />
          </div>
          <Button type="submit" size="sm">
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
                <p className="text-xs text-muted-foreground">검색 중…</p>
              ) : suggestions.length > 0 ? (
                <ul className="flex flex-col gap-1">
                  {suggestions.map((item) => {
                    const meta = TYPE_PATH[item.type];
                    return (
                      <li key={item.id}>
                        <Link
                          href={`${meta.prefix}/${item.slug}`}
                          onClick={() => onOpenChange(false)}
                          className="flex items-center justify-between rounded-md px-2.5 py-2 text-sm hover:bg-secondary"
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
                  <p className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
                    <Clock className="h-3.5 w-3.5" strokeWidth={1.75} />
                    최근 검색어
                  </p>
                  <div className="flex flex-wrap gap-1.5">
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
                <div className="flex flex-wrap gap-1.5">
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

              <div className="flex flex-col gap-1.5 border-t border-border pt-3">
                <p className="text-xs font-semibold text-muted-foreground">
                  빠른 이동
                </p>
                <div className="grid grid-cols-1 gap-1 sm:grid-cols-2">
                  {QUICK_LINKS.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => onOpenChange(false)}
                      className="flex items-center justify-between rounded-md px-2.5 py-2 text-sm text-foreground hover:bg-secondary"
                    >
                      <span>{link.label}</span>
                      <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" strokeWidth={1.75} />
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

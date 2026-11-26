"use client";

import { ArrowLeft, Bookmark, RotateCcw, Search, X } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { ContentCard, VerificationBadge } from "@/entities/content";
import {
  AI_USES,
  SOURCE_TYPE_LABELS,
  WORK_DOMAINS,
} from "@/entities/taxonomy";
import { ToolSpecCard } from "@/entities/tool";
import { useLocalVaultStore, useVaultItemsQuery } from "@/entities/vault";
import { CompareToggleButton, CompareTray } from "@/features/tool-compare";
import { BookmarkAction } from "@/features/vault-save";
import {
  cn,
  selectIsAuthenticated,
  useAuthStore,
  type ContentSummary,
  type NewsDetailData,
  type ToolDetailData,
} from "@alkok/core";
import { Button, EmptyState, Input } from "@alkok/ui";
import { AlkokHeroMark } from "./AlkokHeroMark";

export type HomeCatalogTab = "guides" | "tools" | "news";

export interface HomeCatalogPayload {
  guides: ContentSummary[];
  tools: ToolDetailData[];
  news: NewsDetailData[];
  guidesTotal?: number;
  toolsTotal?: number;
  newsTotal?: number;
}

export interface HomePageProps {
  initialCatalog?: HomeCatalogPayload | null;
}

const VALID_TABS = new Set<HomeCatalogTab>(["guides", "tools", "news"]);
const DOMAIN_SLUG_SET = new Set<string>(WORK_DOMAINS.map((d) => d.slug));

function parseTab(raw: string | null): HomeCatalogTab {
  if (raw && VALID_TABS.has(raw as HomeCatalogTab)) {
    return raw as HomeCatalogTab;
  }
  return "guides";
}

function matchesSearchText(
  q: string,
  parts: Array<string | null | undefined>,
): boolean {
  if (!q) return true;
  const lower = q.toLowerCase();
  return parts.some((part) => part?.toLowerCase().includes(lower));
}

function hasCategorySlug(item: ContentSummary, slug: string): boolean {
  if (!slug) return true;
  return item.categories?.some((cat) => cat.slug === slug) ?? false;
}

function getLatestVerifiedDate(
  guides: ContentSummary[],
  tools: ToolDetailData[],
  news: NewsDetailData[],
): string | null {
  const dates = [...guides, ...tools, ...news]
    .map((item) => item.verifiedAt?.slice(0, 10))
    .filter((d): d is string => Boolean(d))
    .sort();
  return dates.length > 0 ? (dates[dates.length - 1] ?? null) : null;
}

const USAGE_STEPS = [
  {
    step: "01",
    title: "막힌 업무 찾기",
    description:
      "회의록·보고서·엑셀 등 지금 해결할 업무를 검색하거나 좌측 업무별 탐색에서 고릅니다.",
  },
  {
    step: "02",
    title: "프롬프트·도구 바로 적용",
    description:
      "가이드의 변수 프롬프트를 복사해 쓰거나, AI 도구 비교에서 무료 한도·한국어 지원을 확인합니다.",
  },
  {
    step: "03",
    title: "보관함에 콕 저장",
    description:
      "자주 쓰는 가이드와 외부 AI 링크를 로그인 없이도 브라우저 보관함에 저장해 두고 다시 꺼내 씁니다.",
  },
] as const;

const emptySubscribe = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

const HOME_SEARCH_INPUT_ID = "home-catalog-search";

export default function HomePage({ initialCatalog }: HomePageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const isAuthenticated = useAuthStore(selectIsAuthenticated);
  const localVaultItems = useLocalVaultStore((s) => s.items);
  const vaultQuery = useVaultItemsQuery({ limit: 50 }, isAuthenticated);
  const mounted = useSyncExternalStore(
    emptySubscribe,
    getClientSnapshot,
    getServerSnapshot,
  );

  const activeTab = parseTab(searchParams.get("tab"));
  const activeDomainSlug = searchParams.get("domain") ?? "";
  const activeUseFilter = searchParams.get("use") ?? "";
  const urlQuery = searchParams.get("q") ?? "";
  const savedOnly = searchParams.get("saved") === "1";

  const [searchDraft, setSearchDraft] = useState(urlQuery);
  const [prevUrlQuery, setPrevUrlQuery] = useState(urlQuery);

  if (urlQuery !== prevUrlQuery) {
    setPrevUrlQuery(urlQuery);
    setSearchDraft(urlQuery);
  }

  useEffect(() => {
    void useLocalVaultStore.persist.rehydrate();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "/" || e.metaKey || e.ctrlKey || e.altKey) return;
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.tagName === "SELECT" ||
          target.isContentEditable)
      ) {
        return;
      }
      e.preventDefault();
      document.getElementById(HOME_SEARCH_INPUT_ID)?.focus();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const updateParams = useCallback(
    (patch: Record<string, string | null>) => {
      const next = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(patch)) {
        if (!value || (key === "tab" && value === "guides")) {
          next.delete(key);
        } else {
          next.set(key, value);
        }
      }
      const qs = next.toString();
      router.replace(qs ? `/?${qs}` : "/", { scroll: false });
    },
    [router, searchParams],
  );

  const guides = useMemo(() => initialCatalog?.guides ?? [], [initialCatalog]);
  const tools = useMemo(() => initialCatalog?.tools ?? [], [initialCatalog]);
  const news = useMemo(() => initialCatalog?.news ?? [], [initialCatalog]);
  const latestVerifiedDate = useMemo(
    () => getLatestVerifiedDate(guides, tools, news),
    [guides, tools, news],
  );

  const savedContentIds = useMemo(() => {
    if (!mounted) return new Set<string>();
    if (isAuthenticated) {
      return new Set(
        (vaultQuery.data?.data ?? [])
          .map((item) => item.content?.id)
          .filter((id): id is string => Boolean(id)),
      );
    }
    return new Set(localVaultItems.map((item) => item.contentId));
  }, [mounted, isAuthenticated, vaultQuery.data?.data, localVaultItems]);

  const savedCount = savedContentIds.size;
  const trimmedSearch = searchDraft.trim();

  const filteredGuides = useMemo(() => {
    return guides.filter((g) => {
      if (activeDomainSlug && !hasCategorySlug(g, activeDomainSlug)) return false;
      if (activeUseFilter && !hasCategorySlug(g, activeUseFilter)) return false;
      if (savedOnly && !savedContentIds.has(g.id)) return false;
      return matchesSearchText(trimmedSearch, [
        g.title,
        g.summary,
        ...(g.categories?.map((c) => c.name) ?? []),
        ...(g.tags?.map((t) => t.name) ?? []),
      ]);
    });
  }, [guides, activeDomainSlug, activeUseFilter, savedOnly, savedContentIds, trimmedSearch]);

  const filteredTools = useMemo(() => {
    return tools.filter((t) => {
      if (activeDomainSlug && !hasCategorySlug(t, activeDomainSlug)) return false;
      if (activeUseFilter === "free" && !t.hasFreePlan) return false;
      if (activeUseFilter === "korean" && t.koreanSupport !== "FULL") return false;
      if (
        activeUseFilter === "free-korean" &&
        (!t.hasFreePlan || t.koreanSupport !== "FULL")
      ) {
        return false;
      }
      if (savedOnly && !savedContentIds.has(t.id)) return false;
      return matchesSearchText(trimmedSearch, [
        t.title,
        t.summary,
        t.providerName,
        t.pricingSummary,
        ...t.strengths,
        ...(t.categories?.map((c) => c.name) ?? []),
      ]);
    });
  }, [tools, activeDomainSlug, activeUseFilter, savedOnly, savedContentIds, trimmedSearch]);

  const filteredNews = useMemo(() => {
    return news.filter((n) => {
      if (activeDomainSlug && !hasCategorySlug(n, activeDomainSlug)) return false;
      if (activeUseFilter && n.sourceType !== activeUseFilter) return false;
      if (savedOnly && !savedContentIds.has(n.id)) return false;
      return matchesSearchText(trimmedSearch, [
        n.title,
        n.summary,
        n.workImpact,
        n.sourceName,
        ...(n.categories?.map((c) => c.name) ?? []),
      ]);
    });
  }, [news, activeDomainSlug, activeUseFilter, savedOnly, savedContentIds, trimmedSearch]);

  const activeDomain = DOMAIN_SLUG_SET.has(activeDomainSlug)
    ? WORK_DOMAINS.find((d) => d.slug === activeDomainSlug)
    : undefined;

  const guidesTotal = initialCatalog?.guidesTotal ?? guides.length;
  const toolsTotal = initialCatalog?.toolsTotal ?? tools.length;
  const newsTotal = initialCatalog?.newsTotal ?? news.length;

  const activeTabTotal =
    activeTab === "guides"
      ? guidesTotal
      : activeTab === "tools"
        ? toolsTotal
        : newsTotal;

  const activeFilteredCount =
    activeTab === "guides"
      ? filteredGuides.length
      : activeTab === "tools"
        ? filteredTools.length
        : filteredNews.length;

  const hasAnyFilter = Boolean(
    activeDomainSlug || activeUseFilter || trimmedSearch || savedOnly,
  );

  const handleResetFilters = () => {
    setSearchDraft("");
    updateParams({
      domain: null,
      use: null,
      q: null,
      saved: null,
    });
  };

  const tabItems: Array<{
    id: HomeCatalogTab;
    label: string;
    count: number;
  }> = [
    { id: "guides", label: "업무 가이드", count: guides.length },
    { id: "tools", label: "AI 도구", count: tools.length },
    { id: "news", label: "AI 소식", count: news.length },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* 1. Service Introduction or Focused Domain Header */}
      {activeDomain ? (
        <header className="flex flex-wrap items-end justify-between gap-3">
          <div className="flex flex-col gap-1">
            <button
              type="button"
              onClick={() => updateParams({ domain: null })}
              className="inline-flex w-fit items-center gap-1 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden="true" />
              전체 탐색으로
            </button>
            <h1 className="break-keep text-2xl font-bold leading-[1.25] tracking-[-0.025em] text-foreground">
              {activeDomain.name}
            </h1>
            <p className="break-keep text-sm text-muted-foreground">
              {activeDomain.name} 업무에 바로 쓰는 검증된 AI 가이드·도구·소식
            </p>
          </div>

          <p className="tabular-nums text-xs font-medium text-muted-foreground">
            {activeFilteredCount} / {activeTabTotal}개
          </p>
        </header>
      ) : (
        <section
          aria-label="알콕 서비스 소개"
          className="rounded-2xl border border-border bg-surface-sunken/70 p-6 sm:p-8"
        >
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-3 sm:gap-x-6 sm:gap-y-4">
              <div className="flex min-w-0 flex-col gap-2">
                <p className="text-xs font-semibold text-primary">
                  실무자를 위한 검증된 AI 지식 허브
                </p>
                <h1 className="break-keep text-2xl font-bold leading-[1.28] tracking-[-0.025em] text-foreground sm:text-3xl">
                  흩어진 AI 정보, 실무에 바로 쓰는 알맹이만 콕
                  <span className="text-primary">!</span>
                </h1>
              </div>

              <div className="flex items-center justify-center self-center sm:row-span-2">
                <AlkokHeroMark className="h-[54px] w-14 sm:h-[112px] sm:w-[116px]" />
              </div>

              <div className="col-span-2 flex min-w-0 flex-col gap-4 sm:col-span-1">
                <p className="break-keep max-w-2xl text-sm leading-[1.6] text-muted-foreground sm:text-base">
                  알콕은 공식 출처와 최신성을 확인한 업무 프롬프트 가이드, 무료 한도·한국어 지원 기준 도구 비교, 실무 영향 중심 AI 소식을 한곳에서 찾아 바로 적용하고 보관하는 실무 카탈로그입니다.
                </p>

                <div className="flex flex-wrap items-center gap-2">
                  <Button asChild size="sm" className="min-h-11 sm:min-h-9">
                    <Link href="/tools/compare">AI 도구 한눈에 비교하기</Link>
                  </Button>
                  <Button asChild variant="outline" size="sm" className="min-h-11 sm:min-h-9">
                    <Link href="/vault">내 보관함 열기</Link>
                  </Button>
                </div>
              </div>
            </div>

            <dl className="grid grid-cols-2 gap-3 border-t border-separator pt-5 sm:grid-cols-4">
              <div>
                <dt className="text-xs text-muted-foreground">업무 가이드</dt>
                <dd className="tabular-nums text-lg font-bold text-foreground">
                  {guidesTotal}건
                </dd>
                <dd className="text-[11px] text-muted-foreground">복사 프롬프트·사례</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">AI 도구·모델</dt>
                <dd className="tabular-nums text-lg font-bold text-foreground">
                  {toolsTotal}종
                </dd>
                <dd className="text-[11px] text-muted-foreground">무료·한국어·장단점 비교</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">최신 AI 소식</dt>
                <dd className="tabular-nums text-lg font-bold text-foreground">
                  {newsTotal}건
                </dd>
                <dd className="text-[11px] text-muted-foreground">실무 영향 핵심 요약</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">최근 검증일</dt>
                <dd className="tabular-nums text-lg font-bold text-foreground">
                  {latestVerifiedDate ?? "-"}
                </dd>
                <dd className="text-[11px] text-muted-foreground">공식 출처 기준 검증</dd>
              </div>
            </dl>
          </div>
        </section>
      )}

      {/* 2. 3-Step Usage Band (Above Catalog) */}
      {!activeDomain ? (
        <section aria-label="알콕 활용 방법" className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <h2 className="text-lg font-bold tracking-[-0.02em] text-foreground">
              알콕, 3단계로 바로 쓰세요
            </h2>
            <p className="break-keep text-sm text-muted-foreground">
              가입이나 설치 없이 지금 막힌 업무부터 바로 해결할 수 있습니다.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {USAGE_STEPS.map((item) => (
              <div
                key={item.step}
                className="flex flex-col gap-2 rounded-xl border border-border bg-card p-5"
              >
                <span className="tabular-nums font-mono text-xs font-semibold text-primary">
                  {item.step}
                </span>
                <h3 className="break-keep text-base font-semibold text-foreground">
                  {item.title}
                </h3>
                <p className="break-keep text-sm leading-[1.55] text-muted-foreground">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {!activeDomain ? (
        <div className="flex items-baseline justify-between gap-3">
          <h2 className="text-lg font-bold tracking-[-0.02em] text-foreground">
            실무 카탈로그
          </h2>
          <p className="tabular-nums text-xs font-medium text-muted-foreground">
            {activeFilteredCount} / {activeTabTotal}개
          </p>
        </div>
      ) : null}

      {/* 2. Full-Width Instant Search */}
      <div className="relative">
        <Input
          id={HOME_SEARCH_INPUT_ID}
          value={searchDraft}
          onChange={(e) => {
            const nextValue = e.target.value;
            setSearchDraft(nextValue);
            updateParams({ q: nextValue.trim() ? nextValue : null });
          }}
          placeholder="예: 회의록 정리, 보고서 초안, 무료 PDF 요약"
          aria-label="카탈로그 실시간 검색"
          className="min-h-11 pr-16"
          startIcon={
            <Search
              className="h-4 w-4"
              strokeWidth={1.75}
              absoluteStrokeWidth
            />
          }
        />
        <div className="absolute inset-y-0 end-3 flex items-center gap-1.5">
          {searchDraft ? (
            <button
              type="button"
              onClick={() => {
                setSearchDraft("");
                updateParams({ q: null });
              }}
              aria-label="검색어 지우기"
              className="inline-flex h-7 w-7 items-center justify-center rounded-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden="true" />
            </button>
          ) : (
            <kbd
              aria-hidden="true"
              className="hidden rounded-xs border border-border bg-surface-sunken px-1.5 py-0.5 font-mono text-[11px] text-muted-foreground sm:inline-flex"
            >
              /
            </kbd>
          )}
        </div>
      </div>

      {/* 3. Single-Row Tabs + Inline Filter Dropdowns + Saved Toggle */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div
          role="tablist"
          aria-label="콘텐츠 유형"
          className="flex flex-wrap items-center gap-1.5"
        >
          {tabItems.map((tab) => {
            const selected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => updateParams({ tab: tab.id, use: null })}
                className={cn(
                  "inline-flex min-h-11 items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-medium transition-colors sm:min-h-9",
                  selected
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card text-muted-foreground hover:bg-surface-sunken hover:text-foreground",
                )}
              >
                <span>{tab.label}</span>
                <span
                  aria-hidden="true"
                  className={cn(
                    "tabular-nums text-[11px]",
                    selected ? "text-primary-foreground/80" : "text-muted-foreground",
                  )}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            aria-label="업무 분야 필터"
            value={activeDomainSlug}
            onChange={(e) => updateParams({ domain: e.target.value || null })}
            className="min-h-11 w-40 truncate rounded-md border border-input bg-card px-3 text-xs text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:min-h-9"
          >
            <option value="">업무 분야 전체</option>
            {WORK_DOMAINS.map((domain) => (
              <option key={domain.slug} value={domain.slug}>
                {domain.name}
              </option>
            ))}
          </select>

          <select
            aria-label="세부 조건 필터"
            value={activeUseFilter}
            onChange={(e) => updateParams({ use: e.target.value || null })}
            className="min-h-11 w-36 truncate rounded-md border border-input bg-card px-3 text-xs text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:min-h-9"
          >
            {activeTab === "guides" ? (
              <>
                <option value="">활용 목적 전체</option>
                {AI_USES.map((use) => (
                  <option key={use.slug} value={use.slug}>
                    {use.name}
                  </option>
                ))}
              </>
            ) : activeTab === "tools" ? (
              <>
                <option value="">조건 전체</option>
                <option value="free">무료 플랜 있음</option>
                <option value="korean">한국어 완전 지원</option>
                <option value="free-korean">무료 + 한국어 완전 지원</option>
              </>
            ) : (
              <>
                <option value="">출처 전체</option>
                <option value="OFFICIAL">{SOURCE_TYPE_LABELS.OFFICIAL}</option>
                <option value="MEDIA">{SOURCE_TYPE_LABELS.MEDIA}</option>
                <option value="COMMUNITY">{SOURCE_TYPE_LABELS.COMMUNITY}</option>
              </>
            )}
          </select>

          <button
            type="button"
            aria-pressed={savedOnly}
            onClick={() => updateParams({ saved: savedOnly ? null : "1" })}
            className={cn(
              "inline-flex min-h-11 min-w-[124px] items-center justify-center gap-1.5 rounded-md border px-3 text-xs font-medium transition-colors sm:min-h-9",
              savedOnly
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card text-foreground hover:bg-surface-sunken",
            )}
          >
            <Bookmark className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden="true" />
            <span>저장한 항목</span>
            {mounted && savedCount > 0 ? (
              <span
                aria-hidden="true"
                className={cn(
                  "tabular-nums text-[11px]",
                  savedOnly ? "text-primary-foreground/80" : "text-muted-foreground",
                )}
              >
                {savedCount}
              </span>
            ) : null}
          </button>

          {hasAnyFilter ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleResetFilters}
              className="min-h-11 gap-1 text-xs text-muted-foreground sm:min-h-9"
            >
              <RotateCcw className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden="true" />
              초기화
            </Button>
          ) : null}
        </div>
      </div>

      {/* 4. Catalog Grid */}
      {activeTab === "guides" ? (
        filteredGuides.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredGuides.map((guide) => (
              <ContentCard
                key={guide.id}
                item={guide}
                hideTypeBadge
                ctaLabel="가이드 열기"
                bookmarkSlot={
                  <BookmarkAction
                    iconOnly
                    contentId={guide.id}
                    title={guide.title}
                    contentType={guide.type}
                    slug={guide.slug}
                    summary={guide.summary}
                  />
                }
              />
            ))}
          </div>
        ) : (
          <EmptyState
            title="조건에 맞는 업무 가이드가 없습니다."
            description="검색어나 필터 조건을 조정해 다른 가이드를 확인해 보세요."
            action={
              <div className="flex flex-wrap items-center justify-center gap-2">
                <Button variant="outline" size="sm" onClick={handleResetFilters}>
                  필터 초기화
                </Button>
                {trimmedSearch ? (
                  <Button variant="secondary" size="sm" asChild>
                    <Link href={`/search?q=${encodeURIComponent(trimmedSearch)}`}>
                      통합 검색에서 찾기
                    </Link>
                  </Button>
                ) : null}
              </div>
            }
          />
        )
      ) : activeTab === "tools" ? (
        filteredTools.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredTools.map((tool) => (
              <ToolSpecCard
                key={tool.id}
                tool={tool}
                verificationSlot={
                  <VerificationBadge
                    status={tool.verificationStatus}
                    verifiedAt={tool.verifiedAt}
                    sourceType={tool.sourceType}
                    sourceName={tool.sourceName}
                  />
                }
                bookmarkSlot={
                  <BookmarkAction
                    iconOnly
                    contentId={tool.id}
                    title={tool.title}
                    contentType={tool.type}
                    slug={tool.slug}
                    summary={tool.summary}
                  />
                }
                compareSlot={
                  <CompareToggleButton slug={tool.slug} title={tool.title} />
                }
              />
            ))}
          </div>
        ) : (
          <EmptyState
            title="조건에 맞는 AI 도구가 없습니다."
            description="필터를 초기화하거나 도구 디렉터리에서 전체 도구를 살펴보세요."
            action={
              <div className="flex flex-wrap items-center justify-center gap-2">
                <Button variant="outline" size="sm" onClick={handleResetFilters}>
                  필터 초기화
                </Button>
                <Button variant="secondary" size="sm" asChild>
                  <Link href="/tools/compare">AI 도구 비교하기</Link>
                </Button>
              </div>
            }
          />
        )
      ) : filteredNews.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredNews.map((item) => (
            <ContentCard
              key={item.id}
              item={item}
              hideTypeBadge
              ctaLabel="소식 열기"
              highlightLine={
                item.workImpact
                  ? { label: "실무 영향", text: item.workImpact }
                  : undefined
              }
              bookmarkSlot={
                <BookmarkAction
                  iconOnly
                  contentId={item.id}
                  title={item.title}
                  contentType={item.type}
                  slug={item.slug}
                  summary={item.summary}
                />
              }
            />
          ))}
        </div>
      ) : (
        <EmptyState
          title="조건에 맞는 AI 소식이 없습니다."
          description="검색어나 출처 필터를 초기화하고 최신 업데이트를 확인해 보세요."
          action={
            <Button variant="outline" size="sm" onClick={handleResetFilters}>
              필터 초기화
            </Button>
          }
        />
      )}

      <CompareTray />
    </div>
  );
}

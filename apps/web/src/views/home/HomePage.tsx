"use client";

import { Bookmark, Search } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState, type FormEvent } from "react";
import {
  ContentCard,
  ContentCardSkeleton,
  VerificationBadge,
} from "@/entities/content";
import type { HomeDataPayload } from "@/entities/content";
import { useGuidesList } from "@/entities/guide";
import {
  POPULAR_SEARCH_CHIPS,
  WORK_DOMAINS,
} from "@/entities/taxonomy";
import { ToolSpecCard } from "@/entities/tool";
import { CompareToggleButton, CompareTray } from "@/features/tool-compare";
import { HomeComparePreview } from "@/widgets/home-compare-preview";
import { selectIsAuthenticated, useAuthStore } from "@alkok/core";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  EmptyState,
  Input,
} from "@alkok/ui";

export interface HomePageProps {
  initialData?: HomeDataPayload | null;
}

function getLatestVerifiedDate(initialData?: HomeDataPayload | null): string | null {
  if (!initialData) return null;
  const dates = [
    ...initialData.guides,
    ...initialData.tools,
    ...initialData.news,
  ]
    .map((item) => item.verifiedAt)
    .filter((d): d is string => Boolean(d))
    .map((d) => d.slice(0, 10))
    .sort();
  return dates.length > 0 ? dates[dates.length - 1] ?? null : null;
}

export default function HomePage({ initialData }: HomePageProps) {
  const router = useRouter();
  const isAuthenticated = useAuthStore(selectIsAuthenticated);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDomain, setSelectedDomain] = useState<string>("ALL");

  const handleHeroSearch = (e: FormEvent) => {
    e.preventDefault();
    const q = searchTerm.trim();
    if (!q) return;
    router.push(`/search?q=${encodeURIComponent(q)}`);
  };

  const guides = useMemo(() => initialData?.guides ?? [], [initialData]);
  const tools = useMemo(() => initialData?.tools ?? [], [initialData]);
  const news = useMemo(() => initialData?.news ?? [], [initialData]);
  const recentVault = initialData?.recentVaultItems ?? [];

  const latestVerifiedDate = useMemo(
    () => getLatestVerifiedDate(initialData),
    [initialData],
  );

  const domainGuidesQuery = useGuidesList(
    {
      workDomain: selectedDomain === "ALL" ? "" : selectedDomain,
      limit: 6,
    },
    { enabled: selectedDomain !== "ALL" },
  );

  const fallbackDomainGuides = useMemo(() => {
    if (selectedDomain === "ALL") return guides.slice(0, 6);
    return guides
      .filter((g) => g.categories?.some((c) => c.slug === selectedDomain))
      .slice(0, 6);
  }, [guides, selectedDomain]);

  const displayedGuides = useMemo(() => {
    if (selectedDomain === "ALL") return guides.slice(0, 6);
    const serverItems = domainGuidesQuery.data?.data;
    if (serverItems && serverItems.length > 0) {
      return serverItems.slice(0, 6);
    }
    if (domainGuidesQuery.isError || (domainGuidesQuery.isSuccess && (!serverItems || serverItems.length === 0))) {
      return fallbackDomainGuides;
    }
    return fallbackDomainGuides;
  }, [
    selectedDomain,
    guides,
    domainGuidesQuery.data,
    domainGuidesQuery.isError,
    domainGuidesQuery.isSuccess,
    fallbackDomainGuides,
  ]);

  const isDomainLoading =
    selectedDomain !== "ALL" &&
    domainGuidesQuery.isLoading &&
    !domainGuidesQuery.data;

  return (
    <div className="flex flex-col gap-12">
      {/* 1. 2-Column Hero + Live Compare Preview */}
      <section className="rounded-2xl border border-transparent bg-surface-sunken p-5 dark:border-border sm:p-8">
        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
          <div className="flex flex-col gap-4 lg:col-span-5">
            <div className="flex flex-col gap-2">
              <h1 className="text-balance text-2xl font-bold leading-[1.25] tracking-[-0.025em] text-foreground sm:text-3xl">
                AI 정보, 알맹이만 콕<span className="text-primary">.</span>
              </h1>
              <p className="text-pretty text-sm leading-[1.6] text-muted-foreground sm:text-base">
                검증된 AI 도구 7축 비교표와 실무 해결 가이드를 바로 확인하고 비교하세요.
              </p>
              {guides.length > 0 || tools.length > 0 ? (
                <p className="tabular-nums text-xs text-muted-foreground">
                  {latestVerifiedDate ? `최근 검증일 ${latestVerifiedDate} · ` : ""}
                  가이드 {guides.length}건 · 도구 {tools.length}건 기준
                </p>
              ) : null}
            </div>

            <form
              onSubmit={handleHeroSearch}
              className="flex w-full items-center gap-2"
            >
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="예: 회의록 정리, PDF 요약, 무료 AI 비교"
                aria-label="홈 통합 검색"
                wrapperClassName="flex-1"
                className="min-h-11 sm:min-h-9"
                startIcon={
                  <Search
                    className="h-4 w-4"
                    strokeWidth={1.75}
                    absoluteStrokeWidth
                  />
                }
              />
              <Button type="submit" className="min-h-11 sm:min-h-9">
                검색
              </Button>
            </form>

            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-muted-foreground">인기 업무:</span>
              {POPULAR_SEARCH_CHIPS.map((chip) => (
                <Button
                  key={chip}
                  variant="secondary"
                  size="sm"
                  asChild
                  className="min-h-11 sm:min-h-8"
                >
                  <Link href={`/search?q=${encodeURIComponent(chip)}`}>{chip}</Link>
                </Button>
              ))}
            </div>
          </div>

          <div className="min-w-0 lg:col-span-7">
            <HomeComparePreview
              presets={initialData?.comparisonPresets}
              initialTools={tools}
            />
          </div>
        </div>
      </section>

      {/* 2. Work Guides with Instant Domain Tabs */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold tracking-[-0.02em]">업무 활용 가이드</h2>
            <p className="text-sm text-muted-foreground">
              프롬프트 복사로 바로 적용하는 단계별 실무 해결책
            </p>
          </div>
          <Button variant="ghost" size="sm" asChild className="min-h-11 sm:min-h-8">
            <Link href="/guides">전체 보기</Link>
          </Button>
        </div>

        <div
          role="tablist"
          aria-label="업무 도메인별 가이드 탐색"
          className="flex flex-wrap gap-2"
        >
          <button
            type="button"
            role="tab"
            aria-selected={selectedDomain === "ALL"}
            onClick={() => setSelectedDomain("ALL")}
            className={`min-h-11 rounded-md border px-3 py-1.5 text-xs font-medium transition-colors sm:min-h-8 ${
              selectedDomain === "ALL"
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card text-muted-foreground hover:bg-surface-sunken hover:text-foreground"
            }`}
          >
            전체
          </button>
          {WORK_DOMAINS.map((domain) => {
            const selected = selectedDomain === domain.slug;
            return (
              <button
                key={domain.slug}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => setSelectedDomain(domain.slug)}
                className={`min-h-11 rounded-md border px-3 py-1.5 text-xs font-medium transition-colors sm:min-h-8 ${
                  selected
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card text-muted-foreground hover:bg-surface-sunken hover:text-foreground"
                }`}
              >
                {domain.name}
              </button>
            );
          })}
        </div>

        {isDomainLoading ? (
          <div
            role="status"
            aria-label="업무 가이드 불러오는 중"
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
          >
            <ContentCardSkeleton />
            <ContentCardSkeleton />
            <ContentCardSkeleton />
            <span className="sr-only">업무 가이드를 불러오고 있습니다.</span>
          </div>
        ) : displayedGuides.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {displayedGuides.map((guide) => (
              <ContentCard key={guide.id} item={guide} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="선택한 업무 도메인의 가이드가 아직 없습니다."
            description="전체 보기에서 다른 실무 가이드를 확인해 보세요."
            action={
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedDomain("ALL")}
              >
                전체 가이드 보기
              </Button>
            }
          />
        )}
      </section>

      {/* 3. AI Tools & Spec Cards + Compare Tray */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold tracking-[-0.02em]">주요 AI 도구·모델</h2>
            <p className="text-sm text-muted-foreground">
              무료 한도·한국어 지원·핵심 강점을 비교하고 비교함에 담아보세요.
            </p>
          </div>
          <Button variant="ghost" size="sm" asChild className="min-h-11 sm:min-h-8">
            <Link href="/tools">디렉터리</Link>
          </Button>
        </div>

        {tools.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {tools.slice(0, 6).map((tool) => (
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
                compareSlot={
                  <CompareToggleButton slug={tool.slug} title={tool.title} />
                }
              />
            ))}
          </div>
        ) : (
          <EmptyState
            title="표시할 AI 도구·모델이 없습니다."
            description="도구 디렉터리에서 조건별로 도구를 찾아보세요."
            action={
              <Button variant="outline" size="sm" asChild>
                <Link href="/tools">도구 디렉터리 보기</Link>
              </Button>
            }
          />
        )}
      </section>

      {/* 4. Latest AI News (3-5) — borderless editorial list */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold tracking-[-0.02em]">최신 AI 소식</h2>
            <p className="text-sm text-muted-foreground">
              실무 영향 중심으로 3줄 요약한 최신 업데이트
            </p>
          </div>
          <Button variant="ghost" size="sm" asChild className="min-h-11 sm:min-h-8">
            <Link href="/news">전체 보기</Link>
          </Button>
        </div>

        {news.length > 0 ? (
          <ul className="divide-y divide-separator border-y border-separator">
            {news.slice(0, 5).map((item) => (
              <li key={item.id} className="py-5">
                <div className="flex flex-col gap-2">
                  <VerificationBadge
                    status={item.verificationStatus}
                    verifiedAt={item.verifiedAt}
                    sourceType={item.sourceType}
                    sourceName={item.sourceName}
                    showSourceBadge
                  />
                  <Link
                    href={`/news/${item.slug}`}
                    className="text-base font-semibold leading-[1.4] text-foreground transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                  >
                    {item.title}
                  </Link>
                  <p className="line-clamp-2 text-sm leading-[1.6] text-muted-foreground">
                    {item.summary}
                  </p>
                  {item.workImpact ? (
                    <p className="rounded-md bg-surface-sunken px-3 py-2 text-xs leading-[1.5] text-foreground">
                      <span className="font-semibold text-primary">실무 영향: </span>
                      {item.workImpact}
                    </p>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState
            title="표시할 최신 AI 소식이 없습니다."
            description="AI 소식 목록에서 전체 업데이트를 확인해 보세요."
            action={
              <Button variant="outline" size="sm" asChild>
                <Link href="/news">소식 목록 보기</Link>
              </Button>
            }
          />
        )}
      </section>

      {/* 5. Personal Vault Strip */}
      <section>
        <Card variant="surface">
          <CardHeader className="flex flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Bookmark className="h-5 w-5 text-primary" strokeWidth={1.75} aria-hidden="true" />
              <CardTitle as="h2">개인 지식 보관함</CardTitle>
            </div>
            <Button variant="outline" size="sm" asChild className="min-h-11 sm:min-h-8">
              <Link href={isAuthenticated ? "/vault" : "/login?next=/vault"}>
                {isAuthenticated ? "보관함 열기" : "로그인하고 보관함 열기"}
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {isAuthenticated && recentVault.length > 0 ? (
              <ul className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                {recentVault.slice(0, 3).map((v) => (
                  <li key={v.id}>
                    <Link
                      href="/vault"
                      className="block rounded-lg border border-transparent bg-card p-3 text-sm font-medium text-foreground transition-colors hover:bg-secondary dark:border-border"
                    >
                      {v.title}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm leading-[1.6] text-muted-foreground">
                유용한 AI 가이드와 외부 참고 링크를 폴더·태그·메모와 함께 내 보관함에 콕 저장해 두세요.
              </p>
            )}
          </CardContent>
        </Card>
      </section>

      <CompareTray />
    </div>
  );
}

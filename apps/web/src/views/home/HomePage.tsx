"use client";

import { Bookmark, Search } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { ContentCard, VerificationBadge } from "@/entities/content";
import {
  POPULAR_COMPARE_PRESETS,
  POPULAR_SEARCH_CHIPS,
} from "@/entities/taxonomy";
import { useAuth } from "@alkok/core";
import type { HomeDataPayload } from "@/entities/content";
import { Button, Card, CardContent, CardHeader, CardTitle, EmptyState, Input } from "@alkok/ui";

export interface HomePageProps {
  initialData?: HomeDataPayload | null;
}

export default function HomePage({ initialData }: HomePageProps) {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");

  const handleHeroSearch = (e: FormEvent) => {
    e.preventDefault();
    const q = searchTerm.trim();
    if (!q) return;
    router.push(`/search?q=${encodeURIComponent(q)}`);
  };

  const guides = initialData?.guides ?? [];
  const tools = initialData?.tools ?? [];
  const news = initialData?.news ?? [];
  const recentVault = initialData?.recentVaultItems ?? [];

  return (
    <div className="flex flex-col gap-12">
      {/* 1. Search Hero */}
      <section className="rounded-2xl border border-transparent bg-surface-sunken p-6 dark:border-border sm:p-10">
        <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
          <h1 className="text-balance text-2xl font-bold leading-[1.25] tracking-[-0.025em] text-foreground sm:text-3xl">
            AI 정보, 알맹이만 콕<span className="text-primary">.</span>
          </h1>
          <p className="mt-2 max-w-xl text-pretty text-sm leading-[1.6] text-muted-foreground sm:text-base">
            출처와 최신성이 검증된 업무 가이드, 도구 7축 비교표, 핵심 AI 소식을 바로 찾아보세요.
          </p>

          <form
            onSubmit={handleHeroSearch}
            className="mt-6 flex w-full items-center gap-2"
          >
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="예: 회의록 정리, PDF 요약, 무료 이미지 생성 도구"
              aria-label="홈 통합 검색"
              wrapperClassName="flex-1"
              startIcon={
                <Search
                  className="h-4 w-4"
                  strokeWidth={1.75}
                  absoluteStrokeWidth
                />
              }
            />
            <Button type="submit">검색</Button>
          </form>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
            <span className="text-xs text-muted-foreground">인기 업무:</span>
            {POPULAR_SEARCH_CHIPS.map((chip) => (
              <Button key={chip} variant="secondary" size="sm" asChild>
                <Link href={`/search?q=${encodeURIComponent(chip)}`}>{chip}</Link>
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* 2. Work Guides (4-6) */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold tracking-[-0.02em]">업무 활용 가이드</h2>
            <p className="text-sm text-muted-foreground">
              프롬프트 복사로 바로 적용하는 단계별 실무 해결책
            </p>
          </div>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/guides">전체 보기</Link>
          </Button>
        </div>

        {guides.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {guides.slice(0, 6).map((guide) => (
              <ContentCard key={guide.id} item={guide} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="아직 등록된 업무 가이드가 없습니다."
            description="업무 활용 가이드 목록에서 전체 주제를 확인해 보세요."
            action={
              <Button variant="outline" size="sm" asChild>
                <Link href="/guides">가이드 목록 보기</Link>
              </Button>
            }
          />
        )}
      </section>

      {/* 3. AI Tools & Popular Compare Presets */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold tracking-[-0.02em]">주요 AI 도구·모델</h2>
            <p className="text-sm text-muted-foreground">
              무료 한도·한국어 지원·강점과 한계를 한눈에 비교하세요.
            </p>
          </div>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/tools">디렉터리</Link>
          </Button>
        </div>

        <div className="flex flex-wrap gap-2">
          {POPULAR_COMPARE_PRESETS.map((preset) => (
            <Button key={preset.label} variant="outline" size="sm" asChild>
              <Link href={`/tools/compare?slugs=${preset.slugs.join(",")}`}>
                {preset.label}
              </Link>
            </Button>
          ))}
        </div>

        {tools.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {tools.slice(0, 6).map((tool) => (
              <ContentCard key={tool.id} item={tool} />
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

      {/* 4. Latest AI News (3-5) — toss.tech borderless editorial list */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold tracking-[-0.02em]">최신 AI 소식</h2>
            <p className="text-sm text-muted-foreground">
              실무 영향 중심으로 3줄 요약한 최신 업데이트
            </p>
          </div>
          <Button variant="ghost" size="sm" asChild>
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
            <Button variant="outline" size="sm" asChild>
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
                유용한 AI 가이드와 외부 링크를 폴더·태그·메모와 함께 내 보관함에 콕 저장해 두세요.
              </p>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

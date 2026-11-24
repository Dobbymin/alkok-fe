"use client";

import { ArrowRight, Bookmark, Search, Sparkles } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { ContentCard, ContentCardSkeleton, VerificationBadge } from "@/entities/content";
import {
  POPULAR_COMPARE_PRESETS,
  POPULAR_SEARCH_CHIPS,
} from "@/entities/taxonomy";
import { useAuth } from "@/shared/auth";
import type { HomeDataPayload } from "@/entities/content";
import { Badge, Button, Card, CardContent, CardHeader, CardTitle, Input } from "@/shared/ui";

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
    <div className="flex flex-col gap-10">
      {/* 1. Search Hero */}
      <section className="rounded-lg border border-border bg-card p-6 sm:p-8">
        <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
          <Badge variant="official" className="mb-3">
            <Sparkles className="h-3 w-3" strokeWidth={1.75} />
            실무 AI 지식 워크스페이스
          </Badge>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            AI 정보, 알맹이만 콕.
          </h1>
          <p className="mt-2 text-sm text-muted-foreground sm:text-base">
            출처와 최신성이 검증된 업무 가이드, 도구 7축 비교표, 핵심 AI 소식을 바로 찾아보세요.
          </p>

          <form
            onSubmit={handleHeroSearch}
            className="mt-5 flex w-full items-center gap-2"
          >
            <div className="relative flex-1">
              <Search
                className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-muted-foreground"
                strokeWidth={1.75}
              />
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="예: 회의록 정리, PDF 요약, 무료 이미지 생성 도구"
                aria-label="홈 통합 검색"
                className="pl-9"
              />
            </div>
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
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold tracking-tight">업무 활용 가이드</h2>
            <p className="text-sm text-muted-foreground">
              프롬프트 복사로 바로 적용하는 단계별 실무 해결책
            </p>
          </div>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/guides">
              전체 보기 <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.75} />
            </Link>
          </Button>
        </div>

        {guides.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {guides.slice(0, 6).map((guide) => (
              <ContentCard key={guide.id} item={guide} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <ContentCardSkeleton />
            <ContentCardSkeleton />
            <ContentCardSkeleton />
          </div>
        )}
      </section>

      {/* 3. AI Tools & Popular Compare Presets */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold tracking-tight">주요 AI 도구·모델</h2>
            <p className="text-sm text-muted-foreground">
              무료 한도·한국어 지원·강점/한계를 한눈에 비교하세요.
            </p>
          </div>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/tools">
              디렉터리 <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.75} />
            </Link>
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
        ) : null}
      </section>

      {/* 4. Latest AI News (3-5) */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold tracking-tight">최신 AI 소식</h2>
            <p className="text-sm text-muted-foreground">
              실무 영향 중심으로 3줄 요약한 최신 업데이트
            </p>
          </div>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/news">
              전체 보기 <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.75} />
            </Link>
          </Button>
        </div>

        {news.length > 0 ? (
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {news.slice(0, 5).map((item) => (
              <Card key={item.id} className="p-4">
                <div className="flex items-center justify-between gap-2">
                  <VerificationBadge
                    status={item.verificationStatus}
                    verifiedAt={item.verifiedAt}
                    sourceType={item.sourceType}
                    showSourceBadge
                  />
                </div>
                <Link
                  href={`/news/${item.slug}`}
                  className="mt-2 block text-base font-semibold text-foreground hover:text-primary"
                >
                  {item.title}
                </Link>
                <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                  {item.summary}
                </p>
              </Card>
            ))}
          </div>
        ) : null}
      </section>

      {/* 5. Personal Vault Strip */}
      <section>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Bookmark className="h-5 w-5 text-primary" strokeWidth={1.75} />
              <CardTitle>개인 지식 보관함</CardTitle>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href={isAuthenticated ? "/vault" : "/login?next=/vault"}>
                {isAuthenticated ? "전체 보기 →" : "로그인하고 시작하기"}
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {isAuthenticated && recentVault.length > 0 ? (
              <ul className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                {recentVault.slice(0, 3).map((v) => (
                  <li
                    key={v.id}
                    className="rounded-md border border-border bg-muted/40 p-3 text-sm font-medium"
                  >
                    {v.title}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">
                유용한 AI 가이드와 외부 링크를 폴더·태그·메모와 함께 내 보관함에 콕 저장해 두세요.
              </p>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

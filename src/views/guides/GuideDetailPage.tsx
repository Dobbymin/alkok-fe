import { AlertTriangle, Clock, ExternalLink } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { ContentCard, VerificationBadge } from "@/entities/content";
import { GuideToc, PromptCopyBlock, SafeMarkdown } from "@/entities/guide";
import { DIFFICULTY_LABELS } from "@/entities/taxonomy";
import { BookmarkAction } from "@/features/vault-save";
import type { GuideDetailData } from "@/shared/types";
import { Badge, Button, Card, CardContent, CardHeader, CardTitle, ErrorState } from "@/shared/ui";

export interface GuideDetailPageProps {
  guide: GuideDetailData | null;
  bookmarkSlot?: ReactNode;
  engagementSlot?: ReactNode;
}

export default function GuideDetailPage({
  guide,
  bookmarkSlot,
  engagementSlot,
}: GuideDetailPageProps) {
  if (!guide) {
    return (
      <ErrorState
        title="가이드를 찾을 수 없습니다."
        description="삭제되었거나 비공개 상태인 가이드일 수 있습니다."
        action={
          <Button variant="outline" size="sm" asChild>
            <Link href="/guides">가이드 목록으로</Link>
          </Button>
        }
      />
    );
  }

  const headings = guide.toc ?? [];

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_240px]">
      <article className="mx-auto flex w-full max-w-3xl flex-col gap-6">
        {/* 1. Structured Summary Card */}
        <Card>
          <CardHeader className="gap-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <VerificationBadge
                status={guide.verificationStatus}
                verifiedAt={guide.verifiedAt}
                sourceType={guide.sourceType}
                sourceName={guide.sourceName}
                showSourceBadge
              />
              {bookmarkSlot ?? (
                <BookmarkAction contentId={guide.id} title={guide.title} />
              )}
            </div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              {guide.title}
            </h1>
            <p className="text-base text-muted-foreground">{guide.summary}</p>
          </CardHeader>
          <CardContent className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary">
              난이도: {DIFFICULTY_LABELS[guide.difficulty]}
            </Badge>
            {guide.estimatedMinutes ? (
              <Badge variant="outline" className="tabular-nums">
                <Clock className="h-3 w-3" strokeWidth={1.75} />
                약 {guide.estimatedMinutes}분
              </Badge>
            ) : null}
            <Badge variant="outline">{guide.pricingModel}</Badge>
            {guide.recommendedTools?.map((tool) => (
              <Link key={tool.id} href={`/tools/${tool.slug}`}>
                <Badge variant="official">추천 도구: {tool.title}</Badge>
              </Link>
            ))}
          </CardContent>
        </Card>

        {/* Mobile TOC */}
        <div className="lg:hidden">
          <GuideToc headings={headings} />
        </div>

        {/* 2. Markdown Body */}
        <SafeMarkdown content={guide.markdownBody} />

        {/* 3. Prompt Copy Blocks */}
        {guide.prompts.length > 0 ? (
          <section className="flex flex-col gap-4">
            <h2 className="text-xl font-bold tracking-tight">바로 쓰는 프롬프트</h2>
            {guide.prompts.map((prompt) => (
              <PromptCopyBlock
                key={prompt.id}
                title={prompt.title}
                content={prompt.content}
                variables={prompt.variables}
              />
            ))}
          </section>
        ) : null}

        {/* 4. Cautions & Official CTA */}
        {guide.cautions ? (
          <div className="rounded-lg border border-status-review-border bg-status-review-bg p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-status-review-fg">
              <AlertTriangle className="h-4 w-4" strokeWidth={1.75} />
              <span>주의사항 및 한계</span>
            </div>
            <p className="mt-1.5 text-sm text-foreground">{guide.cautions}</p>
          </div>
        ) : null}

        <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-card p-4">
          <Button asChild>
            <a
              href={guide.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              공식 사이트에서 바로 쓰기
              <ExternalLink className="h-4 w-4" strokeWidth={1.75} />
            </a>
          </Button>
          {engagementSlot}
        </div>

        {guide.relatedGuides && guide.relatedGuides.length > 0 ? (
          <section className="flex flex-col gap-3 pt-4">
            <CardTitle className="text-lg">연관 업무 가이드</CardTitle>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {guide.relatedGuides.map((rel) => (
                <ContentCard key={rel.id} item={rel} />
              ))}
            </div>
          </section>
        ) : null}
      </article>

      {/* Desktop Sticky TOC */}
      <div className="hidden lg:block">
        <GuideToc headings={headings} />
      </div>
    </div>
  );
}

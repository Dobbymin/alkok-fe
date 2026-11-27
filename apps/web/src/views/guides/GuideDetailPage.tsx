import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  ExternalLink,
  ShieldAlert,
} from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { ContentCard, VerificationBadge } from "@/entities/content";
import { GuideToc, PromptCopyBlock, SafeMarkdown } from "@/entities/guide";
import { DIFFICULTY_LABELS } from "@/entities/taxonomy";
import { HelpfulButton } from "@/features/content-helpful";
import { ReportModal } from "@/features/content-report";
import { BookmarkAction } from "@/features/vault-save";
import type {
  GuideDetailData,
  GuideMistakeCategory,
  PricingModel,
} from "@alkok/core";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  ErrorState,
} from "@alkok/ui";

const PRICING_LABELS: Record<PricingModel, string> = {
  FREE: "무료",
  FREEMIUM: "무료+유료",
  PAID: "유료",
};

const MISTAKE_CATEGORY_LABELS: Record<GuideMistakeCategory, string> = {
  SECURITY: "보안 주의",
  HALLUCINATION: "환각 방지",
  FREE_LIMIT: "무료 한도",
  WORKFLOW: "워크플로",
};

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

  const beforeAfterExamples = guide.beforeAfterExamples ?? [];
  const commonMistakes = guide.commonMistakes ?? [];
  const verificationChecklist = guide.verificationChecklist ?? [];

  const headings = [
    ...(guide.toc ?? []),
    ...(guide.prompts.length > 0
      ? [{ id: "prompts", text: "바로 쓰는 프롬프트", level: 2 }]
      : []),
    ...(beforeAfterExamples.length > 0
      ? [{ id: "before-after", text: "Before / After 실행 예시", level: 2 }]
      : []),
    ...(commonMistakes.length > 0
      ? [{ id: "common-mistakes", text: "자주 하는 실수와 예방법", level: 2 }]
      : []),
    ...(verificationChecklist.length > 0
      ? [{ id: "verification-checklist", text: "결과 확인 체크리스트", level: 2 }]
      : []),
  ];

  return (
    <div className="flex flex-col gap-8 lg:flex-row">
      <article className="flex min-w-0 flex-1 flex-col gap-6">
        {/* 1. Structured Summary Card */}
        <Card variant="surface">
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
                <BookmarkAction
                  contentId={guide.id}
                  title={guide.title}
                  contentType={guide.type}
                  slug={guide.slug}
                  summary={guide.summary}
                />
              )}
            </div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              {guide.title}
            </h1>
            <p className="text-base leading-[1.6] text-muted-foreground">{guide.summary}</p>
          </CardHeader>
          <CardContent className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary">
              난이도: {DIFFICULTY_LABELS[guide.difficulty]}
            </Badge>
            {guide.estimatedMinutes ? (
              <Badge variant="outline" className="tabular-nums">
                <Clock className="h-3 w-3" strokeWidth={1.75} aria-hidden="true" />
                약 {guide.estimatedMinutes}분
              </Badge>
            ) : null}
            <Badge variant="outline">{PRICING_LABELS[guide.pricingModel]}</Badge>
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
          <section id="prompts" className="scroll-mt-20 flex flex-col gap-4">
            <h2 className="text-xl font-bold tracking-tight">바로 쓰는 프롬프트</h2>
            {guide.prompts.map((prompt) => (
              <PromptCopyBlock
                key={prompt.id}
                title={prompt.title}
                content={prompt.content ?? prompt.prompt ?? ""}
                variables={prompt.variables ?? []}
                variableExamples={prompt.variableExamples}
                expectedOutput={prompt.expectedOutput}
                tips={prompt.tips}
              />
            ))}
          </section>
        ) : null}

        {/* 3.5 Before / After Examples */}
        {beforeAfterExamples.length > 0 ? (
          <section id="before-after" className="scroll-mt-20 flex flex-col gap-4">
            <h2 className="text-xl font-bold tracking-tight">
              Before / After 실행 예시
            </h2>
            <div className="flex flex-col gap-4">
              {beforeAfterExamples.map((ex) => (
                <Card key={ex.id}>
                  <CardHeader>
                    <CardTitle as="h3" className="text-base">
                      {ex.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-3">
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                      <div className="rounded-lg border border-border bg-surface-sunken p-3">
                        <p className="text-xs font-semibold text-muted-foreground">
                          Before (원본 입력)
                        </p>
                        <p className="mt-1.5 whitespace-pre-wrap text-xs leading-[1.6] text-muted-foreground">
                          {ex.beforeInput}
                        </p>
                      </div>
                      <div className="rounded-lg border border-primary/30 bg-card p-3">
                        <p className="text-xs font-semibold text-primary">
                          After (AI 적용 결과)
                        </p>
                        <p className="mt-1.5 whitespace-pre-wrap text-xs leading-[1.6] text-foreground">
                          {ex.afterOutput}
                        </p>
                      </div>
                    </div>
                    {(ex.improvementPoints ?? []).length > 0 ? (
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-xs font-medium text-muted-foreground">
                          개선 포인트:
                        </span>
                        {ex.improvementPoints.map((pt, idx) => (
                          <Badge key={idx} variant="secondary">
                            {pt}
                          </Badge>
                        ))}
                      </div>
                    ) : null}
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        ) : null}

        {/* 3.6 Common Mistakes */}
        {commonMistakes.length > 0 ? (
          <section id="common-mistakes" className="scroll-mt-20 flex flex-col gap-4">
            <h2 className="flex items-center gap-2 text-xl font-bold tracking-tight">
              <ShieldAlert
                className="h-5 w-5 text-status-review-fg"
                strokeWidth={1.75}
                aria-hidden="true"
              />
              <span>자주 하는 실수와 예방법</span>
            </h2>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {commonMistakes.map((m) => (
                <Card key={m.id}>
                  <CardHeader className="gap-2 pb-2">
                    <div className="flex items-center justify-between gap-2">
                      <Badge variant="outline">
                        {MISTAKE_CATEGORY_LABELS[m.category] ?? m.category}
                      </Badge>
                    </div>
                    <CardTitle as="h3" className="text-sm">
                      {m.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-2 text-xs leading-[1.6]">
                    <p className="text-muted-foreground">
                      <span className="font-semibold text-foreground">실수: </span>
                      {m.mistake}
                    </p>
                    <p className="rounded-md bg-surface-sunken p-2.5 text-foreground">
                      <span className="font-semibold text-primary">예방: </span>
                      {m.prevention}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        ) : null}

        {/* 3.7 Verification Checklist */}
        {verificationChecklist.length > 0 ? (
          <section
            id="verification-checklist"
            className="scroll-mt-20 flex flex-col gap-3"
          >
            <Card>
              <CardHeader>
                <CardTitle as="h2" className="flex items-center gap-2 text-base">
                  <CheckCircle2
                    className="h-4 w-4 text-primary"
                    strokeWidth={1.75}
                    aria-hidden="true"
                  />
                  <span>결과 확인 체크리스트</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="list-decimal space-y-2 pl-5 text-sm text-foreground">
                  {verificationChecklist.map((item, idx) => (
                    <li key={idx} className="leading-[1.6]">
                      {item}
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>
          </section>
        ) : null}

        {/* 4. Cautions & Official CTA */}
        {guide.cautions ? (
          <div className="rounded-xl border border-status-review-border bg-status-review-bg p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-status-review-fg">
              <AlertTriangle className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
              <span>주의사항 및 한계</span>
            </div>
            <p className="mt-2 text-sm text-foreground">{guide.cautions}</p>
          </div>
        ) : null}

        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-transparent bg-surface-sunken p-4 dark:border-border">
          <Button asChild>
            <a
              href={guide.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              공식 사이트에서 바로 쓰기
              <ExternalLink className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
            </a>
          </Button>
          {engagementSlot ?? (
            <div className="flex flex-wrap items-center gap-2">
              <HelpfulButton
                contentId={guide.id}
                initialCount={guide.helpfulCount}
              />
              <ReportModal contentId={guide.id} contentTitle={guide.title} />
            </div>
          )}
        </div>

        {guide.relatedGuides && guide.relatedGuides.length > 0 ? (
          <section className="flex flex-col gap-4 pt-4">
            <h2 className="text-xl font-bold tracking-tight">연관 업무 가이드</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {guide.relatedGuides.map((rel) => (
                <ContentCard key={rel.id} item={rel} />
              ))}
            </div>
          </section>
        ) : null}
      </article>

      {/* Desktop Sticky TOC */}
      <div className="hidden w-60 shrink-0 lg:block">
        <GuideToc headings={headings} />
      </div>
    </div>
  );
}

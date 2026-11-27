import {
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  FolderTree,
  Lightbulb,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { ContentCard, VerificationBadge } from "@/entities/content";
import { GuideToc } from "@/entities/guide";
import {
  SKILL_KIND_LABELS,
  SkillInstallTabs,
  SkillMdPreview,
  SkillSpecCard,
} from "@/entities/skill";
import { DIFFICULTY_LABELS } from "@/entities/taxonomy";
import { HelpfulButton } from "@/features/content-helpful";
import { ReportModal } from "@/features/content-report";
import { BookmarkAction } from "@/features/vault-save";
import type {
  PricingModel,
  SkillDetailData,
  SkillExecutionVerification,
} from "@alkok/core";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CopyableCodeBlock,
  ErrorState,
} from "@alkok/ui";

const PRICING_LABELS: Record<PricingModel, string> = {
  FREE: "무료",
  FREEMIUM: "무료+유료",
  PAID: "유료",
};

const EXECUTION_VERIFICATION_LABELS: Record<
  SkillExecutionVerification,
  { label: string; variant: "valid" | "review" | "outline" }
> = {
  VERIFIED: { label: "실제 실행 검증됨", variant: "valid" },
  SOURCE_CHECKED: { label: "원본 SKILL.md 확인", variant: "review" },
  UNVERIFIED: { label: "실제 실행 미검증", variant: "outline" },
};

export interface SkillDetailPageProps {
  skill: SkillDetailData | null;
  bookmarkSlot?: ReactNode;
  engagementSlot?: ReactNode;
}

export default function SkillDetailPage({
  skill,
  bookmarkSlot,
  engagementSlot,
}: SkillDetailPageProps) {
  if (!skill) {
    return (
      <ErrorState
        title="플러그인·스킬을 찾을 수 없습니다."
        description="삭제되었거나 비공개 상태인 항목일 수 있습니다."
        action={
          <Button variant="outline" size="sm" asChild>
            <Link href="/skills">디렉터리로 이동</Link>
          </Button>
        }
      />
    );
  }

  const execBadge =
    EXECUTION_VERIFICATION_LABELS[skill.executionVerification] ??
    EXECUTION_VERIFICATION_LABELS.SOURCE_CHECKED;
  const beforeItems = skill.beforeAfter?.beforeItems ?? [];
  const afterItems = skill.beforeAfter?.afterItems ?? [];
  const workflowSteps = skill.workflowSteps ?? [];
  const prerequisites = skill.prerequisites ?? [];
  const installGuides = skill.installGuides ?? [];
  const examplePrompts = skill.examplePrompts ?? [];
  const expectedOutputs = skill.expectedOutputs ?? [];
  const postRunChecklist = skill.postRunChecklist ?? [];
  const tips = skill.tips ?? [];
  const faq = skill.faq ?? [];
  const fileStructure = skill.fileStructure ?? [];

  const tocHeadings =
    skill.toc && skill.toc.length > 0
      ? skill.toc
      : [
          { id: "overview", text: "어떤 스킬·플러그인인가요?", level: 2 },
          ...(beforeItems.length > 0 || afterItems.length > 0
            ? [{ id: "before-after", text: "도입 전후 비교", level: 2 }]
            : []),
          ...(workflowSteps.length > 0
            ? [{ id: "workflow", text: "어떻게 진행되나요?", level: 2 }]
            : []),
          ...(skill.installPrompt || installGuides.length > 0
            ? [{ id: "install", text: "준비물 및 설치·호출 방법", level: 2 }]
            : []),
          ...(examplePrompts.length > 0 || expectedOutputs.length > 0
            ? [{ id: "examples", text: "이렇게 요청하고 결과를 확인하세요", level: 2 }]
            : []),
          ...(tips.length > 0 || faq.length > 0 || skill.cautions
            ? [{ id: "tips-faq", text: "잘 쓰는 팁 · 주의사항 · FAQ", level: 2 }]
            : []),
          ...(skill.webAlternative
            ? [{ id: "web-alternative", text: "설치 없이 웹 AI로 따라 하기", level: 2 }]
            : []),
          ...(skill.skillMdPreview || fileStructure.length > 0
            ? [{ id: "source-preview", text: "파일 구성 및 SKILL.md 미리보기", level: 2 }]
            : []),
        ];

  return (
    <div className="flex flex-col gap-8 lg:flex-row">
      <article className="flex min-w-0 flex-1 flex-col gap-6">
        {/* 1. Hero Card */}
        <Card variant="surface">
          <CardHeader className="gap-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="secondary">
                  {SKILL_KIND_LABELS[skill.skillKind]}
                </Badge>
                <VerificationBadge
                  status={skill.verificationStatus}
                  verifiedAt={skill.verifiedAt}
                  sourceType={skill.sourceType}
                  sourceName={skill.sourceName}
                  showSourceBadge
                />
                <Badge variant={execBadge.variant}>{execBadge.label}</Badge>
              </div>
              {bookmarkSlot ?? (
                <BookmarkAction
                  contentId={skill.id}
                  title={skill.title}
                  contentType={skill.type}
                  slug={skill.slug}
                  summary={skill.summary}
                />
              )}
            </div>

            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              {skill.title}
            </h1>
            <p className="text-base leading-[1.6] text-muted-foreground">
              {skill.summary}
            </p>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <Badge variant="outline">제작: {skill.authorName}</Badge>
              {skill.license ? (
                <Badge variant="outline">라이선스: {skill.license}</Badge>
              ) : null}
              <Badge variant="outline">
                난이도: {DIFFICULTY_LABELS[skill.difficulty]}
              </Badge>
              <Badge variant="outline">
                {PRICING_LABELS[skill.pricingModel]}
              </Badge>
            </div>
            {(skill.compatibleAgents ?? []).length > 0 ? (
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-xs font-medium text-muted-foreground">
                  호환 에이전트:
                </span>
                {skill.compatibleAgents.map((agent) => (
                  <Badge key={agent} variant="secondary">
                    {agent}
                  </Badge>
                ))}
              </div>
            ) : null}
          </CardContent>
        </Card>

        {/* Mobile TOC */}
        <div className="lg:hidden">
          <GuideToc headings={tocHeadings} />
        </div>

        {/* 2. Overview & Use Cases */}
        <section id="overview" className="scroll-mt-20 flex flex-col gap-4">
          <h2 className="text-xl font-bold tracking-tight">
            어떤 스킬·플러그인인가요?
          </h2>
          <p className="text-base leading-[1.7] text-foreground">
            {skill.overview}
          </p>
          {(skill.useCases ?? []).length > 0 ? (
            <Card>
              <CardHeader>
                <CardTitle as="h3" className="text-base">
                  이럴 때 써보세요
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc space-y-2 pl-5 text-sm text-foreground">
                  {skill.useCases.map((uc, idx) => (
                    <li key={idx} className="leading-[1.6]">
                      {uc}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ) : null}
        </section>

        {/* 3. Before / After */}
        {beforeItems.length > 0 || afterItems.length > 0 ? (
          <section id="before-after" className="scroll-mt-20 flex flex-col gap-3">
            <h2 className="text-xl font-bold tracking-tight">도입 전후 비교</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle as="h3" className="text-base text-muted-foreground">
                    지금은 이렇죠 (Before)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc space-y-2 pl-4 text-sm text-muted-foreground">
                    {beforeItems.map((item, idx) => (
                      <li key={idx} className="leading-[1.6]">
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
              <Card variant="surface">
                <CardHeader>
                  <CardTitle as="h3" className="text-base text-primary">
                    쓰면 이렇게 달라져요 (After)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc space-y-2 pl-4 text-sm text-foreground">
                    {afterItems.map((item, idx) => (
                      <li key={idx} className="leading-[1.6]">
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </section>
        ) : null}

        {/* 4. Workflow Steps */}
        {workflowSteps.length > 0 ? (
          <section id="workflow" className="scroll-mt-20 flex flex-col gap-3">
            <h2 className="text-xl font-bold tracking-tight">
              이렇게 진행돼요
            </h2>
            <ol className="flex flex-col gap-3">
              {workflowSteps.map((step) => (
                <li
                  key={step.step}
                  className="flex items-start gap-3 rounded-xl border border-border bg-card p-4"
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground tabular-nums">
                    {step.step}
                  </span>
                  <div className="flex min-w-0 flex-1 flex-col gap-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-sm font-semibold text-foreground">
                        {step.title}
                      </h3>
                      {step.badge ? (
                        <Badge variant="secondary">{step.badge}</Badge>
                      ) : null}
                    </div>
                    <p className="text-sm leading-[1.6] text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </section>
        ) : null}

        {/* 5. Prerequisites & Install Guides */}
        {prerequisites.length > 0 ||
        skill.installPrompt ||
        installGuides.length > 0 ? (
          <section id="install" className="scroll-mt-20 flex flex-col gap-4">
            <h2 className="text-xl font-bold tracking-tight">
              준비물 및 설치·호출 방법
            </h2>

            {prerequisites.length > 0 ? (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {prerequisites.map((pre, idx) => (
                  <Card key={idx}>
                    <CardContent className="flex flex-col gap-1.5 pt-4">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-semibold text-foreground">
                          {pre.name}
                        </span>
                        <Badge variant={pre.required ? "secondary" : "outline"}>
                          {pre.required ? "필수" : "선택"}
                        </Badge>
                      </div>
                      <p className="text-xs leading-[1.5] text-muted-foreground">
                        {pre.description}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : null}

            <SkillInstallTabs
              installPrompt={skill.installPrompt}
              installGuides={installGuides}
            />
          </section>
        ) : null}

        {/* 6. Example Prompts, Expected Outputs & Post-run Checklist */}
        {examplePrompts.length > 0 ||
        expectedOutputs.length > 0 ||
        postRunChecklist.length > 0 ? (
          <section id="examples" className="scroll-mt-20 flex flex-col gap-4">
            <h2 className="text-xl font-bold tracking-tight">
              이렇게 요청하고 결과를 확인하세요
            </h2>

            {examplePrompts.length > 0 ? (
              <div className="flex flex-col gap-3">
                <h3 className="text-base font-semibold text-foreground">
                  바로 복사해 쓰는 요청 예시
                </h3>
                {examplePrompts.map((ex, idx) => (
                  <CopyableCodeBlock
                    key={idx}
                    title={ex.label}
                    code={ex.prompt}
                    copyLabel="요청 복사"
                  />
                ))}
              </div>
            ) : null}

            {expectedOutputs.length > 0 ? (
              <div className="flex flex-col gap-3">
                <h3 className="text-base font-semibold text-foreground">
                  이런 결과를 받아요
                </h3>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {expectedOutputs.map((out, idx) => (
                    <Card key={idx}>
                      <CardContent className="flex items-start gap-3 pt-4">
                        <span className="font-mono text-xs font-bold text-primary tabular-nums">
                          {out.order}
                        </span>
                        <div className="flex flex-col gap-1">
                          <span className="text-sm font-semibold text-foreground">
                            {out.title}
                          </span>
                          <p className="text-xs leading-[1.55] text-muted-foreground">
                            {out.description}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ) : null}

            {postRunChecklist.length > 0 ? (
              <Card>
                <CardHeader>
                  <CardTitle as="h3" className="flex items-center gap-2 text-base">
                    <CheckCircle2
                      className="h-4 w-4 text-primary"
                      strokeWidth={1.75}
                      aria-hidden="true"
                    />
                    <span>결과를 받은 뒤 확인 순서</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ol className="list-decimal space-y-2 pl-5 text-sm text-foreground">
                    {postRunChecklist.map((item, idx) => (
                      <li key={idx} className="leading-[1.6]">
                        {item}
                      </li>
                    ))}
                  </ol>
                </CardContent>
              </Card>
            ) : null}
          </section>
        ) : null}

        {/* 7. Tips, Cautions & FAQ */}
        {tips.length > 0 || skill.cautions || faq.length > 0 ? (
          <section id="tips-faq" className="scroll-mt-20 flex flex-col gap-4">
            <h2 className="text-xl font-bold tracking-tight">
              잘 쓰는 팁 · 주의사항 · FAQ
            </h2>

            {tips.length > 0 ? (
              <Card>
                <CardHeader>
                  <CardTitle as="h3" className="flex items-center gap-2 text-base">
                    <Lightbulb
                      className="h-4 w-4 text-primary"
                      strokeWidth={1.75}
                      aria-hidden="true"
                    />
                    <span>실무 활용 팁</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc space-y-2 pl-5 text-sm text-foreground">
                    {tips.map((tip, idx) => (
                      <li key={idx} className="leading-[1.6]">
                        {tip}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ) : null}

            {skill.cautions ? (
              <div className="rounded-xl border border-status-review-border bg-status-review-bg p-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-status-review-fg">
                  <AlertTriangle
                    className="h-4 w-4"
                    strokeWidth={1.75}
                    aria-hidden="true"
                  />
                  <span>주의사항 및 한계</span>
                </div>
                <p className="mt-2 text-sm leading-[1.6] text-foreground">
                  {skill.cautions}
                </p>
              </div>
            ) : null}

            {faq.length > 0 ? (
              <div className="flex flex-col gap-3">
                <h3 className="text-base font-semibold text-foreground">
                  자주 묻는 질문
                </h3>
                {faq.map((item, idx) => (
                  <Card key={idx}>
                    <CardHeader className="pb-2">
                      <CardTitle as="h4" className="text-sm">
                        Q. {item.question}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm leading-[1.6] text-muted-foreground">
                        {item.answer}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : null}
          </section>
        ) : null}

        {/* 8. Non-Developer Web AI Alternative */}
        {skill.webAlternative ? (
          <section
            id="web-alternative"
            className="scroll-mt-20 flex flex-col gap-3"
          >
            <Card variant="surface">
              <CardHeader>
                <CardTitle as="h2" className="flex items-center gap-2 text-lg">
                  <Sparkles
                    className="h-4 w-4 text-primary"
                    strokeWidth={1.75}
                    aria-hidden="true"
                  />
                  <span>{skill.webAlternative.title}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                <p className="text-sm leading-[1.65] text-foreground">
                  {skill.webAlternative.description}
                </p>
                {(skill.webAlternative.recommendedTools ?? []).length > 0 ? (
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs text-muted-foreground">
                      웹 AI 대안:
                    </span>
                    {skill.webAlternative.recommendedTools.map((slug) => (
                      <Link key={slug} href={`/tools/${slug}`}>
                        <Badge variant="official">{slug}</Badge>
                      </Link>
                    ))}
                  </div>
                ) : null}
                {skill.webAlternative.guideSlug ? (
                  <div>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/guides/${skill.webAlternative.guideSlug}`}>
                        비개발자 웹 대안 가이드 보기
                      </Link>
                    </Button>
                  </div>
                ) : null}
              </CardContent>
            </Card>
          </section>
        ) : null}

        {/* 9. File Structure & SKILL.md Preview */}
        {fileStructure.length > 0 || skill.skillMdPreview ? (
          <section
            id="source-preview"
            className="scroll-mt-20 flex flex-col gap-4"
          >
            <h2 className="text-xl font-bold tracking-tight">
              파일 구성 및 원본 미리보기
            </h2>
            {fileStructure.length > 0 ? (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle as="h3" className="flex items-center gap-2 text-sm">
                    <FolderTree
                      className="h-4 w-4 text-muted-foreground"
                      strokeWidth={1.75}
                      aria-hidden="true"
                    />
                    <span>패키지 파일 구성</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="grid grid-cols-1 gap-1.5 font-mono text-xs text-muted-foreground sm:grid-cols-2">
                    {fileStructure.map((file, idx) => (
                      <li key={idx} className="truncate">
                        {file}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ) : null}

            {skill.skillMdPreview ? (
              <SkillMdPreview code={skill.skillMdPreview} previewLines={25} />
            ) : null}
          </section>
        ) : null}

        {/* 10. Official CTA & Engagement */}
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-transparent bg-surface-sunken p-4 dark:border-border">
          <Button asChild>
            <a
              href={skill.repositoryUrl || skill.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              원본 저장소·출처 보기
              <ExternalLink
                className="h-4 w-4"
                strokeWidth={1.75}
                aria-hidden="true"
              />
            </a>
          </Button>
          {engagementSlot ?? (
            <div className="flex flex-wrap items-center gap-2">
              <HelpfulButton
                contentId={skill.id}
                initialCount={skill.helpfulCount}
              />
              <ReportModal contentId={skill.id} contentTitle={skill.title} />
            </div>
          )}
        </div>

        {/* Related Tools & Skills */}
        {skill.compatibleTools && skill.compatibleTools.length > 0 ? (
          <section className="flex flex-col gap-3 pt-2">
            <h2 className="text-lg font-bold tracking-tight">
              함께 활용하는 AI 도구·모델
            </h2>
            <div className="flex flex-wrap gap-2">
              {skill.compatibleTools.map((tool) => (
                <Link key={tool.id} href={`/tools/${tool.slug}`}>
                  <Badge variant="official">{tool.title}</Badge>
                </Link>
              ))}
            </div>
          </section>
        ) : null}

        {skill.relatedSkills && skill.relatedSkills.length > 0 ? (
          <section className="flex flex-col gap-4 pt-2">
            <h2 className="text-lg font-bold tracking-tight">
              비슷한 플러그인·스킬
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {skill.relatedSkills.map((rel) =>
                "skillKind" in rel ? (
                  <SkillSpecCard key={rel.id} skill={rel as SkillDetailData} />
                ) : (
                  <ContentCard key={rel.id} item={rel} />
                ),
              )}
            </div>
          </section>
        ) : null}
      </article>

      {/* Desktop Sticky TOC */}
      <div className="hidden w-60 shrink-0 lg:block">
        <GuideToc headings={tocHeadings} />
      </div>
    </div>
  );
}

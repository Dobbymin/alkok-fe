import { ExternalLink } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { ContentCard, VerificationBadge } from "@/entities/content";
import { SkillSpecCard } from "@/entities/skill";
import { HelpfulButton } from "@/features/content-helpful";
import { ReportModal } from "@/features/content-report";
import { CompareToggleButton } from "@/features/tool-compare";
import { BookmarkAction } from "@/features/vault-save";
import type { KoreanSupportLevel, ToolDetailData } from "@alkok/core";
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

const KOREAN_LABEL: Record<KoreanSupportLevel, string> = {
  FULL: "완전 지원",
  PARTIAL: "부분 지원",
  NONE: "미지원",
};

export interface ToolDetailPageProps {
  tool: ToolDetailData | null;
  bookmarkSlot?: ReactNode;
  engagementSlot?: ReactNode;
}

export default function ToolDetailPage({
  tool,
  bookmarkSlot,
  engagementSlot,
}: ToolDetailPageProps) {
  if (!tool) {
    return (
      <ErrorState
        title="도구·모델을 찾을 수 없습니다."
        description="삭제되었거나 비공개 상태일 수 있습니다."
        action={
          <Button variant="outline" size="sm" asChild>
            <Link href="/tools">디렉터리로 이동</Link>
          </Button>
        }
      />
    );
  }

  return (
    <div className="flex w-full flex-col gap-6">
      <Card variant="surface">
        <CardHeader className="gap-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary">
                {tool.toolKind === "MODEL" ? "AI 모델" : "AI 도구"}
              </Badge>
              <VerificationBadge
                status={tool.verificationStatus}
                verifiedAt={tool.verifiedAt}
                sourceType={tool.sourceType}
                sourceName={tool.sourceName}
                showSourceBadge
              />
              {tool.isAffiliate ? (
                <Badge variant="affiliate">제휴 링크</Badge>
              ) : null}
            </div>
            <div className="flex items-center gap-2">
              <CompareToggleButton slug={tool.slug} title={tool.title} />
              {bookmarkSlot ?? (
                <BookmarkAction
                  contentId={tool.id}
                  title={tool.title}
                  contentType={tool.type}
                  slug={tool.slug}
                  summary={tool.summary}
                />
              )}
            </div>
          </div>

          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            {tool.title}
          </h1>
          <p className="text-base text-muted-foreground">{tool.summary}</p>
        </CardHeader>
        <CardContent className="flex flex-wrap items-center gap-2 text-xs">
          <Badge variant="outline">제공사: {tool.providerName}</Badge>
          <Badge variant="outline">
            한국어: {KOREAN_LABEL[tool.koreanSupport]}
          </Badge>
          {tool.platforms.map((p) => (
            <Badge key={p} variant="secondary">
              {p}
            </Badge>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle as="h2" className="text-base">
            요금 · 무료 한도
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={tool.hasFreePlan ? "valid" : "outline"}>
              {tool.hasFreePlan ? "무료 플랜 있음" : "유료 전용"}
            </Badge>
            <span className="tabular-nums text-sm font-medium text-foreground">
              {tool.pricingSummary}
            </span>
          </div>

          {tool.pricingPlans && tool.pricingPlans.length > 0 ? (
            <div className="overflow-x-auto rounded-lg border border-border">
              <table className="w-full min-w-[480px] border-collapse text-left text-xs">
                <thead className="bg-surface-sunken text-muted-foreground">
                  <tr>
                    <th className="px-3 py-2 font-semibold">플랜</th>
                    <th className="px-3 py-2 font-semibold">가격</th>
                    <th className="px-3 py-2 font-semibold">추천 대상</th>
                    <th className="px-3 py-2 font-semibold">핵심 제공 범위</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {tool.pricingPlans.map((plan, idx) => (
                    <tr key={idx}>
                      <td className="px-3 py-2.5 font-semibold text-foreground">
                        {plan.name}
                      </td>
                      <td className="px-3 py-2.5 tabular-nums text-foreground">
                        {plan.price}
                      </td>
                      <td className="px-3 py-2.5 text-muted-foreground">
                        {plan.target}
                      </td>
                      <td className="px-3 py-2.5 text-foreground">
                        {plan.highlights}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle as="h2" className="text-base">
              강점 · 적합 업무
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc space-y-2 pl-4 text-sm text-foreground">
              {tool.strengths.map((s, idx) => (
                <li key={idx}>{s}</li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle as="h2" className="text-base">
              한계 · 주의사항
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc space-y-2 pl-4 text-sm text-muted-foreground">
              {tool.limitations.map((l, idx) => (
                <li key={idx}>{l}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {tool.useCases && tool.useCases.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle as="h2" className="text-base">
              이럴 때 쓰세요
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc space-y-2 pl-4 text-sm text-foreground">
              {tool.useCases.map((uc, idx) => (
                <li key={idx} className="leading-[1.6]">
                  {uc}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      ) : null}

      {tool.gettingStartedSteps && tool.gettingStartedSteps.length > 0 ? (
        <section className="flex flex-col gap-3">
          <h2 className="text-lg font-bold tracking-tight">
            빠르게 시작하기 (단계별 가이드)
          </h2>
          <ol className="flex flex-col gap-2.5">
            {tool.gettingStartedSteps.map((step) => (
              <li
                key={step.step}
                className="flex items-start gap-3 rounded-xl border border-border bg-card p-4"
              >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground tabular-nums">
                  {step.step}
                </span>
                <div className="flex flex-col gap-1">
                  <h3 className="text-sm font-semibold text-foreground">
                    {step.title}
                  </h3>
                  <p className="text-xs leading-[1.6] text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </section>
      ) : null}

      {tool.examplePrompts && tool.examplePrompts.length > 0 ? (
        <section className="flex flex-col gap-3">
          <h2 className="text-lg font-bold tracking-tight">
            첫 요청 예시 프롬프트
          </h2>
          {tool.examplePrompts.map((ex, idx) => (
            <CopyableCodeBlock
              key={idx}
              title={ex.title}
              code={ex.prompt}
              copyLabel="프롬프트 복사"
            />
          ))}
        </section>
      ) : null}

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-transparent bg-surface-sunken p-4 dark:border-border">
        <Button asChild>
          <a
            href={tool.officialUrl}
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
              contentId={tool.id}
              initialCount={tool.helpfulCount}
            />
            <ReportModal contentId={tool.id} contentTitle={tool.title} />
          </div>
        )}
      </div>

      {tool.compatibleSkills && tool.compatibleSkills.length > 0 ? (
        <section className="flex flex-col gap-4">
          <h2 className="text-lg font-bold tracking-tight">
            함께 쓰면 좋은 플러그인·스킬
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {tool.compatibleSkills.map((skill) => (
              <SkillSpecCard key={skill.id} skill={skill} />
            ))}
          </div>
        </section>
      ) : null}

      {tool.faq && tool.faq.length > 0 ? (
        <section className="flex flex-col gap-3">
          <h2 className="text-lg font-bold tracking-tight">자주 묻는 질문</h2>
          {tool.faq.map((item, idx) => (
            <Card key={idx}>
              <CardHeader className="pb-2">
                <CardTitle as="h3" className="text-sm">
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
        </section>
      ) : null}

      {tool.relatedGuides && tool.relatedGuides.length > 0 ? (
        <section className="flex flex-col gap-4">
          <h2 className="text-lg font-bold tracking-tight">
            이 도구를 활용하는 업무 가이드
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {tool.relatedGuides.map((g) => (
              <ContentCard key={g.id} item={g} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}

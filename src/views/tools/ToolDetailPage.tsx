import { ExternalLink } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { ContentCard, VerificationBadge } from "@/entities/content";
import { CompareToggleButton } from "@/features/tool-compare";
import { BookmarkAction } from "@/features/vault-save";
import type { KoreanSupportLevel, ToolDetailData } from "@/shared/types";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  ErrorState,
} from "@/shared/ui";

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
    <div className="mx-auto flex max-w-4xl flex-col gap-6">
      <Card>
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
                <BookmarkAction contentId={tool.id} title={tool.title} />
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
          <CardTitle className="text-base">요금 · 무료 한도</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Badge variant={tool.hasFreePlan ? "valid" : "outline"}>
              {tool.hasFreePlan ? "무료 플랜 있음" : "유료 전용"}
            </Badge>
            <span className="tabular-nums text-sm font-medium text-foreground">
              {tool.pricingSummary}
            </span>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">강점 · 적합 업무</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc space-y-1.5 pl-4 text-sm text-foreground">
              {tool.strengths.map((s, idx) => (
                <li key={idx}>{s}</li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">한계 · 주의사항</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc space-y-1.5 pl-4 text-sm text-muted-foreground">
              {tool.limitations.map((l, idx) => (
                <li key={idx}>{l}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-card p-4">
        <Button asChild>
          <a
            href={tool.officialUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            공식 사이트에서 바로 쓰기
            <ExternalLink className="h-4 w-4" strokeWidth={1.75} />
          </a>
        </Button>
        {engagementSlot}
      </div>

      {tool.relatedGuides && tool.relatedGuides.length > 0 ? (
        <section className="flex flex-col gap-3">
          <h2 className="text-lg font-bold tracking-tight">
            이 도구를 활용하는 업무 가이드
          </h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {tool.relatedGuides.map((g) => (
              <ContentCard key={g.id} item={g} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}

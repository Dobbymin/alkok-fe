import { ExternalLink } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { ContentCard, VerificationBadge } from "@/entities/content";
import { HelpfulButton } from "@/features/content-helpful";
import { ReportModal } from "@/features/content-report";
import { BookmarkAction } from "@/features/vault-save";
import type { NewsDetailData } from "@/shared/types";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  ErrorState,
} from "@/shared/ui";

export interface NewsDetailPageProps {
  news: NewsDetailData | null;
  bookmarkSlot?: ReactNode;
  engagementSlot?: ReactNode;
}

export default function NewsDetailPage({
  news,
  bookmarkSlot,
  engagementSlot,
}: NewsDetailPageProps) {
  if (!news) {
    return (
      <ErrorState
        title="소식을 찾을 수 없습니다."
        description="삭제되었거나 비공개 상태인 소식일 수 있습니다."
        action={
          <Button variant="outline" size="sm" asChild>
            <Link href="/news">AI 소식 목록으로</Link>
          </Button>
        }
      />
    );
  }

  return (
    <article className="mx-auto flex max-w-3xl flex-col gap-6">
      <Card>
        <CardHeader className="gap-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <VerificationBadge
              status={news.verificationStatus}
              verifiedAt={news.verifiedAt}
              sourceType={news.sourceType}
              sourceName={news.sourceName}
              showSourceBadge
            />
            {bookmarkSlot ?? (
              <BookmarkAction contentId={news.id} title={news.title} />
            )}
          </div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            {news.title}
          </h1>
          <p className="text-base text-muted-foreground">{news.summary}</p>
        </CardHeader>
        {news.tags && news.tags.length > 0 ? (
          <CardContent className="flex flex-wrap gap-1.5">
            {news.tags.map((t) => (
              <Badge key={t.id} variant="outline">
                #{t.name}
              </Badge>
            ))}
          </CardContent>
        ) : null}
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">핵심 3줄 알맹이 요약</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground">
            {news.keyPoints.map((point, idx) => (
              <li key={idx}>{point}</li>
            ))}
          </ol>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">실무 영향 포인트</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-relaxed text-foreground">
            {news.workImpact}
          </p>
        </CardContent>
      </Card>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-card p-4">
        <Button asChild>
          <a
            href={news.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            원문 출처 확인하기
            <ExternalLink className="h-4 w-4" strokeWidth={1.75} />
          </a>
        </Button>
        {engagementSlot ?? (
          <div className="flex flex-wrap items-center gap-2">
            <HelpfulButton
              contentId={news.id}
              initialCount={news.helpfulCount}
            />
            <ReportModal contentId={news.id} contentTitle={news.title} />
          </div>
        )}
      </div>

      {news.relatedContents && news.relatedContents.length > 0 ? (
        <section className="flex flex-col gap-3">
          <h2 className="text-lg font-bold tracking-tight">연관 도구·가이드</h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {news.relatedContents.map((item) => (
              <ContentCard key={item.id} item={item} />
            ))}
          </div>
        </section>
      ) : null}
    </article>
  );
}

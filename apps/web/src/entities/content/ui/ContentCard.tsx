import { ThumbsUp } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import type { ContentSummary, ContentType } from "@alkok/core";
import { Badge, Card, CardContent, CardHeader, Skeleton } from "@alkok/ui";
import { VerificationBadge } from "./VerificationBadge";

const TYPE_META: Record<ContentType, { label: string; hrefPrefix: string }> = {
  GUIDE: { label: "업무 가이드", hrefPrefix: "/guides" },
  TOOL: { label: "도구·모델", hrefPrefix: "/tools" },
  NEWS: { label: "AI 소식", hrefPrefix: "/news" },
};

export interface ContentCardProps {
  item: ContentSummary;
  bookmarkSlot?: ReactNode;
  footerSlot?: ReactNode;
}

export const ContentCard = ({
  item,
  bookmarkSlot,
  footerSlot,
}: ContentCardProps) => {
  const typeMeta = TYPE_META[item.type];
  const href = `${typeMeta.hrefPrefix}/${item.slug}`;

  return (
    <Card className="flex h-full flex-col justify-between transition-colors duration-150 ease-out hover:bg-surface-sunken">
      <CardHeader className="gap-2 pb-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary">{typeMeta.label}</Badge>
            <VerificationBadge
              status={item.verificationStatus}
              verifiedAt={item.verifiedAt}
              sourceType={item.sourceType}
              sourceName={item.sourceName}
            />
          </div>
          {bookmarkSlot}
        </div>

        <Link
          href={href}
          className="line-clamp-2 text-balance rounded-sm text-base font-semibold leading-[1.3] text-foreground transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          {item.title}
        </Link>

        <p className="line-clamp-2 text-pretty text-sm leading-[1.5] text-muted-foreground">
          {item.summary}
        </p>
      </CardHeader>

      <CardContent className="flex flex-col gap-3 pt-0">
        {item.categories && item.categories.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {item.categories.slice(0, 3).map((cat) => (
              <Badge key={cat.id} variant="outline" className="text-[11px]">
                {cat.name}
              </Badge>
            ))}
          </div>
        ) : null}

        <div className="flex items-center justify-between border-t border-separator pt-3 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1 tabular-nums">
            <ThumbsUp
              className="h-3.5 w-3.5"
              strokeWidth={1.75}
              absoluteStrokeWidth
              aria-hidden="true"
            />
            도움됨 {item.helpfulCount}
          </span>
          {footerSlot}
        </div>
      </CardContent>
    </Card>
  );
};

export const ContentCardSkeleton = () => (
  <Card className="flex h-full flex-col justify-between p-5">
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <Skeleton className="h-5 w-16" />
        <Skeleton className="h-5 w-12" />
      </div>
      <Skeleton className="h-5 w-4/5" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
    </div>
    <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
      <Skeleton className="h-4 w-20" />
      <Skeleton className="h-4 w-16" />
    </div>
  </Card>
);

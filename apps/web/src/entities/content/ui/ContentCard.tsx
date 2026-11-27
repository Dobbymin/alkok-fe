import {
  ArrowRight,
  BookOpen,
  Briefcase,
  FileText,
  MessageSquare,
  Newspaper,
  Palette,
  Presentation,
  Puzzle,
  Search,
  Table2,
  ThumbsUp,
  Wrench,
} from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import type { ContentSummary, ContentType } from "@alkok/core";
import { Card, CardContent, CardHeader, Skeleton } from "@alkok/ui";
import { VerificationBadge } from "./VerificationBadge";

const TYPE_META: Record<
  ContentType,
  { label: string; hrefPrefix: string; Icon: typeof BookOpen }
> = {
  GUIDE: { label: "업무 가이드", hrefPrefix: "/guides", Icon: BookOpen },
  TOOL: { label: "도구·모델", hrefPrefix: "/tools", Icon: Wrench },
  SKILL: { label: "스킬·플러그인", hrefPrefix: "/skills", Icon: Puzzle },
  NEWS: { label: "AI 소식", hrefPrefix: "/news", Icon: Newspaper },
};

const DOMAIN_ICON_MAP: Record<string, typeof FileText> = {
  "docs-reports": FileText,
  "meetings-comms": MessageSquare,
  research: Search,
  "data-sheets": Table2,
  "planning-slides": Presentation,
  "content-design": Palette,
  career: Briefcase,
};

function renderHeaderIcon(domainSlug: string | undefined, type: ContentType) {
  const Icon = (domainSlug && DOMAIN_ICON_MAP[domainSlug]) || TYPE_META[type].Icon;
  return <Icon className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden="true" />;
}

export interface ContentCardProps {
  item: ContentSummary;
  bookmarkSlot?: ReactNode;
  footerSlot?: ReactNode;
  highlightLine?: { label: string; text: string };
  ctaLabel?: string;
  hideTypeBadge?: boolean;
}

export const ContentCard = ({
  item,
  bookmarkSlot,
  footerSlot,
  highlightLine,
  ctaLabel,
  hideTypeBadge = false,
}: ContentCardProps) => {
  const typeMeta = TYPE_META[item.type];
  const href = `${typeMeta.hrefPrefix}/${item.slug}`;
  const primaryDomain = item.categories?.find((c) => c.group === "WORK_DOMAIN");
  const secondaryCategories = (item.categories ?? [])
    .filter((c) => c.id !== primaryDomain?.id)
    .slice(0, 2);

  const headerLabel = primaryDomain?.name ?? typeMeta.label;
  const showTypeSuffix = !hideTypeBadge && Boolean(primaryDomain);

  const resolvedFooterRight =
    footerSlot ??
    (ctaLabel ? (
      <Link
        href={href}
        className="inline-flex items-center gap-1 font-medium text-foreground transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      >
        {ctaLabel}
        <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden="true" />
      </Link>
    ) : null);

  return (
    <Card
      variant="outline"
      className="group flex h-full min-h-[248px] flex-col justify-between transition-colors duration-150 ease-out hover:border-primary/40 hover:bg-card"
    >
      <CardHeader className="gap-3 pb-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-2">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-surface-sunken text-foreground/80">
              {renderHeaderIcon(primaryDomain?.slug, item.type)}
            </span>
            <span className="truncate text-xs font-medium text-muted-foreground">
              {headerLabel}
              {showTypeSuffix ? ` · ${typeMeta.label}` : ""}
            </span>
          </div>
          {bookmarkSlot}
        </div>

        <Link
          href={href}
          className="break-keep line-clamp-2 rounded-sm text-[17px] font-bold leading-[1.38] tracking-[-0.015em] text-foreground transition-colors group-hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          {item.title}
        </Link>

        <p className="break-keep line-clamp-2 text-sm leading-[1.55] text-muted-foreground">
          {item.summary}
        </p>
      </CardHeader>

      <CardContent className="flex flex-col gap-3 pt-0">
        {highlightLine ? (
          <p className="break-keep line-clamp-2 rounded-md bg-surface-sunken px-3 py-2 text-xs leading-[1.5] text-foreground">
            <span className="font-semibold text-primary">
              {highlightLine.label}:{" "}
            </span>
            {highlightLine.text}
          </p>
        ) : null}

        {secondaryCategories.length > 0 ? (
          <div className="flex flex-wrap gap-1.5">
            {secondaryCategories.map((cat) => (
              <span
                key={cat.id}
                className="rounded-sm bg-surface-sunken px-2 py-0.5 text-[11px] font-medium text-muted-foreground"
              >
                {cat.name}
              </span>
            ))}
          </div>
        ) : null}

        <div className="flex items-center justify-between gap-2 border-t border-separator pt-3 text-xs text-muted-foreground">
          <div className="flex min-w-0 flex-wrap items-center gap-2">
            <VerificationBadge
              status={item.verificationStatus}
              verifiedAt={item.verifiedAt}
              sourceType={item.sourceType}
              sourceName={item.sourceName}
            />
            {item.helpfulCount > 0 ? (
              <span className="inline-flex items-center gap-1 tabular-nums">
                <ThumbsUp
                  className="h-3.5 w-3.5"
                  strokeWidth={1.75}
                  absoluteStrokeWidth
                  aria-hidden="true"
                />
                도움됨 {item.helpfulCount}
              </span>
            ) : null}
          </div>
          {resolvedFooterRight}
        </div>
      </CardContent>
    </Card>
  );
};

export const ContentCardSkeleton = () => (
  <Card variant="outline" className="flex h-full min-h-[248px] flex-col justify-between">
    <CardHeader className="gap-3 pb-3">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Skeleton className="h-7 w-7 rounded-md" />
          <Skeleton className="h-4 w-24" />
        </div>
        <Skeleton className="h-8 w-8 rounded-md" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-5 w-11/12" />
        <Skeleton className="h-5 w-3/5" />
      </div>
      <div className="space-y-1.5">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
      </div>
    </CardHeader>
    <CardContent className="flex flex-col gap-3 pt-0">
      <div className="flex gap-1.5">
        <Skeleton className="h-5 w-16 rounded-sm" />
        <Skeleton className="h-5 w-16 rounded-sm" />
      </div>
      <div className="flex items-center justify-between border-t border-separator pt-3">
        <Skeleton className="h-5 w-28" />
        <Skeleton className="h-4 w-16" />
      </div>
    </CardContent>
  </Card>
);

import { AlertTriangle, CheckCircle2, XCircle } from "lucide-react";
import type { SourceType, VerificationStatus } from "@alkok/core";
import {
  Badge,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@alkok/ui";

const STATUS_META: Record<
  VerificationStatus,
  {
    label: string;
    tooltip: string;
    variant: "valid" | "review" | "expired";
    Icon: typeof CheckCircle2;
  }
> = {
  VALID: {
    label: "유효",
    tooltip: "출처 확인됨",
    variant: "valid",
    Icon: CheckCircle2,
  },
  NEEDS_REVIEW: {
    label: "확인 필요",
    tooltip: "업데이트 확인 필요",
    variant: "review",
    Icon: AlertTriangle,
  },
  EXPIRED: {
    label: "만료",
    tooltip: "만료된 정보",
    variant: "expired",
    Icon: XCircle,
  },
};

const SOURCE_LABELS: Record<SourceType, string> = {
  OFFICIAL: "공식",
  MEDIA: "전문 미디어",
  COMMUNITY: "커뮤니티",
};

export interface VerificationBadgeProps {
  status: VerificationStatus;
  verifiedAt?: string | null;
  sourceType?: SourceType;
  sourceName?: string | null;
  showSourceBadge?: boolean;
}

export const VerificationBadge = ({
  status,
  verifiedAt,
  sourceType,
  sourceName,
  showSourceBadge = false,
}: VerificationBadgeProps) => {
  const meta = STATUS_META[status];
  const Icon = meta.Icon;
  const formattedDate = verifiedAt ? verifiedAt.slice(0, 10) : null;

  const badgeButton = (
    <button
      type="button"
      aria-label={`신뢰 상태 ${meta.label} (${meta.tooltip})`}
      className="inline-flex items-center gap-2 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <Badge variant={meta.variant}>
        <Icon className="h-3 w-3" strokeWidth={1.75} aria-hidden="true" />
        <span>{meta.label}</span>
      </Badge>
      {formattedDate ? (
        <span className="tabular-nums text-xs text-muted-foreground">
          {formattedDate}
        </span>
      ) : null}
      {showSourceBadge && sourceType ? (
        <Badge variant="official">{SOURCE_LABELS[sourceType]}</Badge>
      ) : null}
    </button>
  );

  const detailBody = (
    <div className="flex flex-col gap-1 text-xs">
      <p className="font-semibold text-foreground">{meta.tooltip}</p>
      {sourceType ? (
        <p className="text-muted-foreground">
          출처: {SOURCE_LABELS[sourceType]}
          {sourceName ? ` (${sourceName})` : ""}
        </p>
      ) : null}
      {formattedDate ? (
        <p className="tabular-nums text-muted-foreground">
          최종 확인일: {formattedDate}
        </p>
      ) : null}
    </div>
  );

  return (
    <>
      <span className="hidden md:inline-flex">
        <Tooltip>
          <TooltipTrigger asChild>{badgeButton}</TooltipTrigger>
          <TooltipContent>{detailBody}</TooltipContent>
        </Tooltip>
      </span>
      <span className="inline-flex md:hidden">
        <Popover>
          <PopoverTrigger asChild>{badgeButton}</PopoverTrigger>
          <PopoverContent className="w-56 p-3">{detailBody}</PopoverContent>
        </Popover>
      </span>
    </>
  );
};

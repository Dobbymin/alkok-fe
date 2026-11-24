"use client";

import { ArrowRight, X } from "lucide-react";
import Link from "next/link";
import { Badge, Button } from "@/shared/ui";
import { compareStore, useCompareSelection } from "../model/compare-store";

export const CompareTray = () => {
  const items = useCompareSelection();
  if (items.length === 0) return null;

  const compareHref = `/tools/compare?slugs=${items.map((i) => i.slug).join(",")}`;

  return (
    <div
      role="region"
      aria-label="선택된 도구 비교 트레이"
      className="fixed inset-x-4 bottom-20 z-30 mx-auto max-w-4xl rounded-lg border border-border bg-popover p-3 shadow-lg md:bottom-4"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs font-semibold text-foreground">
            비교 선택 ({items.length})
          </span>
          {items.map((item) => (
            <Badge key={item.slug} variant="secondary" className="gap-1 pr-1">
              <span>{item.title}</span>
              <button
                type="button"
                aria-label={`${item.title} 비교에서 제거`}
                onClick={() => compareStore.remove(item.slug)}
                className="rounded-sm p-0.5 hover:bg-muted"
              >
                <X className="h-3 w-3" strokeWidth={1.75} />
              </button>
            </Badge>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => compareStore.clear()}
          >
            초기화
          </Button>
          <Button size="sm" asChild>
            <Link href={compareHref}>
              비교하기 <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.75} />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

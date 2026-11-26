"use client";

import { X } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { Badge, Button } from "@alkok/ui";
import { useCompareStore } from "../model/compare.store";

export const CompareTray = () => {
  const items = useCompareStore((s) => s.selectedItems);
  const remove = useCompareStore((s) => s.remove);
  const clear = useCompareStore((s) => s.clear);

  useEffect(() => {
    void useCompareStore.persist.rehydrate();
  }, []);

  if (items.length === 0) return null;

  const compareHref = `/tools/compare?slugs=${items.map((i) => i.slug).join(",")}`;

  return (
    <div
      role="region"
      aria-label="선택된 도구 비교 트레이"
      className="fixed inset-x-6 bottom-20 z-30 mx-auto max-w-6xl rounded-xl border border-transparent bg-surface-raised p-4 shadow-elevated md:start-64 md:end-6 md:bottom-4"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <span className="tabular-nums text-xs font-semibold text-foreground">
            비교 선택 ({items.length})
          </span>
          {items.map((item) => (
            <Badge key={item.slug} variant="secondary" className="gap-1 pe-1">
              <span>{item.title}</span>
              <button
                type="button"
                aria-label={`${item.title} 비교에서 제거`}
                onClick={() => remove(item.slug)}
                className="rounded-sm p-1 hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ring"
              >
                <X className="h-3 w-3" strokeWidth={2} absoluteStrokeWidth aria-hidden="true" />
              </button>
            </Badge>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => clear()}>
            초기화
          </Button>
          <Button size="sm" asChild>
            <Link href={compareHref}>비교하기</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

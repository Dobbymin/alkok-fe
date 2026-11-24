"use client";

import { Check, Scale } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/shared/ui";
import {
  compareStore,
  getCompareMaxLimit,
  useCompareSelection,
} from "../model/compare-store";

export const CompareToggleButton = ({
  slug,
  title,
}: {
  slug: string;
  title: string;
}) => {
  const items = useCompareSelection();
  const isSelected = items.some((i) => i.slug === slug);

  const handleToggle = () => {
    const ok = compareStore.toggle({ slug, title });
    if (!ok) {
      const max = getCompareMaxLimit();
      toast.info(`비교함에는 최대 ${max}개까지 담을 수 있습니다.`);
    }
  };

  return (
    <Button
      variant={isSelected ? "default" : "outline"}
      size="sm"
      onClick={handleToggle}
      aria-pressed={isSelected}
      className="h-7 gap-1 px-2 text-xs"
    >
      {isSelected ? (
        <>
          <Check className="h-3 w-3" strokeWidth={1.75} />
          비교 담김
        </>
      ) : (
        <>
          <Scale className="h-3 w-3" strokeWidth={1.75} />
          비교 담기
        </>
      )}
    </Button>
  );
};

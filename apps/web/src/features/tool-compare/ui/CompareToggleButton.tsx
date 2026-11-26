"use client";

import { Check, Scale } from "lucide-react";
import { useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@alkok/ui";
import { getCompareMaxLimit, useCompareStore } from "../model/compare.store";

export const CompareToggleButton = ({
  slug,
  title,
}: {
  slug: string;
  title: string;
}) => {
  const isSelected = useCompareStore((s) =>
    s.selectedItems.some((i) => i.slug === slug),
  );
  const toggle = useCompareStore((s) => s.toggle);

  useEffect(() => {
    void useCompareStore.persist.rehydrate();
  }, []);

  const handleToggle = () => {
    const ok = toggle({ slug, title });
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

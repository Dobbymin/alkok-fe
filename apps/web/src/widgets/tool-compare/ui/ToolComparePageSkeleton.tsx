import type { ComparePresetDefinition } from "@/entities/taxonomy";
import { Skeleton } from "@alkok/ui";
import { ToolCompareSummary } from "./ToolCompareSummary";
import { ToolCompareTable } from "./ToolCompareTable";

const PRESET_CHIP_WIDTHS = [
  "w-24",
  "w-24",
  "w-28",
  "w-28",
  "w-24",
  "w-24",
  "w-28",
] as const;

export interface ToolComparePageSkeletonProps {
  mode?: "hub" | "compare";
  toolCount?: number;
  matchedPreset?: ComparePresetDefinition;
}

export const ToolComparePageSkeleton = ({
  mode = "hub",
  toolCount = 3,
  matchedPreset,
}: ToolComparePageSkeletonProps) => {
  const isCompare = mode === "compare";
  const badgeCount = Math.min(Math.max(toolCount, 1), 4);

  return (
    <div
      role="status"
      aria-label="도구 비교표 불러오는 중"
      className="flex flex-col gap-6"
    >
      <div className="space-y-2">
        <Skeleton className="h-8 w-56" />
        <Skeleton className="h-4 w-96 max-w-full" />
      </div>

      {/* Preset Quick Switcher */}
      <div className="flex flex-wrap items-center gap-2">
        <Skeleton className="h-4 w-24" />
        {PRESET_CHIP_WIDTHS.map((widthCls, i) => (
          <Skeleton
            key={i}
            className={`min-h-11 ${widthCls} rounded-md sm:min-h-8`}
          />
        ))}
      </div>

      {/* Tool Add / Remove Control Bar */}
      <div className="flex min-h-[58px] flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-surface-sunken p-3">
        <div className="flex flex-wrap items-center gap-2">
          <Skeleton className="h-4 w-24" />
          {isCompare ? (
            Array.from({ length: badgeCount }).map((_, i) => (
              <Skeleton key={i} className="h-7 w-20 rounded-full" />
            ))
          ) : (
            <Skeleton className="h-4 w-36" />
          )}
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="min-h-11 w-36 rounded-md sm:min-h-8" />
          <Skeleton className="min-h-11 w-24 rounded-md sm:min-h-8" />
        </div>
      </div>

      {isCompare ? (
        <>
          <ToolCompareSummary
            tools={[]}
            matchedPreset={matchedPreset}
            isLoading
            toolCount={toolCount}
          />
          <ToolCompareTable tools={[]} isLoading toolCount={toolCount} />
        </>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {PRESET_CHIP_WIDTHS.map((_, i) => (
            <div
              key={i}
              className="flex flex-col justify-between gap-2 rounded-xl border border-border bg-card p-4"
            >
              <div className="flex flex-col gap-1.5">
                <Skeleton className="h-5 w-28" />
                <Skeleton className="h-4 w-11/12" />
              </div>
              <Skeleton className="h-4 w-16" />
            </div>
          ))}
        </div>
      )}

      <span className="sr-only">도구 비교표를 불러오고 있습니다.</span>
    </div>
  );
};

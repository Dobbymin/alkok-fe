import { Skeleton } from "@alkok/ui";

export default function ToolCompareLoading() {
  return (
    <div
      role="status"
      aria-label="도구 비교표 불러오는 중"
      className="flex flex-col gap-6"
    >
      <div className="space-y-2">
        <Skeleton className="h-8 w-56" />
        <Skeleton className="h-4 w-80 max-w-full" />
      </div>
      <div className="flex flex-wrap gap-2">
        {[0, 1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-8 w-28 rounded-md" />
        ))}
      </div>
      <div className="rounded-xl border border-border bg-card p-4">
        <div className="flex items-center justify-between border-b border-separator pb-3">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-8 w-44" />
        </div>
        <div className="mt-3 space-y-3">
          {[0, 1, 2, 3, 4].map((row) => (
            <div key={row} className="grid grid-cols-4 gap-3">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
            </div>
          ))}
        </div>
      </div>
      <span className="sr-only">도구 비교표를 불러오고 있습니다.</span>
    </div>
  );
}

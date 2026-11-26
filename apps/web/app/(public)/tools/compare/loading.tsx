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
        {[0, 1, 2, 3, 4, 5, 6].map((i) => (
          <Skeleton key={i} className="h-8 w-28 rounded-md" />
        ))}
      </div>
      <div className="flex min-h-[58px] flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-surface-sunken p-3">
        <div className="flex flex-wrap items-center gap-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="min-h-11 w-36 rounded-md sm:min-h-8" />
          <Skeleton className="min-h-11 w-24 rounded-md sm:min-h-8" />
        </div>
      </div>
      <div className="rounded-2xl border border-transparent bg-surface-sunken p-6 dark:border-border">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <Skeleton className="h-5 w-52" />
          <Skeleton className="h-5 w-32 rounded-full" />
        </div>
        <Skeleton className="mt-2 h-4 w-full max-w-2xl" />
        <div className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="min-h-[76px] w-full rounded-lg" />
          ))}
        </div>
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

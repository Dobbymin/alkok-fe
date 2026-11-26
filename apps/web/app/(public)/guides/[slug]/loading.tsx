import { Skeleton } from "@alkok/ui";

export default function GuideDetailLoading() {
  return (
    <div
      role="status"
      aria-label="업무 가이드 상세 불러오는 중"
      className="flex flex-col gap-8 lg:flex-row"
    >
      <div className="flex min-w-0 flex-1 flex-col gap-6">
        <div className="rounded-2xl border border-border bg-surface-sunken/70 p-6">
          <div className="flex items-center justify-between gap-2">
            <Skeleton className="h-5 w-36" />
            <Skeleton className="h-8 w-28" />
          </div>
          <Skeleton className="mt-4 h-8 w-4/5" />
          <Skeleton className="mt-2 h-4 w-full" />
          <div className="mt-4 flex gap-2">
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-6 w-16 rounded-full" />
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
        </div>
        <div className="space-y-3">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-11/12" />
          <Skeleton className="h-4 w-4/5" />
        </div>
        <Skeleton className="h-40 w-full rounded-xl" />
      </div>
      <div className="hidden w-60 shrink-0 lg:block">
        <Skeleton className="h-56 w-full rounded-xl" />
      </div>
      <span className="sr-only">업무 가이드 상세를 불러오고 있습니다.</span>
    </div>
  );
}

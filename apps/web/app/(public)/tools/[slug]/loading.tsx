import { Skeleton } from "@alkok/ui";

export default function ToolDetailLoading() {
  return (
    <div
      role="status"
      aria-label="AI 도구 상세 불러오는 중"
      className="flex w-full flex-col gap-6"
    >
      <div className="rounded-2xl border border-border bg-surface-sunken/70 p-6">
        <div className="flex items-center justify-between gap-2">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-8 w-44" />
        </div>
        <Skeleton className="mt-4 h-8 w-48" />
        <Skeleton className="mt-2 h-4 w-full max-w-xl" />
      </div>
      <Skeleton className="h-28 w-full rounded-xl" />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Skeleton className="h-40 w-full rounded-xl" />
        <Skeleton className="h-40 w-full rounded-xl" />
      </div>
      <span className="sr-only">AI 도구 상세를 불러오고 있습니다.</span>
    </div>
  );
}

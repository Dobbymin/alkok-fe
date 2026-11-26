import { Skeleton } from "@alkok/ui";

export default function NewsDetailLoading() {
  return (
    <div
      role="status"
      aria-label="AI 소식 상세 불러오는 중"
      className="flex w-full flex-col gap-6"
    >
      <div className="rounded-2xl border border-border bg-surface-sunken/70 p-6">
        <div className="flex items-center justify-between gap-2">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-8 w-28" />
        </div>
        <Skeleton className="mt-4 h-8 w-4/5" />
        <Skeleton className="mt-2 h-4 w-full" />
      </div>
      <Skeleton className="h-32 w-full rounded-xl" />
      <Skeleton className="h-24 w-full rounded-xl" />
      <span className="sr-only">AI 소식 상세를 불러오고 있습니다.</span>
    </div>
  );
}

import { ContentCardSkeleton } from "@/entities/content";
import { Skeleton } from "@alkok/ui";

export default function PublicHomeLoading() {
  return (
    <div
      role="status"
      aria-label="알콕 홈 불러오는 중"
      className="flex flex-col gap-6"
    >
      <div className="rounded-2xl border border-border bg-surface-sunken/70 p-6 sm:p-8">
        <div className="flex flex-col gap-4">
          <Skeleton className="h-4 w-44" />
          <Skeleton className="h-8 w-3/4 max-w-xl" />
          <Skeleton className="h-4 w-full max-w-2xl" />
          <div className="flex gap-2">
            <Skeleton className="h-9 w-40 rounded-md" />
            <Skeleton className="h-9 w-28 rounded-md" />
          </div>
          <div className="grid grid-cols-2 gap-3 border-t border-separator pt-5 sm:grid-cols-4">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="flex flex-col gap-1.5">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-6 w-12" />
                <Skeleton className="h-3 w-24" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="flex flex-col gap-2 rounded-xl border border-border bg-card p-5"
          >
            <Skeleton className="h-3.5 w-8" />
            <Skeleton className="h-5 w-36" />
            <Skeleton className="h-4 w-full" />
          </div>
        ))}
      </div>

      <div className="flex items-baseline justify-between gap-3">
        <Skeleton className="h-6 w-28" />
        <Skeleton className="h-4 w-16" />
      </div>

      <Skeleton className="h-11 w-full rounded-md" />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-1.5">
          <Skeleton className="h-9 w-24 rounded-md" />
          <Skeleton className="h-9 w-20 rounded-md" />
          <Skeleton className="h-9 w-20 rounded-md" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-9 w-32 rounded-md" />
          <Skeleton className="h-9 w-32 rounded-md" />
          <Skeleton className="h-9 w-24 rounded-md" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <ContentCardSkeleton key={i} />
        ))}
      </div>
      <span className="sr-only">페이지를 불러오고 있습니다.</span>
    </div>
  );
}

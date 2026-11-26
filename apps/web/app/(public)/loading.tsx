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
        <div className="@container flex flex-col gap-4">
          <div className="grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-3 @[500px]:grid-cols-[minmax(0,42rem)_minmax(148px,1fr)] @[500px]:gap-x-0 @[500px]:gap-y-4 @[640px]:grid-cols-[minmax(0,42rem)_minmax(172px,1fr)] @[820px]:grid-cols-[minmax(0,42rem)_minmax(200px,1fr)]">
            <div className="flex min-w-0 flex-col gap-2">
              <Skeleton className="h-4 w-44" />
              <Skeleton className="h-8 w-3/4 max-w-xl" />
            </div>
            <div className="flex items-center justify-center self-center @[500px]:row-span-2 @[500px]:px-3">
              <Skeleton className="aspect-[54/52] w-16 rounded-2xl @[380px]:w-20 @[500px]:w-[124px] @[640px]:w-[148px] @[820px]:w-[176px]" />
            </div>
            <div className="col-span-2 flex min-w-0 flex-col gap-4 @[500px]:col-span-1">
              <Skeleton className="h-4 w-full max-w-2xl" />
              <div className="flex gap-2">
                <Skeleton className="h-9 w-40 rounded-md" />
                <Skeleton className="h-9 w-28 rounded-md" />
              </div>
            </div>
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
        <div className="flex flex-wrap gap-1.5">
          <Skeleton className="min-h-11 w-24 rounded-md sm:min-h-9" />
          <Skeleton className="min-h-11 w-20 rounded-md sm:min-h-9" />
          <Skeleton className="min-h-11 w-20 rounded-md sm:min-h-9" />
        </div>
        <div className="flex flex-wrap gap-2">
          <Skeleton className="min-h-11 w-40 rounded-md sm:min-h-9" />
          <Skeleton className="min-h-11 w-36 rounded-md sm:min-h-9" />
          <Skeleton className="min-h-11 w-[124px] rounded-md sm:min-h-9" />
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

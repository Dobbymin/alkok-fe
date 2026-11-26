import { Skeleton } from "@alkok/ui";

export default function VaultLoading() {
  return (
    <div
      role="status"
      aria-label="내 보관함 불러오는 중"
      className="flex flex-col gap-6"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-2">
          <Skeleton className="h-8 w-36" />
          <Skeleton className="h-4 w-72 max-w-full" />
        </div>
        <Skeleton className="h-9 w-32 rounded-md" />
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-[220px_1fr]">
        <Skeleton className="h-40 w-full rounded-xl" />
        <div className="flex flex-col gap-4">
          <Skeleton className="h-12 w-full rounded-xl" />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {[0, 1].map((i) => (
              <div
                key={i}
                className="flex flex-col gap-3 rounded-xl border border-border bg-card p-5"
              >
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-5 w-4/5" />
                <Skeleton className="h-4 w-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
      <span className="sr-only">보관함을 불러오고 있습니다.</span>
    </div>
  );
}

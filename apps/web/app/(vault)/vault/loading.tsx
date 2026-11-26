import { Skeleton } from "@alkok/ui";

export default function VaultLoading() {
  return (
    <div
      role="status"
      aria-label="내 보관함 불러오는 중"
      className="flex flex-col gap-6"
    >
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-9 w-36" />
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        <Skeleton className="h-64 w-full rounded-xl" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:col-span-3">
          {[0, 1, 2, 3].map((i) => (
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
      <span className="sr-only">보관함을 불러오고 있습니다.</span>
    </div>
  );
}

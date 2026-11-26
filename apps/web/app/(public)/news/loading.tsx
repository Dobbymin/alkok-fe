import { Skeleton } from "@alkok/ui";

export default function NewsLoading() {
  return (
    <div
      role="status"
      aria-label="AI 소식 불러오는 중"
      className="flex flex-col gap-6"
    >
      <div className="space-y-2">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-4 w-72 max-w-full" />
      </div>
      <Skeleton className="h-9 w-64" />
      <div className="divide-y divide-separator border-y border-separator">
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} className="flex min-h-[128px] flex-col gap-2 py-6">
            <div className="flex items-center justify-between gap-2">
              <Skeleton className="h-5 w-36" />
              <Skeleton className="h-4 w-16" />
            </div>
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        ))}
      </div>
      <span className="sr-only">AI 소식을 불러오고 있습니다.</span>
    </div>
  );
}

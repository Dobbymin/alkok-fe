import { ContentCardSkeleton } from "@/entities/content";
import { Skeleton } from "@alkok/ui";

export default function ToolsLoading() {
  return (
    <div
      role="status"
      aria-label="AI 도구 디렉터리 불러오는 중"
      className="flex flex-col gap-6"
    >
      <div className="space-y-2">
        <Skeleton className="h-8 w-52" />
        <Skeleton className="h-4 w-80 max-w-full" />
      </div>
      <Skeleton className="h-24 w-full rounded-2xl" />
      <div className="flex flex-wrap gap-2">
        <Skeleton className="h-9 w-24" />
        <Skeleton className="h-9 w-28" />
        <Skeleton className="h-9 w-24" />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <ContentCardSkeleton key={i} />
        ))}
      </div>
      <span className="sr-only">AI 도구 목록을 불러오고 있습니다.</span>
    </div>
  );
}

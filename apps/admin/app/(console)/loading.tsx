import { Skeleton } from "@alkok/ui";

export default function AdminLoading() {
  return (
    <div
      role="status"
      aria-label="관리자 화면 불러오는 중"
      className="flex flex-col gap-6"
    >
      <div className="space-y-2">
        <Skeleton className="h-7 w-44" />
        <Skeleton className="h-4 w-72" />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-28 w-full rounded-xl" />
        ))}
      </div>
      <div className="space-y-2">
        {[0, 1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-10 w-full" />
        ))}
      </div>
      <span className="sr-only">관리자 데이터를 불러오고 있습니다.</span>
    </div>
  );
}

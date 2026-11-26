import { Skeleton } from "@alkok/ui";

export default function SettingsLoading() {
  return (
    <div
      role="status"
      aria-label="계정 설정 불러오는 중"
      className="flex w-full flex-col gap-6 py-4"
    >
      <div className="space-y-2">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-4 w-64" />
      </div>
      <Skeleton className="h-48 w-full rounded-xl" />
      <Skeleton className="h-48 w-full rounded-xl" />
      <span className="sr-only">계정 설정을 불러오고 있습니다.</span>
    </div>
  );
}

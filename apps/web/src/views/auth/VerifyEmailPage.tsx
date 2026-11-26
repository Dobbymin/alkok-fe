import { Suspense } from "react";
import { VerifyEmailPanel } from "@/features/auth-forms";
import { Skeleton } from "@alkok/ui";

function VerifyCardSkeleton() {
  return (
    <div
      role="status"
      aria-label="이메일 인증 화면 불러오는 중"
      className="w-full max-w-md space-y-4 rounded-xl border border-transparent bg-surface-sunken p-6 dark:border-border"
    >
      <div className="space-y-1.5">
        <Skeleton className="h-7 w-28" />
        <Skeleton className="h-4 w-64" />
      </div>
      <Skeleton className="h-10 w-full" />
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<VerifyCardSkeleton />}>
      <VerifyEmailPanel />
    </Suspense>
  );
}

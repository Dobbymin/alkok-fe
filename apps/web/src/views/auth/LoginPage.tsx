import { Suspense } from "react";
import { LoginForm } from "@/features/auth-forms";
import { Skeleton } from "@alkok/ui";

function AuthCardSkeleton() {
  return (
    <div
      role="status"
      aria-label="로그인 화면 불러오는 중"
      className="w-full max-w-md space-y-4 rounded-xl border border-transparent bg-surface-sunken p-6 dark:border-border"
    >
      <div className="space-y-1.5">
        <Skeleton className="h-7 w-20" />
        <Skeleton className="h-4 w-56" />
      </div>
      <div className="space-y-1.5">
        <Skeleton className="h-4 w-12" />
        <Skeleton className="h-10 w-full" />
      </div>
      <div className="space-y-1.5">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-10 w-full" />
      </div>
      <Skeleton className="h-10 w-full" />
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-14" />
        <Skeleton className="h-4 w-20" />
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<AuthCardSkeleton />}>
      <LoginForm />
    </Suspense>
  );
}

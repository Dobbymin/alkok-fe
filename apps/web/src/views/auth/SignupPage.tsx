import { Suspense } from "react";
import { SignupForm } from "@/features/auth-forms";
import { Skeleton } from "@alkok/ui";

function AuthCardSkeleton() {
  return (
    <div
      role="status"
      aria-label="회원가입 화면 불러오는 중"
      className="w-full max-w-md space-y-4 rounded-xl border border-transparent bg-surface-sunken p-6 dark:border-border"
    >
      <div className="space-y-1.5">
        <Skeleton className="h-7 w-24" />
        <Skeleton className="h-4 w-64" />
      </div>
      <div className="space-y-1.5">
        <Skeleton className="h-4 w-12" />
        <Skeleton className="h-10 w-full" />
      </div>
      <div className="space-y-1.5">
        <Skeleton className="h-4 w-12" />
        <Skeleton className="h-10 w-full" />
      </div>
      <div className="space-y-1.5">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-3.5 w-36" />
      </div>
      <Skeleton className="h-5 w-64" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="mx-auto h-4 w-32" />
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={<AuthCardSkeleton />}>
      <SignupForm />
    </Suspense>
  );
}

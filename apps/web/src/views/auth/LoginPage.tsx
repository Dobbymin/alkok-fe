import { Suspense } from "react";
import { LoginForm } from "@/features/auth-forms";
import { Skeleton } from "@alkok/ui";

function AuthCardSkeleton() {
  return (
    <div
      role="status"
      aria-label="로그인 화면 불러오는 중"
      className="w-full max-w-md space-y-4 rounded-xl border border-border bg-card p-6"
    >
      <Skeleton className="h-7 w-28" />
      <Skeleton className="h-4 w-56" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
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

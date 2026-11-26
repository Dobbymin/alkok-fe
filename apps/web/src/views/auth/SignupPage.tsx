import { Suspense } from "react";
import { SignupForm } from "@/features/auth-forms";
import { Skeleton } from "@alkok/ui";

function AuthCardSkeleton() {
  return (
    <div
      role="status"
      aria-label="회원가입 화면 불러오는 중"
      className="w-full max-w-md space-y-4 rounded-xl border border-border bg-card p-6"
    >
      <Skeleton className="h-7 w-32" />
      <Skeleton className="h-4 w-60" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
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

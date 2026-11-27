import { Suspense } from "react";
import { AdminLoginForm } from "@/features/admin-auth";
import { Skeleton } from "@alkok/ui";

function AdminLoginSkeleton() {
  return (
    <div
      role="status"
      aria-label="관리자 로그인 화면 불러오는 중"
      className="w-full max-w-md space-y-4 rounded-xl border border-transparent bg-surface-sunken p-6 dark:border-border"
    >
      <div className="space-y-1.5">
        <Skeleton className="h-7 w-28" />
        <Skeleton className="h-4 w-64" />
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
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-6xl flex-col items-center justify-start bg-background px-6 pt-16 pb-12 sm:pt-[14vh]">
      <div className="mb-6 flex items-center gap-2 font-semibold text-foreground text-lg tracking-tight">
        <svg
          width="32"
          height="32"
          viewBox="0 0 64 64"
          fill="none"
          aria-hidden="true"
          className="h-8 w-8 shrink-0"
        >
          <rect width="64" height="64" rx="16" className="fill-primary" />
          <circle cx="32" cy="32" r="14" className="fill-primary-foreground" />
          <circle cx="32" cy="32" r="6" className="fill-status-valid-fg" />
        </svg>
        <span>Alkok Admin</span>
      </div>
      <Suspense fallback={<AdminLoginSkeleton />}>
        <AdminLoginForm />
      </Suspense>
    </div>
  );
}

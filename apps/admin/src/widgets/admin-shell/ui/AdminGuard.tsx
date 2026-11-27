"use client";

import { ShieldAlert } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { getWebUrl, selectIsAuthenticated, useAuthStore } from "@alkok/core";
import { Button, Card, CardContent, CardHeader, CardTitle, Skeleton } from "@alkok/ui";

export interface AdminGuardProps {
  children: ReactNode;
  onRedirectToLogin?: (url: string) => void;
}

export const AdminGuard = ({
  children,
  onRedirectToLogin,
}: AdminGuardProps) => {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const isAuthenticated = useAuthStore(selectIsAuthenticated);
  const isLoading = useAuthStore((s) => s.isLoading);
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      const normalized = !pathname || pathname === "/" ? "/" : pathname;
      const loginUrl = `/login?next=${encodeURIComponent(normalized)}`;
      if (onRedirectToLogin) {
        onRedirectToLogin(loginUrl);
      } else {
        router.replace(loginUrl);
      }
    }
  }, [isAuthenticated, isLoading, onRedirectToLogin, pathname, router]);

  if (isLoading) {
    return (
      <div
        role="status"
        aria-label="관리자 인증 확인 중"
        className="flex min-h-dvh bg-background text-foreground"
      >
        <aside
          aria-hidden="true"
          className="sticky top-0 hidden h-dvh w-60 shrink-0 flex-col border-e border-sidebar-border bg-sidebar lg:flex"
        >
          <div className="flex h-14 shrink-0 items-center justify-between border-b border-separator px-4">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-4 w-12" />
          </div>
          <div className="flex flex-1 flex-col gap-1 p-3">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-9 w-full rounded-lg" />
            ))}
          </div>
        </aside>
        <div className="flex min-w-0 flex-1 flex-col">
          <header
            aria-hidden="true"
            className="sticky top-0 z-30 flex h-14 items-center border-b border-border bg-card/95 px-6"
          >
            <div className="mx-auto flex w-full max-w-6xl items-center">
              <Skeleton className="h-5 w-36" />
            </div>
          </header>
          <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-6">
            <div className="flex flex-col gap-6">
              <div className="space-y-2">
                <Skeleton className="h-7 w-44" />
                <Skeleton className="h-4 w-72 max-w-full" />
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
            </div>
          </main>
        </div>
        <span className="sr-only">관리자 권한을 확인하고 있습니다.</span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="mx-auto flex min-h-dvh w-full max-w-6xl items-center justify-center px-6 py-12">
        <p className="text-sm text-muted-foreground">
          로그인 페이지로 이동 중입니다...
        </p>
      </div>
    );
  }

  if (user?.role !== "ADMIN") {
    return (
      <div className="mx-auto flex min-h-dvh w-full max-w-6xl items-center justify-center px-6 py-12">
        <Card className="w-full max-w-md border-status-expired-border">
          <CardHeader>
            <div className="flex items-center gap-2 text-status-expired-fg">
              <ShieldAlert className="h-5 w-5" strokeWidth={1.75} />
              <CardTitle>접근 권한이 없습니다 (403)</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <p className="text-sm text-muted-foreground">
              관리자(ADMIN) 계정으로만 접근할 수 있는 화면입니다.
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <Button
                type="button"
                size="sm"
                onClick={async () => {
                  await logout();
                  router.replace("/login");
                }}
              >
                다른 계정으로 로그인
              </Button>
              <Button asChild variant="outline" size="sm">
                <a href={getWebUrl()}>공개 웹으로 이동</a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
};

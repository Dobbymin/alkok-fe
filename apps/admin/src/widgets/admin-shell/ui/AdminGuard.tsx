"use client";

import { ShieldAlert } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { useAuth } from "@alkok/core";
import { Button, Card, CardContent, CardHeader, CardTitle, Skeleton } from "@alkok/ui";

export interface AdminGuardProps {
  children: ReactNode;
  onRedirectToLogin?: (url: string) => void;
}

export const AdminGuard = ({
  children,
  onRedirectToLogin,
}: AdminGuardProps) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      const normalized =
        !pathname || pathname === "/"
          ? "/admin"
          : pathname.startsWith("/admin")
            ? pathname
            : `/admin${pathname}`;
      const loginUrl = `/login?next=${encodeURIComponent(normalized)}`;
      if (onRedirectToLogin) {
        onRedirectToLogin(loginUrl);
      } else {
        // Cross-app redirect to apps/web (/login) outside basePath "/admin"
        // eslint-disable-next-line @next/next/no-location-assign-relative-destination
        window.location.assign(loginUrl);
      }
    }
  }, [isAuthenticated, isLoading, onRedirectToLogin, pathname]);

  if (isLoading) {
    return (
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-6 py-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-40 w-full" />
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
            <div>
              <Button asChild size="sm">
                {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
                <a href="/">홈으로 돌아가기</a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
};

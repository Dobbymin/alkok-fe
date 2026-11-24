"use client";

import { ShieldAlert } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { useAuth } from "@/shared/auth";
import { Button, Card, CardContent, CardHeader, CardTitle, Skeleton } from "@/shared/ui";

export const AdminGuard = ({ children }: { children: ReactNode }) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      const nextPath = pathname || "/admin";
      router.replace(`/login?next=${encodeURIComponent(nextPath)}`);
    }
  }, [isAuthenticated, isLoading, pathname, router]);

  if (isLoading) {
    return (
      <div className="mx-auto flex max-w-4xl flex-col gap-4 p-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center p-4">
        <p className="text-sm text-muted-foreground">
          로그인 페이지로 이동 중입니다...
        </p>
      </div>
    );
  }

  if (user?.role !== "ADMIN") {
    return (
      <div className="flex min-h-[70vh] items-center justify-center p-4">
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
                <Link href="/">홈으로 돌아가기</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
};

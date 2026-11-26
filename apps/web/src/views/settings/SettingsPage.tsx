"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { SettingsForms } from "@/features/auth-forms";
import { selectIsAuthenticated, useAuthStore } from "@alkok/core";
import { Skeleton } from "@alkok/ui";

export default function SettingsPage() {
  const router = useRouter();
  const isAuthenticated = useAuthStore(selectIsAuthenticated);
  const isLoading = useAuthStore((s) => s.isLoading);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/login?next=/settings");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading || !isAuthenticated) {
    return (
      <div role="status" aria-label="계정 설정 불러오는 중" className="w-full py-8">
        <Skeleton className="h-64 w-full rounded-2xl" />
        <span className="sr-only">계정 설정을 불러오고 있습니다.</span>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-6 py-4">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">계정 설정</h1>
        <p className="text-sm text-muted-foreground">
          프로필 정보, 비밀번호 및 계정 상태를 관리합니다.
        </p>
      </header>
      <SettingsForms />
    </div>
  );
}

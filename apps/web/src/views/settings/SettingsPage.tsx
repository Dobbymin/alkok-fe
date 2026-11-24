"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { SettingsForms } from "@/features/auth-forms";
import { useAuth } from "@alkok/core";

export default function SettingsPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/login?next=/settings");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading || !isAuthenticated) {
    return (
      <div className="mx-auto max-w-2xl py-8">
        <div className="h-64 rounded-lg bg-muted/40" />
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6 py-4">
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

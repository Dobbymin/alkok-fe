"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@alkok/ui";
import { authApi } from "../api/auth.api";
import { useResendVerificationMutation } from "../model/useAuthMutations";

export const VerifyEmailPanel = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email") ?? "";

  const [status, setStatus] = useState<"idle" | "verifying" | "verified" | "error">(
    token ? "verifying" : "idle",
  );
  const [cooldown, setCooldown] = useState(0);
  const resendMutation = useResendVerificationMutation();

  useEffect(() => {
    if (!token) return;
    let active = true;
    authApi
      .verifyEmail(token)
      .then(() => {
        if (!active) return;
        setStatus("verified");
        window.setTimeout(() => router.replace("/login"), 1200);
      })
      .catch(() => {
        if (!active) return;
        setStatus("error");
      });
    return () => {
      active = false;
    };
  }, [token, router]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = window.setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => window.clearTimeout(t);
  }, [cooldown]);

  const handleResend = async () => {
    if (cooldown > 0 || !email) return;
    await resendMutation.mutateAsync(email);
    setCooldown(60);
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>이메일 인증</CardTitle>
        <CardDescription>
          {status === "verifying"
            ? "인증 토큰을 확인하고 있습니다..."
            : status === "verified"
              ? "이메일 인증이 완료되었습니다! 로그인 페이지로 이동합니다."
              : status === "error"
                ? "인증 토큰이 유효하지 않거나 만료되었습니다."
                : "입력하신 이메일로 인증 링크를 발송했습니다. 메일함을 확인해 주세요."}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {email ? (
          <Button
            variant="outline"
            disabled={cooldown > 0 || resendMutation.isPending}
            onClick={handleResend}
          >
            {cooldown > 0
              ? `인증 메일 재발송 (${cooldown}초)`
              : "인증 메일 재발송"}
          </Button>
        ) : null}
        <Button asChild variant="secondary">
          <Link href="/login">로그인으로 이동</Link>
        </Button>
      </CardContent>
    </Card>
  );
};

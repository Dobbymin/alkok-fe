"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { ApiError } from "@/shared/api";
import { sanitizeNextPath } from "@/shared/lib";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  FieldGroup,
  Input,
} from "@/shared/ui";
import {
  useLoginMutation,
  useResendVerificationMutation,
} from "../model/useAuthMutations";

export const LoginForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = sanitizeNextPath(searchParams.get("next"));

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [needsVerify, setNeedsVerify] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  const loginMutation = useLoginMutation();
  const resendMutation = useResendVerificationMutation();

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = window.setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [cooldown]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setNeedsVerify(false);
    try {
      await loginMutation.mutateAsync({ email: email.trim(), password });
      router.replace(nextPath);
    } catch (err) {
      if (err instanceof ApiError && err.errorCode === "AUTH_EMAIL_NOT_VERIFIED") {
        setNeedsVerify(true);
        setErrorMsg("이메일 인증 완료 후 로그인할 수 있습니다.");
      } else {
        setErrorMsg(
          err instanceof Error ? err.message : "로그인에 실패했습니다.",
        );
      }
    }
  };

  const handleResend = async () => {
    if (cooldown > 0 || !email.trim()) return;
    await resendMutation.mutateAsync(email.trim());
    setCooldown(60);
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>로그인</CardTitle>
        <CardDescription>알콕(Alkok) 계정으로 로그인하세요.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <FieldGroup
            htmlFor="login-email"
            label="이메일"
            required
            error={errorMsg ?? undefined}
            errorId="login-error"
          >
            <Input
              id="login-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-describedby={errorMsg ? "login-error" : undefined}
              required
            />
          </FieldGroup>

          <FieldGroup htmlFor="login-password" label="비밀번호" required>
            <Input
              id="login-password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </FieldGroup>

          {needsVerify ? (
            <div className="rounded-md border border-status-review-border bg-status-review-bg p-3 text-xs">
              <p className="font-medium text-status-review-fg">
                이메일 인증이 필요합니다.
              </p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-2"
                disabled={cooldown > 0 || resendMutation.isPending}
                onClick={handleResend}
              >
                {cooldown > 0
                  ? `인증 메일 재발송 (${cooldown}초)`
                  : "인증 메일 재발송"}
              </Button>
            </div>
          ) : null}

          <Button type="submit" disabled={loginMutation.isPending}>
            {loginMutation.isPending ? "로그인 중..." : "로그인"}
          </Button>

          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <Link href="/signup" className="hover:text-foreground hover:underline">
              회원가입
            </Link>
            <Link
              href="/reset-password"
              className="hover:text-foreground hover:underline"
            >
              비밀번호 찾기
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

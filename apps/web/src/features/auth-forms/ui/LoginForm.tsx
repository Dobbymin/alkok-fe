"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { ApiError, sanitizeNextPath } from "@alkok/core";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  FieldGroup,
  Input,
  toast,
} from "@alkok/ui";
import { loginSchema, type LoginFormValues } from "../model/auth-forms.schema";
import {
  useLoginMutation,
  useResendVerificationMutation,
} from "../model/useAuthMutations";

export const LoginForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = sanitizeNextPath(searchParams.get("next"));

  const [serverError, setServerError] = useState<string | null>(null);
  const [needsVerify, setNeedsVerify] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  const loginMutation = useLoginMutation();
  const resendMutation = useResendVerificationMutation();

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = window.setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [cooldown]);

  const onSubmit = async (values: LoginFormValues) => {
    setServerError(null);
    setNeedsVerify(false);
    try {
      await loginMutation.mutateAsync({
        email: values.email.trim(),
        password: values.password,
      });
      router.replace(nextPath);
    } catch (err) {
      if (err instanceof ApiError && err.errorCode === "AUTH_EMAIL_NOT_VERIFIED") {
        const message = "이메일 인증 완료 후 로그인할 수 있습니다.";
        setNeedsVerify(true);
        setServerError(message);
        toast.error(message);
      } else {
        const message =
          err instanceof Error ? err.message : "로그인에 실패했습니다.";
        setServerError(message);
        toast.error(message);
      }
    }
  };

  const handleResend = async () => {
    const email = getValues("email").trim();
    if (cooldown > 0 || !email) return;
    await resendMutation.mutateAsync(email);
    setCooldown(60);
  };

  return (
    <Card variant="surface" className="w-full max-w-md">
      <CardHeader>
        <CardTitle as="h1" className="text-xl">
          로그인
        </CardTitle>
        <CardDescription>알콕(Alkok) 계정으로 로그인하세요.</CardDescription>
      </CardHeader>
      <CardContent>
        <form noValidate onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <FieldGroup
            htmlFor="login-email"
            label="이메일"
            required
            error={errors.email?.message}
            errorId="login-email-error"
          >
            <Input
              id="login-email"
              type="email"
              autoComplete="email"
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? "login-email-error" : undefined}
              {...register("email")}
            />
          </FieldGroup>

          <FieldGroup
            htmlFor="login-password"
            label="비밀번호"
            required
            error={errors.password?.message}
            errorId="login-password-error"
          >
            <Input
              id="login-password"
              type="password"
              autoComplete="current-password"
              aria-invalid={Boolean(errors.password)}
              aria-describedby={
                errors.password ? "login-password-error" : undefined
              }
              {...register("password")}
            />
          </FieldGroup>

          {serverError && !needsVerify ? (
            <p
              role="alert"
              className="rounded-md border border-status-expired-border bg-status-expired-bg px-3 py-2 text-xs text-status-expired-fg"
            >
              {serverError}
            </p>
          ) : null}

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

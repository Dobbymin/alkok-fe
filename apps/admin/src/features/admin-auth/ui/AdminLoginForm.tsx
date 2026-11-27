"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  getWebUrl,
  sanitizeNextPath,
  selectIsAuthenticated,
  useAuthStore,
} from "@alkok/core";
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
import {
  adminLoginSchema,
  type AdminLoginFormValues,
  useAdminLoginMutation,
} from "../model";

function resolveSafeAdminNextPath(rawNext: string | null): string {
  const sanitized = sanitizeNextPath(rawNext);
  if (
    sanitized === "/login" ||
    sanitized.startsWith("/login/") ||
    sanitized.startsWith("/login?")
  ) {
    return "/";
  }
  return sanitized;
}

export const AdminLoginForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = resolveSafeAdminNextPath(searchParams.get("next"));

  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore(selectIsAuthenticated);
  const isLoading = useAuthStore((s) => s.isLoading);

  const [serverError, setServerError] = useState<string | null>(null);
  const loginMutation = useAdminLoginMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AdminLoginFormValues>({
    resolver: zodResolver(adminLoginSchema),
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    if (!isLoading && isAuthenticated && user?.role === "ADMIN") {
      router.replace(nextPath);
    }
  }, [isAuthenticated, isLoading, nextPath, router, user?.role]);

  const onSubmit = async (values: AdminLoginFormValues) => {
    setServerError(null);
    try {
      await loginMutation.mutateAsync({
        email: values.email.trim(),
        password: values.password,
      });
      router.replace(nextPath);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "로그인에 실패했습니다.";
      setServerError(message);
      toast.error(message);
    }
  };

  return (
    <Card variant="surface" className="w-full max-w-md">
      <CardHeader>
        <CardTitle as="h1" className="text-xl">
          관리자 로그인
        </CardTitle>
        <CardDescription>
          알콕(Alkok) 운영 콘솔은 관리자 계정으로만 접속할 수 있습니다.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          noValidate
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          <FieldGroup
            htmlFor="admin-login-email"
            label="이메일"
            required
            error={errors.email?.message}
            errorId="admin-login-email-error"
          >
            <Input
              id="admin-login-email"
              type="email"
              autoComplete="email"
              aria-invalid={Boolean(errors.email)}
              aria-describedby={
                errors.email ? "admin-login-email-error" : undefined
              }
              {...register("email")}
            />
          </FieldGroup>

          <FieldGroup
            htmlFor="admin-login-password"
            label="비밀번호"
            required
            error={errors.password?.message}
            errorId="admin-login-password-error"
          >
            <Input
              id="admin-login-password"
              type="password"
              autoComplete="current-password"
              aria-invalid={Boolean(errors.password)}
              aria-describedby={
                errors.password ? "admin-login-password-error" : undefined
              }
              {...register("password")}
            />
          </FieldGroup>

          {serverError ? (
            <p
              role="alert"
              className="rounded-md border border-status-expired-border bg-status-expired-bg px-3 py-2 text-xs text-status-expired-fg"
            >
              {serverError}
            </p>
          ) : null}

          <Button type="submit" disabled={loginMutation.isPending}>
            {loginMutation.isPending ? "로그인 중..." : "로그인"}
          </Button>

          <div className="flex items-center justify-end text-xs text-muted-foreground">
            <a href={getWebUrl()} className="hover:text-foreground hover:underline">
              공개 웹으로 이동
            </a>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

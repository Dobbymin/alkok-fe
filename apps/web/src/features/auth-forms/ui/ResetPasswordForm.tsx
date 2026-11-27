"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
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
import { authApi } from "../api/auth.api";
import {
  resetPasswordConfirmSchema,
  resetPasswordRequestSchema,
  type ResetPasswordConfirmFormValues,
  type ResetPasswordRequestFormValues,
} from "../model/auth-forms.schema";

export const ResetPasswordForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [isPending, setIsPending] = useState(false);

  const requestForm = useForm<ResetPasswordRequestFormValues>({
    resolver: zodResolver(resetPasswordRequestSchema),
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: { email: "" },
  });

  const confirmForm = useForm<ResetPasswordConfirmFormValues>({
    resolver: zodResolver(resetPasswordConfirmSchema),
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: { newPassword: "" },
  });

  const handleRequest = async (values: ResetPasswordRequestFormValues) => {
    setIsPending(true);
    try {
      await authApi.requestPasswordReset(values.email.trim());
      toast.success("비밀번호 재설정 링크를 발송했습니다.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "요청에 실패했습니다.");
    } finally {
      setIsPending(false);
    }
  };

  const handleConfirm = async (values: ResetPasswordConfirmFormValues) => {
    if (!token) return;
    setIsPending(true);
    try {
      await authApi.confirmPasswordReset({
        token,
        newPassword: values.newPassword,
      });
      toast.success("비밀번호가 재설정되었습니다.");
      router.replace("/login");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "재설정에 실패했습니다.");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Card variant="surface" className="w-full max-w-md">
      <CardHeader>
        <CardTitle as="h1" className="text-xl">
          비밀번호 재설정
        </CardTitle>
        <CardDescription>
          {token
            ? "새 비밀번호를 입력해 주세요."
            : "가입하신 이메일로 재설정 링크를 보내드립니다."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {token ? (
          <form
            noValidate
            onSubmit={confirmForm.handleSubmit(handleConfirm)}
            className="flex flex-col gap-4"
          >
            <FieldGroup
              htmlFor="reset-new-pw"
              label="새 비밀번호"
              required
              hint="8자 이상 입력해 주세요."
              error={confirmForm.formState.errors.newPassword?.message}
              errorId="reset-new-pw-error"
            >
              <Input
                id="reset-new-pw"
                type="password"
                autoComplete="new-password"
                aria-invalid={Boolean(confirmForm.formState.errors.newPassword)}
                aria-describedby={
                  confirmForm.formState.errors.newPassword
                    ? "reset-new-pw-error"
                    : undefined
                }
                {...confirmForm.register("newPassword")}
              />
            </FieldGroup>
            <Button type="submit" disabled={isPending}>
              {isPending ? "변경 중..." : "새 비밀번호 확정"}
            </Button>
          </form>
        ) : (
          <form
            noValidate
            onSubmit={requestForm.handleSubmit(handleRequest)}
            className="flex flex-col gap-4"
          >
            <FieldGroup
              htmlFor="reset-email"
              label="이메일"
              required
              error={requestForm.formState.errors.email?.message}
              errorId="reset-email-error"
            >
              <Input
                id="reset-email"
                type="email"
                autoComplete="email"
                aria-invalid={Boolean(requestForm.formState.errors.email)}
                aria-describedby={
                  requestForm.formState.errors.email
                    ? "reset-email-error"
                    : undefined
                }
                {...requestForm.register("email")}
              />
            </FieldGroup>
            <Button type="submit" disabled={isPending}>
              {isPending ? "발송 중..." : "재설정 메일 발송"}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
};

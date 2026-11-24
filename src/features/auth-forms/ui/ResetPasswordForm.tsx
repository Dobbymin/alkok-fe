"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
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
import { authApi } from "../api/auth.api";

export const ResetPasswordForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isPending, setIsPending] = useState(false);

  const handleRequest = async (e: FormEvent) => {
    e.preventDefault();
    setIsPending(true);
    try {
      await authApi.requestPasswordReset(email.trim());
      toast.success("비밀번호 재설정 링크를 발송했습니다.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "요청에 실패했습니다.");
    } finally {
      setIsPending(false);
    }
  };

  const handleConfirm = async (e: FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setIsPending(true);
    try {
      await authApi.confirmPasswordReset({ token, newPassword });
      toast.success("비밀번호가 재설정되었습니다.");
      router.replace("/login");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "재설정에 실패했습니다.");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>비밀번호 재설정</CardTitle>
        <CardDescription>
          {token
            ? "새 비밀번호를 입력해 주세요."
            : "가입하신 이메일로 재설정 링크를 보내드립니다."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {token ? (
          <form onSubmit={handleConfirm} className="flex flex-col gap-4">
            <FieldGroup htmlFor="reset-new-pw" label="새 비밀번호" required>
              <Input
                id="reset-new-pw"
                type="password"
                minLength={8}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </FieldGroup>
            <Button type="submit" disabled={isPending}>
              {isPending ? "변경 중..." : "새 비밀번호 확정"}
            </Button>
          </form>
        ) : (
          <form onSubmit={handleRequest} className="flex flex-col gap-4">
            <FieldGroup htmlFor="reset-email" label="이메일" required>
              <Input
                id="reset-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
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

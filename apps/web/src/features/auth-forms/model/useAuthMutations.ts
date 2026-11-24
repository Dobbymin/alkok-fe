"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAuth } from "@alkok/core";
import { authApi } from "../api/auth.api";

export function useLoginMutation() {
  const { setSession } = useAuth();
  return useMutation({
    mutationFn: (payload: { email: string; password: string }) =>
      authApi.login(payload),
    onSuccess: (res) => {
      setSession(res.data.accessToken, res.data.user);
      toast.success("로그인되었습니다.");
    },
  });
}

export function useSignupMutation() {
  return useMutation({
    mutationFn: (payload: { email: string; password: string; nickname: string }) =>
      authApi.signup(payload),
    onSuccess: () => {
      toast.success("인증 메일을 발송했습니다.");
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : "회원가입에 실패했습니다.");
    },
  });
}

export function useResendVerificationMutation() {
  return useMutation({
    mutationFn: (email: string) => authApi.resendVerification(email),
    onSuccess: () => {
      toast.success("인증 메일을 다시 발송했습니다.");
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : "메일 재발송에 실패했습니다.");
    },
  });
}

export function useDeleteAccountMutation() {
  const { clearSession } = useAuth();
  return useMutation({
    mutationFn: () => authApi.deleteAccount(),
    onSuccess: () => {
      clearSession();
      toast.success("회원 탈퇴가 완료되었습니다.");
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : "회원 탈퇴에 실패했습니다.");
    },
  });
}

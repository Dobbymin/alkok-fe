"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { syncLocalVaultToServer, useLocalVaultStore } from "@/entities/vault";
import { useAuthStore } from "@alkok/core";
import { toast } from "@alkok/ui";
import { authApi } from "../api/auth.api";

export function useLoginMutation() {
  const queryClient = useQueryClient();
  const setSession = useAuthStore((s) => s.setSession);
  return useMutation({
    mutationFn: (payload: { email: string; password: string }) =>
      authApi.login(payload),
    onSuccess: async (res) => {
      setSession(res.data.accessToken, res.data.user);
      toast.success("로그인되었습니다.");

      try {
        await useLocalVaultStore.persist.rehydrate();
        if (useLocalVaultStore.getState().items.length > 0) {
          const result = await syncLocalVaultToServer(queryClient);
          if (result.syncedCount > 0) {
            toast.success(
              `로컬 보관함 ${result.syncedCount}건을 서버 보관함에 동기화했습니다.`,
            );
          }
        }
      } catch {
        // Keep local items intact if sync fails transiently
      }
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
  const clearSession = useAuthStore((s) => s.clearSession);
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

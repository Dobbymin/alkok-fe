"use client";

import { useMutation } from "@tanstack/react-query";
import { ApiError, useAuthStore } from "@alkok/core";
import { adminAuthApi, type AdminLoginPayload } from "../api";

export function useAdminLoginMutation() {
  return useMutation({
    mutationFn: async (payload: AdminLoginPayload) => {
      const res = await adminAuthApi.login(payload);
      if (res.data.user.role !== "ADMIN") {
        await useAuthStore.getState().logout();
        throw new ApiError({
          statusCode: 403,
          errorCode: "FORBIDDEN_ADMIN_ONLY",
          message: "관리자(ADMIN) 계정으로만 로그인할 수 있습니다.",
        });
      }
      useAuthStore.getState().setSession(res.data.accessToken, res.data.user);
      return res.data;
    },
  });
}

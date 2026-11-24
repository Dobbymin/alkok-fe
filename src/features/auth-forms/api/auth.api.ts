import { apiClient } from "@/shared/api";
import type { ApiEnvelope, UserProfile } from "@/shared/types";

export const authApi = {
  signup(payload: { email: string; password: string; nickname: string }) {
    return apiClient.post<ApiEnvelope<{ message: string }>>(
      "/api/v1/auth/signup",
      payload,
      { skipAuthRefresh: true },
    );
  },
  verifyEmail(token: string) {
    return apiClient.post<ApiEnvelope<{ verified: boolean }>>(
      "/api/v1/auth/verify-email",
      { token },
      { skipAuthRefresh: true },
    );
  },
  resendVerification(email: string) {
    return apiClient.post<ApiEnvelope<{ sent: boolean }>>(
      "/api/v1/auth/resend-verification",
      { email },
      { skipAuthRefresh: true },
    );
  },
  login(payload: { email: string; password: string }) {
    return apiClient.post<ApiEnvelope<{ accessToken: string; user: UserProfile }>>(
      "/api/v1/auth/login",
      payload,
      { skipAuthRefresh: true },
    );
  },
  requestPasswordReset(email: string) {
    return apiClient.post<ApiEnvelope<{ sent: boolean }>>(
      "/api/v1/auth/password-reset/request",
      { email },
      { skipAuthRefresh: true },
    );
  },
  confirmPasswordReset(payload: { token: string; newPassword: string }) {
    return apiClient.post<ApiEnvelope<{ reset: boolean }>>(
      "/api/v1/auth/password-reset/confirm",
      payload,
      { skipAuthRefresh: true },
    );
  },
  updateProfile(nickname: string) {
    return apiClient.patch<ApiEnvelope<UserProfile>>("/api/v1/users/me/profile", {
      nickname,
    });
  },
  updateInterests(categorySlugs: string[]) {
    return apiClient.put<ApiEnvelope<UserProfile>>("/api/v1/users/me/interests", {
      categorySlugs,
    });
  },
  updatePassword(payload: { currentPassword: string; newPassword: string }) {
    return apiClient.patch<void>("/api/v1/users/me/password", payload);
  },
  deleteAccount() {
    return apiClient.delete<void>("/api/v1/users/me");
  },
};

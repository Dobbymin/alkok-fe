import { apiClient, type ApiEnvelope, type UserProfile } from "@alkok/core";

export interface AdminLoginPayload {
  email: string;
  password: string;
}

export interface AdminLoginResponse {
  accessToken: string;
  user: UserProfile;
}

export const adminAuthApi = {
  login(payload: AdminLoginPayload) {
    return apiClient.post<ApiEnvelope<AdminLoginResponse>>(
      "/api/v1/auth/login",
      payload,
      { skipAuthRefresh: true },
    );
  },
};

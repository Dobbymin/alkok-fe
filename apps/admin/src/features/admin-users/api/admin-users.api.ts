import { apiClient } from "@alkok/core";
import type { ApiEnvelope, UserProfile, UserRole, UserStatus } from "@alkok/core";

export interface AdminUserListParams {
  q?: string;
  page?: number;
  limit?: number;
}

export const adminUsersApi = {
  list(params: AdminUserListParams = {}) {
    return apiClient.get<ApiEnvelope<UserProfile[]>>("/api/v1/admin/users", {
      params: {
        q: params.q || undefined,
        page: params.page ?? 1,
        limit: params.limit ?? 20,
      },
    });
  },
  updateRole(id: string, role: UserRole) {
    return apiClient.patch<ApiEnvelope<UserProfile>>(
      `/api/v1/admin/users/${id}/role`,
      { role },
    );
  },
  updateStatus(id: string, status: Extract<UserStatus, "ACTIVE" | "SUSPENDED">) {
    return apiClient.patch<ApiEnvelope<UserProfile>>(
      `/api/v1/admin/users/${id}/status`,
      { status },
    );
  },
};

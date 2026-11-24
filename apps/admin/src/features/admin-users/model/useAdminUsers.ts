"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ADMIN_QUERY_KEYS } from "@alkok/core";
import type { UserRole, UserStatus } from "@alkok/core";
import { adminUsersApi, type AdminUserListParams } from "../api/admin-users.api";

export function useAdminUsersList(params: AdminUserListParams) {
  return useQuery({
    queryKey: ADMIN_QUERY_KEYS.list("users", { ...params }),
    queryFn: () => adminUsersApi.list(params),
  });
}

export function useUpdateAdminUserRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, role }: { id: string; role: UserRole }) =>
      adminUsersApi.updateRole(id, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_QUERY_KEYS.all() });
      toast.success("회원 역할이 변경되었습니다.");
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : "역할 변경에 실패했습니다.");
    },
  });
}

export function useUpdateAdminUserStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: string;
      status: Extract<UserStatus, "ACTIVE" | "SUSPENDED">;
    }) => adminUsersApi.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_QUERY_KEYS.all() });
      toast.success("계정 상태가 변경되었습니다.");
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : "상태 변경에 실패했습니다.");
    },
  });
}

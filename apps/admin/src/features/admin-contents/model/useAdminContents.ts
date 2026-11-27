"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ADMIN_QUERY_KEYS,
  GUIDE_QUERY_KEYS,
  NEWS_QUERY_KEYS,
  TOOL_QUERY_KEYS,
} from "@alkok/core";
import { toast } from "@alkok/ui";
import {
  adminContentsApi,
  type AdminContentCreatePayload,
  type AdminContentListParams,
} from "../api/admin-contents.api";

function invalidateAllContentCaches(queryClient: ReturnType<typeof useQueryClient>) {
  queryClient.invalidateQueries({ queryKey: ADMIN_QUERY_KEYS.all() });
  queryClient.invalidateQueries({ queryKey: GUIDE_QUERY_KEYS.all() });
  queryClient.invalidateQueries({ queryKey: TOOL_QUERY_KEYS.all() });
  queryClient.invalidateQueries({ queryKey: NEWS_QUERY_KEYS.all() });
}

export function useAdminContentsList(params: AdminContentListParams) {
  return useQuery({
    queryKey: ADMIN_QUERY_KEYS.list("contents", { ...params }),
    queryFn: () => adminContentsApi.list(params),
  });
}

export function useCreateAdminContent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: AdminContentCreatePayload) =>
      adminContentsApi.create(payload),
    onSuccess: () => {
      invalidateAllContentCaches(queryClient);
      toast.success("콘텐츠가 등록되었습니다.");
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : "콘텐츠 등록에 실패했습니다.");
    },
  });
}

export function useUpdateAdminContent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: Partial<AdminContentCreatePayload>;
    }) => adminContentsApi.update(id, payload),
    onSuccess: () => {
      invalidateAllContentCaches(queryClient);
      toast.success("콘텐츠가 수정되었습니다.");
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : "콘텐츠 수정에 실패했습니다.");
    },
  });
}

export function useVerifyAdminContent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminContentsApi.verify(id),
    onSuccess: () => {
      invalidateAllContentCaches(queryClient);
      toast.success("확인 완료 처리되었습니다.");
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : "확인 완료 처리에 실패했습니다.");
    },
  });
}

export function useArchiveAdminContent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminContentsApi.archive(id),
    onSuccess: () => {
      invalidateAllContentCaches(queryClient);
      toast.success("콘텐츠가 보관(ARCHIVED) 처리되었습니다.");
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : "보관 처리에 실패했습니다.");
    },
  });
}

export function useDeleteAdminContent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminContentsApi.remove(id),
    onSuccess: () => {
      invalidateAllContentCaches(queryClient);
      toast.success("콘텐츠가 삭제되었습니다.");
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : "콘텐츠 삭제에 실패했습니다.");
    },
  });
}

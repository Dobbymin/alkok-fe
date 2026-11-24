"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  ADMIN_QUERY_KEYS,
  GUIDE_QUERY_KEYS,
  NEWS_QUERY_KEYS,
  TOOL_QUERY_KEYS,
} from "@/shared/api";
import { adminInboxApi, type InboxDraftPatch } from "../api/admin-inbox.api";

export function useAdminInboxList() {
  return useQuery({
    queryKey: ADMIN_QUERY_KEYS.list("inbox"),
    queryFn: () => adminInboxApi.list(),
  });
}

export function useAdminInboxDetail(id: string | null) {
  return useQuery({
    queryKey: ADMIN_QUERY_KEYS.detail("inbox", id ?? "none"),
    queryFn: () => adminInboxApi.getDetail(id as string),
    enabled: Boolean(id),
  });
}

export function useManualUrlIngest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (url: string) => adminInboxApi.manualUrl(url),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_QUERY_KEYS.all() });
      toast.success("URL 수집 및 AI 초안 생성이 요청되었습니다.");
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : "URL 수동 투입에 실패했습니다.");
    },
  });
}

export function useApproveInboxItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: InboxDraftPatch }) =>
      adminInboxApi.approve(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_QUERY_KEYS.all() });
      queryClient.invalidateQueries({ queryKey: GUIDE_QUERY_KEYS.all() });
      queryClient.invalidateQueries({ queryKey: TOOL_QUERY_KEYS.all() });
      queryClient.invalidateQueries({ queryKey: NEWS_QUERY_KEYS.all() });
      toast.success("승인 및 즉시 공개 처리되었습니다.");
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : "승인 처리에 실패했습니다.");
    },
  });
}

export function useSaveInboxDraft() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: InboxDraftPatch }) =>
      adminInboxApi.saveDraft(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_QUERY_KEYS.all() });
      toast.success("초안이 임시 저장되었습니다.");
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : "임시 저장에 실패했습니다.");
    },
  });
}

export function useRejectInboxItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) =>
      adminInboxApi.reject(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_QUERY_KEYS.all() });
      toast.success("반려 처리되었습니다.");
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : "반려 처리에 실패했습니다.");
    },
  });
}

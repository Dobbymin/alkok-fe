"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ADMIN_QUERY_KEYS } from "@alkok/core";
import { toast } from "@alkok/ui";
import { adminSourcesApi, type SourcePayload } from "../api/admin-sources.api";

export function useAdminSourcesList() {
  return useQuery({
    queryKey: ADMIN_QUERY_KEYS.list("sources"),
    queryFn: () => adminSourcesApi.list(),
  });
}

export function useAdminJobsList() {
  return useQuery({
    queryKey: ADMIN_QUERY_KEYS.list("jobs"),
    queryFn: () => adminSourcesApi.listJobs(),
  });
}

export function useCreateAdminSource() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: SourcePayload) => adminSourcesApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_QUERY_KEYS.all() });
      toast.success("수집 출처가 등록되었습니다.");
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : "출처 등록에 실패했습니다.");
    },
  });
}

export function useUpdateAdminSource() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: Partial<SourcePayload>;
    }) => adminSourcesApi.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_QUERY_KEYS.all() });
      toast.success("출처 설정이 저장되었습니다.");
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : "출처 수정에 실패했습니다.");
    },
  });
}

export function useDeleteAdminSource() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminSourcesApi.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_QUERY_KEYS.all() });
      toast.success("출처가 삭제되었습니다.");
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : "출처 삭제에 실패했습니다.");
    },
  });
}

export function useTriggerSourceFetch() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminSourcesApi.triggerFetch(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_QUERY_KEYS.all() });
      toast.success("수집 작업(Job)이 대기열에 등록되었습니다.");
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : "즉시 수집 실행에 실패했습니다.");
    },
  });
}

"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ADMIN_QUERY_KEYS } from "@/shared/api";
import type { ReportStatus } from "@/shared/types";
import { adminReportsApi } from "../api/admin-reports.api";

export const useAdminReportsQuery = (status?: ReportStatus) =>
  useQuery({
    queryKey: ADMIN_QUERY_KEYS.list("reports", { status }),
    queryFn: () => adminReportsApi.listReports(status),
  });

export const useUpdateAdminReportMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      status,
      resolutionMemo,
    }: {
      id: string;
      status: ReportStatus;
      resolutionMemo?: string;
    }) => adminReportsApi.updateReport(id, { status, resolutionMemo }),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ADMIN_QUERY_KEYS.all() });
    },
  });
};

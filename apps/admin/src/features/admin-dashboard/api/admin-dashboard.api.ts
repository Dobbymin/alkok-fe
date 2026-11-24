import { apiClient } from "@alkok/core";
import type { ApiEnvelope } from "@alkok/core";

export interface AdminDashboardStats {
  pendingInboxCount: number;
  staleContentCount: number;
  openReportCount: number;
  failedJobs24hCount: number;
}

export const adminDashboardApi = {
  getSummary: () =>
    apiClient.get<ApiEnvelope<AdminDashboardStats>>("/api/v1/admin/dashboard"),
};

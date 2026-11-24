import { apiClient } from "@alkok/core";
import type { ApiEnvelope, ReportReason, ReportStatus } from "@alkok/core";

export interface AdminReportItem {
  id: string;
  contentId: string;
  contentTitle?: string | null;
  contentSlug?: string | null;
  reason: ReportReason;
  detail: string;
  reporterEmail?: string | null;
  status: ReportStatus;
  resolutionMemo?: string | null;
  createdAt: string;
  resolvedAt?: string | null;
}

export const adminReportsApi = {
  listReports: (status?: ReportStatus) =>
    apiClient.get<ApiEnvelope<AdminReportItem[]>>("/api/v1/admin/reports", {
      params: { status },
    }),

  updateReport: (
    id: string,
    input: { status: ReportStatus; resolutionMemo?: string },
  ) =>
    apiClient.patch<ApiEnvelope<AdminReportItem>>(
      `/api/v1/admin/reports/${id}`,
      input,
    ),
};

import { apiClient } from "@alkok/core";
import type { ApiEnvelope, ReportReason } from "@alkok/core";

export interface SubmitReportInput {
  reason: ReportReason;
  detail: string;
  reporterEmail?: string;
  website?: string;
}

export const reportApi = {
  submitReport: (contentId: string, input: SubmitReportInput) =>
    apiClient.post<ApiEnvelope<{ id: string }>>(
      `/api/v1/contents/${contentId}/reports`,
      input,
    ),
};

import { apiClient } from "@alkok/core";
import type { ApiEnvelope, JobStatus, JobType, SourceType } from "@alkok/core";

export interface SourceItem {
  id: string;
  name: string;
  feedUrl: string;
  sourceType: SourceType;
  fetchIntervalHours: number;
  isActive: boolean;
  lastFetchedAt?: string | null;
  lastError?: string | null;
}

export interface JobRunItem {
  id: string;
  type: JobType;
  status: JobStatus;
  attempts: number;
  maxAttempts: number;
  errorMessage?: string | null;
  startedAt?: string | null;
  finishedAt?: string | null;
  durationMs?: number | null;
  createdAt: string;
}

export interface SourcePayload {
  name: string;
  feedUrl: string;
  sourceType: SourceType;
  fetchIntervalHours: number;
  isActive?: boolean;
}

export const adminSourcesApi = {
  list() {
    return apiClient.get<ApiEnvelope<SourceItem[]>>("/api/v1/admin/sources");
  },
  create(payload: SourcePayload) {
    return apiClient.post<ApiEnvelope<SourceItem>>("/api/v1/admin/sources", payload);
  },
  update(id: string, payload: Partial<SourcePayload>) {
    return apiClient.patch<ApiEnvelope<SourceItem>>(
      `/api/v1/admin/sources/${id}`,
      payload,
    );
  },
  remove(id: string) {
    return apiClient.delete<void>(`/api/v1/admin/sources/${id}`);
  },
  triggerFetch(id: string) {
    return apiClient.post<ApiEnvelope<{ jobId: string }>>(
      `/api/v1/admin/sources/${id}/fetch`,
    );
  },
  listJobs() {
    return apiClient.get<ApiEnvelope<JobRunItem[]>>("/api/v1/admin/jobs", {
      params: { limit: 15 },
    });
  },
};

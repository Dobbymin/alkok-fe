import { apiClient } from "@alkok/core";
import type {
  ApiEnvelope,
  ContentSummary,
  ContentType,
  PublishStatus,
  SourceType,
  VerificationStatus,
} from "@alkok/core";

export interface InboxQueueItem {
  id: string;
  type: ContentType;
  title: string;
  summary: string;
  publishStatus: PublishStatus;
  verificationStatus: VerificationStatus;
  sourceType: SourceType;
  sourceUrl: string;
  sourceName?: string | null;
  unverifiedFields: string[];
  createdAt: string;
}

export interface InboxReviewDetail extends InboxQueueItem {
  rawTextExcerpt: string;
  evidenceNotes: string[];
  tags: string[];
  workImpact?: string | null;
  keyPoints?: string[];
  markdownBody?: string | null;
  pricingSummary?: string | null;
  overview?: string | null;
  compatibleAgents?: string[];
  installPrompt?: string | null;
  skillMdPreview?: string | null;
}

export interface InboxDraftPatch {
  title: string;
  summary: string;
  tags: string[];
  workImpact?: string;
  markdownBody?: string;
  pricingSummary?: string;
  overview?: string;
  installPrompt?: string;
  skillMdPreview?: string;
}

export const adminInboxApi = {
  list() {
    return apiClient.get<ApiEnvelope<InboxQueueItem[]>>("/api/v1/admin/inbox");
  },
  getDetail(id: string) {
    return apiClient.get<ApiEnvelope<InboxReviewDetail>>(
      `/api/v1/admin/inbox/${id}`,
    );
  },
  manualUrl(url: string) {
    return apiClient.post<ApiEnvelope<{ jobId: string; contentId?: string }>>(
      "/api/v1/admin/inbox/manual-url",
      { url },
    );
  },
  approve(id: string, payload: InboxDraftPatch) {
    return apiClient.post<ApiEnvelope<ContentSummary>>(
      `/api/v1/admin/inbox/${id}/approve`,
      payload,
    );
  },
  reject(id: string, reason?: string) {
    return apiClient.post<ApiEnvelope<ContentSummary>>(
      `/api/v1/admin/inbox/${id}/reject`,
      { reason },
    );
  },
  saveDraft(id: string, payload: InboxDraftPatch) {
    return apiClient.patch<ApiEnvelope<ContentSummary>>(
      `/api/v1/admin/contents/${id}`,
      payload,
    );
  },
};

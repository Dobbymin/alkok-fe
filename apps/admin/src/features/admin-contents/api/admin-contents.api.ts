import { apiClient } from "@alkok/core";
import type {
  ApiEnvelope,
  ContentSummary,
  ContentType,
  DifficultyLevel,
  KoreanSupportLevel,
  PricingModel,
  PublishStatus,
  SkillKind,
  SourceType,
  ToolKind,
  VerificationStatus,
} from "@alkok/core";

export interface AdminContentListParams {
  type?: ContentType | "";
  publishStatus?: PublishStatus | "";
  verificationStatus?: VerificationStatus | "";
  page?: number;
  limit?: number;
}

export interface AdminContentCreatePayload {
  type: ContentType;
  title: string;
  slug?: string;
  summary: string;
  publishStatus: PublishStatus;
  sourceType: SourceType;
  sourceUrl: string;
  sourceName?: string;
  categorySlugs?: string[];
  tagSlugs?: string[];
  // Guide fields
  difficulty?: DifficultyLevel;
  estimatedMinutes?: number;
  pricingModel?: PricingModel;
  markdownBody?: string;
  prompts?: Array<{ title: string; content: string; variables: string[] }>;
  cautions?: string;
  // Tool fields
  toolKind?: ToolKind;
  providerName?: string;
  officialUrl?: string;
  hasFreePlan?: boolean;
  pricingSummary?: string;
  koreanSupport?: KoreanSupportLevel;
  platforms?: string[];
  strengths?: string[];
  limitations?: string[];
  // News fields
  keyPoints?: string[];
  workImpact?: string;
  // Skill fields
  skillKind?: SkillKind;
  skillSlug?: string;
  authorName?: string;
  license?: string;
  repositoryUrl?: string;
  compatibleAgents?: string[];
  overview?: string;
  installPrompt?: string;
  useCases?: string[];
  tips?: string[];
}

export const adminContentsApi = {
  list(params: AdminContentListParams = {}) {
    return apiClient.get<ApiEnvelope<ContentSummary[]>>("/api/v1/admin/contents", {
      params: {
        type: params.type || undefined,
        publishStatus: params.publishStatus || undefined,
        verificationStatus: params.verificationStatus || undefined,
        page: params.page ?? 1,
        limit: params.limit ?? 20,
      },
    });
  },
  create(payload: AdminContentCreatePayload) {
    return apiClient.post<ApiEnvelope<ContentSummary>>(
      "/api/v1/admin/contents",
      payload,
    );
  },
  update(id: string, payload: Partial<AdminContentCreatePayload>) {
    return apiClient.patch<ApiEnvelope<ContentSummary>>(
      `/api/v1/admin/contents/${id}`,
      payload,
    );
  },
  verify(id: string) {
    return apiClient.post<ApiEnvelope<ContentSummary>>(
      `/api/v1/admin/contents/${id}/verify`,
    );
  },
  archive(id: string) {
    return apiClient.post<ApiEnvelope<ContentSummary>>(
      `/api/v1/admin/contents/${id}/archive`,
    );
  },
  remove(id: string) {
    return apiClient.delete<void>(`/api/v1/admin/contents/${id}`);
  },
};

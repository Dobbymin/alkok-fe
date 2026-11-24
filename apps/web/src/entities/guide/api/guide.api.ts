import { apiClient } from "@alkok/core";
import type {
  ApiEnvelope,
  ContentSummary,
  DifficultyLevel,
  GuideDetailData,
  PricingModel,
} from "@alkok/core";

export interface GuideListParams {
  workDomain?: string;
  aiUse?: string;
  difficulty?: DifficultyLevel | "";
  pricingModel?: PricingModel | "";
  sort?: "recommended" | "latest" | "helpful";
  page?: number;
  limit?: number;
}

export const guideApi = {
  list(params: GuideListParams = {}) {
    return apiClient.get<ApiEnvelope<ContentSummary[]>>("/api/v1/guides", {
      params: {
        workDomain: params.workDomain || undefined,
        aiUse: params.aiUse || undefined,
        difficulty: params.difficulty || undefined,
        pricingModel: params.pricingModel || undefined,
        sort: params.sort ?? "recommended",
        page: params.page ?? 1,
        limit: params.limit ?? 18,
      },
    });
  },
  getDetail(slug: string) {
    return apiClient.get<ApiEnvelope<GuideDetailData>>(`/api/v1/guides/${slug}`);
  },
};

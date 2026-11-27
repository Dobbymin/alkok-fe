import { apiClient } from "@alkok/core";
import type {
  ApiEnvelope,
  DifficultyLevel,
  PricingModel,
  SkillDetailData,
  SkillKind,
} from "@alkok/core";

export interface SkillListParams {
  skillKind?: SkillKind | "";
  agent?: string;
  difficulty?: DifficultyLevel | "";
  pricingModel?: PricingModel | "";
  workDomain?: string;
  aiUse?: string;
  validOnly?: boolean;
  sort?: "recommended" | "latest" | "helpful";
  page?: number;
  limit?: number;
}

export const skillApi = {
  list(params: SkillListParams = {}) {
    return apiClient.get<ApiEnvelope<SkillDetailData[]>>("/api/v1/skills", {
      params: {
        skillKind: params.skillKind || undefined,
        agent: params.agent || undefined,
        difficulty: params.difficulty || undefined,
        pricingModel: params.pricingModel || undefined,
        workDomain: params.workDomain || undefined,
        aiUse: params.aiUse || undefined,
        validOnly: params.validOnly ? "true" : undefined,
        sort: params.sort ?? "recommended",
        page: params.page ?? 1,
        limit: params.limit ?? 50,
      },
    });
  },
  getDetail(slug: string) {
    return apiClient.get<ApiEnvelope<SkillDetailData>>(`/api/v1/skills/${slug}`);
  },
};

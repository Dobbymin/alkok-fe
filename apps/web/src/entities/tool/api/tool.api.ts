import { apiClient } from "@alkok/core";
import type { ApiEnvelope, ToolDetailData, ToolKind } from "@alkok/core";

export interface ToolListParams {
  toolKind?: ToolKind | "";
  hasFreePlan?: boolean;
  koreanFull?: boolean;
  workDomain?: string;
  aiUse?: string;
  validOnly?: boolean;
  sort?: "recommended" | "latest" | "helpful";
  page?: number;
  limit?: number;
}

export const toolApi = {
  list(params: ToolListParams = {}) {
    return apiClient.get<ApiEnvelope<ToolDetailData[]>>("/api/v1/tools", {
      params: {
        toolKind: params.toolKind || undefined,
        hasFreePlan: params.hasFreePlan ? "true" : undefined,
        koreanSupport: params.koreanFull ? "FULL" : undefined,
        workDomain: params.workDomain || undefined,
        aiUse: params.aiUse || undefined,
        validOnly: params.validOnly ? "true" : undefined,
        sort: params.sort ?? "recommended",
        page: params.page ?? 1,
        limit: params.limit ?? 20,
      },
    });
  },
  getDetail(slug: string) {
    return apiClient.get<ApiEnvelope<ToolDetailData>>(`/api/v1/tools/${slug}`);
  },
  compare(slugs: string[]) {
    return apiClient.get<ApiEnvelope<ToolDetailData[]>>("/api/v1/tools/compare", {
      params: { slugs: slugs.join(",") },
    });
  },
};

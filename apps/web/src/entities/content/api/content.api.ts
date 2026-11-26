import { apiClient } from "@alkok/core";
import type { ApiEnvelope, ContentSummary, NewsDetailData, ToolDetailData } from "@alkok/core";

export interface HomeComparisonPreset {
  id: string;
  label: string;
  slugs: string[];
}

export interface HomeDataPayload {
  guides: ContentSummary[];
  tools: ToolDetailData[];
  news: NewsDetailData[];
  comparisonPresets?: HomeComparisonPreset[];
  recentVaultItems?: Array<{
    id: string;
    title: string;
    itemType: string;
    url?: string | null;
    contentSlug?: string | null;
    contentType?: string | null;
  }>;
}

export const contentApi = {
  getHome() {
    return apiClient.get<ApiEnvelope<HomeDataPayload>>("/api/v1/home");
  },
};

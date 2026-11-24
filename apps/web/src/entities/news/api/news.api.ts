import { apiClient } from "@alkok/core";
import type { ApiEnvelope, NewsDetailData } from "@alkok/core";

export interface NewsListParams {
  tag?: string;
  page?: number;
  limit?: number;
}

export const newsApi = {
  list(params: NewsListParams = {}) {
    return apiClient.get<ApiEnvelope<NewsDetailData[]>>("/api/v1/news", {
      params: {
        tag: params.tag || undefined,
        page: params.page ?? 1,
        limit: params.limit ?? 20,
      },
    });
  },
  getDetail(slug: string) {
    return apiClient.get<ApiEnvelope<NewsDetailData>>(`/api/v1/news/${slug}`);
  },
};

import { apiClient } from "@alkok/core";
import type { ApiEnvelope, ContentSummary, ContentType } from "@alkok/core";

export interface SearchSuggestItem {
  id: string;
  type: ContentType;
  slug: string;
  title: string;
}

export interface SearchParams {
  q: string;
  type?: ContentType | "VAULT" | "ALL";
  workDomain?: string;
  validOnly?: boolean;
  page?: number;
  limit?: number;
}

export interface SearchResponsePayload {
  items: ContentSummary[];
  vaultItems?: Array<{
    id: string;
    title: string;
    url?: string | null;
    memo?: string | null;
  }>;
}

export const searchApi = {
  suggest(q: string) {
    return apiClient.get<ApiEnvelope<SearchSuggestItem[]>>(
      "/api/v1/search/suggest",
      { params: { q } },
    );
  },
  search(params: SearchParams) {
    return apiClient.get<ApiEnvelope<SearchResponsePayload>>("/api/v1/search", {
      params: {
        q: params.q,
        type: params.type && params.type !== "ALL" ? params.type : undefined,
        workDomain: params.workDomain || undefined,
        validOnly: params.validOnly ? "true" : undefined,
        page: params.page ?? 1,
        limit: params.limit ?? 20,
      },
    });
  },
};

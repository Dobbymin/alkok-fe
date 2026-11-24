import { apiClient } from "@alkok/core";
import type { ApiEnvelope } from "@alkok/core";

export interface HelpfulResult {
  helpfulCount: number;
  isHelpful: boolean;
}

export const helpfulApi = {
  markHelpful: (contentId: string) =>
    apiClient.post<ApiEnvelope<HelpfulResult>>(
      `/api/v1/contents/${contentId}/helpful`,
    ),

  unmarkHelpful: (contentId: string) =>
    apiClient.delete<ApiEnvelope<HelpfulResult>>(
      `/api/v1/contents/${contentId}/helpful`,
    ),
};

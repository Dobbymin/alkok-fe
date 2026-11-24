"use client";

import { useQuery } from "@tanstack/react-query";
import { GUIDE_QUERY_KEYS } from "@alkok/core";
import { guideApi, type GuideListParams } from "../api/guide.api";

export function useGuidesList(params: GuideListParams) {
  return useQuery({
    queryKey: GUIDE_QUERY_KEYS.list({ ...params }),
    queryFn: () => guideApi.list(params),
  });
}

export function useGuideDetail(slug: string) {
  return useQuery({
    queryKey: GUIDE_QUERY_KEYS.detail(slug),
    queryFn: () => guideApi.getDetail(slug),
    enabled: Boolean(slug),
  });
}

"use client";

import { useQuery } from "@tanstack/react-query";
import { NEWS_QUERY_KEYS } from "@alkok/core";
import { newsApi, type NewsListParams } from "../api/news.api";

export function useNewsList(params: NewsListParams) {
  return useQuery({
    queryKey: NEWS_QUERY_KEYS.list({ ...params }),
    queryFn: () => newsApi.list(params),
  });
}

export function useNewsDetail(slug: string) {
  return useQuery({
    queryKey: NEWS_QUERY_KEYS.detail(slug),
    queryFn: () => newsApi.getDetail(slug),
    enabled: Boolean(slug),
  });
}

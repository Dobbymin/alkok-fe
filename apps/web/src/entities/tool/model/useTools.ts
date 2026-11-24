"use client";

import { useQuery } from "@tanstack/react-query";
import { TOOL_QUERY_KEYS } from "@alkok/core";
import { toolApi, type ToolListParams } from "../api/tool.api";

export function useToolsList(params: ToolListParams) {
  return useQuery({
    queryKey: TOOL_QUERY_KEYS.list({ ...params }),
    queryFn: () => toolApi.list(params),
  });
}

export function useToolDetail(slug: string) {
  return useQuery({
    queryKey: TOOL_QUERY_KEYS.detail(slug),
    queryFn: () => toolApi.getDetail(slug),
    enabled: Boolean(slug),
  });
}

export function useToolCompare(slugs: string[]) {
  return useQuery({
    queryKey: TOOL_QUERY_KEYS.compare(slugs),
    queryFn: () => toolApi.compare(slugs),
    enabled: slugs.length > 0,
  });
}

"use client";

import { useQuery } from "@tanstack/react-query";
import { SKILL_QUERY_KEYS } from "@alkok/core";
import { skillApi, type SkillListParams } from "../api/skill.api";

export function useSkillsList(params: SkillListParams) {
  return useQuery({
    queryKey: SKILL_QUERY_KEYS.list({ ...params }),
    queryFn: () => skillApi.list(params),
  });
}

export function useSkillDetail(slug: string) {
  return useQuery({
    queryKey: SKILL_QUERY_KEYS.detail(slug),
    queryFn: () => skillApi.getDetail(slug),
    enabled: Boolean(slug),
  });
}

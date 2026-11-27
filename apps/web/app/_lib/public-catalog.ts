import { cache } from "react";
import type { HomeCatalogPayload } from "@/views/home";
import type { PublicShellCounts } from "@/widgets/public-shell";
import { WORK_DOMAINS } from "@/entities/taxonomy";
import type {
  ApiEnvelope,
  ContentSummary,
  GuideDetailData,
  NewsDetailData,
  SkillDetailData,
  ToolDetailData,
} from "@alkok/core";
import { serverApiGet } from "@alkok/core/server";

export const fetchGuidesCatalog = cache(async () =>
  serverApiGet<ApiEnvelope<ContentSummary[]>>(
    "/api/v1/guides?limit=50&sort=recommended",
    { revalidate: 60 },
  ),
);

export const fetchToolsCatalog = cache(async () =>
  serverApiGet<ApiEnvelope<ToolDetailData[]>>(
    "/api/v1/tools?limit=50&sort=recommended",
    { revalidate: 60 },
  ),
);

export const fetchSkillsCatalog = cache(async () =>
  serverApiGet<ApiEnvelope<SkillDetailData[]>>(
    "/api/v1/skills?limit=50&sort=recommended",
    { revalidate: 60 },
  ),
);

export const fetchNewsCatalog = cache(async () =>
  serverApiGet<ApiEnvelope<NewsDetailData[]>>("/api/v1/news?limit=50", {
    revalidate: 60,
  }),
);

export const fetchGuideBySlug = cache(async (slug: string) =>
  serverApiGet<ApiEnvelope<GuideDetailData>>(`/api/v1/guides/${slug}`, {
    revalidate: 60,
  }),
);

export const fetchToolBySlug = cache(async (slug: string) =>
  serverApiGet<ApiEnvelope<ToolDetailData>>(`/api/v1/tools/${slug}`, {
    revalidate: 60,
  }),
);

export const fetchSkillBySlug = cache(async (slug: string) =>
  serverApiGet<ApiEnvelope<SkillDetailData>>(`/api/v1/skills/${slug}`, {
    revalidate: 60,
  }),
);

export const fetchNewsBySlug = cache(async (slug: string) =>
  serverApiGet<ApiEnvelope<NewsDetailData>>(`/api/v1/news/${slug}`, {
    revalidate: 60,
  }),
);

export const fetchHomeCatalog = cache(
  async (): Promise<HomeCatalogPayload> => {
    const [guidesRes, toolsRes, skillsRes, newsRes] = await Promise.all([
      fetchGuidesCatalog(),
      fetchToolsCatalog(),
      fetchSkillsCatalog(),
      fetchNewsCatalog(),
    ]);

    return {
      guides: guidesRes?.data ?? [],
      tools: toolsRes?.data ?? [],
      skills: skillsRes?.data ?? [],
      news: newsRes?.data ?? [],
      guidesTotal: guidesRes?.meta?.total ?? guidesRes?.data?.length ?? 0,
      toolsTotal: toolsRes?.meta?.total ?? toolsRes?.data?.length ?? 0,
      skillsTotal: skillsRes?.meta?.total ?? skillsRes?.data?.length ?? 0,
      newsTotal: newsRes?.meta?.total ?? newsRes?.data?.length ?? 0,
    };
  },
);

export const fetchPublicShellCounts = cache(
  async (): Promise<PublicShellCounts> => {
    const catalog = await fetchHomeCatalog();
    const domains: Record<string, number> = {};

    const seenByDomain: Record<string, Set<string>> = {};
    for (const domain of WORK_DOMAINS) {
      domains[domain.slug] = 0;
      seenByDomain[domain.slug] = new Set<string>();
    }

    const allItems = [
      ...catalog.guides,
      ...catalog.tools,
      ...(catalog.skills ?? []),
      ...catalog.news,
    ];
    for (const item of allItems) {
      for (const cat of item.categories ?? []) {
        const seen = seenByDomain[cat.slug];
        if (seen && !seen.has(item.id)) {
          seen.add(item.id);
          domains[cat.slug] = seen.size;
        }
      }
    }

    return {
      guides: catalog.guidesTotal ?? catalog.guides.length,
      tools: catalog.toolsTotal ?? catalog.tools.length,
      skills: catalog.skillsTotal ?? catalog.skills?.length ?? 0,
      news: catalog.newsTotal ?? catalog.news.length,
      domains,
    };
  },
);

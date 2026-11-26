import type { HomeCatalogPayload } from "@/views/home";
import type { PublicShellCounts } from "@/widgets/public-shell";
import { WORK_DOMAINS } from "@/entities/taxonomy";
import type {
  ApiEnvelope,
  ContentSummary,
  NewsDetailData,
  ToolDetailData,
} from "@alkok/core";
import { serverApiGet } from "@alkok/core/server";

export async function fetchHomeCatalog(): Promise<HomeCatalogPayload> {
  const [guidesRes, toolsRes, newsRes] = await Promise.all([
    serverApiGet<ApiEnvelope<ContentSummary[]>>(
      "/api/v1/guides?limit=50&sort=recommended",
      { revalidate: 60 },
    ),
    serverApiGet<ApiEnvelope<ToolDetailData[]>>(
      "/api/v1/tools?limit=50&sort=recommended",
      { revalidate: 60 },
    ),
    serverApiGet<ApiEnvelope<NewsDetailData[]>>("/api/v1/news?limit=50", {
      revalidate: 60,
    }),
  ]);

  return {
    guides: guidesRes?.data ?? [],
    tools: toolsRes?.data ?? [],
    news: newsRes?.data ?? [],
    guidesTotal: guidesRes?.meta?.total ?? guidesRes?.data?.length ?? 0,
    toolsTotal: toolsRes?.meta?.total ?? toolsRes?.data?.length ?? 0,
    newsTotal: newsRes?.meta?.total ?? newsRes?.data?.length ?? 0,
  };
}

export async function fetchPublicShellCounts(): Promise<PublicShellCounts> {
  const catalog = await fetchHomeCatalog();
  const domains: Record<string, number> = {};

  for (const domain of WORK_DOMAINS) {
    domains[domain.slug] = 0;
  }

  for (const guide of catalog.guides) {
    for (const cat of guide.categories ?? []) {
      if (cat.slug in domains) {
        domains[cat.slug] = (domains[cat.slug] ?? 0) + 1;
      }
    }
  }

  return {
    guides: catalog.guidesTotal ?? catalog.guides.length,
    tools: catalog.toolsTotal ?? catalog.tools.length,
    news: catalog.newsTotal ?? catalog.news.length,
    domains,
  };
}

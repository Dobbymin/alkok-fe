import type { MetadataRoute } from "next";
import { serverApiGet } from "@alkok/core/server";
import { env } from "@alkok/core";
import type { ApiEnvelope, ContentSummary } from "@alkok/core";

export const dynamic = "force-dynamic";

const MAX_SITEMAP_PAGES = 20;
const SITEMAP_PAGE_LIMIT = 50;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = env.siteUrl.replace(/\/$/, "");
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${siteUrl}/`, lastModified: now, changeFrequency: "daily", priority: 1.0 },
    { url: `${siteUrl}/guides`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${siteUrl}/tools`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${siteUrl}/skills`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${siteUrl}/news`, lastModified: now, changeFrequency: "daily", priority: 0.8 },
  ];

  const fetchAllPublished = async (endpoint: string): Promise<ContentSummary[]> => {
    const firstRes = await serverApiGet<ApiEnvelope<ContentSummary[]>>(endpoint, {
      params: { page: 1, limit: SITEMAP_PAGE_LIMIT },
      revalidate: 300,
    });
    if (!firstRes?.data?.length) return [];

    const collected: ContentSummary[] = [...firstRes.data];
    if (!firstRes.meta?.hasNext) return collected;

    const rawTotalPages =
      firstRes.meta.totalPages ??
      (typeof firstRes.meta.total === "number" && firstRes.meta.total > 0
        ? Math.ceil(firstRes.meta.total / (firstRes.meta.limit || SITEMAP_PAGE_LIMIT))
        : 0);

    if (rawTotalPages >= 2) {
      const lastPage = Math.min(MAX_SITEMAP_PAGES, rawTotalPages);
      const remainingPages = Array.from(
        { length: lastPage - 1 },
        (_, index) => index + 2,
      );
      const restResponses = await Promise.all(
        remainingPages.map((page) =>
          serverApiGet<ApiEnvelope<ContentSummary[]>>(endpoint, {
            params: { page, limit: SITEMAP_PAGE_LIMIT },
            revalidate: 300,
          }),
        ),
      );
      for (const res of restResponses) {
        if (res?.data?.length) {
          collected.push(...res.data);
        }
      }
      return collected;
    }

    for (let page = 2; page <= MAX_SITEMAP_PAGES; page += 1) {
      const res = await serverApiGet<ApiEnvelope<ContentSummary[]>>(endpoint, {
        params: { page, limit: SITEMAP_PAGE_LIMIT },
        revalidate: 300,
      });
      if (!res?.data?.length) break;
      collected.push(...res.data);
      if (!res.meta?.hasNext) break;
    }
    return collected;
  };

  const [guides, tools, skills, news] = await Promise.all([
    fetchAllPublished("/api/v1/guides"),
    fetchAllPublished("/api/v1/tools"),
    fetchAllPublished("/api/v1/skills"),
    fetchAllPublished("/api/v1/news"),
  ]);

  const toEntries = (
    items: ContentSummary[],
    prefix: string,
  ): MetadataRoute.Sitemap =>
    items
      .filter((item) => item.publishStatus === "PUBLISHED")
      .map((item) => ({
        url: `${siteUrl}${prefix}/${item.slug}`,
        lastModified: item.updatedAt ? new Date(item.updatedAt) : now,
        changeFrequency: "weekly",
        priority: 0.7,
      }));

  return [
    ...staticRoutes,
    ...toEntries(guides, "/guides"),
    ...toEntries(tools, "/tools"),
    ...toEntries(skills, "/skills"),
    ...toEntries(news, "/news"),
  ];
}

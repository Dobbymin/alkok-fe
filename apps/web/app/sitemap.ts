import type { MetadataRoute } from "next";
import { serverApiGet } from "@alkok/core/server";
import { env } from "@alkok/core";
import type { ApiEnvelope, ContentSummary } from "@alkok/core";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = env.siteUrl.replace(/\/$/, "");
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${siteUrl}/`, lastModified: now, changeFrequency: "daily", priority: 1.0 },
    { url: `${siteUrl}/guides`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${siteUrl}/tools`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${siteUrl}/news`, lastModified: now, changeFrequency: "daily", priority: 0.8 },
  ];

  const fetchAllPublished = async (endpoint: string): Promise<ContentSummary[]> => {
    const collected: ContentSummary[] = [];
    for (let page = 1; page <= 20; page += 1) {
      const res = await serverApiGet<ApiEnvelope<ContentSummary[]>>(endpoint, {
        params: { page, limit: 50 },
        revalidate: 300,
      });
      if (!res?.data?.length) break;
      collected.push(...res.data);
      if (!res.meta?.hasNext) break;
    }
    return collected;
  };

  const [guides, tools, news] = await Promise.all([
    fetchAllPublished("/api/v1/guides"),
    fetchAllPublished("/api/v1/tools"),
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
    ...toEntries(news, "/news"),
  ];
}

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

  const [guidesRes, toolsRes, newsRes] = await Promise.all([
    serverApiGet<ApiEnvelope<ContentSummary[]>>("/api/v1/guides", {
      params: { limit: 100 },
      revalidate: 300,
    }),
    serverApiGet<ApiEnvelope<ContentSummary[]>>("/api/v1/tools", {
      params: { limit: 100 },
      revalidate: 300,
    }),
    serverApiGet<ApiEnvelope<ContentSummary[]>>("/api/v1/news", {
      params: { limit: 100 },
      revalidate: 300,
    }),
  ]);

  const toEntries = (
    items: ContentSummary[] | undefined,
    prefix: string,
  ): MetadataRoute.Sitemap =>
    (items ?? [])
      .filter((item) => item.publishStatus === "PUBLISHED")
      .map((item) => ({
        url: `${siteUrl}${prefix}/${item.slug}`,
        lastModified: item.updatedAt ? new Date(item.updatedAt) : now,
        changeFrequency: "weekly",
        priority: 0.7,
      }));

  return [
    ...staticRoutes,
    ...toEntries(guidesRes?.data, "/guides"),
    ...toEntries(toolsRes?.data, "/tools"),
    ...toEntries(newsRes?.data, "/news"),
  ];
}

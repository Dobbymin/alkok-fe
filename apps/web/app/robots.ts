import type { MetadataRoute } from "next";
import { getSiteUrl } from "@alkok/core";

export const dynamic = "force-dynamic";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl();
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/guides", "/tools", "/news", "/api/og/"],
        disallow: ["/vault", "/settings", "/api"],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}

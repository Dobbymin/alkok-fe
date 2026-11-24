import type { MetadataRoute } from "next";
import { env } from "@alkok/core";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = env.siteUrl.replace(/\/$/, "");
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/guides", "/tools", "/news"],
        disallow: ["/admin", "/vault", "/settings", "/api"],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}

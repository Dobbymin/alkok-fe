import type { Metadata } from "next";
import { env } from "../config";
import type { GuideDetailData, NewsDetailData, ToolDetailData } from "../types";

export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export function buildPageMetadata(options: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  const baseUrl = env.siteUrl.replace(/\/$/, "");
  const canonical = `${baseUrl}${options.path.startsWith("/") ? options.path : `/${options.path}`}`;

  return {
    title: options.title,
    description: options.description,
    alternates: {
      canonical,
    },
    openGraph: {
      title: options.title,
      description: options.description,
      url: canonical,
      siteName: "알콕(Alkok)",
      locale: "ko_KR",
      type: "website",
    },
  };
}

export function buildWebsiteJsonLd() {
  const siteUrl = env.siteUrl.replace(/\/$/, "");
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "알콕(Alkok)",
    url: siteUrl,
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteUrl}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export function buildGuideJsonLd(guide: GuideDetailData) {
  const siteUrl = env.siteUrl.replace(/\/$/, "");
  const url = `${siteUrl}/guides/${guide.slug}`;
  return [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: guide.title,
      description: guide.summary,
      dateModified: guide.verifiedAt ?? guide.updatedAt ?? guide.publishedAt,
      mainEntityOfPage: url,
    },
    {
      "@context": "https://schema.org",
      "@type": "HowTo",
      name: guide.title,
      description: guide.summary,
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "홈", item: siteUrl },
        { "@type": "ListItem", position: 2, name: "업무 가이드", item: `${siteUrl}/guides` },
        { "@type": "ListItem", position: 3, name: guide.title, item: url },
      ],
    },
  ];
}

export function buildToolJsonLd(tool: ToolDetailData) {
  const siteUrl = env.siteUrl.replace(/\/$/, "");
  const url = `${siteUrl}/tools/${tool.slug}`;
  return [
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: tool.title,
      description: tool.summary,
      applicationCategory: "BusinessApplication",
      url: tool.officialUrl,
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "홈", item: siteUrl },
        { "@type": "ListItem", position: 2, name: "AI 도구·모델", item: `${siteUrl}/tools` },
        { "@type": "ListItem", position: 3, name: tool.title, item: url },
      ],
    },
  ];
}

export function buildNewsJsonLd(news: NewsDetailData) {
  const siteUrl = env.siteUrl.replace(/\/$/, "");
  const url = `${siteUrl}/news/${news.slug}`;
  return [
    {
      "@context": "https://schema.org",
      "@type": "NewsArticle",
      headline: news.title,
      description: news.summary,
      datePublished: news.publishedAt ?? news.createdAt,
      dateModified: news.verifiedAt ?? news.updatedAt,
      mainEntityOfPage: url,
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "홈", item: siteUrl },
        { "@type": "ListItem", position: 2, name: "AI 소식", item: `${siteUrl}/news` },
        { "@type": "ListItem", position: 3, name: news.title, item: url },
      ],
    },
  ];
}

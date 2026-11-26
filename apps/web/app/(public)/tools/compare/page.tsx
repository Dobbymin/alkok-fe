import type { Metadata } from "next";
import { Suspense } from "react";
import {
  findMatchingComparePreset,
  normalizeCompareSlugs,
} from "@/entities/taxonomy";
import {
  getSiteUrl,
  type ApiEnvelope,
  type ToolDetailData,
} from "@alkok/core";
import { serverApiGet } from "@alkok/core/server";
import { ToolComparePage } from "@/views/tools";
import { ToolComparePageSkeleton } from "@/widgets/tool-compare";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ slugs?: string }>;
}): Promise<Metadata> {
  const { slugs: slugsRaw = "" } = await searchParams;
  const slugs = normalizeCompareSlugs(slugsRaw);
  const siteUrl = getSiteUrl();
  const query = slugs.length > 0 ? `?slugs=${encodeURIComponent(slugs.join(","))}` : "";
  const title =
    slugs.length > 0
      ? `${slugs.join(" vs ")} 비교표`
      : "AI 도구 한눈에 비교하기";
  const description =
    slugs.length > 0
      ? `${slugs.join(", ")}의 무료 한도, 한국어 지원, 강점과 한계를 한눈에 비교합니다.`
      : "AI 도구·모델의 무료 한도, 한국어 지원, 강점과 한계를 한눈에 비교합니다.";
  const ogImageUrl = `${siteUrl}/api/og/compare${query}`;
  const canonicalUrl = `${siteUrl}/tools/compare${query}`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    robots: {
      index: false,
      follow: false,
    },
    openGraph: {
      title: `${title} | 알콕(Alkok)`,
      description,
      url: canonicalUrl,
      siteName: "알콕(Alkok)",
      locale: "ko_KR",
      type: "website",
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | 알콕(Alkok)`,
      description,
      images: [ogImageUrl],
    },
  };
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ slugs?: string }>;
}) {
  const { slugs: slugsRaw = "" } = await searchParams;
  const slugs = normalizeCompareSlugs(slugsRaw);

  const [allToolsRes, compareRes] = await Promise.all([
    serverApiGet<ApiEnvelope<ToolDetailData[]>>(
      "/api/v1/tools?limit=50&sort=recommended",
      { revalidate: 60 },
    ),
    slugs.length > 0
      ? serverApiGet<ApiEnvelope<ToolDetailData[]>>("/api/v1/tools/compare", {
          params: { slugs: slugs.join(",") },
          revalidate: 60,
        })
      : Promise.resolve(null),
  ]);

  const matchedPreset = findMatchingComparePreset(slugs);

  return (
    <Suspense
      fallback={
        <ToolComparePageSkeleton
          mode={slugs.length > 0 ? "compare" : "hub"}
          toolCount={slugs.length}
          matchedPreset={matchedPreset}
        />
      }
    >
      <ToolComparePage
        initialAllTools={allToolsRes?.data ?? []}
        initialCompareTools={compareRes?.data ?? []}
        initialSlugs={slugs}
      />
    </Suspense>
  );
}

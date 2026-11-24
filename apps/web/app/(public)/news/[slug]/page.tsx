import type { Metadata } from "next";
import { serverApiGet } from "@alkok/core/server";
import { buildNewsJsonLd, buildPageMetadata } from "@alkok/core";
import type { ApiEnvelope, NewsDetailData } from "@alkok/core";
import { JsonLdScript } from "@alkok/ui";
import { NewsDetailPage } from "@/views/news";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const res = await serverApiGet<ApiEnvelope<NewsDetailData>>(
    `/api/v1/news/${slug}`,
    { revalidate: 60 },
  );
  if (!res?.data) {
    return { title: "AI 소식" };
  }
  return buildPageMetadata({
    title: res.data.title,
    description: res.data.summary,
    path: `/news/${slug}`,
  });
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const res = await serverApiGet<ApiEnvelope<NewsDetailData>>(
    `/api/v1/news/${slug}`,
    { revalidate: 60 },
  );
  return (
    <>
      {res?.data ? <JsonLdScript data={buildNewsJsonLd(res.data)} /> : null}
      <NewsDetailPage news={res?.data ?? null} />
    </>
  );
}

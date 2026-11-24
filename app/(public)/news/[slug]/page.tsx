import type { Metadata } from "next";
import { serverApiGet } from "@/shared/api/server-api-client.server";
import type { ApiEnvelope, NewsDetailData } from "@/shared/types";
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
  return {
    title: res.data.title,
    description: res.data.summary,
  };
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
  return <NewsDetailPage news={res?.data ?? null} />;
}

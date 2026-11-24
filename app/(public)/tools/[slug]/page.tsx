import type { Metadata } from "next";
import { serverApiGet } from "@/shared/api/server-api-client.server";
import type { ApiEnvelope, ToolDetailData } from "@/shared/types";
import { ToolDetailPage } from "@/views/tools";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const res = await serverApiGet<ApiEnvelope<ToolDetailData>>(
    `/api/v1/tools/${slug}`,
    { revalidate: 60 },
  );
  if (!res?.data) {
    return { title: "AI 도구·모델 상세" };
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
  const res = await serverApiGet<ApiEnvelope<ToolDetailData>>(
    `/api/v1/tools/${slug}`,
    { revalidate: 60 },
  );
  return <ToolDetailPage tool={res?.data ?? null} />;
}

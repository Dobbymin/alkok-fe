import type { Metadata } from "next";
import { serverApiGet } from "@/shared/api/server-api-client.server";
import type { ApiEnvelope, GuideDetailData } from "@/shared/types";
import { GuideDetailPage } from "@/views/guides";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const res = await serverApiGet<ApiEnvelope<GuideDetailData>>(
    `/api/v1/guides/${slug}`,
    { revalidate: 60 },
  );
  if (!res?.data) {
    return { title: "업무 활용 가이드" };
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
  const res = await serverApiGet<ApiEnvelope<GuideDetailData>>(
    `/api/v1/guides/${slug}`,
    { revalidate: 60 },
  );
  return <GuideDetailPage guide={res?.data ?? null} />;
}

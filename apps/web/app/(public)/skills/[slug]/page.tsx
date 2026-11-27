import type { Metadata } from "next";
import { buildPageMetadata } from "@alkok/core";
import type { ApiEnvelope, SkillDetailData } from "@alkok/core";
import { serverApiGet } from "@alkok/core/server";
import { SkillDetailPage } from "@/views/skills";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const res = await serverApiGet<ApiEnvelope<SkillDetailData>>(
    `/api/v1/skills/${slug}`,
    { revalidate: 60 },
  );
  if (!res?.data) {
    return { title: "플러그인·스킬 상세" };
  }
  return buildPageMetadata({
    title: res.data.title,
    description: res.data.summary,
    path: `/skills/${slug}`,
  });
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const res = await serverApiGet<ApiEnvelope<SkillDetailData>>(
    `/api/v1/skills/${slug}`,
    { revalidate: 60 },
  );
  return <SkillDetailPage skill={res?.data ?? null} />;
}

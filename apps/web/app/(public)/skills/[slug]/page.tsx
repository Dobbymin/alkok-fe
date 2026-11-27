import type { Metadata } from "next";
import { buildPageMetadata } from "@alkok/core";
import { SkillDetailPage } from "@/views/skills";
import { fetchSkillBySlug } from "../../../_lib/public-catalog";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const res = await fetchSkillBySlug(slug);
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
  const res = await fetchSkillBySlug(slug);
  return <SkillDetailPage skill={res?.data ?? null} />;
}

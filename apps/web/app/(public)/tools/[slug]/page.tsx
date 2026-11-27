import type { Metadata } from "next";
import { buildPageMetadata, buildToolJsonLd } from "@alkok/core";
import { JsonLdScript } from "@alkok/ui";
import { ToolDetailPage } from "@/views/tools";
import { fetchToolBySlug } from "../../../_lib/public-catalog";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const res = await fetchToolBySlug(slug);
  if (!res?.data) {
    return { title: "AI 도구·모델 상세" };
  }
  return buildPageMetadata({
    title: res.data.title,
    description: res.data.summary,
    path: `/tools/${slug}`,
  });
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const res = await fetchToolBySlug(slug);
  return (
    <>
      {res?.data ? <JsonLdScript data={buildToolJsonLd(res.data)} /> : null}
      <ToolDetailPage tool={res?.data ?? null} />
    </>
  );
}

import type { Metadata } from "next";
import { buildGuideJsonLd, buildPageMetadata } from "@alkok/core";
import { JsonLdScript } from "@alkok/ui";
import { GuideDetailPage } from "@/views/guides";
import { fetchGuideBySlug } from "../../../_lib/public-catalog";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const res = await fetchGuideBySlug(slug);
  if (!res?.data) {
    return { title: "업무 활용 가이드" };
  }
  return buildPageMetadata({
    title: res.data.title,
    description: res.data.summary,
    path: `/guides/${slug}`,
  });
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const res = await fetchGuideBySlug(slug);
  return (
    <>
      {res?.data ? <JsonLdScript data={buildGuideJsonLd(res.data)} /> : null}
      <GuideDetailPage guide={res?.data ?? null} />
    </>
  );
}

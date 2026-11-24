import type { Metadata } from "next";
import { serverApiGet } from "@alkok/core/server";
import { buildGuideJsonLd, buildPageMetadata } from "@alkok/core";
import type { ApiEnvelope, GuideDetailData } from "@alkok/core";
import { JsonLdScript } from "@alkok/ui";
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
  const res = await serverApiGet<ApiEnvelope<GuideDetailData>>(
    `/api/v1/guides/${slug}`,
    { revalidate: 60 },
  );
  return (
    <>
      {res?.data ? <JsonLdScript data={buildGuideJsonLd(res.data)} /> : null}
      <GuideDetailPage guide={res?.data ?? null} />
    </>
  );
}

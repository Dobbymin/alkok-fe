import type { Metadata } from "next";
import { serverApiGet } from "@alkok/core/server";
import { buildPageMetadata, buildToolJsonLd } from "@alkok/core";
import type { ApiEnvelope, ToolDetailData } from "@alkok/core";
import { JsonLdScript } from "@alkok/ui";
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
  const res = await serverApiGet<ApiEnvelope<ToolDetailData>>(
    `/api/v1/tools/${slug}`,
    { revalidate: 60 },
  );
  return (
    <>
      {res?.data ? <JsonLdScript data={buildToolJsonLd(res.data)} /> : null}
      <ToolDetailPage tool={res?.data ?? null} />
    </>
  );
}

import type { Metadata } from "next";
import { Suspense } from "react";
import { buildPageMetadata, buildWebsiteJsonLd } from "@alkok/core";
import { JsonLdScript } from "@alkok/ui";
import { HomePage } from "@/views/home";
import { fetchHomeCatalog } from "../_lib/public-catalog";
import PublicHomeLoading from "./loading";

export const metadata: Metadata = buildPageMetadata({
  title: "알콕(Alkok) · AI 정보, 알맹이만 콕.",
  description:
    "실무 직장인을 위한 AI 업무 활용 가이드, AI 도구·모델 비교, 최신 AI 소식과 개인 지식 보관함.",
  path: "/",
});

export default async function Page() {
  const catalog = await fetchHomeCatalog();
  return (
    <>
      <JsonLdScript data={buildWebsiteJsonLd()} />
      <Suspense fallback={<PublicHomeLoading />}>
        <HomePage initialCatalog={catalog} />
      </Suspense>
    </>
  );
}

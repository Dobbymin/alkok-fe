import { afterEach, describe, expect, it } from "vitest";
import type { GuideDetailData, NewsDetailData, ToolDetailData } from "../types";
import {
  buildGuideJsonLd,
  buildNewsJsonLd,
  buildPageMetadata,
  buildToolJsonLd,
  buildWebsiteJsonLd,
  serializeJsonLd,
} from "./seo";

describe("seo utilities", () => {
  const originalSiteUrl = process.env.NEXT_PUBLIC_SITE_URL;

  afterEach(() => {
    if (originalSiteUrl === undefined) {
      delete process.env.NEXT_PUBLIC_SITE_URL;
    } else {
      process.env.NEXT_PUBLIC_SITE_URL = originalSiteUrl;
    }
  });

  it("escapes < characters in serializeJsonLd to prevent script injection", () => {
    const out = serializeJsonLd({ title: "</script><script>alert(1)</script>" });
    expect(out).not.toContain("</script>");
    expect(out).toContain("\\u003c/script>");
  });

  it("reflects NEXT_PUBLIC_SITE_URL changes across canonical and JSON-LD builders", () => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://alkok.kr/";

    const ld = buildWebsiteJsonLd();
    expect(ld["@type"]).toBe("WebSite");
    expect(ld.url).toBe("https://alkok.kr");
    expect(ld.potentialAction.target).toBe(
      "https://alkok.kr/search?q={search_term_string}",
    );

    const meta = buildPageMetadata({
      title: "테스트",
      description: "설명",
      path: "/guides",
    });
    expect(meta.alternates?.canonical).toBe("https://alkok.kr/guides");

    const guideLd = buildGuideJsonLd({
      slug: "g1",
      title: "가이드",
      summary: "요약",
    } as GuideDetailData);
    expect(guideLd[0]?.mainEntityOfPage).toBe("https://alkok.kr/guides/g1");

    const toolLd = buildToolJsonLd({
      slug: "t1",
      title: "도구",
      summary: "요약",
      officialUrl: "https://example.com",
    } as ToolDetailData);
    expect(toolLd[1]?.itemListElement?.[2]?.item).toBe("https://alkok.kr/tools/t1");

    const newsLd = buildNewsJsonLd({
      slug: "n1",
      title: "소식",
      summary: "요약",
    } as NewsDetailData);
    expect(newsLd[0]?.mainEntityOfPage).toBe("https://alkok.kr/news/n1");
  });
});

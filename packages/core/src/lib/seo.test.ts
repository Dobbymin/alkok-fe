import { describe, expect, it } from "vitest";
import {
  buildPageMetadata,
  buildWebsiteJsonLd,
  serializeJsonLd,
} from "./seo";

describe("seo utilities", () => {
  it("escapes < characters in serializeJsonLd to prevent script injection", () => {
    const out = serializeJsonLd({ title: "</script><script>alert(1)</script>" });
    expect(out).not.toContain("</script>");
    expect(out).toContain("\\u003c/script>");
  });

  it("builds WebSite JSON-LD with SearchAction and canonical metadata", () => {
    const ld = buildWebsiteJsonLd();
    expect(ld["@type"]).toBe("WebSite");
    expect(ld.potentialAction["@type"]).toBe("SearchAction");

    const meta = buildPageMetadata({
      title: "테스트",
      description: "설명",
      path: "/guides",
    });
    expect(meta.alternates?.canonical).toContain("/guides");
  });
});

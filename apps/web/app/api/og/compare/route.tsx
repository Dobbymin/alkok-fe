import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";
import { normalizeCompareSlugs } from "@/entities/taxonomy";
import { getSiteUrl, type ApiEnvelope, type KoreanSupportLevel, type ToolDetailData } from "@alkok/core";
import { serverApiGet } from "@alkok/core/server";
import { loadKoreanOgFonts } from "./og-font";

export const runtime = "nodejs";

const KOREAN_LABEL: Record<KoreanSupportLevel, string> = {
  FULL: "한국어 완전 지원",
  PARTIAL: "한국어 부분 지원",
  NONE: "한국어 미지원",
};

function getHostLabel(): string {
  try {
    return new URL(getSiteUrl()).host;
  } catch {
    return "alkok";
  }
}

export async function GET(request: NextRequest) {
  const slugsRaw = request.nextUrl.searchParams.get("slugs") ?? "";
  const slugs = normalizeCompareSlugs(slugsRaw);

  let tools: ToolDetailData[] = [];
  if (slugs.length > 0) {
    const res = await serverApiGet<ApiEnvelope<ToolDetailData[]>>(
      "/api/v1/tools/compare",
      {
        params: { slugs: slugs.join(",") },
        revalidate: 300,
      },
    );
    tools = res?.data ?? [];
  }

  const hostLabel = getHostLabel();
  const title =
    tools.length >= 2
      ? tools.map((t) => t.title).join(" vs ")
      : slugs.length >= 2
        ? slugs.join(" vs ")
        : "AI 도구 한눈에 비교하기";

  const verifiedDates = tools
    .map((t) => t.verifiedAt?.slice(0, 10))
    .filter((d): d is string => Boolean(d))
    .sort();
  const latestVerified =
    verifiedDates.length > 0 ? verifiedDates[verifiedDates.length - 1] : null;

  const glyphSource = [
    "알콕 Alkok AI 도구 한눈에 비교하기 AI 도구 비교표 무료 플랜 있음 유료 전용 한국어 완전 부분 미지원 확인일 출처 검증 실무 비교",
    hostLabel,
    title,
    latestVerified ?? "",
    ...tools.flatMap((t) => [
      t.title,
      t.providerName,
      t.pricingSummary,
      t.strengths[0] ?? "",
      KOREAN_LABEL[t.koreanSupport],
    ]),
  ].join(" ");

  const fonts = await loadKoreanOgFonts(glyphSource);

  const response = new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          width: "100%",
          height: "100%",
          backgroundColor: "#f8fafc",
          color: "#0f172a",
          padding: "48px 56px",
          fontFamily: fonts.length > 0 ? '"Noto Sans KR", sans-serif' : "sans-serif",
        }}
      >
        {/* Top brand bar */}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "12px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "36px",
                height: "36px",
                borderRadius: "10px",
                backgroundColor: "#2563eb",
                color: "#ffffff",
                fontSize: "20px",
                fontWeight: 700,
              }}
            >
              a
            </div>
            <div style={{ display: "flex", flexDirection: "row", alignItems: "baseline", gap: "10px" }}>
              <span style={{ fontSize: "24px", fontWeight: 700, color: "#0f172a" }}>
                알콕 Alkok
              </span>
              <span style={{ fontSize: "16px", fontWeight: 500, color: "#64748b" }}>
                AI 정보, 알맹이만 콕.
              </span>
            </div>
          </div>
          <span style={{ fontSize: "16px", fontWeight: 500, color: "#2563eb" }}>
            {hostLabel}
          </span>
        </div>

        {/* Title & subtitle */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "20px" }}>
          <span style={{ fontSize: "18px", fontWeight: 700, color: "#2563eb" }}>
            AI 도구 한눈에 비교
          </span>
          <span style={{ fontSize: "38px", fontWeight: 700, color: "#0f172a", lineHeight: 1.2 }}>
            {title}
          </span>
        </div>

        {/* Tool cards row */}
        {tools.length > 0 ? (
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              gap: "18px",
              marginTop: "24px",
              flex: 1,
            }}
          >
            {tools.slice(0, 4).map((tool) => (
              <div
                key={tool.slug}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  flex: 1,
                  backgroundColor: "#ffffff",
                  border: "1px solid #e2e8f0",
                  borderRadius: "16px",
                  padding: "20px",
                }}
              >
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                    <span style={{ fontSize: "22px", fontWeight: 700, color: "#0f172a" }}>
                      {tool.title}
                    </span>
                    <span style={{ fontSize: "14px", fontWeight: 500, color: "#64748b" }}>
                      {tool.providerName}
                    </span>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      gap: "6px",
                      marginTop: "4px",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "13px",
                        fontWeight: 700,
                        padding: "4px 10px",
                        borderRadius: "999px",
                        backgroundColor: tool.hasFreePlan ? "#dcfce7" : "#f1f5f9",
                        color: tool.hasFreePlan ? "#166534" : "#475569",
                      }}
                    >
                      {tool.hasFreePlan ? "무료 플랜 있음" : "유료 전용"}
                    </span>
                  </div>

                  <span style={{ fontSize: "14px", fontWeight: 500, color: "#1e293b", marginTop: "6px" }}>
                    {KOREAN_LABEL[tool.koreanSupport]}
                  </span>
                  <span style={{ fontSize: "14px", fontWeight: 500, color: "#334155" }}>
                    {tool.pricingSummary}
                  </span>
                </div>

                <span style={{ fontSize: "13px", fontWeight: 500, color: "#64748b" }}>
                  {tool.verifiedAt ? `확인일 ${tool.verifiedAt.slice(0, 10)}` : "검증 정보"}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              flex: 1,
              backgroundColor: "#ffffff",
              border: "1px solid #e2e8f0",
              borderRadius: "16px",
              padding: "32px",
              marginTop: "24px",
              gap: "8px",
            }}
          >
            <span style={{ fontSize: "24px", fontWeight: 700, color: "#0f172a" }}>
              요금·무료 한도·한국어 지원·강점과 한계를 한눈에 비교하세요
            </span>
            <span style={{ fontSize: "16px", fontWeight: 500, color: "#64748b" }}>
              출처와 최종 확인일이 검증된 실무 직장인 AI 비교 허브
            </span>
          </div>
        )}

        {/* Footer */}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "20px",
            paddingTop: "16px",
            borderTop: "1px solid #e2e8f0",
            fontSize: "14px",
            fontWeight: 500,
            color: "#64748b",
          }}
        >
          <span>출처·최신성 검증 기반 실무 비교</span>
          <span>
            {latestVerified ? `최근 확인일 ${latestVerified}` : "AI 도구 비교표"}
          </span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      ...(fonts.length > 0 ? { fonts } : {}),
    },
  );

  response.headers.set(
    "Cache-Control",
    "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800",
  );
  return response;
}

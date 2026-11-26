import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { ToolDetailData } from "@alkok/core";
import { TooltipProvider } from "@alkok/ui";
import ToolComparePage from "./ToolComparePage";

const pushMock = vi.fn();
let currentSearch = "slugs=chatgpt,claude,gemini";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushMock }),
  useSearchParams: () => new URLSearchParams(currentSearch),
}));

const mockTools: ToolDetailData[] = [
  {
    id: "t1",
    type: "TOOL",
    slug: "chatgpt",
    title: "ChatGPT",
    summary: "범용 AI",
    publishStatus: "PUBLISHED",
    verificationStatus: "VALID",
    verifiedAt: "2026-11-25T00:00:00.000Z",
    sourceType: "OFFICIAL",
    sourceUrl: "https://chatgpt.com",
    helpfulCount: 0,
    toolKind: "TOOL",
    providerName: "OpenAI",
    officialUrl: "https://chatgpt.com",
    pricingModel: "FREEMIUM",
    hasFreePlan: true,
    pricingSummary: "무료 / Plus $20",
    koreanSupport: "FULL",
    platforms: ["Web"],
    strengths: ["범용 작업에 강점"],
    limitations: ["사내 데이터 주의"],
  },
  {
    id: "t2",
    type: "TOOL",
    slug: "claude",
    title: "Claude",
    summary: "문서 AI",
    publishStatus: "PUBLISHED",
    verificationStatus: "VALID",
    verifiedAt: "2026-11-25T00:00:00.000Z",
    sourceType: "OFFICIAL",
    sourceUrl: "https://claude.ai",
    helpfulCount: 0,
    toolKind: "TOOL",
    providerName: "Anthropic",
    officialUrl: "https://claude.ai",
    pricingModel: "FREEMIUM",
    hasFreePlan: true,
    pricingSummary: "무료 / Pro $20",
    koreanSupport: "FULL",
    platforms: ["Web"],
    strengths: ["한국어 보고서 문체 우수"],
    limitations: ["무료 한도 제한"],
  },
  {
    id: "t3",
    type: "TOOL",
    slug: "gemini",
    title: "Gemini",
    summary: "구글 AI",
    publishStatus: "PUBLISHED",
    verificationStatus: "VALID",
    verifiedAt: "2026-11-25T00:00:00.000Z",
    sourceType: "OFFICIAL",
    sourceUrl: "https://gemini.google.com",
    helpfulCount: 0,
    toolKind: "TOOL",
    providerName: "Google",
    officialUrl: "https://gemini.google.com",
    pricingModel: "FREEMIUM",
    hasFreePlan: true,
    pricingSummary: "무료 / AI Pro",
    koreanSupport: "FULL",
    platforms: ["Web"],
    strengths: ["구글 워크스페이스 연동"],
    limitations: ["복잡한 추론은 검증 필요"],
  },
  {
    id: "t4",
    type: "TOOL",
    slug: "perplexity",
    title: "Perplexity",
    summary: "리서치 AI",
    publishStatus: "PUBLISHED",
    verificationStatus: "VALID",
    verifiedAt: "2026-11-25T00:00:00.000Z",
    sourceType: "OFFICIAL",
    sourceUrl: "https://perplexity.ai",
    helpfulCount: 0,
    toolKind: "TOOL",
    providerName: "Perplexity",
    officialUrl: "https://perplexity.ai",
    pricingModel: "FREEMIUM",
    hasFreePlan: true,
    pricingSummary: "무료 / Pro $20",
    koreanSupport: "FULL",
    platforms: ["Web"],
    strengths: ["출처 링크 기반 검색"],
    limitations: ["긴 문서 편집은 제한적"],
  },
];

let mockCompareLoading = false;
let mockToolsListLoading = false;

vi.mock("@/entities/tool", () => ({
  useToolCompare: (slugs: string[]) => ({
    data: mockCompareLoading
      ? undefined
      : { data: mockTools.filter((t) => slugs.includes(t.slug)) },
    isLoading: mockCompareLoading,
    isError: false,
    refetch: vi.fn(),
  }),
  useToolsList: () => ({
    data: mockToolsListLoading ? undefined : { data: mockTools },
    isLoading: mockToolsListLoading,
    isError: false,
  }),
}));

describe("ToolComparePage", () => {
  beforeEach(() => {
    pushMock.mockReset();
    currentSearch = "slugs=chatgpt,claude,gemini";
    mockCompareLoading = false;
    mockToolsListLoading = false;
  });

  it("renders expanded presets, recommendation summary, and updates URL on add/remove", () => {
    const qc = new QueryClient();
    render(
      <QueryClientProvider client={qc}>
        <TooltipProvider>
          <ToolComparePage />
        </TooltipProvider>
      </QueryClientProvider>,
    );

    expect(
      screen.getByRole("heading", { name: "AI 도구 한눈에 비교하기" }),
    ).toBeInTheDocument();
    expect(screen.queryByText(/7축/)).not.toBeInTheDocument();
    expect(
      screen.getByText("어떤 상황에 어떤 도구가 유리한가요?"),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "회의록·음성 AI" })).toHaveAttribute(
      "href",
      "/tools/compare?slugs=clova-note,notebooklm,notion-ai",
    );

    fireEvent.click(screen.getByRole("button", { name: "도구 추가" }));
    expect(pushMock).toHaveBeenCalledWith(
      "/tools/compare?slugs=chatgpt,claude,gemini,perplexity",
    );

    fireEvent.click(
      screen.getByRole("button", { name: "Claude 비교에서 제거" }),
    );
    expect(pushMock).toHaveBeenCalledWith(
      "/tools/compare?slugs=chatgpt,gemini",
    );
  });

  it("renders add-tool and summary skeletons while loading", () => {
    mockCompareLoading = true;
    mockToolsListLoading = true;

    const qc = new QueryClient();
    render(
      <QueryClientProvider client={qc}>
        <TooltipProvider>
          <ToolComparePage />
        </TooltipProvider>
      </QueryClientProvider>,
    );

    expect(
      screen.getByRole("status", { name: "추가 가능한 도구 불러오는 중" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("status", { name: "비교 요약 불러오는 중" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("status", { name: "도구 비교표 불러오는 중" }),
    ).toBeInTheDocument();
  });
});

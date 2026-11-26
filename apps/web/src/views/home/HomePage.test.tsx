import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { HomeDataPayload } from "@/entities/content";
import { TooltipProvider } from "@alkok/ui";
import { resetCompareStore } from "@/features/tool-compare";
import HomePage from "./HomePage";

const pushMock = vi.fn();
const guidesListMock = vi.fn();
const compareMock = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushMock }),
}));

vi.mock("@/entities/guide", () => ({
  useGuidesList: (
    params: { workDomain?: string },
    options?: { enabled?: boolean },
  ) => {
    if (options?.enabled) {
      return guidesListMock(params);
    }
    return {
      data: undefined,
      isLoading: false,
      isError: false,
      isSuccess: false,
    };
  },
}));

vi.mock("@/entities/tool", async () => {
  const actual = await vi.importActual<typeof import("@/entities/tool")>(
    "@/entities/tool",
  );
  return {
    ...actual,
    useToolCompare: (slugs: string[]) => compareMock(slugs),
  };
});

const mockInitialData: HomeDataPayload = {
  guides: [
    {
      id: "g1",
      type: "GUIDE",
      slug: "weekly-report",
      title: "주간 보고서 10분 완성 가이드",
      summary: "핵심 성과만 요약하는 프롬프트 가이드",
      publishStatus: "PUBLISHED",
      verificationStatus: "VALID",
      verifiedAt: "2026-11-24T00:00:00.000Z",
      sourceType: "OFFICIAL",
      sourceUrl: "https://alkok.dobbymin.cloud",
      helpfulCount: 0,
      categories: [
        {
          id: "c1",
          group: "WORK_DOMAIN",
          slug: "docs-reports",
          name: "문서·보고서",
          sortOrder: 1,
        },
      ],
    },
  ],
  tools: [
    {
      id: "t1",
      type: "TOOL",
      slug: "chatgpt",
      title: "ChatGPT",
      summary: "범용 AI 도구",
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
      strengths: ["문서 초안 작성에 강점"],
      limitations: ["사내 보안 확인 필요"],
    },
    {
      id: "t2",
      type: "TOOL",
      slug: "claude",
      title: "Claude",
      summary: "장문 분석 AI",
      publishStatus: "PUBLISHED",
      verificationStatus: "VALID",
      verifiedAt: "2026-11-25T00:00:00.000Z",
      sourceType: "OFFICIAL",
      sourceUrl: "https://claude.ai",
      helpfulCount: 3,
      toolKind: "TOOL",
      providerName: "Anthropic",
      officialUrl: "https://claude.ai",
      pricingModel: "FREEMIUM",
      hasFreePlan: true,
      pricingSummary: "무료 / Pro $20",
      koreanSupport: "FULL",
      platforms: ["Web"],
      strengths: ["자연스러운 한국어 문장력"],
      limitations: ["무료 사용량 제한"],
    },
  ],
  news: [
    {
      id: "n1",
      type: "NEWS",
      slug: "news-1",
      title: "신규 오피스 AI 기능 출시",
      summary: "문서 자동 요약 기능이 추가되었습니다.",
      publishStatus: "PUBLISHED",
      verificationStatus: "VALID",
      verifiedAt: "2026-11-25T00:00:00.000Z",
      sourceType: "OFFICIAL",
      sourceUrl: "https://example.com",
      helpfulCount: 0,
      keyPoints: ["요약 1"],
      workImpact: "주간 보고서 작성 시간을 단축할 수 있습니다.",
    },
  ],
  comparisonPresets: [
    {
      id: "free-chatbots",
      label: "ChatGPT vs Claude 비교",
      slugs: ["chatgpt", "claude"],
    },
    {
      id: "research-tools",
      label: "Perplexity 비교",
      slugs: ["perplexity"],
    },
  ],
};

function renderHome() {
  const qc = new QueryClient();
  return render(
    <QueryClientProvider client={qc}>
      <TooltipProvider>
        <HomePage initialData={mockInitialData} />
      </TooltipProvider>
    </QueryClientProvider>,
  );
}

describe("HomePage", () => {
  beforeEach(() => {
    resetCompareStore();
    guidesListMock.mockReset();
    compareMock.mockReset();
    compareMock.mockReturnValue({
      data: { data: [] },
      isLoading: false,
      isError: false,
    });
  });

  it("renders 2-col hero compare preview, hides helpfulCount 0, shows workImpact, and links CompareTray", async () => {
    renderHome();

    expect(
      screen.getByText("라이브 도구 비교 프리뷰"),
    ).toBeInTheDocument();
    expect(screen.getByText(/최근 검증일 2026-11-25/)).toBeInTheDocument();
    expect(screen.queryByText("도움됨 0")).not.toBeInTheDocument();
    expect(
      screen.getByText("주간 보고서 작성 시간을 단축할 수 있습니다."),
    ).toBeInTheDocument();

    const compareButtons = screen.getAllByRole("button", { name: "비교 담기" });
    fireEvent.click(compareButtons[0]!);

    expect(
      await screen.findByRole("region", { name: "선택된 도구 비교 트레이" }),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole("tab", { name: "Perplexity 비교" }));
    await waitFor(() => {
      expect(compareMock).toHaveBeenCalledWith(["perplexity"]);
    });
  });

  it("queries domain guides when a work domain tab is clicked", () => {
    guidesListMock.mockReturnValue({
      data: {
        data: [
          {
            ...mockInitialData.guides[0]!,
            title: "회의록 자동 정리 가이드",
          },
        ],
      },
      isLoading: false,
      isError: false,
      isSuccess: true,
    });

    renderHome();

    fireEvent.click(screen.getByRole("tab", { name: "회의·커뮤니케이션" }));

    expect(guidesListMock).toHaveBeenCalledWith({
      workDomain: "meetings-comms",
      limit: 6,
    });
    expect(screen.getByText("회의록 자동 정리 가이드")).toBeInTheDocument();
  });
});

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { TooltipProvider } from "@alkok/ui";
import { resetLocalVaultStore, useLocalVaultStore } from "@/entities/vault";
import { resetCompareStore } from "@/features/tool-compare";
import HomePage, { type HomeCatalogPayload } from "./HomePage";

let mockSearchParams = new URLSearchParams();
const replaceMock = vi.fn((url: string) => {
  const query = url.includes("?") ? url.split("?")[1] ?? "" : "";
  mockSearchParams = new URLSearchParams(query);
});

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), replace: replaceMock }),
  useSearchParams: () => mockSearchParams,
}));

const mockCatalog: HomeCatalogPayload = {
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
        {
          id: "c2",
          group: "AI_USE",
          slug: "writing-summary",
          name: "글쓰기·요약",
          sortOrder: 1,
        },
      ],
    },
    {
      id: "g2",
      type: "GUIDE",
      slug: "meeting-notes",
      title: "회의록 자동 정리 가이드",
      summary: "녹취록에서 결정사항과 할 일을 뽑는 방법",
      publishStatus: "PUBLISHED",
      verificationStatus: "VALID",
      verifiedAt: "2026-11-25T00:00:00.000Z",
      sourceType: "OFFICIAL",
      sourceUrl: "https://alkok.dobbymin.cloud",
      helpfulCount: 4,
      categories: [
        {
          id: "c3",
          group: "WORK_DOMAIN",
          slug: "meetings-comms",
          name: "회의·커뮤니케이션",
          sortOrder: 2,
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
      pricingModel: "PAID",
      hasFreePlan: false,
      pricingSummary: "Pro $20",
      koreanSupport: "PARTIAL",
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
  guidesTotal: 2,
  toolsTotal: 2,
  newsTotal: 1,
};

function renderHome() {
  const qc = new QueryClient();
  return render(
    <QueryClientProvider client={qc}>
      <TooltipProvider>
        <HomePage initialCatalog={mockCatalog} />
      </TooltipProvider>
    </QueryClientProvider>,
  );
}

describe("HomePage", () => {
  beforeEach(() => {
    mockSearchParams = new URLSearchParams();
    replaceMock.mockClear();
    resetCompareStore();
    resetLocalVaultStore();
  });

  it("renders service intro, 4-stat strip, 3-step usage band, and clean domain-anchored guide cards", () => {
    renderHome();

    expect(screen.queryByText("라이브 도구 비교 프리뷰")).not.toBeInTheDocument();
    expect(screen.queryByText("개인 지식 보관함")).not.toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "흩어진 AI 정보, 실무에 바로 쓰는 알맹이만 콕!",
      }),
    ).toBeInTheDocument();
    expect(screen.getByTestId("alkok-hero-mark")).toBeInTheDocument();
    expect(screen.getAllByText("2026-11-25").length).toBeGreaterThanOrEqual(1);
    const stepsHeading = screen.getByRole("heading", {
      name: "알콕, 3단계로 바로 쓰세요",
    });
    const catalogHeading = screen.getByRole("heading", {
      name: "실무 카탈로그",
    });
    expect(
      stepsHeading.compareDocumentPosition(catalogHeading) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
    expect(
      screen.getByRole("link", { name: "AI 도구 한눈에 비교하기" }),
    ).toBeInTheDocument();
    expect(screen.queryByText(/7축/)).not.toBeInTheDocument();
    expect(screen.getByText("주간 보고서 10분 완성 가이드")).toBeInTheDocument();
    expect(screen.getByText("회의록 자동 정리 가이드")).toBeInTheDocument();
    expect(screen.queryByText("도움됨 0")).not.toBeInTheDocument();
    expect(screen.getByText("2 / 2개")).toBeInTheDocument();
    expect(
      screen.getAllByRole("button", { name: "보관함에 콕 담기" }),
    ).toHaveLength(2);
    expect(screen.queryByText("보관함에 콕 담기")).not.toBeInTheDocument();
  });

  it("collapses service intro into focused domain header when domain filter is active", () => {
    mockSearchParams = new URLSearchParams("domain=docs-reports");
    renderHome();

    expect(
      screen.queryByText("알콕, 3단계로 바로 쓰세요"),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "문서·보고서" }),
    ).toBeInTheDocument();
    expect(screen.getByText("주간 보고서 10분 완성 가이드")).toBeInTheDocument();
    expect(
      screen.queryByText("회의록 자동 정리 가이드"),
    ).not.toBeInTheDocument();
  });

  it("filters guides in real time via search input and focuses search on '/' key", () => {
    renderHome();

    const searchInput = screen.getByRole("textbox", { name: "카탈로그 실시간 검색" });
    fireEvent.keyDown(window, { key: "/" });
    expect(document.activeElement).toBe(searchInput);

    fireEvent.change(searchInput, { target: { value: "회의록" } });

    expect(screen.getByText("회의록 자동 정리 가이드")).toBeInTheDocument();
    expect(
      screen.queryByText("주간 보고서 10분 완성 가이드"),
    ).not.toBeInTheDocument();
    expect(replaceMock).toHaveBeenCalledWith("/?q=%ED%9A%8C%EC%9D%98%EB%A1%9D", {
      scroll: false,
    });
  });

  it("switches tabs, filters tools + links CompareTray, and shows workImpact on news tab", async () => {
    const view = renderHome();

    fireEvent.click(screen.getByRole("tab", { name: /AI 도구/ }));
    expect(replaceMock).toHaveBeenCalledWith("/?tab=tools", { scroll: false });
    view.rerender(
      <QueryClientProvider client={new QueryClient()}>
        <TooltipProvider>
          <HomePage initialCatalog={mockCatalog} />
        </TooltipProvider>
      </QueryClientProvider>,
    );

    expect(screen.getByText("ChatGPT")).toBeInTheDocument();
    expect(screen.getByText("Claude")).toBeInTheDocument();

    fireEvent.change(screen.getByRole("combobox", { name: "세부 조건 필터" }), {
      target: { value: "free" },
    });
    view.rerender(
      <QueryClientProvider client={new QueryClient()}>
        <TooltipProvider>
          <HomePage initialCatalog={mockCatalog} />
        </TooltipProvider>
      </QueryClientProvider>,
    );
    expect(screen.getByText("ChatGPT")).toBeInTheDocument();
    expect(screen.queryByText("Claude")).not.toBeInTheDocument();

    const compareButtons = screen.getAllByRole("button", { name: "비교 담기" });
    fireEvent.click(compareButtons[0]!);
    expect(
      await screen.findByRole("region", { name: "선택된 도구 비교 트레이" }),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole("tab", { name: /AI 소식/ }));
    view.rerender(
      <QueryClientProvider client={new QueryClient()}>
        <TooltipProvider>
          <HomePage initialCatalog={mockCatalog} />
        </TooltipProvider>
      </QueryClientProvider>,
    );
    expect(
      screen.getByText("주간 보고서 작성 시간을 단축할 수 있습니다."),
    ).toBeInTheDocument();
  });

  it("filters saved items using local vault store", () => {
    useLocalVaultStore.getState().saveItem({
      contentId: "g2",
      title: "회의록 자동 정리 가이드",
      contentType: "GUIDE",
      slug: "meeting-notes",
    });

    const view = renderHome();
    fireEvent.click(screen.getByRole("button", { name: /저장한 항목/ }));
    view.rerender(
      <QueryClientProvider client={new QueryClient()}>
        <TooltipProvider>
          <HomePage initialCatalog={mockCatalog} />
        </TooltipProvider>
      </QueryClientProvider>,
    );

    expect(screen.getByText("회의록 자동 정리 가이드")).toBeInTheDocument();
    expect(
      screen.queryByText("주간 보고서 10분 완성 가이드"),
    ).not.toBeInTheDocument();
  });
});

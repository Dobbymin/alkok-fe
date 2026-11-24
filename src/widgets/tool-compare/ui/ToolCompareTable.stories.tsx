import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import type { ToolDetailData } from "@/shared/types";
import { ToolCompareTable } from "./ToolCompareTable";

const sampleTools: ToolDetailData[] = [
  {
    id: "t1",
    type: "TOOL",
    slug: "chatgpt",
    title: "ChatGPT",
    summary: "범용 AI 어시스턴트",
    publishStatus: "PUBLISHED",
    verificationStatus: "VALID",
    verifiedAt: "2026-11-24T00:00:00.000Z",
    sourceType: "OFFICIAL",
    sourceUrl: "https://chatgpt.com",
    sourceName: "OpenAI",
    helpfulCount: 40,
    toolKind: "TOOL",
    providerName: "OpenAI",
    officialUrl: "https://chatgpt.com",
    pricingModel: "FREEMIUM",
    pricingSummary: "무료 플랜 + Plus 월 $20",
    hasFreePlan: true,
    koreanSupport: "FULL",
    platforms: ["Web", "iOS", "macOS"],
    isAffiliate: false,
    strengths: ["문서 요약", "코드 생성"],
    limitations: ["실시간 정보 확인 필요"],
  },
  {
    id: "t2",
    type: "TOOL",
    slug: "claude",
    title: "Claude",
    summary: "긴 문서 분석 및 글쓰기 특화 AI",
    publishStatus: "PUBLISHED",
    verificationStatus: "VALID",
    verifiedAt: "2026-11-24T00:00:00.000Z",
    sourceType: "OFFICIAL",
    sourceUrl: "https://claude.ai",
    sourceName: "Anthropic",
    helpfulCount: 35,
    toolKind: "TOOL",
    providerName: "Anthropic",
    officialUrl: "https://claude.ai",
    pricingModel: "FREEMIUM",
    pricingSummary: "무료 플랜 + Plus 월 $20",
    hasFreePlan: true,
    koreanSupport: "FULL",
    platforms: ["Web", "iOS"],
    isAffiliate: false,
    strengths: ["자연스러운 한국어", "아티팩트"],
    limitations: ["무료 사용량 제한"],
  },
];

const meta: Meta<typeof ToolCompareTable> = {
  title: "Widgets/ToolCompare/ToolCompareTable",
  component: ToolCompareTable,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof ToolCompareTable>;

export const Default: Story = {
  args: {
    tools: sampleTools,
  },
};

export const Loading: Story = {
  args: {
    tools: [],
    isLoading: true,
  },
};

export const Empty: Story = {
  args: {
    tools: [],
  },
};

export const ErrorStateStory: Story = {
  args: {
    tools: [],
    error: "비교 데이터를 불러오지 못했습니다.",
  },
};

export const Mobile390: Story = {
  args: {
    tools: sampleTools,
  },
  globals: {
    viewport: { value: "mobile390", isRotated: false },
  },
};

import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import type { ContentSummary } from "@alkok/core";
import { ContentCard, ContentCardSkeleton } from "./ContentCard";

const sampleGuide: ContentSummary = {
  id: "g1",
  type: "GUIDE",
  slug: "weekly-report-prompt",
  title: "주간 업무 보고서 5분 완성 프롬프트",
  summary: "회의록과 진행 업무를 붙여넣으면 팀장 보고용 요약과 리스크를 자동 정리합니다.",
  publishStatus: "PUBLISHED",
  verificationStatus: "VALID",
  verifiedAt: "2026-11-24T00:00:00.000Z",
  sourceType: "OFFICIAL",
  sourceUrl: "https://openai.com",
  sourceName: "OpenAI",
  helpfulCount: 24,
  tags: [{ id: "t1", name: "문서·보고서", slug: "report" }],
};

const meta: Meta<typeof ContentCard> = {
  title: "Entities/Content/ContentCard",
  component: ContentCard,
  tags: ["autodocs"],
  args: {
    item: sampleGuide,
  },
};

export default meta;
type Story = StoryObj<typeof ContentCard>;

export const Default: Story = {};

export const LoadingSkeleton: Story = {
  render: () => <ContentCardSkeleton />,
};

export const Mobile390: Story = {
  globals: {
    viewport: { value: "mobile390", isRotated: false },
  },
};

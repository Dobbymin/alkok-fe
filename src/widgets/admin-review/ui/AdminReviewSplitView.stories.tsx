import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { AdminReviewSplitView, type AdminReviewItem } from "./AdminReviewSplitView";

const sampleItem: AdminReviewItem = {
  id: "inbox-1",
  type: "GUIDE",
  title: "Claude Artifacts로 주간 보고서 시각화하기",
  summary: "CSV 데이터를 붙여넣고 즉시 차트와 요약 보고서를 생성합니다.",
  sourceType: "OFFICIAL",
  sourceUrl: "https://anthropic.com/news",
  sourceName: "Anthropic News",
  rawTextExcerpt: "Anthropic announced Artifacts support for interactive charts...",
  evidenceNotes: ["공식 블로그 2026-11 업데이트 확인", "한국어 UI 정상 동작"],
  unverifiedFields: ["pricingSummary"],
  tags: ["문서·보고서", "시각화"],
  markdownBody: "## 1. 준비하기\n데이터를 준비합니다.",
  pricingSummary: "무료 플랜 월 제한 적용",
};

const noop = () => {};

const meta: Meta<typeof AdminReviewSplitView> = {
  title: "Widgets/AdminReview/AdminReviewSplitView",
  component: AdminReviewSplitView,
  tags: ["autodocs"],
  args: {
    onApprove: noop,
    onSaveDraft: noop,
    onReject: noop,
  },
};

export default meta;
type Story = StoryObj<typeof AdminReviewSplitView>;

export const Default: Story = {
  args: {
    item: sampleItem,
  },
};

export const Loading: Story = {
  args: {
    item: null,
    isLoading: true,
  },
};

export const Empty: Story = {
  args: {
    item: null,
  },
};

export const ErrorStateStory: Story = {
  args: {
    item: null,
    error: "검수 항목을 불러오지 못했습니다.",
  },
};

export const Mobile390: Story = {
  args: {
    item: sampleItem,
  },
  globals: {
    viewport: { value: "mobile390", isRotated: false },
  },
};

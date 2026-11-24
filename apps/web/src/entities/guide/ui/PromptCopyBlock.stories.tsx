import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { PromptCopyBlock } from "./PromptCopyBlock";

const meta: Meta<typeof PromptCopyBlock> = {
  title: "Entities/Guide/PromptCopyBlock",
  component: PromptCopyBlock,
  tags: ["autodocs"],
  args: {
    title: "회의록 액션 아이템 추출 프롬프트",
    content:
      "아래 [회의록]을 바탕으로 1) 핵심 결정사항 3줄, 2) [담당자]별 마감 기한 표를 작성해 주세요.",
  },
};

export default meta;
type Story = StoryObj<typeof PromptCopyBlock>;

export const Default: Story = {};

export const Mobile390: Story = {
  globals: {
    viewport: { value: "mobile390", isRotated: false },
  },
};

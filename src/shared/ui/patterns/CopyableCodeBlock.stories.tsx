import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { CopyableCodeBlock } from "./CopyableCodeBlock";

const meta: Meta<typeof CopyableCodeBlock> = {
  title: "Shared/Patterns/CopyableCodeBlock",
  component: CopyableCodeBlock,
  tags: ["autodocs"],
  args: {
    title: "프롬프트 예시",
    code: "다음 회의록을 3줄 요약하고 [담당자]별 액션 아이템을 표로 정리해 주세요.",
  },
};

export default meta;
type Story = StoryObj<typeof CopyableCodeBlock>;

export const Default: Story = {};

export const Mobile390: Story = {
  globals: {
    viewport: { value: "mobile390", isRotated: false },
  },
};

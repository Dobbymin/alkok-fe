import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Bookmark } from "lucide-react";
import { Button } from "../primitives/Button";
import { EmptyState } from "./EmptyState";

const meta: Meta<typeof EmptyState> = {
  title: "Shared/Patterns/EmptyState",
  component: EmptyState,
  tags: ["autodocs"],
  args: {
    icon: <Bookmark className="h-6 w-6" aria-hidden="true" />,
    title: "저장된 항목이 없습니다.",
    description: "가이드나 AI 도구를 보관함에 저장하면 여기에서 바로 찾아볼 수 있습니다.",
    action: <Button size="sm">가이드 둘러보기</Button>,
  },
};

export default meta;
type Story = StoryObj<typeof EmptyState>;

export const Default: Story = {};

export const Mobile390: Story = {
  globals: {
    viewport: { value: "mobile390", isRotated: false },
  },
};

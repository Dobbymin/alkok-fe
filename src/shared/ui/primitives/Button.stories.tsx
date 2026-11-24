import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Button } from "./Button";

const meta: Meta<typeof Button> = {
  title: "Shared/Primitives/Button",
  component: Button,
  tags: ["autodocs"],
  args: {
    children: "보관함에 저장",
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Default: Story = {};

export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button variant="default">기본</Button>
      <Button variant="secondary">보조</Button>
      <Button variant="outline">외곽선</Button>
      <Button variant="ghost">고스트</Button>
      <Button variant="destructive">삭제</Button>
    </div>
  ),
};

export const DisabledLoading: Story = {
  args: {
    disabled: true,
    children: "처리 중...",
  },
};

export const DarkMode: Story = {
  render: () => (
    <div className="dark rounded-lg bg-background p-4 text-foreground">
      <div className="flex flex-wrap gap-2">
        <Button>다크 기본</Button>
        <Button variant="outline">다크 외곽선</Button>
      </div>
    </div>
  ),
};

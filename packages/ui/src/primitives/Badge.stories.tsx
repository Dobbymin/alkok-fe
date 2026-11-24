import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Badge } from "./Badge";

const meta: Meta<typeof Badge> = {
  title: "Shared/Primitives/Badge",
  component: Badge,
  tags: ["autodocs"],
  args: {
    children: "확인됨",
  },
};

export default meta;
type Story = StoryObj<typeof Badge>;

export const Default: Story = {};

export const SemanticStatuses: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <Badge variant="valid">유효함</Badge>
      <Badge variant="review">재확인 필요</Badge>
      <Badge variant="expired">만료</Badge>
      <Badge variant="affiliate">제휴 링크</Badge>
      <Badge variant="secondary">보조</Badge>
      <Badge variant="outline">외곽선</Badge>
    </div>
  ),
};

export const DarkMode: Story = {
  render: () => (
    <div className="dark rounded-lg bg-background p-4">
      <div className="flex flex-wrap gap-2">
        <Badge variant="valid">유효함</Badge>
        <Badge variant="review">재확인 필요</Badge>
        <Badge variant="expired">만료</Badge>
      </div>
    </div>
  ),
};

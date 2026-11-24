import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { SplitPane } from "./SplitPane";

const meta: Meta<typeof SplitPane> = {
  title: "Shared/Patterns/SplitPane",
  component: SplitPane,
  tags: ["autodocs"],
  args: {
    left: (
      <div className="rounded-lg border border-border bg-card p-4 text-sm">
        원문 근거 영역
      </div>
    ),
    right: (
      <div className="rounded-lg border border-border bg-card p-4 text-sm">
        초안 편집 영역
      </div>
    ),
  },
};

export default meta;
type Story = StoryObj<typeof SplitPane>;

export const Default: Story = {};

export const Mobile390: Story = {
  globals: {
    viewport: { value: "mobile390", isRotated: false },
  },
};

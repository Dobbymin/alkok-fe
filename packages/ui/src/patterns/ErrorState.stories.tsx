import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Button } from "../primitives/Button";
import { ErrorState } from "./ErrorState";

const meta: Meta<typeof ErrorState> = {
  title: "Shared/Patterns/ErrorState",
  component: ErrorState,
  tags: ["autodocs"],
  args: {
    title: "데이터를 불러오지 못했습니다.",
    description: "네트워크 상태를 확인한 뒤 다시 시도해 주세요.",
    action: (
      <Button variant="outline" size="sm">
        다시 시도
      </Button>
    ),
  },
};

export default meta;
type Story = StoryObj<typeof ErrorState>;

export const Default: Story = {};

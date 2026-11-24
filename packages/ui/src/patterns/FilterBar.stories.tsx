import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Button } from "../primitives/Button";
import { Input } from "../primitives/Input";
import { FilterBar } from "./FilterBar";

const meta: Meta<typeof FilterBar> = {
  title: "Shared/Patterns/FilterBar",
  component: FilterBar,
  tags: ["autodocs"],
  args: {
    children: (
      <>
        <Input placeholder="키워드 검색" className="max-w-xs" />
        <Button size="sm">전체</Button>
        <Button size="sm" variant="outline">
          유료
        </Button>
      </>
    ),
  },
};

export default meta;
type Story = StoryObj<typeof FilterBar>;

export const Default: Story = {};

export const Mobile390: Story = {
  globals: {
    viewport: { value: "mobile390", isRotated: false },
  },
};

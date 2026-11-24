import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { BookmarkAction } from "./BookmarkAction";

const meta: Meta<typeof BookmarkAction> = {
  title: "Features/Vault/BookmarkAction",
  component: BookmarkAction,
  tags: ["autodocs"],
  args: {
    contentId: "c1",
    title: "주간 업무 보고서 5분 완성 프롬프트",
  },
};

export default meta;
type Story = StoryObj<typeof BookmarkAction>;

export const Unsaved: Story = {};

export const Saved: Story = {
  args: {
    initialSavedItem: {
      id: "v1",
      itemType: "INTERNAL_CONTENT",
      contentId: "c1",
      title: "주간 업무 보고서 5분 완성 프롬프트",
      folderId: "f1",
      folderName: "보고서",
      memo: "금요일 주간 보고에 활용",
      tags: [{ id: "t1", name: "보고서" }],
      createdAt: "2026-11-24T00:00:00.000Z",
    },
  },
};

export const Mobile390: Story = {
  globals: {
    viewport: { value: "mobile390", isRotated: false },
  },
};

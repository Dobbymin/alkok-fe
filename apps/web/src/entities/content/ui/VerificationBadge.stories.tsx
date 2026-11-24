import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { VerificationBadge } from "./VerificationBadge";

const meta: Meta<typeof VerificationBadge> = {
  title: "Entities/Content/VerificationBadge",
  component: VerificationBadge,
  tags: ["autodocs"],
  args: {
    status: "VALID",
    verifiedAt: "2026-11-24T00:00:00.000Z",
    sourceType: "OFFICIAL",
    sourceName: "OpenAI Docs",
    showSourceBadge: true,
  },
};

export default meta;
type Story = StoryObj<typeof VerificationBadge>;

export const Valid: Story = {};

export const NeedsReview: Story = {
  args: {
    status: "NEEDS_REVIEW",
    sourceType: "MEDIA",
    sourceName: "TechCrunch",
  },
};

export const Expired: Story = {
  args: {
    status: "EXPIRED",
    sourceType: "COMMUNITY",
    sourceName: "커뮤니티 제보",
  },
};

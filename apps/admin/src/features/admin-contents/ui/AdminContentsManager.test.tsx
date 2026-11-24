import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { AdminContentsManager } from "./AdminContentsManager";
import { adminContentsApi } from "../api/admin-contents.api";

vi.mock("../api/admin-contents.api", () => ({
  adminContentsApi: {
    list: vi.fn().mockResolvedValue({
      data: [
        {
          id: "c1",
          type: "GUIDE",
          slug: "meeting-notes",
          title: "회의록 자동 요약 가이드",
          summary: "요약",
          publishStatus: "PUBLISHED",
          verificationStatus: "NEEDS_REVIEW",
          verifiedAt: "2026-10-01T00:00:00.000Z",
          sourceType: "OFFICIAL",
          sourceUrl: "https://openai.com",
          helpfulCount: 3,
        },
      ],
    }),
    create: vi.fn().mockResolvedValue({ data: {} }),
    update: vi.fn().mockResolvedValue({ data: {} }),
    verify: vi.fn().mockResolvedValue({ data: {} }),
    archive: vi.fn().mockResolvedValue({ data: {} }),
    remove: vi.fn().mockResolvedValue(undefined),
  },
}));

describe("AdminContentsManager", () => {
  it("lists contents and calls verify when clicking 확인 완료", async () => {
    const user = userEvent.setup();
    const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });

    render(
      <QueryClientProvider client={qc}>
        <AdminContentsManager />
      </QueryClientProvider>,
    );

    expect(
      await screen.findByText("회의록 자동 요약 가이드"),
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "확인 완료" }));
    expect(adminContentsApi.verify).toHaveBeenCalledWith("c1");
  });
});

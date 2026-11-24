import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { AdminSourcesManager } from "./AdminSourcesManager";
import { adminSourcesApi } from "../api/admin-sources.api";

vi.mock("../api/admin-sources.api", () => ({
  adminSourcesApi: {
    list: vi.fn().mockResolvedValue({
      data: [
        {
          id: "s1",
          name: "OpenAI News",
          feedUrl: "https://openai.com/news/rss.xml",
          sourceType: "OFFICIAL",
          fetchIntervalHours: 6,
          isActive: true,
          lastFetchedAt: "2026-11-24T09:00:00.000Z",
          lastError: null,
        },
      ],
    }),
    listJobs: vi.fn().mockResolvedValue({
      data: [
        {
          id: "j1",
          type: "RSS_FETCH",
          status: "SUCCEEDED",
          attempts: 1,
          maxAttempts: 3,
          createdAt: "2026-11-24T09:00:00.000Z",
        },
      ],
    }),
    create: vi.fn().mockResolvedValue({ data: {} }),
    update: vi.fn().mockResolvedValue({ data: {} }),
    remove: vi.fn().mockResolvedValue(undefined),
    triggerFetch: vi.fn().mockResolvedValue({ data: { jobId: "j2" } }),
  },
}));

describe("AdminSourcesManager", () => {
  it("renders sources and triggers immediate fetch", async () => {
    const user = userEvent.setup();
    const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });

    render(
      <QueryClientProvider client={qc}>
        <AdminSourcesManager />
      </QueryClientProvider>,
    );

    expect(await screen.findByText("OpenAI News")).toBeInTheDocument();
    expect(screen.getByText("성공")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "지금 수집" }));
    expect(adminSourcesApi.triggerFetch).toHaveBeenCalledWith("s1");
  });
});

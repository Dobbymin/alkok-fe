import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { resetAuthStore } from "@alkok/core";
import SearchPage from "./SearchPage";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
  useSearchParams: () => new URLSearchParams("q=회의록"),
}));

vi.mock("@/features/quick-search", () => ({
  useUnifiedSearch: () => ({
    isLoading: false,
    isError: false,
    data: { data: { items: [], vaultItems: [] } },
    refetch: vi.fn(),
  }),
}));

describe("SearchPage", () => {
  beforeEach(() => {
    resetAuthStore();
  });
  it("hides 내 보관함 tab for unauthenticated users", () => {
    const qc = new QueryClient();
    render(
      <QueryClientProvider client={qc}>
        <SearchPage />
      </QueryClientProvider>,
    );

    expect(screen.getByRole("tab", { name: "업무 가이드" })).toBeInTheDocument();
    expect(screen.queryByRole("tab", { name: "내 보관함" })).not.toBeInTheDocument();
  });
});

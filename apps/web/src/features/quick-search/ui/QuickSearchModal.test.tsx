import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  resetQuickSearchStore,
  useQuickSearchStore,
} from "../model/quick-search.store";
import { QuickSearchModal } from "./QuickSearchModal";
import { searchApi } from "../api/search.api";

const pushMock = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushMock }),
}));

vi.mock("../api/search.api", () => ({
  searchApi: {
    suggest: vi.fn().mockResolvedValue({
      data: [
        { id: "g1", type: "GUIDE", slug: "meeting-notes", title: "회의록 정리 가이드" },
      ],
    }),
    search: vi.fn(),
  },
}));

describe("QuickSearchModal", () => {
  beforeEach(() => {
    resetQuickSearchStore();
    useQuickSearchStore.setState({ open: true });
  });

  afterEach(() => {
    vi.useRealTimers();
    pushMock.mockReset();
    resetQuickSearchStore();
  });

  it("debounces suggest calls by 250ms and navigates to /search?q= on submit", async () => {
    vi.useFakeTimers();
    const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });

    render(
      <QueryClientProvider client={qc}>
        <QuickSearchModal />
      </QueryClientProvider>,
    );

    const input = screen.getByLabelText("검색어 입력");
    fireEvent.change(input, { target: { value: "회의록" } });

    expect(searchApi.suggest).not.toHaveBeenCalled();

    await act(async () => {
      vi.advanceTimersByTime(260);
    });

    expect(searchApi.suggest).toHaveBeenCalledWith("회의록");

    fireEvent.submit(input.closest("form")!);
    expect(pushMock).toHaveBeenCalledWith("/search?q=%ED%9A%8C%EC%9D%98%EB%A1%9D");
    expect(useQuickSearchStore.getState().open).toBe(false);
    expect(useQuickSearchStore.getState().recentSearches).toEqual(["회의록"]);
  });

  it("shows popular search chips when query is empty", async () => {
    const user = userEvent.setup();
    const qc = new QueryClient();

    render(
      <QueryClientProvider client={qc}>
        <QuickSearchModal />
      </QueryClientProvider>,
    );

    await user.click(screen.getByRole("button", { name: "회의록 정리" }));
    expect(pushMock).toHaveBeenCalledWith(
      "/search?q=%ED%9A%8C%EC%9D%98%EB%A1%9D%20%EC%A0%95%EB%A6%AC",
    );
  });
});

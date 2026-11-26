import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { resetAuthStore, useAuthStore } from "@alkok/core";
import { helpfulApi } from "../api/helpful.api";
import { HelpfulButton } from "./HelpfulButton";

const pushMock = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushMock }),
  usePathname: () => "/guides/sample",
}));

describe("HelpfulButton", () => {
  beforeEach(() => {
    resetAuthStore();
  });

  it("toggles helpful state for authenticated users and avoids mutation for guests", async () => {
    const markSpy = vi
      .spyOn(helpfulApi, "markHelpful")
      .mockResolvedValueOnce({ data: { helpfulCount: 5, isHelpful: true } });

    const qc = new QueryClient();
    render(
      <QueryClientProvider client={qc}>
        <HelpfulButton contentId="c1" initialCount={4} initialHelpful={false} />
      </QueryClientProvider>,
    );

    fireEvent.click(screen.getByRole("button", { name: /도움이 되었어요/ }));
    expect(markSpy).not.toHaveBeenCalled();

    act(() => {
      useAuthStore.setState({
        user: {
          id: "u1",
          email: "user@alkok.kr",
          nickname: "테스터",
          role: "USER",
          status: "ACTIVE",
        },
        isLoading: false,
      });
    });

    fireEvent.click(screen.getByRole("button", { name: /도움이 되었어요/ }));

    await waitFor(() => {
      expect(markSpy).toHaveBeenCalledWith("c1");
      expect(screen.getByText("5")).toBeInTheDocument();
    });
  });
});

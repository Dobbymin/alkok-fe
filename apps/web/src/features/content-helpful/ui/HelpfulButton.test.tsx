import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { helpfulApi } from "../api/helpful.api";
import { HelpfulButton } from "./HelpfulButton";

const pushMock = vi.fn();
let authed = false;

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushMock }),
  usePathname: () => "/guides/sample",
}));

vi.mock("@alkok/core", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@alkok/core")>();
  return {
    ...actual,
  useAuth: () => ({ isAuthenticated: authed }),
};
});

describe("HelpfulButton", () => {
  it("toggles helpful state for authenticated users and avoids mutation for guests", async () => {
    const markSpy = vi
      .spyOn(helpfulApi, "markHelpful")
      .mockResolvedValueOnce({ data: { helpfulCount: 5, isHelpful: true } });

    const qc = new QueryClient();
    authed = false;
    const { rerender } = render(
      <QueryClientProvider client={qc}>
        <HelpfulButton contentId="c1" initialCount={4} initialHelpful={false} />
      </QueryClientProvider>,
    );

    fireEvent.click(screen.getByRole("button", { name: /도움이 되었어요/ }));
    expect(markSpy).not.toHaveBeenCalled();

    authed = true;
    rerender(
      <QueryClientProvider client={qc}>
        <HelpfulButton contentId="c1" initialCount={4} initialHelpful={false} />
      </QueryClientProvider>,
    );

    fireEvent.click(screen.getByRole("button", { name: /도움이 되었어요/ }));

    await waitFor(() => {
      expect(markSpy).toHaveBeenCalledWith("c1");
      expect(screen.getByText("5")).toBeInTheDocument();
    });
  });
});

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { BookmarkAction } from "./BookmarkAction";

const createBookmarkMock = vi.fn();
const updateItemMock = vi.fn();
const deleteItemMock = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
  usePathname: () => "/guides/sample",
}));

vi.mock("@alkok/core", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@alkok/core")>();
  return {
    ...actual,
  useAuth: () => ({ isAuthenticated: true }),
};
});

vi.mock("@/entities/vault", () => ({
  useVaultFoldersQuery: () => ({
    data: { data: [{ id: "f1", name: "보고서" }] },
  }),
  useCreateBookmarkMutation: () => ({
    mutateAsync: createBookmarkMock,
    isPending: false,
  }),
  useUpdateVaultItemMutation: () => ({
    mutateAsync: updateItemMock,
    isPending: false,
  }),
  useDeleteVaultItemMutation: () => ({
    mutateAsync: deleteItemMock,
    isPending: false,
  }),
}));

describe("BookmarkAction", () => {
  it("saves bookmark and opens quick edit popover", async () => {
    createBookmarkMock.mockResolvedValueOnce({
      data: {
        id: "v1",
        itemType: "INTERNAL_CONTENT",
        contentId: "c1",
        title: "샘플 가이드",
        tags: [],
        createdAt: "2026-11-24T00:00:00.000Z",
      },
    });
    updateItemMock.mockResolvedValueOnce({
      data: {
        id: "v1",
        itemType: "INTERNAL_CONTENT",
        contentId: "c1",
        title: "샘플 가이드",
        folderId: "f1",
        memo: "핵심 프롬프트",
        tags: [{ id: "t1", name: "보고서" }],
        createdAt: "2026-11-24T00:00:00.000Z",
      },
    });

    const qc = new QueryClient();
    render(
      <QueryClientProvider client={qc}>
        <BookmarkAction contentId="c1" title="샘플 가이드" />
      </QueryClientProvider>,
    );

    fireEvent.click(screen.getByRole("button", { name: "보관함에 저장" }));

    expect(await screen.findByText("보관함 빠른 정리")).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("메모"), {
      target: { value: "핵심 프롬프트" },
    });
    fireEvent.click(screen.getByRole("button", { name: "적용" }));

    await waitFor(() => {
      expect(updateItemMock).toHaveBeenCalledWith({
        id: "v1",
        input: {
          folderId: null,
          memo: "핵심 프롬프트",
          tagNames: [],
        },
      });
    });
  });
});

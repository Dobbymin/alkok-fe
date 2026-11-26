import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { resetAuthStore, useAuthStore } from "@alkok/core";
import { resetLocalVaultStore, useLocalVaultStore } from "@/entities/vault";
import { BookmarkAction } from "./BookmarkAction";

const createBookmarkMock = vi.fn();
const updateItemMock = vi.fn();
const deleteItemMock = vi.fn();
const pushMock = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushMock }),
}));

vi.mock("@/entities/vault", async () => {
  const actual = await vi.importActual<typeof import("@/entities/vault")>(
    "@/entities/vault",
  );
  return {
    ...actual,
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
  };
});

describe("BookmarkAction", () => {
  beforeEach(() => {
    resetAuthStore();
    resetLocalVaultStore();
    pushMock.mockReset();
    createBookmarkMock.mockReset();
    updateItemMock.mockReset();
    deleteItemMock.mockReset();
  });

  it("toggles local vault storage for guests without redirecting to login", () => {
    const qc = new QueryClient();
    render(
      <QueryClientProvider client={qc}>
        <BookmarkAction
          contentId="c-guest"
          title="비회원 가이드"
          contentType="GUIDE"
          slug="guest-guide"
        />
      </QueryClientProvider>,
    );

    fireEvent.click(screen.getByRole("button", { name: "보관함에 콕 담기" }));

    expect(pushMock).not.toHaveBeenCalled();
    expect(useLocalVaultStore.getState().items).toHaveLength(1);
    expect(
      screen.getByRole("button", { name: "보관함에 저장됨 (해제)" }),
    ).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("button", { name: "보관함에 저장됨 (해제)" }),
    );
    expect(useLocalVaultStore.getState().items).toHaveLength(0);
  });

  it("renders compact icon-only trigger when iconOnly is true", () => {
    const qc = new QueryClient();
    render(
      <QueryClientProvider client={qc}>
        <BookmarkAction
          iconOnly
          contentId="c-icon"
          title="아이콘 테스트"
          contentType="GUIDE"
          slug="icon-guide"
        />
      </QueryClientProvider>,
    );

    expect(screen.queryByText("보관함에 콕 담기")).not.toBeInTheDocument();
    const btn = screen.getByRole("button", { name: "보관함에 콕 담기" });
    fireEvent.click(btn);
    expect(useLocalVaultStore.getState().items).toHaveLength(1);
    expect(
      screen.getByRole("button", { name: "보관함에 저장됨 (해제)" }),
    ).toBeInTheDocument();
  });

  it("saves server bookmark and opens quick edit popover for authenticated users", async () => {
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

    fireEvent.click(screen.getByRole("button", { name: "보관함에 콕 담기" }));

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

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { resetAuthStore, useAuthStore } from "@alkok/core";
import { resetLocalVaultStore, useLocalVaultStore } from "@/entities/vault";
import VaultPage from "./VaultPage";

vi.mock("@/entities/vault", async () => {
  const actual = await vi.importActual<typeof import("@/entities/vault")>(
    "@/entities/vault",
  );
  return {
    ...actual,
    useVaultFoldersQuery: () => ({ data: { data: [] }, isLoading: false }),
    useVaultTagsQuery: () => ({ data: { data: [] }, isLoading: false }),
    useVaultItemsQuery: () => ({
      data: {
        data: [
          {
            id: "sv1",
            itemType: "INTERNAL_CONTENT",
            contentId: "c1",
            content: {
              id: "c1",
              type: "GUIDE",
              slug: "server-guide",
              title: "서버 저장 가이드",
              summary: "요약",
              publishStatus: "PUBLISHED",
              verificationStatus: "VALID",
              sourceType: "OFFICIAL",
              sourceUrl: "https://alkok.dobbymin.cloud",
              helpfulCount: 1,
            },
            title: "서버 저장 가이드",
            tags: [],
            createdAt: "2026-11-26T00:00:00.000Z",
          },
        ],
      },
      isLoading: false,
      isError: false,
    }),
    useDeleteVaultTagMutation: () => ({ mutateAsync: vi.fn() }),
  };
});

describe("VaultPage", () => {
  beforeEach(() => {
    resetAuthStore();
    resetLocalVaultStore();
  });

  it("renders guest local vault with sync banner, search filter, and item removal", () => {
    useLocalVaultStore.getState().saveItem({
      contentId: "g1",
      title: "비회원 저장 보고서 가이드",
      contentType: "GUIDE",
      slug: "weekly-report",
      summary: "보고서 초안 요약",
    });

    const qc = new QueryClient();
    render(
      <QueryClientProvider client={qc}>
        <VaultPage />
      </QueryClientProvider>,
    );

    expect(
      screen.getByText(
        "로그인하면 기기 간 동기화와 외부 URL 저장을 사용할 수 있어요",
      ),
    ).toBeInTheDocument();
    expect(screen.getByText("비회원 저장 보고서 가이드")).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("로컬 보관함 검색"), {
      target: { value: "없는키워드" },
    });
    expect(
      screen.queryByText("비회원 저장 보고서 가이드"),
    ).not.toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("로컬 보관함 검색"), {
      target: { value: "" },
    });
    fireEvent.click(
      screen.getByRole("button", { name: "비회원 저장 보고서 가이드 삭제" }),
    );
    expect(useLocalVaultStore.getState().items).toHaveLength(0);
  });

  it("renders authenticated server vault", () => {
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

    const qc = new QueryClient();
    render(
      <QueryClientProvider client={qc}>
        <VaultPage />
      </QueryClientProvider>,
    );

    expect(screen.getByText("서버 저장 가이드")).toBeInTheDocument();
  });
});

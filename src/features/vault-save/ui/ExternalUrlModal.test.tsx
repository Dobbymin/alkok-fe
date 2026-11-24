import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ApiError } from "@/shared/api";
import { ExternalUrlModal } from "./ExternalUrlModal";

const previewMutateAsyncMock = vi.fn();
const createMutateAsyncMock = vi.fn();

vi.mock("@/entities/vault", () => ({
  usePreviewExternalUrlMutation: () => ({
    mutateAsync: previewMutateAsyncMock,
    isPending: false,
  }),
  useCreateExternalUrlMutation: () => ({
    mutateAsync: createMutateAsyncMock,
    isPending: false,
  }),
}));

describe("ExternalUrlModal", () => {
  it("handles OG fallback: true manual input, 400 SSRF_BLOCKED_URL, and 409 VAULT_DUPLICATE_URL", async () => {
    const qc = new QueryClient();
    render(
      <QueryClientProvider client={qc}>
        <ExternalUrlModal folders={[{ id: "f1", name: "리서치" }]} />
      </QueryClientProvider>,
    );

    fireEvent.click(screen.getByRole("button", { name: "외부 URL 추가" }));

    const urlInput = screen.getByLabelText(/URL/);
    const previewBtn = screen.getByRole("button", { name: "미리보기" });

    // 1. 400 SSRF_BLOCKED_URL
    previewMutateAsyncMock.mockRejectedValueOnce(
      new ApiError({
        statusCode: 400,
        errorCode: "SSRF_BLOCKED_URL",
        message: "Blocked",
      }),
    );
    fireEvent.change(urlInput, { target: { value: "http://127.0.0.1/secret" } });
    fireEvent.click(previewBtn);

    expect(
      await screen.findByText(/보안 정책상 허용되지 않는 내부\/로컬 URL입니다/),
    ).toBeInTheDocument();

    // 2. fallback: true
    previewMutateAsyncMock.mockResolvedValueOnce({
      data: { url: "https://example.com/manual", fallback: true },
    });
    fireEvent.change(urlInput, { target: { value: "https://example.com/manual" } });
    fireEvent.click(previewBtn);

    expect(
      await screen.findByText(/메타데이터를 자동으로 가져오지 못했습니다/),
    ).toBeInTheDocument();

    // 3. 409 VAULT_DUPLICATE_URL on save
    createMutateAsyncMock.mockRejectedValueOnce(
      new ApiError({
        statusCode: 409,
        errorCode: "VAULT_DUPLICATE_URL",
        message: "Duplicate",
      }),
    );
    fireEvent.change(screen.getByLabelText(/제목/), {
      target: { value: "수동 입력 제목" },
    });
    fireEvent.click(screen.getByRole("button", { name: "보관함에 저장" }));

    await waitFor(() => {
      expect(
        screen.getByText("이미 보관함에 저장된 URL입니다."),
      ).toBeInTheDocument();
    });
  });
});

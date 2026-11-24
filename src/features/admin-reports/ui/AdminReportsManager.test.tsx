import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { AdminReportsManager } from "./AdminReportsManager";

const updateMock = vi.fn();

vi.mock("../model/useAdminReports", () => ({
  useAdminReportsQuery: () => ({
    isLoading: false,
    isError: false,
    data: {
      data: [
        {
          id: "rep-1",
          contentId: "c1",
          contentTitle: "Claude Pro 요금 가이드",
          reason: "PRICING_CHANGED",
          detail: "월 요금이 변경되었습니다.",
          status: "OPEN",
          createdAt: "2026-11-24T00:00:00.000Z",
        },
      ],
    },
  }),
  useUpdateAdminReportMutation: () => ({
    mutateAsync: updateMock,
    isPending: false,
  }),
}));

describe("AdminReportsManager", () => {
  it("lists reports and updates status with memo", async () => {
    updateMock.mockResolvedValueOnce({ data: { id: "rep-1", status: "RESOLVED" } });

    const qc = new QueryClient();
    render(
      <QueryClientProvider client={qc}>
        <AdminReportsManager />
      </QueryClientProvider>,
    );

    expect(screen.getByText("Claude Pro 요금 가이드")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "상태 변경" }));

    fireEvent.change(screen.getByLabelText("처리 메모"), {
      target: { value: "요금표 반영 완료" },
    });
    fireEvent.click(screen.getByRole("button", { name: "저장" }));

    await waitFor(() => {
      expect(updateMock).toHaveBeenCalledWith({
        id: "rep-1",
        status: "RESOLVED",
        resolutionMemo: "요금표 반영 완료",
      });
    });
  });
});

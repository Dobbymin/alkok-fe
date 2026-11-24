import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { reportApi } from "../api/report.api";
import { ReportModal } from "./ReportModal";

describe("ReportModal", () => {
  it("supports 4 reasons, hidden honeypot field, and submits report", async () => {
    const submitSpy = vi
      .spyOn(reportApi, "submitReport")
      .mockResolvedValueOnce({ data: { id: "r1" } });

    const qc = new QueryClient();
    render(
      <QueryClientProvider client={qc}>
        <ReportModal contentId="c1" contentTitle="ChatGPT" />
      </QueryClientProvider>,
    );

    fireEvent.click(screen.getByRole("button", { name: /오류·최신화 제보/ }));

    const select = screen.getByLabelText(/제보 사유/);
    expect(select.querySelectorAll("option")).toHaveLength(4);
    expect(screen.getByLabelText("Website")).toHaveAttribute("tabindex", "-1");

    fireEvent.change(select, { target: { value: "BROKEN_LINK" } });
    fireEvent.change(screen.getByLabelText(/상세 내용/), {
      target: { value: "공식 문서 링크가 404입니다." },
    });
    fireEvent.click(screen.getByRole("button", { name: "제보 제출" }));

    await waitFor(() => {
      expect(submitSpy).toHaveBeenCalledWith("c1", {
        reason: "BROKEN_LINK",
        detail: "공식 문서 링크가 404입니다.",
        reporterEmail: undefined,
        website: undefined,
      });
    });
  });
});

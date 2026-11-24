import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { AdminDashboardOverview } from "./AdminDashboardOverview";

vi.mock("../model/useAdminDashboard", () => ({
  useAdminDashboardQuery: () => ({
    isLoading: false,
    isError: false,
    data: {
      data: {
        pendingInboxCount: 12,
        staleContentCount: 3,
        openReportCount: 5,
        failedJobs24hCount: 1,
      },
    },
  }),
}));

describe("AdminDashboardOverview", () => {
  it("renders 4 KPI cards with links", () => {
    const qc = new QueryClient();
    render(
      <QueryClientProvider client={qc}>
        <AdminDashboardOverview />
      </QueryClientProvider>,
    );

    expect(screen.getByText("12")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
    expect(screen.getByText("1")).toBeInTheDocument();
  });
});

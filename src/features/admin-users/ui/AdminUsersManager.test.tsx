import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { AdminUsersManager } from "./AdminUsersManager";

vi.mock("../api/admin-users.api", () => ({
  adminUsersApi: {
    list: vi.fn().mockResolvedValue({
      data: [
        {
          id: "u1",
          email: "member@alkok.kr",
          nickname: "실무자",
          role: "USER",
          status: "ACTIVE",
          emailVerifiedAt: "2026-11-01T00:00:00.000Z",
        },
      ],
    }),
    updateRole: vi.fn(),
    updateStatus: vi.fn(),
  },
}));

describe("AdminUsersManager", () => {
  it("renders user list with verification badge", async () => {
    const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });

    render(
      <QueryClientProvider client={qc}>
        <AdminUsersManager />
      </QueryClientProvider>,
    );

    expect(await screen.findByText("실무자")).toBeInTheDocument();
    expect(screen.getByText("인증 완료")).toBeInTheDocument();
  });
});

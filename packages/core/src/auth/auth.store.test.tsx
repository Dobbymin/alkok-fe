import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { AUTH_QUERY_KEYS, apiClient, getAccessToken } from "../api";
import type { UserProfile } from "../types";
import { AuthProvider } from "./AuthProvider";
import {
  resetAuthStore,
  selectIsAuthenticated,
  useAuthStore,
} from "./auth.store";

const sampleUser: UserProfile = {
  id: "u1",
  email: "user@alkok.kr",
  nickname: "테스터",
  role: "USER",
  status: "ACTIVE",
};

describe("useAuthStore & AuthProvider", () => {
  beforeEach(() => {
    resetAuthStore();
    document.cookie = "alkok_logged_in=; Max-Age=0; path=/";
  });

  afterEach(() => {
    vi.restoreAllMocks();
    document.cookie = "alkok_logged_in=; Max-Age=0; path=/";
  });

  it("sets, updates, and clears session in memory", () => {
    useAuthStore.getState().setSession("token-123", sampleUser);
    expect(getAccessToken()).toBe("token-123");
    expect(useAuthStore.getState().user).toEqual(sampleUser);
    expect(useAuthStore.getState().isLoading).toBe(false);
    expect(selectIsAuthenticated(useAuthStore.getState())).toBe(true);

    const updated = { ...sampleUser, nickname: "새닉네임" };
    useAuthStore.getState().updateUser(updated);
    expect(useAuthStore.getState().user?.nickname).toBe("새닉네임");

    useAuthStore.getState().clearSession();
    expect(getAccessToken()).toBeNull();
    expect(useAuthStore.getState().user).toBeNull();
    expect(selectIsAuthenticated(useAuthStore.getState())).toBe(false);
  });

  it("handles refreshSession success and failure", async () => {
    const postSpy = vi
      .spyOn(apiClient, "post")
      .mockResolvedValueOnce({
        data: { accessToken: "refreshed-token", user: sampleUser },
      })
      .mockRejectedValueOnce(new Error("Unauthorized"));

    const user = await useAuthStore.getState().refreshSession();
    expect(user).toEqual(sampleUser);
    expect(getAccessToken()).toBe("refreshed-token");
    expect(useAuthStore.getState().isLoading).toBe(false);

    const failed = await useAuthStore.getState().refreshSession();
    expect(failed).toBeNull();
    expect(getAccessToken()).toBeNull();
    expect(useAuthStore.getState().user).toBeNull();
    expect(useAuthStore.getState().isLoading).toBe(false);
    expect(postSpy).toHaveBeenCalledTimes(2);
  });

  it("clears session on logout even if server call fails", async () => {
    useAuthStore.getState().setSession("token-123", sampleUser);
    vi.spyOn(apiClient, "post").mockRejectedValueOnce(new Error("network"));

    await useAuthStore.getState().logout();
    expect(getAccessToken()).toBeNull();
    expect(useAuthStore.getState().user).toBeNull();
  });

  it("sets isLoading to false on mount when no session hint cookie is present", async () => {
    useAuthStore.setState({ user: null, isLoading: true });
    const qc = new QueryClient();

    render(
      <QueryClientProvider client={qc}>
        <AuthProvider>
          <div>child</div>
        </AuthProvider>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(useAuthStore.getState().isLoading).toBe(false);
    });
  });

  it("bootstraps refreshSession when alkok_logged_in=1 cookie is present", async () => {
    document.cookie = "alkok_logged_in=1; path=/";
    useAuthStore.setState({ user: null, isLoading: true });
    const postSpy = vi.spyOn(apiClient, "post").mockResolvedValueOnce({
      data: { accessToken: "boot-token", user: sampleUser },
    });
    const qc = new QueryClient();

    render(
      <QueryClientProvider client={qc}>
        <AuthProvider>
          <div>child</div>
        </AuthProvider>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(useAuthStore.getState().user).toEqual(sampleUser);
    });
    expect(postSpy).toHaveBeenCalledWith("/api/v1/auth/refresh", undefined, {
      skipAuthRefresh: true,
    });
  });

  it("removes auth queries from QueryClient when clearSession runs", () => {
    const qc = new QueryClient();
    qc.setQueryData(AUTH_QUERY_KEYS.me(), sampleUser);
    expect(qc.getQueryData(AUTH_QUERY_KEYS.me())).toEqual(sampleUser);

    render(
      <QueryClientProvider client={qc}>
        <AuthProvider>
          <div>child</div>
        </AuthProvider>
      </QueryClientProvider>,
    );

    useAuthStore.getState().clearSession();
    expect(qc.getQueryData(AUTH_QUERY_KEYS.me())).toBeUndefined();
  });
});

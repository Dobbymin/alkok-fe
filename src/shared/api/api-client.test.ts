import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  ApiError,
  apiClient,
  clearAccessToken,
  getAccessToken,
  setAccessToken,
  subscribeAuthUnauthorized,
} from "./api-client";

describe("apiClient", () => {
  const fetchMock = vi.fn<typeof fetch>();

  beforeEach(() => {
    clearAccessToken();
    fetchMock.mockReset();
    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("attaches in-memory access token and returns parsed JSON", async () => {
    setAccessToken("mem-token-1");
    fetchMock.mockResolvedValueOnce(
      new Response(JSON.stringify({ data: { id: "u1" } }), { status: 200 }),
    );

    const res = await apiClient.get<{ data: { id: string } }>("/api/v1/users/me");

    expect(res.data.id).toBe("u1");
    const [, init] = fetchMock.mock.calls[0] ?? [];
    const headers = new Headers(init?.headers);
    expect(headers.get("Authorization")).toBe("Bearer mem-token-1");
    expect(init?.credentials).toBe("include");
  });

  it("refreshes once across concurrent 401 responses and retries each request once", async () => {
    setAccessToken("expired-token");

    fetchMock
      .mockResolvedValueOnce(new Response(null, { status: 401 }))
      .mockResolvedValueOnce(new Response(null, { status: 401 }))
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ data: { accessToken: "fresh-token" } }), { status: 200 }),
      )
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ data: { ok: "a" } }), { status: 200 }),
      )
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ data: { ok: "b" } }), { status: 200 }),
      );

    const [a, b] = await Promise.all([
      apiClient.get<{ data: { ok: string } }>("/api/v1/vault/items"),
      apiClient.get<{ data: { ok: string } }>("/api/v1/vault/folders"),
    ]);

    expect(a.data.ok).toBe("a");
    expect(b.data.ok).toBe("b");
    expect(getAccessToken()).toBe("fresh-token");

    const refreshCalls = fetchMock.mock.calls.filter(([url]) =>
      String(url).includes("/api/v1/auth/refresh"),
    );
    expect(refreshCalls).toHaveLength(1);
    expect(fetchMock).toHaveBeenCalledTimes(5);
  });

  it("never triggers refresh on login, refresh, logout, or skipAuthRefresh requests", async () => {
    fetchMock.mockResolvedValue(
      new Response(
        JSON.stringify({
          statusCode: 401,
          errorCode: "AUTH_INVALID_CREDENTIALS",
          message: "이메일 또는 비밀번호가 올바르지 않습니다.",
        }),
        { status: 401 },
      ),
    );

    await expect(
      apiClient.post("/api/v1/auth/login", { email: "a@b.com", password: "wrong" }),
    ).rejects.toBeInstanceOf(ApiError);

    await expect(apiClient.post("/api/v1/auth/refresh")).rejects.toBeInstanceOf(ApiError);
    await expect(
      apiClient.get("/api/v1/guides", { skipAuthRefresh: true }),
    ).rejects.toBeInstanceOf(ApiError);

    expect(fetchMock).toHaveBeenCalledTimes(3);
  });

  it("clears token and notifies unauthorized listeners when refresh fails", async () => {
    setAccessToken("stale");
    const onUnauthorized = vi.fn();
    const unsub = subscribeAuthUnauthorized(onUnauthorized);

    fetchMock
      .mockResolvedValueOnce(new Response(null, { status: 401 }))
      .mockResolvedValueOnce(new Response(null, { status: 401 }));

    await expect(apiClient.get("/api/v1/users/me")).rejects.toBeInstanceOf(ApiError);

    expect(getAccessToken()).toBeNull();
    expect(onUnauthorized).toHaveBeenCalledTimes(1);
    unsub();
  });
});

import { QueryClient } from "@tanstack/react-query";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ApiError } from "@alkok/core";
import { vaultApi } from "../api/vault.api";
import { resetLocalVaultStore, useLocalVaultStore } from "./local-vault.store";
import { syncLocalVaultToServer } from "./sync-local-vault";

vi.mock("../api/vault.api", () => ({
  vaultApi: {
    createBookmark: vi.fn(),
  },
}));

describe("localVaultStore & syncLocalVaultToServer", () => {
  beforeEach(() => {
    resetLocalVaultStore();
    vi.clearAllMocks();
  });

  it("saves, toggles, and removes local items", () => {
    const store = useLocalVaultStore.getState();
    const added = store.toggleItem({
      contentId: "c1",
      title: "회의록 가이드",
      contentType: "GUIDE",
      slug: "meeting-guide",
    });
    expect(added).toBe(true);
    expect(useLocalVaultStore.getState().items).toHaveLength(1);

    const removed = useLocalVaultStore.getState().toggleItem({
      contentId: "c1",
      title: "회의록 가이드",
    });
    expect(removed).toBe(false);
    expect(useLocalVaultStore.getState().items).toHaveLength(0);
  });

  it("syncs local items to server, skips 409 duplicates, and retains failed items", async () => {
    useLocalVaultStore.getState().saveItem({ contentId: "c1", title: "가이드 1" });
    useLocalVaultStore.getState().saveItem({ contentId: "c2", title: "가이드 2" });
    useLocalVaultStore.getState().saveItem({ contentId: "c3", title: "가이드 3" });

    vi.mocked(vaultApi.createBookmark).mockImplementation(async (input) => {
      if (input.contentId === "c3") {
        return {
          data: {
            id: "v3",
            itemType: "INTERNAL_CONTENT",
            contentId: "c3",
            title: "가이드 3",
            tags: [],
            createdAt: "2026-11-26T00:00:00.000Z",
          },
        };
      }
      if (input.contentId === "c2") {
        throw new ApiError({
          statusCode: 409,
          errorCode: "VAULT_DUPLICATE_BOOKMARK",
          message: "duplicate",
        });
      }
      throw new Error("network error");
    });

    const qc = new QueryClient();
    const invalidateSpy = vi.spyOn(qc, "invalidateQueries");
    const result = await syncLocalVaultToServer(qc);

    expect(result).toEqual({ syncedCount: 1, skippedCount: 1, failedCount: 1 });
    expect(useLocalVaultStore.getState().items.map((i) => i.contentId)).toEqual(["c1"]);
    expect(invalidateSpy).toHaveBeenCalled();
  });

  it("dispatches createBookmark calls in parallel instead of awaiting sequentially", async () => {
    useLocalVaultStore.getState().saveItem({ contentId: "p1", title: "항목 1" });
    useLocalVaultStore.getState().saveItem({ contentId: "p2", title: "항목 2" });

    const resolvers: Array<() => void> = [];
    vi.mocked(vaultApi.createBookmark).mockImplementation(
      (input) =>
        new Promise((resolve) => {
          resolvers.push(() =>
            resolve({
              data: {
                id: `v-${input.contentId}`,
                itemType: "INTERNAL_CONTENT",
                contentId: input.contentId,
                title: input.contentId,
                tags: [],
                createdAt: "2026-11-27T00:00:00.000Z",
              },
            }),
          );
        }),
    );

    const syncPromise = syncLocalVaultToServer();
    expect(vaultApi.createBookmark).toHaveBeenCalledTimes(2);
    expect(resolvers).toHaveLength(2);

    resolvers.forEach((resolve) => resolve());
    const result = await syncPromise;
    expect(result).toEqual({ syncedCount: 2, skippedCount: 0, failedCount: 0 });
    expect(useLocalVaultStore.getState().items).toHaveLength(0);
  });
});

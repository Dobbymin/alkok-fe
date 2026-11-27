"use client";

import { create } from "zustand";
import { apiClient, clearAccessToken, setAccessToken } from "../api";
import type { ApiEnvelope, UserProfile } from "../types";

export interface AuthState {
  user: UserProfile | null;
  isLoading: boolean;
  setSession: (accessToken: string, user: UserProfile) => void;
  updateUser: (user: UserProfile) => void;
  clearSession: () => void;
  refreshSession: () => Promise<UserProfile | null>;
  logout: () => Promise<void>;
  setLoading: (isLoading: boolean) => void;
}

const clearCacheListeners = new Set<() => void>();

export function registerAuthCacheClearListener(listener: () => void): () => void {
  clearCacheListeners.add(listener);
  return () => {
    clearCacheListeners.delete(listener);
  };
}

export const useAuthStore = create<AuthState>()((set, get) => ({
  // Start with isLoading: true so reload or direct protected entry waits for cookie bootstrap
  user: null,
  isLoading: true,
  setSession: (accessToken, user) => {
    setAccessToken(accessToken);
    set({ user, isLoading: false });
  },
  updateUser: (user) => {
    set({ user });
  },
  clearSession: () => {
    clearAccessToken();
    set({ user: null });
    for (const listener of clearCacheListeners) {
      listener();
    }
  },
  refreshSession: async () => {
    set({ isLoading: true });
    try {
      const res = await apiClient.post<
        ApiEnvelope<{ accessToken: string; user: UserProfile }>
      >("/api/v1/auth/refresh", undefined, { skipAuthRefresh: true });
      setAccessToken(res.data.accessToken);
      set({ user: res.data.user });
      return res.data.user;
    } catch {
      get().clearSession();
      return null;
    } finally {
      set({ isLoading: false });
    }
  },
  logout: async () => {
    try {
      await apiClient.post("/api/v1/auth/logout", undefined, {
        skipAuthRefresh: true,
      });
    } catch {
      // Clear local session even if server cookie was already revoked
    } finally {
      get().clearSession();
    }
  },
  setLoading: (isLoading) => {
    set({ isLoading });
  },
}));

export const selectIsAuthenticated = (state: AuthState): boolean =>
  state.user !== null;

export function resetAuthStore(): void {
  clearAccessToken();
  useAuthStore.setState({ user: null, isLoading: false });
}

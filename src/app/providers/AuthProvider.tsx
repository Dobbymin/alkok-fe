"use client";

import { useQueryClient } from "@tanstack/react-query";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  AUTH_QUERY_KEYS,
  apiClient,
  clearAccessToken,
  setAccessToken,
  subscribeAuthUnauthorized,
} from "@/shared/api";
import type { ApiEnvelope, UserProfile } from "@/shared/types";

interface AuthContextValue {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setSession: (accessToken: string, user: UserProfile) => void;
  updateUser: (user: UserProfile) => void;
  clearSession: () => void;
  refreshSession: () => Promise<UserProfile | null>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const queryClient = useQueryClient();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const clearSession = useCallback(() => {
    clearAccessToken();
    setUser(null);
    queryClient.removeQueries({ queryKey: AUTH_QUERY_KEYS.all() });
  }, [queryClient]);

  useEffect(() => {
    return subscribeAuthUnauthorized(() => {
      setUser(null);
      queryClient.removeQueries({ queryKey: AUTH_QUERY_KEYS.all() });
    });
  }, [queryClient]);

  const setSession = useCallback((accessToken: string, nextUser: UserProfile) => {
    setAccessToken(accessToken);
    setUser(nextUser);
  }, []);

  const updateUser = useCallback((nextUser: UserProfile) => {
    setUser(nextUser);
  }, []);

  const refreshSession = useCallback(async (): Promise<UserProfile | null> => {
    setIsLoading(true);
    try {
      const res = await apiClient.post<
        ApiEnvelope<{ accessToken: string; user: UserProfile }>
      >("/api/v1/auth/refresh", undefined, { skipAuthRefresh: true });
      setAccessToken(res.data.accessToken);
      setUser(res.data.user);
      return res.data.user;
    } catch {
      clearSession();
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [clearSession]);

  const logout = useCallback(async () => {
    try {
      await apiClient.post("/api/v1/auth/logout", undefined, {
        skipAuthRefresh: true,
      });
    } catch {
      // Clear local session even if server cookie was already revoked
    } finally {
      clearSession();
    }
  }, [clearSession]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: user !== null,
      isLoading,
      setSession,
      updateUser,
      clearSession,
      refreshSession,
      logout,
    }),
    [user, isLoading, setSession, updateUser, clearSession, refreshSession, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}

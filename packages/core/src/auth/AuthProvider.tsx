"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useEffect, type ReactNode } from "react";
import { AUTH_QUERY_KEYS, subscribeAuthUnauthorized } from "../api";
import { registerAuthCacheClearListener, useAuthStore } from "./auth.store";

function hasSessionCookieHint(): boolean {
  if (typeof document === "undefined") {
    return false;
  }
  return /(?:^|;\s*)alkok_logged_in=1(?:;|$)/.test(document.cookie);
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const unregisterCache = registerAuthCacheClearListener(() => {
      queryClient.removeQueries({ queryKey: AUTH_QUERY_KEYS.all() });
    });
    const unsubscribeUnauthorized = subscribeAuthUnauthorized(() => {
      useAuthStore.getState().clearSession();
    });
    return () => {
      unregisterCache();
      unsubscribeUnauthorized();
    };
  }, [queryClient]);

  useEffect(() => {
    if (hasSessionCookieHint()) {
      void useAuthStore.getState().refreshSession();
    } else {
      useAuthStore.getState().setLoading(false);
    }
  }, []);

  return <>{children}</>;
};

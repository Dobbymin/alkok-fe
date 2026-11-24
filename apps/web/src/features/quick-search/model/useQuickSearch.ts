"use client";

import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { SEARCH_QUERY_KEYS } from "@alkok/core";
import { searchApi, type SearchParams } from "../api/search.api";

export function useDebouncedValue<T>(value: T, delayMs: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = window.setTimeout(() => setDebounced(value), delayMs);
    return () => window.clearTimeout(timer);
  }, [value, delayMs]);
  return debounced;
}

export function useSearchSuggest(query: string) {
  const debounced = useDebouncedValue(query.trim(), 250);
  return useQuery({
    queryKey: SEARCH_QUERY_KEYS.suggest(debounced),
    queryFn: () => searchApi.suggest(debounced),
    enabled: debounced.length >= 1,
  });
}

export function useUnifiedSearch(params: SearchParams) {
  return useQuery({
    queryKey: SEARCH_QUERY_KEYS.list({ ...params }),
    queryFn: () => searchApi.search(params),
    enabled: params.q.trim().length > 0,
  });
}

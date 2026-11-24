export const GUIDE_QUERY_KEYS = {
  all: () => ["guides"] as const,
  list: (filters: Record<string, unknown> = {}) =>
    [...GUIDE_QUERY_KEYS.all(), "list", filters] as const,
  detail: (slugOrId: string) =>
    [...GUIDE_QUERY_KEYS.all(), "detail", slugOrId] as const,
};

export const TOOL_QUERY_KEYS = {
  all: () => ["tools"] as const,
  list: (filters: Record<string, unknown> = {}) =>
    [...TOOL_QUERY_KEYS.all(), "list", filters] as const,
  detail: (slugOrId: string) =>
    [...TOOL_QUERY_KEYS.all(), "detail", slugOrId] as const,
  compare: (slugs: string[]) =>
    [...TOOL_QUERY_KEYS.all(), "compare", slugs] as const,
};

export const NEWS_QUERY_KEYS = {
  all: () => ["news"] as const,
  list: (filters: Record<string, unknown> = {}) =>
    [...NEWS_QUERY_KEYS.all(), "list", filters] as const,
  detail: (slugOrId: string) =>
    [...NEWS_QUERY_KEYS.all(), "detail", slugOrId] as const,
};

export const SEARCH_QUERY_KEYS = {
  all: () => ["search"] as const,
  list: (filters: Record<string, unknown> = {}) =>
    [...SEARCH_QUERY_KEYS.all(), "list", filters] as const,
  suggest: (q: string) => [...SEARCH_QUERY_KEYS.all(), "suggest", q] as const,
};

export const TAXONOMY_QUERY_KEYS = {
  all: () => ["taxonomies"] as const,
};

export const VAULT_QUERY_KEYS = {
  all: () => ["vault"] as const,
  list: (filters: Record<string, unknown> = {}) =>
    [...VAULT_QUERY_KEYS.all(), "list", filters] as const,
  detail: (id: string) => [...VAULT_QUERY_KEYS.all(), "detail", id] as const,
  folders: () => [...VAULT_QUERY_KEYS.all(), "folders"] as const,
  tags: () => [...VAULT_QUERY_KEYS.all(), "tags"] as const,
};

export const AUTH_QUERY_KEYS = {
  all: () => ["auth"] as const,
  me: () => [...AUTH_QUERY_KEYS.all(), "me"] as const,
};

export const ADMIN_QUERY_KEYS = {
  all: () => ["admin"] as const,
  dashboard: () => [...ADMIN_QUERY_KEYS.all(), "dashboard"] as const,
  list: (resource: string, filters: Record<string, unknown> = {}) =>
    [...ADMIN_QUERY_KEYS.all(), resource, "list", filters] as const,
  detail: (resource: string, id: string) =>
    [...ADMIN_QUERY_KEYS.all(), resource, "detail", id] as const,
};

const STORAGE_KEY = "alkok-recent-searches";
const MAX_RECENT = 6;

export function getRecentSearches(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item): item is string => typeof item === "string");
  } catch {
    return [];
  }
}

export function addRecentSearch(term: string): string[] {
  const trimmed = term.trim();
  if (!trimmed || typeof window === "undefined") return getRecentSearches();
  const next = [
    trimmed,
    ...getRecentSearches().filter((item) => item !== trimmed),
  ].slice(0, MAX_RECENT);
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Ignore storage quota errors
  }
  return next;
}

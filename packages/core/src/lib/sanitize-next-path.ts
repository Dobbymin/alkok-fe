export function sanitizeNextPath(rawNext: string | null | undefined): string {
  if (!rawNext) return "/";
  const trimmed = rawNext.trim();
  if (!trimmed.startsWith("/")) return "/";
  if (trimmed.startsWith("//") || trimmed.startsWith("/\\")) return "/";
  if (/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(trimmed)) return "/";
  return trimmed;
}

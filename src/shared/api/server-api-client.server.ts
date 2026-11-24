import "server-only";

function getInternalApiBaseUrl(): string {
  return (
    process.env.INTERNAL_API_BASE_URL ??
    process.env.NEXT_PUBLIC_API_BASE_URL ??
    "http://localhost:8080"
  ).replace(/\/$/, "");
}

export async function serverApiGet<T>(
  path: string,
  options?: {
    params?: Record<string, string | number | boolean | undefined | null>;
    revalidate?: number | false;
    headers?: Record<string, string>;
  },
): Promise<T | null> {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const searchParams = new URLSearchParams();
  if (options?.params) {
    for (const [k, v] of Object.entries(options.params)) {
      if (v !== undefined && v !== null && v !== "") {
        searchParams.set(k, String(v));
      }
    }
  }
  const qs = searchParams.toString();
  const url = `${getInternalApiBaseUrl()}${normalizedPath}${qs ? `?${qs}` : ""}`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        ...(options?.headers ?? {}),
      },
      next:
        options?.revalidate === false
          ? { revalidate: 0 }
          : { revalidate: options?.revalidate ?? 60 },
    });

    if (!response.ok) {
      return null;
    }

    return (await response.json()) as T;
  } catch {
    return null;
  }
}

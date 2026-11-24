import { env } from "@/shared/config";
import type { ApiEnvelope, ApiErrorResponse } from "@/shared/types";

export class ApiError extends Error {
  readonly statusCode: number;
  readonly errorCode: string;
  readonly details: unknown;
  readonly path: string;

  constructor(payload: {
    statusCode: number;
    errorCode: string;
    message: string;
    details?: unknown;
    path?: string;
  }) {
    super(payload.message);
    this.name = "ApiError";
    this.statusCode = payload.statusCode;
    this.errorCode = payload.errorCode;
    this.details = payload.details ?? null;
    this.path = payload.path ?? "";
  }
}

export interface ApiRequestOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
  params?: Record<string, string | number | boolean | undefined | null>;
  skipAuthRefresh?: boolean;
}

let inMemoryAccessToken: string | null = null;
let refreshInFlight: Promise<string | null> | null = null;
const unauthorizedListeners = new Set<() => void>();

const AUTH_NO_REFRESH_PATHS = [
  "/api/v1/auth/login",
  "/api/v1/auth/refresh",
  "/api/v1/auth/logout",
  "/api/v1/auth/signup",
];

export function getAccessToken(): string | null {
  return inMemoryAccessToken;
}

export function setAccessToken(token: string | null): void {
  inMemoryAccessToken = token;
}

export function clearAccessToken(): void {
  inMemoryAccessToken = null;
}

export function subscribeAuthUnauthorized(listener: () => void): () => void {
  unauthorizedListeners.add(listener);
  return () => {
    unauthorizedListeners.delete(listener);
  };
}

function notifyUnauthorized(): void {
  clearAccessToken();
  for (const listener of unauthorizedListeners) {
    listener();
  }
}

function buildUrl(
  path: string,
  params?: Record<string, string | number | boolean | undefined | null>,
): string {
  const base = path.startsWith("http") ? "" : env.apiBaseUrl.replace(/\/$/, "");
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const url = `${base}${normalizedPath}`;

  if (!params) return url;
  const searchParams = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.set(key, String(value));
    }
  }
  const qs = searchParams.toString();
  return qs ? `${url}?${qs}` : url;
}

function shouldSkipRefresh(path: string, skipAuthRefresh?: boolean): boolean {
  if (skipAuthRefresh) return true;
  return AUTH_NO_REFRESH_PATHS.some((blocked) => path.includes(blocked));
}

async function parseErrorResponse(response: Response, path: string): Promise<ApiError> {
  try {
    const raw: unknown = await response.json();
    if (typeof raw === "object" && raw !== null) {
      const candidate = raw as Partial<ApiErrorResponse>;
      return new ApiError({
        statusCode: candidate.statusCode ?? response.status,
        errorCode: candidate.errorCode ?? "HTTP_ERROR",
        message: candidate.message ?? response.statusText ?? "요청 처리 중 오류가 발생했습니다.",
        details: candidate.details ?? null,
        path: candidate.path ?? path,
      });
    }
  } catch {
    // Non-JSON error body fallback
  }
  return new ApiError({
    statusCode: response.status,
    errorCode: "HTTP_ERROR",
    message: response.statusText || "요청 처리 중 오류가 발생했습니다.",
    path,
  });
}

async function refreshAccessToken(): Promise<string | null> {
  if (refreshInFlight) {
    return refreshInFlight;
  }

  refreshInFlight = (async () => {
    try {
      const response = await fetch(buildUrl("/api/v1/auth/refresh"), {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        notifyUnauthorized();
        return null;
      }

      const json: unknown = await response.json();
      if (
        typeof json === "object" &&
        json !== null &&
        "data" in json &&
        typeof (json as { data?: unknown }).data === "object" &&
        (json as { data?: { accessToken?: unknown } }).data !== null
      ) {
        const token = (json as { data: { accessToken?: unknown } }).data.accessToken;
        if (typeof token === "string" && token.length > 0) {
          setAccessToken(token);
          return token;
        }
      }

      notifyUnauthorized();
      return null;
    } catch {
      notifyUnauthorized();
      return null;
    } finally {
      refreshInFlight = null;
    }
  })();

  return refreshInFlight;
}

async function executeFetch(
  path: string,
  options: ApiRequestOptions,
): Promise<Response> {
  const { body, params, headers: customHeaders, skipAuthRefresh: _skip, ...rest } = options;
  void _skip;

  const headers = new Headers(customHeaders);
  const isFormData = typeof FormData !== "undefined" && body instanceof FormData;

  if (!isFormData && body !== undefined && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (inMemoryAccessToken && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${inMemoryAccessToken}`);
  }

  const serializedBody =
    body === undefined
      ? undefined
      : isFormData || typeof body === "string"
        ? (body as BodyInit)
        : JSON.stringify(body);

  return fetch(buildUrl(path, params), {
    ...rest,
    headers,
    body: serializedBody,
    credentials: "include",
  });
}

async function request<T>(
  path: string,
  options: ApiRequestOptions = {},
): Promise<T> {
  const response = await executeFetch(path, options);

  if (response.status === 401 && !shouldSkipRefresh(path, options.skipAuthRefresh)) {
    const newToken = await refreshAccessToken();
    if (newToken) {
      const retryHeaders = new Headers(options.headers);
      retryHeaders.set("Authorization", `Bearer ${newToken}`);
      const retryResponse = await executeFetch(path, {
        ...options,
        headers: retryHeaders,
        skipAuthRefresh: true,
      });

      if (!retryResponse.ok) {
        throw await parseErrorResponse(retryResponse, path);
      }

      if (retryResponse.status === 204) {
        return undefined as T;
      }
      return (await retryResponse.json()) as T;
    }
  }

  if (!response.ok) {
    throw await parseErrorResponse(response, path);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

export const apiClient = {
  get<T>(path: string, options?: ApiRequestOptions): Promise<T> {
    return request<T>(path, { ...options, method: "GET" });
  },
  post<T>(path: string, body?: unknown, options?: ApiRequestOptions): Promise<T> {
    return request<T>(path, { ...options, method: "POST", body });
  },
  put<T>(path: string, body?: unknown, options?: ApiRequestOptions): Promise<T> {
    return request<T>(path, { ...options, method: "PUT", body });
  },
  patch<T>(path: string, body?: unknown, options?: ApiRequestOptions): Promise<T> {
    return request<T>(path, { ...options, method: "PATCH", body });
  },
  delete<T>(path: string, options?: ApiRequestOptions): Promise<T> {
    return request<T>(path, { ...options, method: "DELETE" });
  },
};

export type { ApiEnvelope };

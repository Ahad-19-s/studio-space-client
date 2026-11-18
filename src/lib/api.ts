// Thin fetch wrapper around the Express API (studiospace-server).
// Mutations are sent with `Authorization: Bearer <jwt>` — the JWT comes
// from BetterAuth's /api/auth/token endpoint (same origin, session cookie)
// and is verified server-side against our JWKS.
const BASE = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

type ApiOptions = Omit<RequestInit, "body"> & { body?: unknown };

// Cached JWT — invalidated automatically when a request gets a 401.
let cachedToken: string | null = null;
let tokenPromise: Promise<string | null> | null = null;

async function getJwt(): Promise<string | null> {
  if (cachedToken) return cachedToken;
  if (!tokenPromise) {
    tokenPromise = fetch("/api/auth/token", { credentials: "include" })
      .then(async (response) => {
        if (!response.ok) return null;
        const data = (await response.json().catch(() => null)) as {
          token?: string;
        } | null;
        cachedToken = data?.token ?? null;
        return cachedToken;
      })
      .catch(() => null)
      .finally(() => {
        tokenPromise = null;
      });
  }
  return tokenPromise;
}

function invalidateJwt() {
  cachedToken = null;
}

export async function apiFetch<T = unknown>(
  path: string,
  options: ApiOptions = {}
): Promise<T> {
  const { body, headers, method = "GET", ...rest } = options;
  const isMutation = method !== "GET" && method !== "HEAD";

  const authHeader: Record<string, string> = {};
  if (isMutation) {
    const token = await getJwt();
    if (token) authHeader["Authorization"] = `Bearer ${token}`;
  }

  let response: Response;
  try {
    response = await fetch(`${BASE}${path}`, {
      ...rest,
      method,
      credentials: "include",
      headers: {
        ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
        ...authHeader,
        ...headers,
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    // Network failure (server not running, offline, ...).
    throw new ApiError(
      "Could not reach the server. Please check your connection and try again.",
      0
    );
  }

  // Expired/missing JWT — drop the cached token so the retry gets a fresh one.
  if (response.status === 401 && isMutation) invalidateJwt();

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      (data &&
      typeof data === "object" &&
      ("msg" in data || "message" in data)
        ? String(
            (data as { msg?: unknown; message?: unknown }).msg ??
              (data as { message?: unknown }).message
          )
        : null) || `Request failed (${response.status})`;
    throw new ApiError(message, response.status);
  }

  return data as T;
}

export const api = {
  get: <T = unknown>(path: string, options?: ApiOptions) =>
    apiFetch<T>(path, { ...options, method: "GET" }),
  post: <T = unknown>(path: string, body?: unknown, options?: ApiOptions) =>
    apiFetch<T>(path, { ...options, method: "POST", body }),
  patch: <T = unknown>(path: string, body?: unknown, options?: ApiOptions) =>
    apiFetch<T>(path, { ...options, method: "PATCH", body }),
  put: <T = unknown>(path: string, body?: unknown, options?: ApiOptions) =>
    apiFetch<T>(path, { ...options, method: "PUT", body }),
  delete: <T = unknown>(path: string, options?: ApiOptions) =>
    apiFetch<T>(path, { ...options, method: "DELETE" }),
};

import type { ApiErrorBody } from "@/types/api";

export class ApiError extends Error {
  code: string;
  status: number;
  details?: Record<string, unknown>;

  constructor(status: number, body: ApiErrorBody["error"]) {
    super(body.message);
    this.name = "ApiError";
    this.code = body.code;
    this.status = status;
    this.details = body.details;
  }
}

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export async function apiFetch<T>(
  path: string,
  init?: RequestInit & { token?: string },
): Promise<T> {
  const headers = new Headers(init?.headers);
  if (!headers.has("Content-Type") && init?.body) {
    headers.set("Content-Type", "application/json");
  }
  if (init?.token) {
    headers.set("Authorization", `Bearer ${init.token}`);
  }

  const res = await fetch(`${API_BASE_URL}/v1${path}`, {
    ...init,
    headers,
  });

  if (!res.ok) {
    const message = `API error: ${res.status} ${res.statusText}`;
    try {
      const body = (await res.json()) as ApiErrorBody;
      if (body.error) {
        throw new ApiError(res.status, body.error);
      }
    } catch (err) {
      if (err instanceof ApiError) throw err;
    }
    throw new Error(message);
  }

  if (res.status === 204) {
    return undefined as T;
  }

  return res.json() as Promise<T>;
}

export type ApiClient = {
  get: <T>(path: string) => Promise<T>;
  post: <T>(path: string, body?: unknown) => Promise<T>;
  put: <T>(path: string, body?: unknown) => Promise<T>;
  patch: <T>(path: string, body?: unknown) => Promise<T>;
  delete: <T>(path: string) => Promise<T>;
};

export function createApiClient(getToken: () => Promise<string | null>): ApiClient {
  async function withToken(init?: RequestInit) {
    const token = await getToken();
    if (!token) {
      throw new ApiError(401, {
        code: "unauthorized",
        message: "Missing authentication credentials.",
      });
    }
    return { ...init, token };
  }

  return {
    get: async (path) => apiFetch(path, await withToken()),
    post: async (path, body) =>
      apiFetch(
        path,
        await withToken({
          method: "POST",
          body: body !== undefined ? JSON.stringify(body) : undefined,
        }),
      ),
    put: async (path, body) =>
      apiFetch(
        path,
        await withToken({
          method: "PUT",
          body: body !== undefined ? JSON.stringify(body) : undefined,
        }),
      ),
    patch: async (path, body) =>
      apiFetch(
        path,
        await withToken({
          method: "PATCH",
          body: body !== undefined ? JSON.stringify(body) : undefined,
        }),
      ),
    delete: async (path) =>
      apiFetch(path, await withToken({ method: "DELETE" })),
  };
}

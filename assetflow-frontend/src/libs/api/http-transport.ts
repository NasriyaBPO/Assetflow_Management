import { API_BASE_URL } from '@/config/api.config';
import { ApiError } from './api-error';
import { tokenStorage } from '@/libs/auth/token-storage';

export type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'DELETE';

export interface RequestOptions {
  method?: HttpMethod;
  body?: unknown;
  query?: Record<string, string | number | boolean | undefined | null>;
  signal?: AbortSignal;
}

function buildUrl(path: string, query?: RequestOptions['query']) {
  const url = new URL(path, API_BASE_URL);
  Object.entries(query ?? {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.set(key, String(value));
    }
  });
  return url.toString();
}

function safeJson(text: string) {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

export async function httpRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, query, signal } = options;

  let response: Response;
  try {
    const token = tokenStorage.get();

const headers: Record<string, string> = {};

if (body !== undefined) {
  headers['Content-Type'] = 'application/json';
}

if (token) {
  headers['Authorization'] = `Bearer ${token}`;
}

response = await fetch(buildUrl(path, query), {
  method,
  headers,
  body: body !== undefined ? JSON.stringify(body) : undefined,
  signal,
});
  } catch (e) {
    if (e instanceof DOMException && e.name === 'AbortError') throw e;
    throw new ApiError(0, 'Cannot reach the server. Is the backend running?');
  }

  const text = await response.text();
  const data = text ? safeJson(text) : null;

  if (!response.ok) {
    // Nest's default errors use "message"; the Problem Details format we'll add later uses "detail".
    const raw = data?.detail ?? data?.message ?? response.statusText;
    const details = Array.isArray(raw) ? (raw as string[]) : undefined;
    const message = Array.isArray(raw) ? raw.join(', ') : String(raw);
    throw new ApiError(response.status, message, details);
  }

  return data as T;
}
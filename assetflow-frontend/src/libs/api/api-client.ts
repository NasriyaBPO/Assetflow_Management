import {
  httpRequest,
  RequestOptions,
} from './http-transport';

export const apiClient = {
  get: <T>(
    path: string,
    query?: RequestOptions['query'],
    signal?: AbortSignal,
  ) =>
    httpRequest<T>(path, {
      method: 'GET',
      query,
      signal,
    }),

  post: <T>(
    path: string,
    body?: unknown,
  ) =>
    httpRequest<T>(path, {
      method: 'POST',
      body,
    }),

  patch: <T>(
    path: string,
    body?: unknown,
  ) =>
    httpRequest<T>(path, {
      method: 'PATCH',
      body,
    }),

  delete: <T>(path: string) =>
    httpRequest<T>(path, {
      method: 'DELETE',
    }),
};
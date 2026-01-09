import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { env } from '@/config/env';

const baseQuery = fetchBaseQuery({
  baseUrl: env.api.baseUrl,
  timeout: env.api.timeout,
  prepareHeaders: (headers) => {
    const token = localStorage.getItem(env.auth.tokenKey);
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    headers.set('Content-Type', 'application/json');
    return headers;
  },
});

const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions
) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    const refreshToken = localStorage.getItem(env.auth.refreshTokenKey);

    if (refreshToken) {
      const refreshResult = await baseQuery(
        {
          url: '/auth/refresh',
          method: 'POST',
          body: { refreshToken },
        },
        api,
        extraOptions
      );

      if (refreshResult.data) {
        const { token, refreshToken: newRefreshToken } = refreshResult.data as {
          token: string;
          refreshToken: string;
        };

        localStorage.setItem(env.auth.tokenKey, token);
        localStorage.setItem(env.auth.refreshTokenKey, newRefreshToken);

        result = await baseQuery(args, api, extraOptions);
      } else {
        localStorage.removeItem(env.auth.tokenKey);
        localStorage.removeItem(env.auth.refreshTokenKey);
        window.location.href = '/login';
      }
    } else {
      window.location.href = '/login';
    }
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Auth', 'User', 'Workflow', 'Dashboard', 'Settings'],
  endpoints: () => ({}),
});

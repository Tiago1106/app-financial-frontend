import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { emitAuthEvent } from '@services/authEvents';
import { clearTokens, getAccessToken, getRefreshToken, setTokens } from '@services/storage';

export const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000/api',
  timeout: 15000,
});

const refreshClient = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000/api',
  timeout: 15000,
});

let refreshPromise: Promise<{ accessToken: string; refreshToken: string }> | null = null;

api.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  const accessToken = await getAccessToken();
  if (accessToken) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error: unknown) => {
    if (!axios.isAxiosError(error)) {
      throw error;
    }

    const status = error.response?.status;
    const originalRequest = error.config as any;

    if (status !== 401 || !originalRequest) {
      throw error;
    }

    if (originalRequest._retry) {
      throw error;
    }

    const refreshToken = await getRefreshToken();
    if (!refreshToken) {
      throw error;
    }

    originalRequest._retry = true;

    try {
      refreshPromise =
        refreshPromise ??
        refreshClient
          .post<{ accessToken: string; refreshToken: string }>('/auth/refresh', {
            refreshToken,
          })
          .then((res) => res.data)
          .finally(() => {
            refreshPromise = null;
          });

      const tokens = await refreshPromise;
      await setTokens(tokens);

      originalRequest.headers = originalRequest.headers ?? {};
      originalRequest.headers.Authorization = `Bearer ${tokens.accessToken}`;

      return api(originalRequest);
    } catch (refreshError) {
      await clearTokens();
      emitAuthEvent({ type: 'signedOut' });
      throw refreshError;
    }
  },
);

export function getApiErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<any>;
    const message = axiosError.response?.data?.message;
    return typeof message === 'string' ? message : 'Ocorreu um erro. Tente novamente.';
  }

  return 'Ocorreu um erro. Tente novamente.';
}

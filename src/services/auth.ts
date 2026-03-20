import { api } from '@services/api';

export type AuthUser = {
  id: string;
  name: string | null;
  email: string;
  createdAt: string;
};

export type AuthTokensResponse = {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
};

export async function register(payload: {
  name?: string;
  email: string;
  password: string;
}): Promise<AuthTokensResponse> {
  const { data } = await api.post<AuthTokensResponse>('/auth/register', payload);
  return data;
}

export async function login(payload: {
  email: string;
  password: string;
}): Promise<AuthTokensResponse> {
  const { data } = await api.post<AuthTokensResponse>('/auth/login', payload);
  return data;
}

export async function refresh(payload: {
  refreshToken: string;
}): Promise<AuthTokensResponse> {
  const { data } = await api.post<AuthTokensResponse>('/auth/refresh', payload);
  return data;
}

export async function forgotPassword(payload: {
  email: string;
}): Promise<{ message: string }> {
  const { data } = await api.post<{ message: string }>(
    '/auth/forgot-password',
    payload,
  );
  return data;
}

export async function resetPassword(payload: {
  token: string;
  newPassword: string;
}): Promise<{ message: string }> {
  const { data } = await api.post<{ message: string }>(
    '/auth/reset-password',
    payload,
  );
  return data;
}

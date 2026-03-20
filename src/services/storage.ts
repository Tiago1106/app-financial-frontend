import { Platform } from 'react-native';

const ACCESS_TOKEN_KEY = 'auth.accessToken';
const REFRESH_TOKEN_KEY = 'auth.refreshToken';

async function getSecureStore() {
  const mod = await import('expo-secure-store');
  return mod;
}

function canUseLocalStorage(): boolean {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

export async function getAccessToken(): Promise<string | null> {
  if (Platform.OS === 'web') {
    if (!canUseLocalStorage()) return null;
    return window.localStorage.getItem(ACCESS_TOKEN_KEY);
  }

  const SecureStore = await getSecureStore();
  return SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
}

export async function getRefreshToken(): Promise<string | null> {
  if (Platform.OS === 'web') {
    if (!canUseLocalStorage()) return null;
    return window.localStorage.getItem(REFRESH_TOKEN_KEY);
  }

  const SecureStore = await getSecureStore();
  return SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
}

export async function setTokens(tokens: {
  accessToken: string;
  refreshToken: string;
}): Promise<void> {
  if (Platform.OS === 'web') {
    if (!canUseLocalStorage()) return;
    window.localStorage.setItem(ACCESS_TOKEN_KEY, tokens.accessToken);
    window.localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken);
    return;
  }

  const SecureStore = await getSecureStore();
  await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, tokens.accessToken);
  await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, tokens.refreshToken);
}

export async function clearTokens(): Promise<void> {
  if (Platform.OS === 'web') {
    if (!canUseLocalStorage()) return;
    window.localStorage.removeItem(ACCESS_TOKEN_KEY);
    window.localStorage.removeItem(REFRESH_TOKEN_KEY);
    return;
  }

  const SecureStore = await getSecureStore();
  await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
  await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
}

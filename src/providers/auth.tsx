import { createContext, PropsWithChildren, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { clearTokens, getAccessToken, getRefreshToken, setTokens } from '@services/storage';
import * as authApi from '@services/auth';
import { emitAuthEvent, subscribeAuthEvents } from '@services/authEvents';

type AuthState = {
  status: 'loading' | 'authenticated' | 'unauthenticated';
  user: authApi.AuthUser | null;
};

type AuthContextValue = AuthState & {
  signIn: (payload: { email: string; password: string }) => Promise<void>;
  signUp: (payload: { name?: string; email: string; password: string }) => Promise<void>;
  signOut: () => Promise<void>;
  requestPasswordReset: (payload: { email: string }) => Promise<{ message: string }>;
  resetPassword: (payload: { token: string; newPassword: string }) => Promise<{ message: string }>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: PropsWithChildren) {
  const [state, setState] = useState<AuthState>({
    status: 'loading',
    user: null,
  });

  useEffect(() => {
    let cancelled = false;

    const unsubscribe = subscribeAuthEvents((event) => {
      if (event.type === 'signedOut') {
        setState({ status: 'unauthenticated', user: null });
      }
    });

    async function bootstrap() {
      const accessToken = await getAccessToken();
      const refreshToken = await getRefreshToken();

      if (cancelled) return;

      if (accessToken && refreshToken) {
        setState({ status: 'authenticated', user: null });
        return;
      }

      setState({ status: 'unauthenticated', user: null });
    }

    bootstrap();

    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, []);

  const signIn = useCallback(async (payload: { email: string; password: string }) => {
    const data = await authApi.login(payload);
    await setTokens({ accessToken: data.accessToken, refreshToken: data.refreshToken });
    setState({ status: 'authenticated', user: data.user });
    emitAuthEvent({ type: 'signedIn' });
  }, []);

  const signUp = useCallback(async (payload: { name?: string; email: string; password: string }) => {
    const data = await authApi.register(payload);
    await setTokens({ accessToken: data.accessToken, refreshToken: data.refreshToken });
    setState({ status: 'authenticated', user: data.user });
    emitAuthEvent({ type: 'signedIn' });
  }, []);

  const signOut = useCallback(async () => {
    await clearTokens();
    setState({ status: 'unauthenticated', user: null });
    emitAuthEvent({ type: 'signedOut' });
  }, []);

  const requestPasswordReset = useCallback(async (payload: { email: string }) => {
    return authApi.forgotPassword(payload);
  }, []);

  const resetPassword = useCallback(async (payload: { token: string; newPassword: string }) => {
    return authApi.resetPassword(payload);
  }, []);

  const value = useMemo<AuthContextValue>(() => ({
    ...state,
    signIn,
    signUp,
    signOut,
    requestPasswordReset,
    resetPassword,
  }), [state, signIn, signUp, signOut, requestPasswordReset, resetPassword]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return ctx;
}

import { Redirect, Stack } from 'expo-router';
import { useAuth } from '@providers/auth';
import { t } from '@i18n/index';

export default function AuthLayout() {
  const auth = useAuth();

  if (auth.status === 'loading') return null;

  if (auth.status === 'authenticated') {
    return <Redirect href="/(app)" />;
  }

  return (
    <Stack>
      <Stack.Screen name="login" options={{ title: t('auth.nav.login'), header: () => null }} />
      <Stack.Screen name="register" options={{ title: t('auth.nav.register'), header: () => null }} />
      <Stack.Screen
        name="forgot-password"
        options={{ title: t('auth.nav.forgotPassword'), header: () => null }}
      />
      <Stack.Screen name="reset-password" options={{ title: t('auth.nav.resetPassword'), header: () => null }} />
    </Stack>
  );
}

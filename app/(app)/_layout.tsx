import { Redirect, Stack } from 'expo-router';
import { useAuth } from '@providers/auth';

export default function AppLayout() {
  const auth = useAuth();

  if (auth.status === 'loading') return null;

  if (auth.status !== 'authenticated') {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
    </Stack>
  );
}

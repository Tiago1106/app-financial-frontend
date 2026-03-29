import { NativeBaseProvider } from 'native-base';
import { LinearGradient } from 'expo-linear-gradient';
import { PropsWithChildren } from 'react';
import { nativeBaseTheme } from '@theme/nativeBaseTheme';
import { initialWindowMetrics } from 'react-native-safe-area-context';

const config = {
  dependencies: {
    'linear-gradient': LinearGradient,
  },
};

export function AppNativeBaseProvider({ children }: PropsWithChildren) {
  return (
    <NativeBaseProvider config={config} theme={nativeBaseTheme} initialWindowMetrics={initialWindowMetrics ?? undefined}>
      {children}
    </NativeBaseProvider>
  );
}

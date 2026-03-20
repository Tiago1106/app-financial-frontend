import { NativeBaseProvider } from 'native-base';
import { LinearGradient } from 'expo-linear-gradient';
import { PropsWithChildren } from 'react';
import { nativeBaseTheme } from '@theme/nativeBaseTheme';

const config = {
  dependencies: {
    'linear-gradient': LinearGradient,
  },
};

export function AppNativeBaseProvider({ children }: PropsWithChildren) {
  return (
    <NativeBaseProvider config={config} theme={nativeBaseTheme}>
      {children}
    </NativeBaseProvider>
  );
}

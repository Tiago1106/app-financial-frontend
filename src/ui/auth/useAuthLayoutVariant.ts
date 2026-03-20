import { Platform, useWindowDimensions } from 'react-native';

export type AuthLayoutVariant = 'mobile' | 'web';

export function useAuthLayoutVariant(): AuthLayoutVariant {
  const { width } = useWindowDimensions();

  if (Platform.OS === 'web' && width >= 900) {
    return 'web';
  }

  return 'mobile';
}

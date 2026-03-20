import { extendTheme } from 'native-base';

export const nativeBaseTheme = extendTheme({
  fontConfig: {
    Manrope: {
      400: {
        normal: 'Manrope_400Regular',
      },
      500: {
        normal: 'Manrope_500Medium',
      },
      600: {
        normal: 'Manrope_600SemiBold',
      },
      700: {
        normal: 'Manrope_700Bold',
      },
      800: {
        normal: 'Manrope_800ExtraBold',
      },
    },
  },
  fonts: {
    heading: 'Manrope',
    body: 'Manrope',
    mono: 'Manrope',
  },
});

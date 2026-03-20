import { PropsWithChildren, ReactNode } from 'react';
import { Box, ScrollView, Text, VStack } from 'native-base';
import { tokens } from '@theme/tokens';

const nb = (px: number) => px / 4;

type Props = PropsWithChildren<{
  hero: {
    kicker: string;
    title: string;
    body: string;
  };
  wrapPaddingBottom?: number;
  wrapPaddingX?: number;
  wrapGap?: number;
  heroPadding?: number;
  heroGap?: number;
  cardPadding?: number;
  footer?: ReactNode;
}>;

export function AuthMobileShell({
  hero,
  children,
  footer,
  wrapPaddingBottom = 24,
  wrapPaddingX = 24,
  wrapGap = 24,
  heroPadding = 20,
  heroGap = 10,
  cardPadding = 20,
}: Props) {
  
  return (
    <Box flex={1} bg={tokens.colors.bgPrimary} safeAreaTop>
      <ScrollView
        flex={1}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingLeft: wrapPaddingX,
          paddingRight: wrapPaddingX,
          paddingBottom: wrapPaddingBottom,
        }}
      >
        <VStack space={nb(wrapGap)}>
          <Box
            bg={tokens.colors.brand}
            borderRadius={tokens.radii.lg}
            p={nb(heroPadding)}
          >
            <VStack space={nb(heroGap)}>
              <Text
                fontSize={11}
                fontWeight="700"
                letterSpacing={1.2}
                color="#D9DDDD"
              >
                {hero.kicker}
              </Text>
              <Text fontSize={30} fontWeight="800" color="#FFFFFF">
                {hero.title}
              </Text>
              <Text fontSize={14} fontWeight="500" lineHeight={20} color="#E8EBEB">
                {hero.body}
              </Text>
            </VStack>
          </Box>

          <Box
            bg={tokens.colors.surface}
            borderRadius={tokens.radii.lg}
            borderWidth={1}
            borderColor={tokens.colors.border}
            p={nb(cardPadding)}
          >
            {children}
          </Box>

          {footer ? <Box>{footer}</Box> : null}
        </VStack>
      </ScrollView>
    </Box>
  );
}

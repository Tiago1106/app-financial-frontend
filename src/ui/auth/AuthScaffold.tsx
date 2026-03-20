import { PropsWithChildren, ReactNode } from 'react';
import { Box, HStack, Text, VStack } from 'native-base';
import { tokens } from '@theme/tokens';

type Props = PropsWithChildren<{
  metaLeft?: string;
  metaRight?: ReactNode;
  heroKicker: string;
  heroTitle: string;
  heroBody: string;
}>;

export function AuthScaffold({
  children,
  metaLeft,
  metaRight,
  heroKicker,
  heroTitle,
  heroBody,
}: Props) {
  return (
    <Box flex={1} bg={tokens.colors.bgPrimary} px={6} py={6}>
      <HStack w="100%" justifyContent="space-between" alignItems="center" mb={6}>
        <Text fontSize="sm" fontWeight="700" color={tokens.colors.textSecondary}>
          {metaLeft ?? ''}
        </Text>
        {metaRight ?? (
          <Text fontSize="sm" fontWeight="700" color={tokens.colors.brand}>
            {''}
          </Text>
        )}
      </HStack>

      <VStack space={6} w="100%" maxW={420} alignSelf="center" flex={1} justifyContent="center">
        <Box
          bg={tokens.colors.brand}
          borderRadius={tokens.radii.lg}
          px={tokens.space.lg}
          py={tokens.space.lg}
        >
          <VStack space={2}>
            <Text
              fontSize="xs"
              fontWeight="700"
              letterSpacing={1.2}
              color="#D9DDDD"
            >
              {heroKicker}
            </Text>
            <Text fontSize="3xl" fontWeight="800" color="#FFFFFF">
              {heroTitle}
            </Text>
            <Text fontSize="sm" fontWeight="500" lineHeight={20} color="#E8EBEB">
              {heroBody}
            </Text>
          </VStack>
        </Box>

        <Box
          bg={tokens.colors.surface}
          borderRadius={tokens.radii.lg}
          borderWidth={1}
          borderColor={tokens.colors.border}
          px={tokens.space.lg}
          py={tokens.space.lg}
        >
          {children}
        </Box>
      </VStack>
    </Box>
  );
}

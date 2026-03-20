import { PropsWithChildren, ReactNode } from 'react';
import { Box, HStack, Text, VStack } from 'native-base';
import { tokens } from '@theme/tokens';

const nb = (px: number) => px / 4;

type Props = PropsWithChildren<{
  aside: {
    brandKicker: string;
    title: string;
    body: string;
    stat?: {
      label: string;
      value: string;
      body: string;
    };
  };
  topLeft: string;
  topRight?: ReactNode;
}>;

export function AuthWebShell({ aside, topLeft, topRight, children }: Props) {
  return (
    <Box flex={1} bg={tokens.colors.surface}>
      <Box flex={1} bg={tokens.colors.surface} p={nb(24)}>
        <HStack flex={1} space={nb(24)}>
          <Box
            w={420}
            bg={tokens.colors.brand}
            borderRadius={tokens.radii.lg}
            p={nb(32)}
          >
            <VStack flex={1} space={nb(24)}>
              <Text
                fontSize={12}
                fontWeight="800"
                letterSpacing={1.2}
                color="#D9DDDD"
              >
                {aside.brandKicker}
              </Text>
              <Text
                fontSize={42}
                fontWeight="800"
                lineHeight={46}
                color="#FFFFFF"
              >
                {aside.title}
              </Text>
              <Text
                fontSize={16}
                fontWeight="500"
                lineHeight={24}
                color="#E8EBEB"
              >
                {aside.body}
              </Text>

              {aside.stat && (
                <Box
                  bg="#384244"
                  borderRadius={16}
                  p={nb(20)}
                >
                  <VStack space={nb(6)}>
                    <Text
                      fontSize={12}
                      fontWeight="700"
                      letterSpacing={0.8}
                      color="#D9DDDD"
                    >
                      {aside.stat.label}
                    </Text>
                    <Text fontSize={30} fontWeight="800" color="#FFFFFF">
                      {aside.stat.value}
                    </Text>
                    <Text
                      fontSize={14}
                      fontWeight="500"
                      lineHeight={20}
                      color="#E8EBEB"
                    >
                      {aside.stat.body}
                    </Text>
                  </VStack>
                </Box>
              )}
            </VStack>
          </Box>

          <Box
            flex={1}
            bg={tokens.colors.surface}
            borderRadius={tokens.radii.lg}
            borderWidth={1}
            borderColor={tokens.colors.border}
            p={nb(32)}
          >
            <VStack flex={1} space={nb(24)}>
              <HStack justifyContent="space-between" alignItems="center">
                <Text fontSize={14} fontWeight="700" color={tokens.colors.textSecondary}>
                  {topLeft}
                </Text>
                {topRight}
              </HStack>

              <Box flex={1} justifyContent="center" alignItems="center">
                {children}
              </Box>
            </VStack>
          </Box>
        </HStack>
      </Box>
    </Box>
  );
}

import { PropsWithChildren, ReactNode } from 'react';
import { Box, Button, HStack, Input, Text, VStack } from 'native-base';
import { tokens } from '@theme/tokens';

const nb = (px: number) => px / 4;

export type AuthUiVariant = 'mobile' | 'web';

export function AuthFormTitle({
  children,
  ui = 'mobile',
}: PropsWithChildren<{ ui?: AuthUiVariant }>) {
  return (
    <Text fontSize={ui === 'web' ? 34 : 28} fontWeight="800" color={tokens.colors.textPrimary}>
      {children}
    </Text>
  );
}

export function AuthFormBody({
  children,
  ui = 'mobile',
}: PropsWithChildren<{ ui?: AuthUiVariant }>) {
  return (
    <Text
      fontSize={ui === 'web' ? 15 : 14}
      fontWeight="500"
      lineHeight={ui === 'web' ? 22 : 20}
      color={tokens.colors.textSecondary}
    >
      {children}
    </Text>
  );
}

export function FieldLabel({ children }: PropsWithChildren) {
  return (
    <Text fontSize={13} fontWeight="700" color={tokens.colors.textPrimary}>
      {children}
    </Text>
  );
}

export function FieldError({ children }: PropsWithChildren) {
  return (
    <Text fontSize={12} fontWeight="600" color={tokens.colors.error}>
      {children}
    </Text>
  );
}

export function AuthInput({ ui = 'mobile', ...props }: React.ComponentProps<typeof Input> & { ui?: AuthUiVariant }) {
  return (
    <Input
      bg={ui === 'web' ? tokens.colors.surface : tokens.colors.bgPrimary}
      borderRadius={tokens.radii.sm}
      borderWidth={1}
      borderColor={tokens.colors.border}
      px={ui === 'web' ? nb(18) : nb(16)}
      py={ui === 'web' ? nb(16) : nb(14)}
      fontSize={ui === 'web' ? 15 : 14}
      fontWeight="500"
      _focus={{
        borderColor: tokens.colors.brand,
        bg: ui === 'web' ? tokens.colors.surface : tokens.colors.bgPrimary,
      }}
      _disabled={{ opacity: 0.6 }}
      {...props}
    />
  );
}

export function PrimaryButton({
  children,
  isLoading,
  onPress,
  ui = 'mobile',
}: {
  children: ReactNode;
  isLoading?: boolean;
  onPress?: () => void;
  ui?: AuthUiVariant;
}) {
  return (
    <Button
      onPress={onPress}
      isLoading={isLoading}
      bg={tokens.colors.brand}
      borderRadius={tokens.radii.sm}
      py={ui === 'web' ? nb(16) : nb(14)}
      _text={{ color: '#FFFFFF', fontWeight: '800', fontSize: 16 }}
      _pressed={{ opacity: 0.9 }}
    >
      {children}
    </Button>
  );
}

export function DividerOrContinue({ label }: { label: string }) {
  return (
    <HStack alignItems="center" space={nb(12)}>
      <Box flex={1} h="1px" bg={tokens.colors.border} />
      <Text fontSize={11} fontWeight="700" letterSpacing={1.1} color={tokens.colors.textSecondary}>
        {label}
      </Text>
      <Box flex={1} h="1px" bg={tokens.colors.border} />
    </HStack>
  );
}

export function LinkRow({ left, right }: { left: ReactNode; right: ReactNode }) {
  return (
    <HStack justifyContent="space-between" alignItems="center">
      {left}
      {right}
    </HStack>
  );
}

export function BottomInlineLink({
  text,
  link,
}: {
  text: string;
  link: ReactNode;
}) {
  return (
    <HStack justifyContent="center" alignItems="center" space={nb(6)}>
      <Text fontSize={13} fontWeight="500" color={tokens.colors.textSecondary}>
        {text}
      </Text>
      {link}
    </HStack>
  );
}

export function InfoNote({
  dotColor,
  children,
  ui = 'mobile',
}: PropsWithChildren<{ dotColor: string; ui?: AuthUiVariant }>) {
  return (
    <Box
      bg={ui === 'web' ? tokens.colors.surface : tokens.colors.bgPrimary}
      borderRadius={tokens.radii.sm}
      p={ui === 'web' ? nb(16) : nb(14)}
    >
      <HStack space={nb(10)} alignItems="flex-start">
        <Box w={2.5} h={2.5} borderRadius={999} bg={dotColor} mt={1} />
        <Text
          flex={1}
          fontSize={13}
          fontWeight="500"
          lineHeight={18}
          color={tokens.colors.textSecondary}
        >
          {children}
        </Text>
      </HStack>
    </Box>
  );
}

export function TermsRow({ children }: PropsWithChildren) {
  return (
    <HStack space={nb(10)} alignItems="center">
      <Box
        w={nb(18)}
        h={nb(18)}
        borderRadius={nb(5)}
        bg={tokens.colors.surface}
        borderWidth={1}
        borderColor={tokens.colors.border}
      />
      <Text flex={1} fontSize={13} fontWeight="500" color={tokens.colors.textSecondary}>
        {children}
      </Text>
    </HStack>
  );
}

export function CardStack({
  children,
  gapPx = 16,
}: PropsWithChildren<{ gapPx?: number }>) {
  return <VStack space={gapPx / 4}>{children}</VStack>;
}

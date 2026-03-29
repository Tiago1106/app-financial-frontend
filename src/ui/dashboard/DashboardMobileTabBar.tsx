import { HStack, Text, VStack } from 'native-base';
import { tokens } from '@theme/tokens';

const px = (n: number) => `${n}px`;

function Tab({ label, active }: { label: string; active?: boolean }) {
  return (
    <VStack
      flex={1}
      height="100%"
      justifyContent="center"
      alignItems="center"
      bg={active ? tokens.colors.brand : undefined}
      borderRadius={26}
    >
      <Text
        fontSize={10}
        fontWeight={active ? '800' : '700'}
        color={active ? tokens.colors.surface : tokens.colors.textSecondary}
      >
        {label}
      </Text>
    </VStack>
  );
}

export function DashboardMobileTabBar() {
  return (
    <HStack width="100%" px={px(21)} pb={px(16)} pt={px(8)}>
      <HStack
        width="100%"
        height={px(62)}
        bg={tokens.colors.surface}
        borderRadius={tokens.radii.phone}
        borderWidth={1}
        borderColor={tokens.colors.border}
        p={px(4)}
      >
        <Tab label="Início" active />
        <Tab label="Extrato" />
        <Tab label="Nova" />
        <Tab label="Perfil" />
      </HStack>
    </HStack>
  );
}

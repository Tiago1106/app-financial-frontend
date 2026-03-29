import { HStack, Pressable, Text, VStack, Box, Menu } from 'native-base';
import { Platform, useWindowDimensions } from 'react-native';
import { tokens } from '@theme/tokens';
import { formatMonthYearPtBR } from '@ui/dashboard/format';
import { useAuth } from '@providers/auth';

const px = (n: number) => `${n}px`;

type Props = {
  year: number;
  month: number;
  greetingName?: string | null;
  onPressLogout: () => void;
};

function Avatar({ initials, sizePx, radiusPx }: { initials: string; sizePx: number; radiusPx: number }) {
  return (
    <HStack
      width={px(sizePx)}
      height={px(sizePx)}
      borderRadius={px(radiusPx)}
      bg={tokens.colors.brand}
      justifyContent="center"
      alignItems="center"
    >
      <Text fontSize={14} fontWeight="800" color={tokens.colors.surface}>
        {initials}
      </Text>
    </HStack>
  );
}

function Pills() {
  return (
    <HStack
      bg={tokens.colors.bgPrimary}
      borderRadius={999}
      borderWidth={1}
      borderColor={tokens.colors.border}
      p={px(4)}
      space={px(6)}
    >
      <Box bg={tokens.colors.brand} borderRadius={999} px={px(14)} py={px(10)}>
        <Text fontSize={13} fontWeight="800" color={tokens.colors.surface}>
          Início
        </Text>
      </Box>
      <Box borderRadius={999} px={px(14)} py={px(10)}>
        <Text fontSize={13} fontWeight="700" color={tokens.colors.textSecondary}>
          Extrato
        </Text>
      </Box>
      <Box borderRadius={999} px={px(14)} py={px(10)}>
        <Text fontSize={13} fontWeight="700" color={tokens.colors.textSecondary}>
          Nova despesa
        </Text>
      </Box>
    </HStack>
  );
}

export function DashboardHeader({ year, month, greetingName, onPressLogout }: Props) {
  const { width } = useWindowDimensions();
  const isWeb = Platform.OS === 'web' && width >= 900;
  const auth = useAuth();

  const displayName = greetingName ?? auth.user?.name ?? auth.user?.email ?? ' ';
  const firstName = typeof displayName === 'string' ? displayName.split(' ')[0] : '';
  const initials =
    typeof displayName === 'string' && displayName.trim()
      ? displayName
          .trim()
          .split(' ')
          .slice(0, 2)
          .map((p) => p[0]?.toUpperCase() ?? '')
          .join('')
      : 'VB';

  const avatarSpec = isWeb
    ? { sizePx: 44, radiusPx: 22 }
    : { sizePx: 46, radiusPx: 23 };

  const menu = (
    <Menu
      w={px(220)}
      placement="bottom right"
      borderRadius={16}
      bg={tokens.colors.surface}
      borderWidth={1}
      borderColor={tokens.colors.border}
      p={px(8)}
      shadow={0}
      offset={0}
      crossOffset={0}
      trigger={(triggerProps) => (
        <Pressable accessibilityLabel="Menu do usuario" {...triggerProps}>
          <Avatar
            initials={initials}
            sizePx={avatarSpec.sizePx}
            radiusPx={avatarSpec.radiusPx}
          />
        </Pressable>
      )}
    >
      <Menu.Item
        onPress={() => {}}
        bg={tokens.colors.bgPrimary}
        borderRadius={12}
        px={px(12)}
        py={px(10)}
      >
        <Text fontSize={13} fontWeight="700" color={tokens.colors.textPrimary}>
          Perfil
        </Text>
      </Menu.Item>
      <Menu.Item
        onPress={() => {}}
        bg={tokens.colors.bgPrimary}
        borderRadius={12}
        px={px(12)}
        py={px(10)}
        mt={px(6)}
      >
        <Text fontSize={13} fontWeight="700" color={tokens.colors.textPrimary}>
          Configurações
        </Text>
      </Menu.Item>
      <Menu.Item
        onPress={onPressLogout}
        bg={tokens.colors.bgPrimary}
        borderRadius={12}
        px={px(12)}
        py={px(10)}
        mt={px(6)}
      >
        <Text fontSize={13} fontWeight="700" color={tokens.colors.error}>
          Sair
        </Text>
      </Menu.Item>
    </Menu>
  );

  if (isWeb) {
    return (
      <HStack justifyContent="space-between" alignItems="center" width="100%">
        <VStack space={px(6)}>
          <Text fontSize={28} fontWeight="800" color={tokens.colors.textPrimary}>
            Olá, {firstName}
          </Text>
          <Text fontSize={14} fontWeight="500" color={tokens.colors.textSecondary}>
            Resumo financeiro de {formatMonthYearPtBR(year, month)}
          </Text>
        </VStack>

        <HStack alignItems="center" space={px(12)}>
          <Pills />
          {menu}
        </HStack>
      </HStack>
    );
  }

  return (
    <HStack justifyContent="space-between" alignItems="center" width="100%">
      <VStack space={px(6)} flex={1} pr={px(12)}>
        <Text fontSize={28} fontWeight="800" color={tokens.colors.textPrimary}>
          Olá, {firstName}
        </Text>
        <Text fontSize={14} fontWeight="500" color={tokens.colors.textSecondary}>
          Resumo de {formatMonthYearPtBR(year, month)}
        </Text>
      </VStack>

      {menu}
    </HStack>
  );
}

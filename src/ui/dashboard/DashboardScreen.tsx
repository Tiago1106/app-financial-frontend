import { Box, HStack, Pressable, ScrollView, Text, VStack } from 'native-base';
import { Platform, useWindowDimensions } from 'react-native';
import { ReactNode } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { tokens } from '@theme/tokens';
import { DashboardHeader } from '@ui/dashboard/DashboardHeader';
import { DashboardMobileTabBar } from '@ui/dashboard/DashboardMobileTabBar';
import { useDashboardMonthly } from '@ui/dashboard/useDashboardMonthly';
import { formatCurrencyBRL, formatShortDateOrTodayPtBR } from '@ui/dashboard/format';
import { useAuth } from '@providers/auth';
import { t } from '@i18n/index';

const px = (n: number) => `${n}px`;

function SectionCard({ children }: { children: ReactNode }) {
  return (
    <Box
      bg={tokens.colors.surface}
      borderRadius={22}
      borderWidth={1}
      borderColor={tokens.colors.border}
      p={px(12)}
    >
      {children}
    </Box>
  );
}

function BarRow({
  label,
  value,
  pct,
  trackHeightPx = 10,
}: {
  label: string;
  value: string;
  pct: number;
  trackHeightPx?: number;
}) {
  const clamp = (n: number) => Math.max(0, Math.min(1, n));
  const wPct = `${Math.round(clamp(pct) * 100)}%`;

  return (
    <VStack space={px(8)}>
      <HStack justifyContent="space-between" alignItems="center" width="100%">
        <Text fontSize={13} fontWeight="700" color={tokens.colors.textPrimary}>
          {label}
        </Text>
        <Text fontSize={13} fontWeight="700" color={tokens.colors.textSecondary}>
          {value}
        </Text>
      </HStack>
      <Box
        bg={tokens.colors.bgSecondary}
        borderRadius={999}
        height={px(trackHeightPx)}
        overflow="hidden"
      >
        <Box bg={tokens.colors.brand} borderRadius={999} height="100%" width={wPct} />
      </Box>
    </VStack>
  );
}

function RecentItem({
  title,
  meta,
  value,
  status,
  statusTone,
  bgColor = tokens.colors.bgPrimary,
}: {
  title: string;
  meta: string;
  value: string;
  status: string;
  statusTone: 'success' | 'warning';
  bgColor?: string;
}) {
  return (
    <HStack
      bg={bgColor}
      borderRadius={16}
      px={px(14)}
      py={px(12)}
      justifyContent="space-between"
      alignItems="center"
    >
      <VStack space={px(4)} flex={1} pr={px(12)}>
        <Text fontSize={14} fontWeight="800" color={tokens.colors.textPrimary}>
          {title}
        </Text>
        <Text fontSize={12} fontWeight="500" color={tokens.colors.textSecondary}>
          {meta}
        </Text>
      </VStack>
      <VStack space={px(4)} alignItems="flex-end">
        <Text fontSize={14} fontWeight="800" color={tokens.colors.textPrimary}>
          {value}
        </Text>
        <Text
          fontSize={12}
          fontWeight="700"
          color={statusTone === 'success' ? tokens.colors.success : tokens.colors.warning}
        >
          {status}
        </Text>
      </VStack>
    </HStack>
  );
}

export function DashboardScreen() {
  const auth = useAuth();
  const { width } = useWindowDimensions();
  const isWeb = Platform.OS === 'web' && width >= 900;
  const webUseColumnMain = true;
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === 'web' ? 24 : Math.max(insets.top, 24);

  const { data, isLoading } = useDashboardMonthly();
  const year = data?.period.year ?? new Date().getUTCFullYear();
  const month = data?.period.month ?? new Date().getUTCMonth() + 1;

  const totals = data?.totals;
  const counts = data?.counts;
  const categories = data?.categories ?? [];
  const recent = data?.recent ?? [];

  const top = categories.slice(0, isWeb ? 3 : 2);
  const maxCat = top.reduce((acc, c) => Math.max(acc, Number(c.total)), 0) || 1;

  const monthLabelShort = new Intl.DateTimeFormat('pt-BR', { month: 'long' })
    .format(new Date(Date.UTC(year, month - 1, 1)))
    .split(' ')[0];
  const monthLabelCap = monthLabelShort
    ? `${monthLabelShort[0]?.toUpperCase() ?? ''}${monthLabelShort.slice(1)}`
    : '';

  const recentWeb = recent.slice(0, 2);
  const recentMobile = recent.slice(0, 1);

  const shellBg = tokens.colors.bgPrimary;

  if (isWeb) {
    return (
      <Box
        flex={1}
        bg={shellBg}
        borderRadius={tokens.radii.xl}
        borderWidth={1}
        borderColor={tokens.colors.border}
        overflow="hidden"
        p={px(24)}
      >
        <Box
          flex={1}
          bg={tokens.colors.surface}
          borderRadius={tokens.radii.lg}
          borderWidth={1}
          borderColor={tokens.colors.border}
          p={px(20)}
        >
          <VStack space={px(18)} flex={1}>
            <DashboardHeader
              year={year}
              month={month}
              greetingName={data?.greeting.name ?? auth.user?.name}
              onPressLogout={auth.signOut}
            />

            <HStack justifyContent="flex-end">
              <Pressable>
                <HStack
                  bg={tokens.colors.brand}
                  borderRadius={12}
                  px={px(16)}
                  py={px(12)}
                  justifyContent="center"
                  alignItems="center"
                >
                  <Text fontSize={14} fontWeight="800" color={tokens.colors.surface}>
                    {t('dashboard.newExpense')}
                  </Text>
                </HStack>
              </Pressable>
            </HStack>

            <HStack space={px(16)}>
              <Box
                flex={1}
                bg={shellBg}
                borderRadius={tokens.radii.card}
                borderWidth={1}
                borderColor={tokens.colors.border}
                p={px(18)}
              >
                <VStack space={px(8)}>
                  <Text fontSize={12} fontWeight="700" color={tokens.colors.textSecondary}>
                    {t('dashboard.totalExpenses')}
                  </Text>
                  <Text fontSize={28} fontWeight="800" color={tokens.colors.textPrimary}>
                    {formatCurrencyBRL(totals?.total ?? 0)}
                  </Text>
                </VStack>
              </Box>

              <Box
                flex={1}
                bg={shellBg}
                borderRadius={tokens.radii.card}
                borderWidth={1}
                borderColor={tokens.colors.border}
                p={px(18)}
              >
                <VStack space={px(8)}>
                  <Text fontSize={12} fontWeight="700" color={tokens.colors.textSecondary}>
                    {t('dashboard.expensesPaid')}
                  </Text>
                  <Text fontSize={28} fontWeight="800" color={tokens.colors.textPrimary}>
                    {counts ? `${counts.paid}` : '—'}
                  </Text>
                </VStack>
              </Box>

              <Box
                flex={1}
                bg={shellBg}
                borderRadius={tokens.radii.card}
                borderWidth={1}
                borderColor={tokens.colors.border}
                p={px(18)}
              >
                <VStack space={px(8)}>
                  <Text fontSize={12} fontWeight="700" color={tokens.colors.textSecondary}>
                    {t('dashboard.expensesPending')}
                  </Text>
                  <Text fontSize={28} fontWeight="800" color={tokens.colors.textPrimary}>
                    {counts ? `${counts.pending}` : '—'}
                  </Text>
                </VStack>
              </Box>
            </HStack>

            {webUseColumnMain ? (
              <VStack space={px(16)} flex={1}>
                <Box
                  width="100%"
                  bg={shellBg}
                  borderRadius={22}
                  borderWidth={1}
                  borderColor={tokens.colors.border}
                  p={px(20)}
                >
                  <VStack space={px(16)}>
                    <HStack justifyContent="space-between" alignItems="center">
                      <Text fontSize={18} fontWeight="800" color={tokens.colors.textPrimary}>
                        {t('dashboard.categoriesMonthTitle')}
                      </Text>
                      <Text fontSize={13} fontWeight="700" color={tokens.colors.textSecondary}>
                        {monthLabelCap}
                      </Text>
                    </HStack>

                    <VStack space={px(8)}>
                      {top.map((c) => (
                        <BarRow
                          key={c.category}
                          label={c.category}
                          value={formatCurrencyBRL(c.total)}
                          pct={Number(c.total) / maxCat}
                          trackHeightPx={12}
                        />
                      ))}
                      {top.length === 0 && (
                        <Text fontSize={13} fontWeight="600" color={tokens.colors.textSecondary}>
                          {isLoading ? t('common.loading') : t('dashboard.emptyNoData')}
                        </Text>
                      )}
                    </VStack>
                  </VStack>
                </Box>

                <Box
                  width="100%"
                  bg={shellBg}
                  borderRadius={22}
                  borderWidth={1}
                  borderColor={tokens.colors.border}
                  p={px(20)}
                >
                  <VStack space={px(14)}>
                    <HStack justifyContent="space-between" alignItems="center">
                      <Text fontSize={18} fontWeight="800" color={tokens.colors.textPrimary}>
                        {t('dashboard.recentTitle')}
                      </Text>
                      <Text fontSize={13} fontWeight="700" color={tokens.colors.brand}>
                        {t('dashboard.statementLink')}
                      </Text>
                    </HStack>

                    <VStack space={px(12)}>
                      {recentWeb.map((r) => (
                        <RecentItem
                          key={r.id}
                          title={r.description}
                          meta={`${formatShortDateOrTodayPtBR(r.dueDate)} · ${r.category}`}
                          value={formatCurrencyBRL(r.amount)}
                          status={r.isPaid ? t('dashboard.statusPaid') : t('dashboard.statusPending')}
                          statusTone={r.isPaid ? 'success' : 'warning'}
                          bgColor={tokens.colors.surface}
                        />
                      ))}
                      {recentWeb.length === 0 && (
                        <Text fontSize={13} fontWeight="600" color={tokens.colors.textSecondary}>
                          {isLoading ? t('common.loading') : t('dashboard.emptyNoItems')}
                        </Text>
                      )}
                    </VStack>
                  </VStack>
                </Box>
              </VStack>
            ) : (
              <HStack space={px(16)} flex={1}>
                <Box
                  flex={1}
                  bg={shellBg}
                  borderRadius={22}
                  borderWidth={1}
                  borderColor={tokens.colors.border}
                  p={px(20)}
                >
                  <VStack space={px(16)}>
                    <HStack justifyContent="space-between" alignItems="center">
                      <Text fontSize={18} fontWeight="800" color={tokens.colors.textPrimary}>
                        {t('dashboard.categoriesMonthTitle')}
                      </Text>
                    <Text fontSize={13} fontWeight="700" color={tokens.colors.textSecondary}>
                      {monthLabelCap}
                    </Text>
                  </HStack>

                    <VStack space={px(8)}>
                      {top.map((c) => (
                        <BarRow
                          key={c.category}
                          label={c.category}
                        value={formatCurrencyBRL(c.total)}
                        pct={Number(c.total) / maxCat}
                        trackHeightPx={12}
                      />
                    ))}
                    {top.length === 0 && (
                      <Text fontSize={13} fontWeight="600" color={tokens.colors.textSecondary}>
                        {isLoading ? t('common.loading') : t('dashboard.emptyNoData')}
                      </Text>
                    )}
                  </VStack>
                </VStack>
              </Box>

                <Box
                  width={360}
                  bg={shellBg}
                  borderRadius={22}
                  borderWidth={1}
                  borderColor={tokens.colors.border}
                  p={px(20)}
                >
                  <VStack space={px(14)}>
                    <HStack justifyContent="space-between" alignItems="center">
                      <Text fontSize={18} fontWeight="800" color={tokens.colors.textPrimary}>
                        {t('dashboard.recentTitle')}
                      </Text>
                    <Text fontSize={13} fontWeight="700" color={tokens.colors.brand}>
                      {t('dashboard.statementLink')}
                    </Text>
                  </HStack>

                    <VStack space={px(12)}>
                      {recentWeb.map((r) => (
                        <RecentItem
                          key={r.id}
                          title={r.description}
                        meta={`${formatShortDateOrTodayPtBR(r.dueDate)} · ${r.category}`}
                        value={formatCurrencyBRL(r.amount)}
                        status={r.isPaid ? t('dashboard.statusPaid') : t('dashboard.statusPending')}
                        statusTone={r.isPaid ? 'success' : 'warning'}
                        bgColor={tokens.colors.surface}
                      />
                    ))}
                    {recentWeb.length === 0 && (
                      <Text fontSize={13} fontWeight="600" color={tokens.colors.textSecondary}>
                        {isLoading ? t('common.loading') : t('dashboard.emptyNoItems')}
                      </Text>
                    )}
                  </VStack>
                </VStack>
              </Box>
              </HStack>
            )}
          </VStack>
        </Box>
      </Box>
    );
  }

  return (
    <Box flex={1} bg={shellBg}>
      <ScrollView
        flex={1}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 16, paddingTop: topPad }}
      >
        <VStack space={px(18)} px={px(24)}>
          <DashboardHeader
            year={year}
            month={month}
            greetingName={data?.greeting.name ?? auth.user?.name}
            onPressLogout={auth.signOut}
          />

          <Box bg={tokens.colors.brand} borderRadius={24} p={px(16)}>
            <VStack space={px(12)}>
              <Text
                fontSize={11}
                fontWeight="700"
                letterSpacing={1.1}
                color="#D9DDDD"
              >
                {t('dashboard.totalExpenses').toLocaleUpperCase('pt-BR')}
              </Text>
              <Text fontSize={30} fontWeight="800" color={tokens.colors.surface}>
                {formatCurrencyBRL(totals?.total ?? 0)}
              </Text>

              <HStack space={px(12)}>
                <Box
                  flex={1}
                  bg="#384244"
                  borderRadius={16}
                  p={px(14)}
                >
                  <VStack space={px(6)}>
                    <Text fontSize={12} fontWeight="700" color="#D9DDDD">
                      {t('dashboard.valuePaid')}
                    </Text>
                    <Text fontSize={18} fontWeight="800" color={tokens.colors.surface}>
                      {formatCurrencyBRL(totals?.paid ?? 0)}
                    </Text>
                  </VStack>
                </Box>
                <Box
                  flex={1}
                  bg="#384244"
                  borderRadius={16}
                  p={px(14)}
                >
                  <VStack space={px(6)}>
                    <Text fontSize={12} fontWeight="700" color="#D9DDDD">
                      {t('dashboard.valueToPay')}
                    </Text>
                    <Text fontSize={18} fontWeight="800" color={tokens.colors.surface}>
                      {formatCurrencyBRL(totals?.pending ?? 0)}
                    </Text>
                  </VStack>
                </Box>
              </HStack>
            </VStack>
          </Box>

          <HStack space={px(10)}>
            <Box
              flex={1}
              bg={tokens.colors.surface}
              borderRadius={tokens.radii.card}
              borderWidth={1}
              borderColor={tokens.colors.border}
              p={px(14)}
            >
              <VStack space={px(6)}>
                <Text fontSize={12} fontWeight="700" color={tokens.colors.textSecondary}>
                  {t('dashboard.expensesPaid')}
                </Text>
                <Text fontSize={24} fontWeight="800" color={tokens.colors.textPrimary}>
                  {counts?.paid ?? 0}
                </Text>
              </VStack>
            </Box>
            <Box
              flex={1}
              bg={tokens.colors.surface}
              borderRadius={tokens.radii.card}
              borderWidth={1}
              borderColor={tokens.colors.border}
              p={px(14)}
            >
              <VStack space={px(6)}>
                <Text fontSize={12} fontWeight="700" color={tokens.colors.textSecondary}>
                  {t('dashboard.expensesPending')}
                </Text>
                <Text fontSize={24} fontWeight="800" color={tokens.colors.textPrimary}>
                  {counts?.pending ?? 0}
                </Text>
              </VStack>
            </Box>
          </HStack>

          <SectionCard>
            <VStack space={px(10)}>
              <HStack justifyContent="space-between" alignItems="center">
                <Text fontSize={16} fontWeight="800" color={tokens.colors.textPrimary}>
                  {t('dashboard.categoriesTitle')}
                </Text>
                <Text fontSize={13} fontWeight="700" color={tokens.colors.brand}>
                  {t('dashboard.categoriesLink')}
                </Text>
              </HStack>

              <VStack space={px(8)}>
                {top.map((c) => (
                  <BarRow
                    key={c.category}
                    label={c.category}
                    value={formatCurrencyBRL(c.total)}
                    pct={Number(c.total) / maxCat}
                    trackHeightPx={10}
                  />
                ))}
                {top.length === 0 && (
                  <Text fontSize={13} fontWeight="600" color={tokens.colors.textSecondary}>
                    {isLoading ? t('common.loading') : t('dashboard.emptyNoData')}
                  </Text>
                )}
              </VStack>
            </VStack>
          </SectionCard>

          <SectionCard>
            <VStack space={px(8)}>
              <HStack justifyContent="space-between" alignItems="center">
                <Text fontSize={16} fontWeight="800" color={tokens.colors.textPrimary}>
                  {t('dashboard.recentTitle')}
                </Text>
                <Text fontSize={13} fontWeight="700" color={tokens.colors.brand}>
                  {t('dashboard.statementLink')}
                </Text>
              </HStack>

              <VStack space={px(12)}>
                {recentMobile.map((r) => (
                  <RecentItem
                    key={r.id}
                    title={r.description}
                    meta={`${formatShortDateOrTodayPtBR(r.dueDate)} · ${r.category}`}
                    value={formatCurrencyBRL(r.amount)}
                    status={r.isPaid ? t('dashboard.statusPaid') : t('dashboard.statusPending')}
                    statusTone={r.isPaid ? 'success' : 'warning'}
                  />
                ))}
                {recentMobile.length === 0 && (
                  <Text fontSize={13} fontWeight="600" color={tokens.colors.textSecondary}>
                    {isLoading ? t('common.loading') : t('dashboard.emptyNoItems')}
                  </Text>
                )}
              </VStack>
            </VStack>
          </SectionCard>

          <Box height={78} />
        </VStack>
      </ScrollView>

      <DashboardMobileTabBar />
    </Box>
  );
}

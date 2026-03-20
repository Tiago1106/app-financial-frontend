import { Link, router } from 'expo-router';
import { Box, Checkbox, Pressable, Text, VStack } from 'native-base';
import { Fragment, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { getApiErrorMessage } from '@services/api';
import { useAuth } from '@providers/auth';
import { t } from '@i18n/index';
import { useAuthLayoutVariant } from '@ui/auth/useAuthLayoutVariant';
import { AuthWebShell } from '@ui/auth/AuthWebShell';
import { AuthMobileShell } from '@ui/auth/AuthMobileShell';
import {
  AuthFormBody,
  AuthFormTitle,
  AuthInput,
  BottomInlineLink,
  CardStack,
  DividerOrContinue,
  FieldError,
  FieldLabel,
  LinkRow,
  PrimaryButton,
} from '@ui/auth/AuthFormBits';
import { tokens } from '@theme/tokens';


type FormValues = {
  email: string;
  password: string;
};

export default function LoginScreen() {
  const auth = useAuth();
  const variant = useAuthLayoutVariant();
  const ui = variant === 'web' ? 'web' : 'mobile';
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [remember, setRemember] = useState(true);

  const schema = useMemo(
    () =>
      yup.object({
        email: yup.string().email(t('errors.invalidEmail')).required(t('errors.required')),
        password: yup.string().min(6, t('errors.minPassword')).required(t('errors.required')),
      }),
    [],
  );

  const { control, handleSubmit, formState } = useForm<FormValues>({
    defaultValues: { email: '', password: '' },
    resolver: yupResolver(schema),
    mode: 'onSubmit',
  });

  async function onSubmit(values: FormValues) {
    setSubmitError(null);
    try {
      await auth.signIn(values);
      router.replace('/(app)');
    } catch (err) {
      setSubmitError(getApiErrorMessage(err));
    }
  }

  const formCore = (
    <Fragment>
      <VStack>
        <AuthFormTitle ui={ui}>{t('auth.login.title')}</AuthFormTitle>
        <AuthFormBody ui={ui}>{t('auth.login.subtitle')}</AuthFormBody>
      </VStack>

      {submitError && (
        <Text fontSize={13} fontWeight="600" color={tokens.colors.error}>
          {submitError}
        </Text>
      )}

      <VStack space={2}>
        <FieldLabel>{t('auth.login.emailLabel')}</FieldLabel>
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, onBlur, value } }) => (
            <AuthInput
              ui={ui}
              autoCapitalize="none"
              keyboardType="email-address"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
          )}
        />
        {!!formState.errors.email?.message && <FieldError>{formState.errors.email.message}</FieldError>}
      </VStack>

      <VStack space={2}>
        <FieldLabel>{t('auth.login.passwordLabel')}</FieldLabel>
        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, onBlur, value } }) => (
            <AuthInput
              ui={ui}
              type="password"
              placeholder={t('auth.login.passwordPlaceholder')}
              placeholderTextColor={tokens.colors.textDisabled}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
          )}
        />
        {!!formState.errors.password?.message && <FieldError>{formState.errors.password.message}</FieldError>}
      </VStack>

      <LinkRow
        left={
          <Checkbox
            value="remember"
            isChecked={remember}
            onChange={setRemember}
            accessibilityLabel={t('auth.login.rememberMe')}
            _text={{ fontSize: 13, fontWeight: '600', color: tokens.colors.textPrimary }}
            borderColor={tokens.colors.border}
            bg={tokens.colors.surface}
          >
            {t('auth.login.rememberMe')}
          </Checkbox>
        }
        right={
          <Link href="/(auth)/forgot-password" asChild>
            <Pressable>
              <Text fontSize={13} fontWeight="700" color={tokens.colors.brand}>
                {t('auth.login.forgotPassword')}
              </Text>
            </Pressable>
          </Link>
        }
      />

      <PrimaryButton ui={ui} isLoading={formState.isSubmitting} onPress={handleSubmit(onSubmit)}>
        {t('auth.login.submit')}
      </PrimaryButton>
    </Fragment>
  );

  const formFooter = (
    <VStack style={{ gap: 12 }} alignItems="center">
      <DividerOrContinue label={t('auth.login.divider')} />
      <BottomInlineLink
        text={t('auth.login.bottomText')}
        link={
          <Link href="/(auth)/register" asChild>
            <Pressable>
              <Text fontSize={13} fontWeight="700" color={tokens.colors.brand}>
                {t('auth.login.bottomLink')}
              </Text>
            </Pressable>
          </Link>
        }
      />
    </VStack>
  );

  if (variant === 'web') {
    return (
      <AuthWebShell
        topLeft={t('auth.login.webTopLeft')}
        topRight={<Text fontSize={14} fontWeight="700" color={tokens.colors.brand}>{t('auth.helpCta')}</Text>}
        aside={{
          brandKicker: t('auth.brandKicker'),
          title: t('auth.login.webAsideTitle'),
          body: t('auth.login.webAsideBody'),
          stat: {
            label: t('auth.login.webStatLabel'),
            value: t('auth.login.webStatValue'),
            body: t('auth.login.webStatBody'),
          },
        }}
      >
        <Box
          w={460}
          bg={tokens.colors.bgPrimary}
          borderRadius={tokens.radii.lg}
          borderWidth={1}
          borderColor={tokens.colors.border}
          p={8}
        >
          <CardStack gapPx={16}>
            {formCore}
            <DividerOrContinue label={t('auth.login.divider')} />
            <BottomInlineLink
              text={t('auth.login.bottomText')}
              link={
                <Link href="/(auth)/register" asChild>
                  <Pressable>
                    <Text fontSize={13} fontWeight="700" color={tokens.colors.brand}>
                      {t('auth.login.bottomLink')}
                    </Text>
                  </Pressable>
                </Link>
              }
            />
          </CardStack>
        </Box>
      </AuthWebShell>
    );
  }

  return (
    <AuthMobileShell
      hero={{
        kicker: t('auth.login.heroKicker'),
        title: t('auth.login.heroTitle'),
        body: t('auth.login.heroBody'),
      }}
      footer={formFooter}
    >
      <CardStack gapPx={16}>
        {formCore}
      </CardStack>
    </AuthMobileShell>
  );
}

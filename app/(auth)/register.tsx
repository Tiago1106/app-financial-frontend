import { Link, router } from 'expo-router';
import { Box, HStack, Pressable, Text, VStack } from 'native-base';
import { useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import type { Resolver } from 'react-hook-form';
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
  FieldError,
  FieldLabel,
  InfoNote,
  PrimaryButton,
  TermsRow,
} from '@ui/auth/AuthFormBits';
import { tokens } from '@theme/tokens';

type FormValues = {
  firstName?: string;
  lastName?: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export default function RegisterScreen() {
  const auth = useAuth();
  const variant = useAuthLayoutVariant();
  const ui = variant === 'web' ? 'web' : 'mobile';
  const [submitError, setSubmitError] = useState<string | null>(null);

  const schema: yup.ObjectSchema<FormValues> = useMemo(
    () =>
      yup.object({
        firstName: yup.string().optional(),
        lastName: yup.string().optional(),
        email: yup.string().email(t('errors.invalidEmail')).required(t('errors.required')),
        password: yup.string().min(6, t('errors.minPassword')).required(t('errors.required')),
        confirmPassword: yup
          .string()
          .oneOf([yup.ref('password')], t('errors.passwordsDontMatch'))
          .required(t('errors.required')),
      }),
    [],
  );

  const { control, handleSubmit, formState } = useForm<FormValues>({
    defaultValues: { firstName: '', lastName: '', email: '', password: '', confirmPassword: '' },
    resolver: yupResolver(schema) as unknown as Resolver<FormValues>,
    mode: 'onSubmit',
  });

  async function onSubmit(values: FormValues) {
    setSubmitError(null);
    try {
      await auth.signUp({
        name:
          [values.firstName, values.lastName]
            .map((s) => (s ?? '').trim())
            .filter(Boolean)
            .join(' ') || undefined,
        email: values.email,
        password: values.password,
      });
      router.replace('/(app)');
    } catch (err) {
      setSubmitError(getApiErrorMessage(err));
    }
  }

  const form = (
    <CardStack gapPx={variant === 'web' ? 16 : 14}>
      <VStack space={2}>
        <AuthFormTitle ui={ui}>{t('auth.register.title')}</AuthFormTitle>
        <AuthFormBody ui={ui}>{t('auth.register.subtitle')}</AuthFormBody>
      </VStack>

      {submitError && (
        <Text fontSize={13} fontWeight="600" color={tokens.colors.error}>
          {submitError}
        </Text>
      )}

      <HStack space={3}>
        <VStack flex={1} space={2}>
          <FieldLabel>{t('auth.register.nameLabel')}</FieldLabel>
          <Controller
            control={control}
            name="firstName"
            render={({ field: { onChange, onBlur, value } }) => (
              <AuthInput ui={ui} onBlur={onBlur} onChangeText={onChange} value={value} />
            )}
          />
          {!!formState.errors.firstName?.message && <FieldError>{formState.errors.firstName.message}</FieldError>}
        </VStack>
        <VStack flex={1} space={2}>
          <FieldLabel>{t('auth.register.lastNameLabel')}</FieldLabel>
          <Controller
            control={control}
            name="lastName"
            render={({ field: { onChange, onBlur, value } }) => (
              <AuthInput ui={ui} onBlur={onBlur} onChangeText={onChange} value={value} />
            )}
          />
          {!!formState.errors.lastName?.message && <FieldError>{formState.errors.lastName.message}</FieldError>}
        </VStack>
      </HStack>

      <VStack space={2}>
        <FieldLabel>{t('auth.register.emailLabel')}</FieldLabel>
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
        <FieldLabel>{t('auth.register.passwordLabel')}</FieldLabel>
        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, onBlur, value } }) => (
            <AuthInput ui={ui} type="password" onBlur={onBlur} onChangeText={onChange} value={value} />
          )}
        />
        {!!formState.errors.password?.message && <FieldError>{formState.errors.password.message}</FieldError>}
      </VStack>

      <VStack space={2}>
        <FieldLabel>{t('auth.register.confirmPasswordLabel')}</FieldLabel>
        <Controller
          control={control}
          name="confirmPassword"
          render={({ field: { onChange, onBlur, value } }) => (
            <AuthInput ui={ui} type="password" onBlur={onBlur} onChangeText={onChange} value={value} />
          )}
        />
        {!!formState.errors.confirmPassword?.message && (
          <FieldError>{formState.errors.confirmPassword.message}</FieldError>
        )}
      </VStack>

      <TermsRow>{t('auth.register.termsText')}</TermsRow>

      <PrimaryButton ui={ui} isLoading={formState.isSubmitting} onPress={handleSubmit(onSubmit)}>
        {t('auth.register.submit')}
      </PrimaryButton>

      <BottomInlineLink
        text={t('auth.register.bottomText')}
        link={
          <Link href="/(auth)/login" asChild>
            <Pressable>
              <Text fontSize={13} fontWeight="700" color={tokens.colors.brand}>
                {t('auth.register.bottomLink')}
              </Text>
            </Pressable>
          </Link>
        }
      />
    </CardStack>
  );

  if (variant === 'web') {
    return (
      <AuthWebShell
        topLeft={t('auth.register.webTopLeft')}
        topRight={
          <Text fontSize={14} fontWeight="700" color={tokens.colors.brand}>
            {t('auth.helpCta')}
          </Text>
        }
        aside={{
          brandKicker: t('auth.brandKicker'),
          title: t('auth.register.webAsideTitle'),
          body: t('auth.register.webAsideBody'),
          stat: {
            label: t('auth.register.webStatLabel'),
            value: t('auth.register.webStatValue'),
            body: t('auth.register.webStatBody'),
          },
        }}
      >
        <Box
          w={500}
          bg={tokens.colors.bgPrimary}
          borderRadius={tokens.radii.lg}
          borderWidth={1}
          borderColor={tokens.colors.border}
          p={8}
        >
          {form}
        </Box>
      </AuthWebShell>
    );
  }

  return (
    <AuthMobileShell
      hero={{
        kicker: t('auth.register.heroKicker'),
        title: t('auth.register.heroTitle'),
        body: t('auth.register.heroBody'),
      }}
      wrapGap={20}
      heroPadding={16}
      heroGap={8}
      cardPadding={16}
      footer={
        <BottomInlineLink
          text={t('auth.register.bottomText')}
          link={
            <Link href="/(auth)/login" asChild>
              <Pressable>
                <Text fontSize={13} fontWeight="700" color={tokens.colors.brand}>
                  {t('auth.register.bottomLink')}
                </Text>
              </Pressable>
            </Link>
          }
        />
      }
    >
      {form}
    </AuthMobileShell>
  );
}

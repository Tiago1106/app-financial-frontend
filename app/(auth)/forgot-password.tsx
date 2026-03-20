import { Link } from 'expo-router';
import { Box, Pressable, Text, VStack } from 'native-base';
import { useMemo, useState } from 'react';
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
  FieldError,
  FieldLabel,
  InfoNote,
  PrimaryButton,
} from '@ui/auth/AuthFormBits';
import { tokens } from '@theme/tokens';

type FormValues = {
  email: string;
};

export default function ForgotPasswordScreen() {
  const auth = useAuth();
  const variant = useAuthLayoutVariant();
  const ui = variant === 'web' ? 'web' : 'mobile';
  const [info, setInfo] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const schema = useMemo(
    () =>
      yup.object({
        email: yup.string().email(t('errors.invalidEmail')).required(t('errors.required')),
      }),
    [],
  );

  const { control, handleSubmit, formState } = useForm<FormValues>({
    defaultValues: { email: '' },
    resolver: yupResolver(schema),
    mode: 'onSubmit',
  });

  async function onSubmit(values: FormValues) {
    setSubmitError(null);
    setInfo(null);
    try {
      const res = await auth.requestPasswordReset(values);
      setInfo(res.message);
    } catch (err) {
      setSubmitError(getApiErrorMessage(err));
    }
  }

  const form = (
    <CardStack gapPx={16}>
      <VStack space={2}>
        <AuthFormTitle ui={ui}>{t('auth.forgot.title')}</AuthFormTitle>
        <AuthFormBody ui={ui}>{t('auth.forgot.subtitle')}</AuthFormBody>
      </VStack>

      {info && (
        <Text fontSize={13} fontWeight="600" color={tokens.colors.success}>
          {info}
        </Text>
      )}
      {submitError && (
        <Text fontSize={13} fontWeight="600" color={tokens.colors.error}>
          {submitError}
        </Text>
      )}

      <VStack space={2}>
        <FieldLabel>{t('auth.forgot.emailLabel')}</FieldLabel>
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

      <InfoNote ui={ui} dotColor={tokens.colors.info}>
        {t('auth.forgot.note')}
      </InfoNote>

      <PrimaryButton ui={ui} isLoading={formState.isSubmitting} onPress={handleSubmit(onSubmit)}>
        {t('auth.forgot.submit')}
      </PrimaryButton>

      <BottomInlineLink
        text={t('auth.forgot.backText')}
        link={
          <Link href="/(auth)/login" asChild>
            <Pressable>
              <Text fontSize={13} fontWeight="700" color={tokens.colors.brand}>
                {t('auth.forgot.backLink')}
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
        topLeft={t('auth.forgot.webTopLeft')}
        topRight={<Text fontSize={14} fontWeight="700" color={tokens.colors.brand}>{t('auth.helpCta')}</Text>}
        aside={{
          brandKicker: t('auth.brandKicker'),
          title: t('auth.forgot.webAsideTitle'),
          body: t('auth.forgot.webAsideBody'),
          stat: {
            label: t('auth.forgot.webStatLabel'),
            value: t('auth.forgot.webStatValue'),
            body: t('auth.forgot.webStatBody'),
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
        kicker: t('auth.forgot.heroKicker'),
        title: t('auth.forgot.heroTitle'),
        body: t('auth.forgot.heroBody'),
      }}
      footer={
        <BottomInlineLink
          text={t('auth.forgot.backText')}
          link={
            <Link href="/(auth)/login" asChild>
              <Pressable>
                <Text fontSize={13} fontWeight="700" color={tokens.colors.brand}>
                  {t('auth.forgot.backLink')}
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

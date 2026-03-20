import { router, useLocalSearchParams } from 'expo-router';
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
  newPassword: string;
  confirmPassword: string;
};

export default function ResetPasswordScreen() {
  const auth = useAuth();
  const variant = useAuthLayoutVariant();
  const ui = variant === 'web' ? 'web' : 'mobile';
  const params = useLocalSearchParams<{ token?: string }>();
  const token = typeof params.token === 'string' ? params.token : null;
  const [info, setInfo] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const schema = useMemo(
    () =>
      yup.object({
        newPassword: yup
          .string()
          .min(6, t('errors.minPassword'))
          .required(t('errors.required')),
        confirmPassword: yup
          .string()
          .oneOf([yup.ref('newPassword')], t('errors.passwordsDontMatch'))
          .required(t('errors.required')),
      }),
    [],
  );

  const { control, handleSubmit, formState } = useForm<FormValues>({
    defaultValues: { newPassword: '', confirmPassword: '' },
    resolver: yupResolver(schema),
    mode: 'onSubmit',
  });

  async function onSubmit(values: FormValues) {
    setSubmitError(null);
    setInfo(null);

    if (!token) {
      setSubmitError(t('errors.missingToken'));
      return;
    }

    try {
      const res = await auth.resetPassword({ token, newPassword: values.newPassword });
      setInfo(res.message);
      router.replace('/(auth)/login');
    } catch (err) {
      setSubmitError(getApiErrorMessage(err));
    }
  }

  const form = (
    <CardStack gapPx={16}>
      <VStack space={2}>
        <AuthFormTitle ui={ui}>{t('auth.reset.title')}</AuthFormTitle>
        <AuthFormBody ui={ui}>{t('auth.reset.subtitle')}</AuthFormBody>
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
        <FieldLabel>{t('auth.reset.newPasswordLabel')}</FieldLabel>
        <Controller
          control={control}
          name="newPassword"
          render={({ field: { onChange, onBlur, value } }) => (
            <AuthInput ui={ui} type="password" onBlur={onBlur} onChangeText={onChange} value={value} />
          )}
        />
        {!!formState.errors.newPassword?.message && <FieldError>{formState.errors.newPassword.message}</FieldError>}
      </VStack>

      <VStack space={2}>
        <FieldLabel>{t('auth.reset.confirmPasswordLabel')}</FieldLabel>
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

      <InfoNote ui={ui} dotColor={tokens.colors.success}>
        {t('auth.reset.note')}
      </InfoNote>

      <PrimaryButton ui={ui} isLoading={formState.isSubmitting} onPress={handleSubmit(onSubmit)}>
        {t('auth.reset.submit')}
      </PrimaryButton>

      <BottomInlineLink
        text={t('auth.reset.backText')}
        link={
          <Pressable onPress={() => router.replace('/(auth)/login')}>
            <Text fontSize={13} fontWeight="700" color={tokens.colors.brand}>
              {t('auth.reset.backLink')}
            </Text>
          </Pressable>
        }
      />
    </CardStack>
  );

  if (variant === 'web') {
    return (
      <AuthWebShell
        topLeft={t('auth.reset.webTopLeft')}
        topRight={<Text fontSize={14} fontWeight="700" color={tokens.colors.brand}>{t('auth.helpCta')}</Text>}
        aside={{
          brandKicker: t('auth.brandKicker'),
          title: t('auth.reset.webAsideTitle'),
          body: t('auth.reset.webAsideBody'),
          stat: {
            label: t('auth.reset.webStatLabel'),
            value: t('auth.reset.webStatValue'),
            body: t('auth.reset.webStatBody'),
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
        kicker: t('auth.reset.heroKicker'),
        title: t('auth.reset.heroTitle'),
        body: t('auth.reset.heroBody'),
      }}
      footer={
        <BottomInlineLink
          text={t('auth.reset.backText')}
          link={
            <Pressable onPress={() => router.replace('/(auth)/login')}>
              <Text fontSize={13} fontWeight="700" color={tokens.colors.brand}>
                {t('auth.reset.backLink')}
              </Text>
            </Pressable>
          }
        />
      }
    >
      {form}
    </AuthMobileShell>
  );
}

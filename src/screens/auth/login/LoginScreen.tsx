import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import { MFScreenWrapper } from '../../../ui-kit/layouts/MFScreenWrapper';
import { MFInput } from '../../../ui-kit/components/inputs/MFInput';
import { MFButton } from '../../../ui-kit/components/buttons/MFButton';
import { MFText } from '../../../ui-kit/components/typography/MFText';
import { MFHeading } from '../../../ui-kit/components/typography/MFText';
import { useTheme } from '../../../ui-kit/theme/ThemeProvider';
import { useBiometrics } from '../../../core/biometrics/useBiometrics';
import { appConfig } from '../../../config/appConfig';
import { changeLanguage } from '../../../utils/changeLanguage';
import { AuthStackParamList } from '../../../navigation/stacks/AuthStack';
import { TBankSDK } from '../../../sdk/TBANKSDK';
import { MFLoader } from '../../../ui-kit/components/loaders/MFLoader';
const schema = z.object({
  phone: z.string().min(10, 'Enter a valid phone number'),
});
type Form = z.infer<typeof schema>;

const LANG_LABELS: Record<string, string> = {
  en: 'EN',
  ar: 'عر',
};

export function LoginScreen() {
  const t = useTheme();
  const { t: tr, i18n } = useTranslation();
  const nav = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
  const { available, authenticate } = useBiometrics();
  const [loading, setLoading] = useState(false);
  const [switching, setSwitching] = useState(false);
  const currentLang = i18n.language?.split('-')[0] ?? 'en';
  const { control, handleSubmit, formState: { errors } } = useForm<Form>({
    resolver: zodResolver(schema),
    defaultValues: { phone: '' },
  });


  const handleLanguageSwitch =
    async (
      code: string
    ) => {

      if (
        currentLang === code ||
        switching
      ) return;

      setSwitching(
        true
      );

      try {

        await changeLanguage(
          code as
          'en' |
          'ar'
        );

      } finally {

        setSwitching(
          false
        );
      }
    };

  const handleLogin = async () => {
    try {
      setLoading(true);
      console.log("1. Configuring TBank SDK...");

      const result = await TBankSDK.configure();

      console.log("2. Configuration completed:", result);

      console.log("3. Calling login...");

      const response = await TBankSDK.login("077863", "2522");
      const data = JSON.parse(response);
      if (data) {
        nav.navigate('Dashboard' as never);
        setLoading(false);
      }
      console.log("4. Login response:", data);

    } catch (e) {
      console.error("TBank error:", e);
      setLoading(false);
    }
  };

  const onSubmit = async (data: Form) => {
    setLoading(true);
    try {
      // nav.navigate('OTP', {
      //   phone: data.phone,
      //   maskedPhone: `****${data.phone.slice(-4)}`,
      // });
      nav.navigate('Dashboard' as never);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MFScreenWrapper keyboardAvoiding statusBarStyle="dark-content">
      <View style={{ flex: 1 }}>

        {/* ── Language switcher ─────────────────────────────────────── */}
        <View style={styles.langRow}>
          <View style={[styles.langPill, { borderColor: t.colors.border, backgroundColor: t.colors.surface }]}>
            {appConfig.supportedLanguages.map((code, idx) => {
              const isActive = currentLang === code;
              const isFirst = idx === 0;
              const isLast = idx === appConfig.supportedLanguages.length - 1;
              return (
                <TouchableOpacity
                  key={code}
                  onPress={() => handleLanguageSwitch(code)}
                  activeOpacity={switching ? 1 : 0.8}
                  disabled={switching}
                  style={[
                    styles.langTab,
                    isFirst && styles.langTabFirst,
                    isLast && styles.langTabLast,
                    isActive && { backgroundColor: t.colors.primary },
                  ]}
                >
                  <MFText
                    variant="sm"
                    weight={isActive ? 'bold' : 'medium'}
                    style={{ color: isActive ? '#fff' : t.colors.textSecondary }}
                  >
                    {LANG_LABELS[code] ?? code.toUpperCase()}
                  </MFText>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* ── Branding ─────────────────────────────────────────────── */}
        <View style={{ alignItems: 'center', marginTop: 48, marginBottom: 40 }}>
          <View style={[styles.logoBox, { backgroundColor: t.colors.primaryLight }]}>
            <MFText style={{ fontSize: 34, color: t.colors.primary }}>
              {appConfig.bankName.charAt(0)}
            </MFText>
          </View>
          <MFHeading level={2} style={{ color: t.colors.primary, marginTop: t.spacing.md, textAlign: 'center' }}>
            {appConfig.bankName}
          </MFHeading>
          <MFText variant="md" color="secondary" style={{ marginTop: 4, textAlign: 'center' }}>
            {tr('auth.login.subtitle')}
          </MFText>
        </View>

        <Controller
          key={currentLang}
          control={control}
          name="phone"
          render={({ field: { onChange, value } }) => (
            <MFInput
              key={currentLang}
              label={tr('auth.login.phonePlaceholder')}
              placeholder="+1 (555) 000-0000"
              keyboardType="phone-pad"
              returnKeyType="done"
              maxLength={15}
              value={value}
              onChangeText={onChange}
              error={errors.phone?.message}
            />
          )}
        />

        <MFButton
          label={tr('auth.login.cta')}
          onPress={handleSubmit(onSubmit)}
          loading={loading}
          style={{ marginTop: t.spacing.sm }}
        />

        {available && (
          <MFButton
            label={tr('auth.login.biometricCta')}
            variant="outline"
            onPress={() => authenticate(`Login to ${appConfig.bankName}`)}
            style={{ marginTop: t.spacing.sm }}
          />
        )}
      </View>
    </MFScreenWrapper>
  );
}

const styles = StyleSheet.create({
  langRow: { flexDirection: 'row', justifyContent: 'flex-end', paddingTop: 16 },
  langPill: { flexDirection: 'row', borderWidth: 1.5, borderRadius: 20, overflow: 'hidden' },
  langTab: { paddingHorizontal: 14, paddingVertical: 7, alignItems: 'center', justifyContent: 'center' },
  langTabFirst: { borderTopLeftRadius: 18, borderBottomLeftRadius: 18 },
  langTabLast: { borderTopRightRadius: 18, borderBottomRightRadius: 18 },
  logoBox: { width: 68, height: 68, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
});

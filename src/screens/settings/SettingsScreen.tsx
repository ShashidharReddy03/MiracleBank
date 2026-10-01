import React, { useState } from 'react';
import { View, Switch } from 'react-native';
import { useDispatch, useSelector }  from 'react-redux';
import { useNavigation }             from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation }            from 'react-i18next';

import { MFScreenWrapper } from '../../ui-kit/layouts/MFScreenWrapper';
import { MFCard }          from '../../ui-kit/components/cards/MFCard';
import { MFText }          from '../../ui-kit/components/typography/MFText';
import { MFHeading }       from '../../ui-kit/components/typography/MFText';
import { MFButton }        from '../../ui-kit/components/buttons/MFButton';
import { MFDialog }        from '../../ui-kit/components/modals/MFModals';
import { useTheme }        from '../../ui-kit/theme/ThemeProvider';
import { RootState }       from '../../store/store';
import { RootStackParamList } from '../../navigation/RootNavigator';
import { setBiometricEnabled } from '../../store/slices/authSlice';
import { useAuth }         from '../../core/auth/useAuth';
import { appConfig }       from '../../config/appConfig';
import { changeLanguage }  from '../../utils/changeLanguage';
import { useLanguage } from '../../localization/LanguageContext';

type SettingsNavProp = NativeStackNavigationProp<RootStackParamList>;

const LANG_LABELS: Record<string, string> = {
  en: 'EN',
  ar: 'عر',
};

export function SettingsScreen() {
  const t              = useTheme();
  // useTranslation gives REACTIVE i18n — lang updates when changeLanguage called
  const { t: tr, i18n } = useTranslation();
  const dispatch        = useDispatch();
  const navigation      = useNavigation<SettingsNavProp>();
  const { logout }      = useAuth();
  const biometricEnabled = useSelector((s: RootState) => s.auth.biometricEnabled);
  const [logoutDialog, setLogoutDialog] = useState(false);
  const [switching, setSwitching]       = useState(false);
  const {isRTL} = useLanguage();

  const currentLang = i18n.language?.split('-')[0] ?? 'en'; // 'en-US' → 'en'

const toggleBiometric = (val: boolean) => {
  dispatch(setBiometricEnabled(val));
};

  const handleLanguageSwitch = async (code: string) => {
    if (currentLang === code || switching) return;
    setSwitching(true);
    try {
      await changeLanguage(code as 'en' | 'ar');
    } finally {
      setSwitching(false);
    }
  };

  const rowStyle = {
    flexDirection:     isRTL ? 'row-reverse' as const : 'row' as const,
    justifyContent:    'space-between' as const,
    alignItems:        'center' as const,
    paddingVertical:   t.spacing.md,
  };

  return (
    <MFScreenWrapper scrollable>
      <MFHeading level={2} style={{ marginBottom: t.spacing.lg, textAlign: isRTL ? 'right' : 'left' }}>
        {tr('settings.title')}
      </MFHeading>

      {/* ── Settings rows ─────────────────────────────────────────────── */}
      <MFCard style={{ marginBottom: t.spacing.lg }}>

        {/* Biometric row */}
        <View style={[rowStyle, { borderBottomWidth: 1, borderBottomColor: t.colors.divider }]}>
          <MFText variant="md" weight="medium">{tr('settings.biometricLogin')}</MFText>
          <Switch
            value={biometricEnabled}
            onValueChange={toggleBiometric}
            trackColor={{ true: t.colors.primary }}
          />
        </View>

        {/* Language row */}
        <View style={rowStyle}>
          <MFText variant="md" weight="medium">{tr('settings.language')}</MFText>
          <View style={{ flexDirection: 'row', gap: t.spacing.sm }}>
            {appConfig.supportedLanguages.map(code => {
              const isActive = currentLang === code;
              return (
                <MFButton
                  key={code}
                  label={LANG_LABELS[code] ?? code.toUpperCase()}
                  size="sm"
                  variant={isActive ? 'primary' : 'outline'}
                  fullWidth={false}
                  disabled={switching}
                  onPress={() => handleLanguageSwitch(code)}
                />
              );
            })}
          </View>
        </View>
      </MFCard>

      {/* ── App info ──────────────────────────────────────────────────── */}
      <MFCard style={{ marginBottom: t.spacing.lg }}>
        <MFText variant="sm" color="secondary">{tr('settings.bankCode')}</MFText>
        <MFText variant="sm" weight="semiBold">{appConfig.bankCode}</MFText>
        <MFText variant="sm" color="secondary" style={{ marginTop: t.spacing.sm }}>
          {tr('settings.version')}
        </MFText>
        <MFText variant="sm" weight="semiBold">1.0.0</MFText>
      </MFCard>

      {/* ── DEV tools ─────────────────────────────────────────────────── */}
      {__DEV__ && (
        <MFButton
          label={tr('settings.testSecurity')}
          variant="outline"
          onPress={() => navigation.navigate('SecurityBlocked', {
            failures: ['Emulator detected', 'USB debugging enabled'],
          })}
          style={{ marginBottom: t.spacing.md }}
        />
      )}

      {/* ── Logout ────────────────────────────────────────────────────── */}
      <MFButton
        label={tr('settings.logoutTitle')}
        variant="danger"
        onPress={() => setLogoutDialog(true)}
      />

      <MFDialog
        visible={logoutDialog}
        title={tr('settings.logoutTitle')}
        message={tr('settings.logoutMessage')}
        confirmLabel={tr('settings.logoutTitle')}
        cancelLabel={tr('common.cancel')}
        destructive
        onConfirm={async () => {
          setLogoutDialog(false);
          await logout();
          navigation.reset({ index: 0, routes: [{ name: 'MFLogin' as any }] });
        }}
        onCancel={() => setLogoutDialog(false)}
      />
    </MFScreenWrapper>
  );
}

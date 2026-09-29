import React from 'react';
import { View, TouchableOpacity, Linking, StyleSheet } from 'react-native';
import { useNavigation }  from '@react-navigation/native';
import { DrawerActions }  from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { MFScreenWrapper } from '../../ui-kit/layouts/MFScreenWrapper';
import { MFText }          from '../../ui-kit/components/typography/MFText';
import { MFHeading }       from '../../ui-kit/components/typography/MFText';
import { MFCard }          from '../../ui-kit/components/cards/MFCard';
import { useTheme }        from '../../ui-kit/theme/ThemeProvider';
import { appConfig }       from '../../config/appConfig';

export function AboutScreen() {
  const t          = useTheme();
  const { t: tr }  = useTranslation();
  const navigation = useNavigation();

  const INFO_ROWS = [
    { label: tr('about.appVersion'), value: '1.0.0' },
    { label: tr('about.bankCode'),   value: appConfig.bankCode },
    { label: tr('about.apiVersion'), value: appConfig.apiVersion },
    { label: tr('about.suppEmail'),  value: appConfig.support.email },
    { label: tr('about.suppPhone'),  value: appConfig.support.phone },
  ];

  const LEGAL_LINKS = [
    { label: tr('about.privacy'), url: `https://${appConfig.bankCode.toLowerCase()}.com/privacy` },
    { label: tr('about.terms'),   url: `https://${appConfig.bankCode.toLowerCase()}.com/terms` },
    { label: tr('about.cookies'), url: `https://${appConfig.bankCode.toLowerCase()}.com/cookies` },
  ];

  return (
    <MFScreenWrapper scrollable keyboardAvoiding={false}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.dispatch(DrawerActions.openDrawer())} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <MFText variant="xl">☰</MFText>
        </TouchableOpacity>
        <MFHeading level={3} style={{ marginLeft: 16 }}>{tr('about.title')}</MFHeading>
      </View>

      <View style={styles.hero}>
        <View style={[styles.logoBox, { backgroundColor: t.colors.primaryLight }]}>
          <MFText variant="display" style={{ color: t.colors.primary }}>{appConfig.bankName.charAt(0)}</MFText>
        </View>
        <MFHeading level={2} style={{ color: t.colors.primary, marginTop: t.spacing.md }}>{appConfig.bankName}</MFHeading>
        <MFText variant="sm" color="secondary" style={{ marginTop: 4 }}>{tr('about.platform')}</MFText>
      </View>

      <MFCard style={{ marginBottom: t.spacing.lg }}>
        {INFO_ROWS.map((row, i) => (
          <View key={row.label} style={[styles.infoRow, i < INFO_ROWS.length - 1 && { borderBottomWidth: 1, borderBottomColor: t.colors.divider }]}>
            <MFText variant="sm" color="secondary" weight="medium">{row.label}</MFText>
            <MFText variant="sm" weight="semiBold">{row.value}</MFText>
          </View>
        ))}
      </MFCard>

      <MFText variant="sm" weight="semiBold" color="secondary" style={{ marginBottom: t.spacing.sm, letterSpacing: 0.8 }}>
        {tr('about.legal')}
      </MFText>

      {LEGAL_LINKS.map(link => (
        <TouchableOpacity key={link.label} onPress={() => Linking.openURL(link.url)} activeOpacity={0.7}>
          <MFCard style={{ marginBottom: t.spacing.sm, flexDirection: 'row', alignItems: 'center' }}>
            <MFText variant="md" weight="medium" style={{ flex: 1 }}>{link.label}</MFText>
            <MFText variant="md" color="secondary">›</MFText>
          </MFCard>
        </TouchableOpacity>
      ))}

      <MFText variant="xs" color="secondary" style={{ textAlign: 'center', marginTop: t.spacing.xl }}>
        {tr('about.footer', { year: new Date().getFullYear(), bank: appConfig.bankName })}
      </MFText>
    </MFScreenWrapper>
  );
}

const styles = StyleSheet.create({
  header:  { flexDirection: 'row', alignItems: 'center', paddingBottom: 16 },
  hero:    { alignItems: 'center', paddingVertical: 32 },
  logoBox: { width: 80, height: 80, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12 },
});

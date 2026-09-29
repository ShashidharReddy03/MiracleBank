import React from 'react';
import { View } from 'react-native';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { MFScreenWrapper } from '../../ui-kit/layouts/MFScreenWrapper';
import { MFCard }          from '../../ui-kit/components/cards/MFCard';
import { MFText }          from '../../ui-kit/components/typography/MFText';
import { MFHeading }       from '../../ui-kit/components/typography/MFText';
import { useTheme }        from '../../ui-kit/theme/ThemeProvider';
import { RootState }       from '../../store/store';
import { appConfig }       from '../../config/appConfig';

export function ProfileScreen() {
  const t      = useTheme();
  const { t: tr } = useTranslation();
  const user   = useSelector((s: RootState) => s.auth.user);

  const rows = [
    { label: tr('profile.fullName'),  value: user ? `${user.firstName} ${user.lastName}` : '—' },
    { label: tr('profile.email'),     value: user?.email     ?? '—' },
    { label: tr('profile.phone'),     value: user?.phone     ?? '—' },
    { label: tr('profile.kycStatus'), value: user?.kycStatus ?? '—' },
  ];

  return (
    <MFScreenWrapper scrollable>
      <MFHeading level={2} style={{ marginBottom: t.spacing.lg }}>{tr('profile.title')}</MFHeading>

      {/* Avatar */}
      <View style={{ alignItems: 'center', marginBottom: t.spacing.xl }}>
        <View style={{ width: 88, height: 88, borderRadius: 44, backgroundColor: t.colors.primaryLight, alignItems: 'center', justifyContent: 'center', marginBottom: t.spacing.sm }}>
          <MFText variant="display" style={{ color: t.colors.primary }}>{user?.firstName?.[0] ?? '?'}</MFText>
        </View>
        <MFHeading level={3}>{user ? `${user.firstName} ${user.lastName}` : '...'}</MFHeading>
        <MFText variant="sm" color="secondary">{appConfig.bankName} {tr('profile.customer')}</MFText>
      </View>

      {/* Info card */}
      <MFCard style={{ marginBottom: t.spacing.lg }}>
        {rows.map((row, i) => (
          <View key={row.label} style={{
            flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
            paddingVertical: t.spacing.sm,
            borderBottomWidth: i < rows.length - 1 ? 1 : 0,
            borderBottomColor: t.colors.divider,
          }}>
            <MFText variant="sm" color="secondary" weight="medium">{row.label}</MFText>
            <MFText variant="sm" weight="semiBold">{row.value}</MFText>
          </View>
        ))}
      </MFCard>

      {/* Support */}
      <MFCard>
        <MFText variant="sm" weight="semiBold" style={{ marginBottom: t.spacing.sm }}>{tr('profile.support')}</MFText>
        <MFText variant="sm" color="secondary">{appConfig.support.phone}</MFText>
        <MFText variant="sm" color="secondary">{appConfig.support.email}</MFText>
      </MFCard>
    </MFScreenWrapper>
  );
}

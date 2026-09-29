import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { useSelector }     from 'react-redux';
import { useTranslation }  from 'react-i18next';
import { MFScreenWrapper } from '../ui-kit/layouts/MFScreenWrapper';
import { MFText }          from '../ui-kit/components/typography/MFText';
import { MFHeading }       from '../ui-kit/components/typography/MFText';
import { useTheme }        from '../ui-kit/theme/ThemeProvider';
import { appConfig }       from '../config/appConfig';
import { RootState }       from '../store/store';
import { RootStackParamList } from '../navigation/RootNavigator';

type SecurityBlockedRoute = RouteProp<RootStackParamList, 'SecurityBlocked'>;

export function SecurityBlockedScreen() {
  const t      = useTheme();
  const { t: tr } = useTranslation();
  const reduxFailures = useSelector((s: RootState) => s.session.securityFailures);
  const route         = useRoute<SecurityBlockedRoute>();
  const failures      = reduxFailures.length > 0 ? reduxFailures : (route.params?.failures ?? []);

  return (
    <MFScreenWrapper keyboardAvoiding={false}>
      <View style={styles.container}>
        <View style={[styles.iconBox, { backgroundColor: '#FEE2E2' }]}>
          <MFText style={{ fontSize: 48 }}>🔒</MFText>
        </View>

        <MFHeading level={2} style={{ color: t.colors.error, textAlign: 'center', marginTop: t.spacing.lg }}>
          {tr('security.blocked')}
        </MFHeading>

        <MFText variant="md" color="secondary" style={{ textAlign: 'center', marginTop: t.spacing.sm, marginBottom: t.spacing.xl, lineHeight: 22 }}>
          {tr('security.subtitle', { bank: appConfig.bankName })}
        </MFText>

        {failures.length > 0 && (
          <View style={[styles.failureBox, { backgroundColor: '#FEF2F2', borderColor: '#FECACA' }]}>
            {failures.map((f, i) => (
              <View key={i} style={styles.failureRow}>
                <MFText style={{ color: t.colors.error, marginRight: 8, fontSize: 14 }}>✕</MFText>
                <MFText variant="sm" style={{ color: t.colors.error, flex: 1 }}>{f}</MFText>
              </View>
            ))}
          </View>
        )}

        <MFText variant="sm" color="secondary" style={{ textAlign: 'center', marginTop: t.spacing.xl, lineHeight: 20 }}>
          {tr('security.help')}
        </MFText>

        <MFText variant="md" color="primary" weight="semiBold" style={{ marginTop: t.spacing.md }}>
          {appConfig.support.phone}
        </MFText>
        <MFText variant="sm" color="secondary" style={{ marginTop: 4 }}>
          {appConfig.support.email}
        </MFText>
      </View>
    </MFScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container:  { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
  iconBox:    { width: 88, height: 88, borderRadius: 44, alignItems: 'center', justifyContent: 'center' },
  failureBox: { width: '100%', borderWidth: 1, borderRadius: 12, padding: 16, gap: 10 },
  failureRow: { flexDirection: 'row', alignItems: 'flex-start' },
});

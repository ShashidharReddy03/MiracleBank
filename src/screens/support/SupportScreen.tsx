import React, { useState } from 'react';
import { View, TouchableOpacity, Linking, StyleSheet } from 'react-native';
import { useNavigation }  from '@react-navigation/native';
import { DrawerActions }  from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { MFScreenWrapper } from '../../ui-kit/layouts/MFScreenWrapper';
import { MFText }          from '../../ui-kit/components/typography/MFText';
import { MFHeading }       from '../../ui-kit/components/typography/MFText';
import { MFCard }          from '../../ui-kit/components/cards/MFCard';
import { MFBottomSheet }   from '../../ui-kit/components/modals/MFModals';
import { useTheme }        from '../../ui-kit/theme/ThemeProvider';
import { appConfig }       from '../../config/appConfig';

interface FAQItem { q: string; a: string; }

export function SupportScreen() {
  const t          = useTheme();
  const { t: tr }  = useTranslation();
  const navigation = useNavigation();
  const [activeFAQ, setActiveFAQ] = useState<FAQItem | null>(null);

  const faqs: FAQItem[] = tr('support.faqs', { returnObjects: true }) as FAQItem[];

  return (
    <MFScreenWrapper scrollable keyboardAvoiding={false}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.dispatch(DrawerActions.openDrawer())} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <MFText variant="xl">☰</MFText>
        </TouchableOpacity>
        <MFHeading level={3} style={{ marginLeft: 16 }}>{tr('support.title')}</MFHeading>
      </View>

      <MFText variant="sm" weight="semiBold" color="secondary" style={{ marginBottom: t.spacing.sm, letterSpacing: 0.8 }}>
        {tr('support.contact')}
      </MFText>

      {[
        { icon: '📞', label: tr('support.call'),     value: appConfig.support.phone,   onPress: () => Linking.openURL(`tel:${appConfig.support.phone}`) },
        { icon: '✉️',  label: tr('support.email'),    value: appConfig.support.email,   onPress: () => Linking.openURL(`mailto:${appConfig.support.email}`) },
        { icon: '💬', label: tr('support.whatsapp'), value: appConfig.support.whatsapp ?? 'N/A', onPress: () => appConfig.support.whatsapp && Linking.openURL(`https://wa.me/${appConfig.support.whatsapp?.replace(/\D/g,'')}`) },
      ].map(ch => (
        <TouchableOpacity key={ch.label} onPress={ch.onPress} activeOpacity={0.7}>
          <MFCard style={{ marginBottom: t.spacing.sm, flexDirection: 'row', alignItems: 'center', gap: t.spacing.md }}>
            <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: t.colors.primaryLight, alignItems: 'center', justifyContent: 'center' }}>
              <MFText variant="xl">{ch.icon}</MFText>
            </View>
            <View style={{ flex: 1 }}>
              <MFText variant="md" weight="semiBold">{ch.label}</MFText>
              <MFText variant="sm" color="secondary">{ch.value}</MFText>
            </View>
            <MFText variant="lg" color="secondary">›</MFText>
          </MFCard>
        </TouchableOpacity>
      ))}

      <MFText variant="sm" weight="semiBold" color="secondary" style={{ marginTop: t.spacing.md, marginBottom: t.spacing.sm, letterSpacing: 0.8 }}>
        {tr('support.faqTitle')}
      </MFText>

      {Array.isArray(faqs) && faqs.map((faq, i) => (
        <TouchableOpacity key={i} onPress={() => setActiveFAQ(faq)} activeOpacity={0.7}>
          <MFCard style={{ marginBottom: t.spacing.sm, flexDirection: 'row', alignItems: 'center' }}>
            <MFText variant="md" weight="medium" style={{ flex: 1 }}>{faq.q}</MFText>
            <MFText variant="lg" color="secondary">›</MFText>
          </MFCard>
        </TouchableOpacity>
      ))}

      <MFBottomSheet visible={!!activeFAQ} onClose={() => setActiveFAQ(null)} title={activeFAQ?.q}>
        <MFText variant="md" color="secondary" style={{ lineHeight: 22 }}>{activeFAQ?.a}</MFText>
      </MFBottomSheet>
    </MFScreenWrapper>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', paddingBottom: 16 },
});

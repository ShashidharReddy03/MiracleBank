import React from 'react';
import { Pressable, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { ChevronRight, Clock3, Phone } from 'lucide-react-native';
import { BankHeader } from '../common/BankHeader';
import { runWithLoader } from '../../ui-kit/components/loaders/loaderService';

const PRIMARY = '#14B8A6';
const BG = '#F7FBFB';

const OPTIONS = [
  {
    key: 'etl',
    title: 'ETL Airtime',
    subtitle: 'Recharge Your ETL Mobile Number',
    iconBg: '#E7F6F3',
    iconColor: PRIMARY,
    border: '#14B8A6',
    icon: Phone,
  },
  {
    key: 'vcl',
    title: 'VCL Airtime',
    subtitle: 'Recharge Your VCL Mobile Number',
    iconBg: '#F3E8FF',
    iconColor: '#7C3AED',
    border: '#7C3AED',
    icon: Phone,
  },
  {
    key: 'history',
    title: 'Top-Up History',
    subtitle: 'View Your Past Top-Up Transactions',
    iconBg: '#FEF3C7',
    iconColor: '#D97706',
    border: '#F59E0B',
    icon: Clock3,
  },
] as const;

export function AirtimeTopupScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();

  const openOption = (key: (typeof OPTIONS)[number]['key']) => {
    void runWithLoader(() => {
      if (key === 'history') {
        navigation.navigate('History');
        return;
      }
      navigation.navigate('AddMoney', { provider: key });
    });
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" backgroundColor={PRIMARY} />
      <BankHeader title="Airtime Topup" />
      <ScrollView contentContainerStyle={styles.content}>
        {OPTIONS.map(option => {
          const Icon = option.icon;
          return (
            <Pressable
              key={option.key}
              style={[styles.card, { borderLeftColor: option.border }]}
              onPress={() => openOption(option.key)}
            >
              <View style={[styles.iconWrap, { backgroundColor: option.iconBg }]}>
                <Icon size={20} color={option.iconColor} strokeWidth={2.2} />
              </View>
              <View style={styles.textWrap}>
                <Text style={styles.title}>{option.title}</Text>
                <Text style={styles.subtitle}>{option.subtitle}</Text>
              </View>
              <ChevronRight size={18} color="#9CA3AF" />
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: PRIMARY },
  content: { padding: 16, gap: 14, backgroundColor: BG, flexGrow: 1 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderLeftWidth: 4,
    padding: 14,
    gap: 12,
  },
  iconWrap: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textWrap: { flex: 1 },
  title: { fontSize: 16, fontWeight: '700', color: '#111827', marginBottom: 4 },
  subtitle: { fontSize: 13, color: '#6B7280' },
});

import React from 'react';
import { Pressable, StatusBar, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeftRight, RefreshCw, Wallet } from 'lucide-react-native';
import { BankHeader } from '../common/BankHeader';
import { runWithLoader } from '../../ui-kit/components/loaders/loaderService';

const PRIMARY = '#14B8A6';
const BG = '#F7FBFB';

export function RecentTransactionsScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" backgroundColor={PRIMARY} />
      <BankHeader title="Recent Transactions" />
      <View style={styles.body}>
        <View style={styles.toolbar}>
          <View style={styles.toolbarTitle}>
            <View style={styles.toolbarIcon}>
              <ArrowLeftRight size={16} color={PRIMARY} />
            </View>
            <Text style={styles.toolbarText}>Recent Transactions</Text>
          </View>
          <Pressable
            style={styles.refresh}
            onPress={() => {
              void runWithLoader(() => undefined);
            }}
          >
            <RefreshCw size={18} color="#6B7280" />
          </Pressable>
        </View>

        <View style={styles.empty}>
          <View style={styles.emptyIcon}>
            <Wallet size={28} color={PRIMARY} strokeWidth={2} />
          </View>
          <Text style={styles.emptyTitle}>No Transactions</Text>
          <Text style={styles.emptyBody}>
            Your recent transactions will appear here once you make a transfer or payment.
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: PRIMARY },
  body: { flex: 1, backgroundColor: BG, padding: 16 },
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 28,
  },
  toolbarTitle: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  toolbarIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: '#E7F6F3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  toolbarText: { fontSize: 16, fontWeight: '700', color: '#111827' },
  refresh: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  empty: { alignItems: 'center', paddingHorizontal: 24, marginTop: 36 },
  emptyIcon: {
    width: 64,
    height: 64,
    borderRadius: 18,
    backgroundColor: '#E7F6F3',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: '#111827', marginBottom: 8 },
  emptyBody: { fontSize: 14, color: '#6B7280', textAlign: 'center', lineHeight: 20 },
});

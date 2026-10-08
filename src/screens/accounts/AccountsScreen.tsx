import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ChevronLeft,
  ChevronDown,
  Eye,
  EyeOff,
  FileText,
  Files,
  Info,
  LogOut,
} from 'lucide-react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { confirmLogout } from '../../utils/logout';
import type { AccountsTab, MainTabParamList } from '../../navigation/tabs/MainTabs';
import { FullStatementPanel } from './FullStatementPanel';
import { AccountDetailsPanel } from './AccountDetailsPanel';
import { runWithLoader } from '../../ui-kit/components/loaders/loaderService';

const PRIMARY = '#14B8A6';
const BG = '#EEF3F4';
const MINT = '#E8F7F4';

type FilterChip = 'all' | 'income' | 'expenses';

const STATEMENT_TABS: { key: AccountsTab; label: string; icon: typeof FileText }[] = [
  { key: 'mini', label: 'Mini Statement', icon: FileText },
  { key: 'full', label: 'Full Statement', icon: Files },
  { key: 'details', label: 'Account Details', icon: Info },
];

const FILTERS: { key: FilterChip; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'income', label: 'Income' },
  { key: 'expenses', label: 'Expenses' },
];

export function AccountsScreen() {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<MainTabParamList, 'Transfers'>>();
  const insets = useSafeAreaInsets();
  const [balanceVisible, setBalanceVisible] = useState(false);
  const [activeTab, setActiveTab] = useState<AccountsTab>(route.params?.tab ?? 'mini');

  useEffect(() => {
    if (route.params?.tab) {
      setActiveTab(route.params.tab);
    }
  }, [route.params?.tab]);
  const [filter, setFilter] = useState<FilterChip>('all');

  const accountNumber = '917981976686';

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" backgroundColor={PRIMARY} />

      <View style={styles.headerBar}>
        <TouchableOpacity
          style={styles.headerBtn}
          onPress={() => navigation.navigate('Dashboard' as never)}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <ChevronLeft size={22} color="#ffffff" strokeWidth={2.4} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Accounts</Text>
        <TouchableOpacity
          style={styles.headerBtn}
          onPress={() => confirmLogout(navigation)}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <LogOut size={18} color="#ffffff" strokeWidth={2.2} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {activeTab === 'mini' && (
        <View style={styles.summarySection}>
          <View style={styles.accountCard}>
            <View style={styles.accountTopRow}>
              <Text style={styles.accountNumber}>{accountNumber}</Text>
              <View style={styles.balanceToggle}>
                {balanceVisible ? (
                  <Text style={styles.balanceText}>$24,580.00</Text>
                ) : (
                  <View style={styles.dots}>
                    {Array.from({ length: 8 }).map((_, i) => (
                      <View key={i} style={styles.dot} />
                    ))}
                  </View>
                )}
                <TouchableOpacity
                  style={styles.eyeBtn}
                  onPress={() => setBalanceVisible((v) => !v)}
                >
                  {balanceVisible ? (
                    <EyeOff size={18} color={PRIMARY} strokeWidth={2.2} />
                  ) : (
                    <Eye size={18} color={PRIMARY} strokeWidth={2.2} />
                  )}
                </TouchableOpacity>
              </View>
            </View>
            <Text style={styles.accountType}>SavingsAccount</Text>
            <Text style={styles.branchText}>Branch: Branch Name</Text>
          </View>
        </View>
        )}

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabRow}
        >
          {STATEMENT_TABS.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.key;
            return (
              <TouchableOpacity
                key={tab.key}
                style={[styles.tabChip, active && styles.tabChipActive]}
                onPress={() => {
                  if (activeTab !== tab.key) {
                    void runWithLoader(() => setActiveTab(tab.key));
                  }
                }}
                activeOpacity={0.85}
              >
                <Icon size={16} color={active ? '#fff' : '#6B7280'} strokeWidth={2.2} />
                <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {activeTab === 'full' && <FullStatementPanel />}
        {activeTab === 'details' && <AccountDetailsPanel />}

        {activeTab === 'mini' && (
        <View style={styles.filterCard}>
          <TouchableOpacity style={styles.accountSelector} activeOpacity={0.8}>
            <Text style={styles.selectorText}>{accountNumber}</Text>
            <ChevronDown size={18} color={PRIMARY} strokeWidth={2.4} />
          </TouchableOpacity>

          <View style={styles.filterRow}>
            {FILTERS.map((item) => {
              const active = filter === item.key;
              return (
                <TouchableOpacity
                  key={item.key}
                  style={[styles.filterChip, active && styles.filterChipActive]}
                  onPress={() => setFilter(item.key)}
                >
                  <Text style={[styles.filterLabel, active && styles.filterLabelActive]}>
                    {item.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
        )}

        {activeTab === 'mini' && (
        <View style={styles.emptyState}>
          <View style={styles.emptyIconWrap}>
            <FileText size={40} color={PRIMARY} strokeWidth={1.8} />
          </View>
          <Text style={styles.emptyText}>
            No transactions found for the selected criteria
          </Text>
        </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: PRIMARY },
  headerBar: {
    backgroundColor: PRIMARY,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  headerBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },
  scroll: { flex: 1, backgroundColor: BG },
  content: { paddingBottom: 28 },
  summarySection: {
    backgroundColor: MINT,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 18,
  },
  accountCard: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 16,
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
  },
  accountTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  accountNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  balanceToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  balanceText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },
  dots: { flexDirection: 'row', gap: 3 },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#9CA3AF',
  },
  eyeBtn: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: '#D8F5F1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  accountType: {
    fontSize: 15,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 4,
  },
  branchText: {
    fontSize: 13,
    color: '#9CA3AF',
  },
  tabRow: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 10,
  },
  tabChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  tabChipActive: {
    backgroundColor: PRIMARY,
    borderColor: PRIMARY,
  },
  tabLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
  },
  tabLabelActive: { color: '#fff' },
  filterCard: {
    marginHorizontal: 16,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 14,
    marginBottom: 24,
  },
  accountSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 12,
  },
  selectorText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    backgroundColor: '#fff',
  },
  filterChipActive: {
    backgroundColor: PRIMARY,
    borderColor: PRIMARY,
  },
  filterLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
  },
  filterLabelActive: { color: '#fff' },
  emptyState: {
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingTop: 28,
  },
  emptyIconWrap: {
    width: 88,
    height: 88,
    borderRadius: 22,
    backgroundColor: '#D8F0F5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
    lineHeight: 22,
  },
});

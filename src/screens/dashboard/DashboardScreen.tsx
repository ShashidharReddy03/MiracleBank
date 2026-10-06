import React, { useState } from 'react';
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
  Bell,
  Eye,
  EyeOff,
  Download,
  Gift,
  Menu,
  Send,
  ArrowUpCircle,
  LogOut,
  QrCode,
  TrendingUp,
} from 'lucide-react-native';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { confirmLogout } from '../../utils/logout';
import { SafeAreaView } from 'react-native-safe-area-context';

const PRIMARY = '#14B8A6';
const BG = '#EEF3F4';

const quickLinks = [
  { label: 'Payments', color: '#D8F5F1', icon: Send, accent: '#14B8A6' },
  { label: 'Airtime Topup', color: '#FDE8C8', icon: ArrowUpCircle, accent: '#F59E0B' },
  { label: 'Download Statement', color: '#E8E4FF', icon: Download, accent: '#7C6BCF' },
  { label: 'My Rewards', color: '#D9F5DE', icon: Gift, accent: '#22A85A' },
];

export function DashboardScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [balanceVisible, setBalanceVisible] = useState(false);

  return (
    <SafeAreaView style={[styles.root, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" backgroundColor={PRIMARY} />

      <View style={styles.headerBar}>
        <TouchableOpacity
          onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
          style={styles.menuButton}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Menu size={24} color="#ffffff" strokeWidth={2.4} />
        </TouchableOpacity>

        <Text style={styles.appTitle}>Miracle Banking</Text>

        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.actionIcon}
            onPress={() => navigation.dispatch(DrawerActions.jumpTo('Notifications' as never))}
          >
            <Bell size={20} color="#ffffff" strokeWidth={2.2} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionIcon}>
            <QrCode size={20} color="#ffffff" strokeWidth={2.2} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionIcon} onPress={() => confirmLogout(navigation)}>
            <LogOut size={20} color="#ffffff" strokeWidth={2.2} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.accountCard}>
          <View style={styles.accountTopRow}>
            <View style={styles.accountBadge}>
              <Text style={styles.accountBadgeText}>Savings Account</Text>
            </View>
            <Text style={styles.accountNumber}>**** **** 6686</Text>
          </View>

          <Text style={styles.branchLabel}>• Branch Name</Text>

          <View style={styles.balanceRow}>
            <View style={styles.balanceMeta}>
              <Text style={styles.balanceCaption}>AVAILABLE BALANCE</Text>
              {balanceVisible ? (
                <Text style={styles.balanceAmount}>$24,580.00</Text>
              ) : (
                <View style={styles.balanceDots}>
                  {Array.from({ length: 8 }).map((_, index) => (
                    <View key={index} style={styles.dot} />
                  ))}
                </View>
              )}
            </View>
            <TouchableOpacity
              style={styles.eyeButton}
              onPress={() => setBalanceVisible((v) => !v)}
              activeOpacity={0.8}
            >
              {balanceVisible ? (
                <EyeOff size={22} color={PRIMARY} strokeWidth={2.2} />
              ) : (
                <Eye size={22} color={PRIMARY} strokeWidth={2.2} />
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.divider} />

          <View style={styles.accountFooter}>
            <Text style={styles.accountName}>Shashidhar Reddy</Text>
            <View style={styles.trendBadge}>
              <TrendingUp size={16} color="#ffffff" strokeWidth={2.4} />
            </View>
          </View>

          <TouchableOpacity style={styles.addMoneyBtn} activeOpacity={0.9}>
            <Text style={styles.addMoneyText}>+ Add Money</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Quick Links</Text>
        <View style={styles.quickLinkRow}>
          {quickLinks.map((item) => {
            const Icon = item.icon;
            return (
              <TouchableOpacity
                key={item.label}
                style={styles.quickLinkItem}
                activeOpacity={0.75}
                onPress={() => {
                  if (item.label === 'Payments' || item.label === 'Download Statement') {
                    navigation.navigate('Transfers' as never);
                  } else if (item.label === 'My Rewards') {
                    navigation.navigate('Profile' as never);
                  }
                }}
              >
                <View style={[styles.quickIcon, { backgroundColor: item.color }]}>
                  <Icon size={24} color={item.accent} strokeWidth={2.2} />
                </View>
                <Text style={styles.quickLabel}>{item.label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <Text style={styles.sectionTitle}>Features/Offers</Text>
        <View style={styles.promoCard}>
          <View style={styles.promoTag}>
            <Text style={styles.promoTagText}>INVITEFRIENDS</Text>
          </View>

          <View style={styles.promoGraphic}>
            <View style={styles.promoCircle}>
              <Text style={styles.promoCoin}>$</Text>
            </View>
          </View>

          <Text style={styles.promoTitle}>Invite your friends to{'\n'}Miracle Digital Bank</Text>
          <Text style={styles.promoSubtitle}>
            You'll get $51 when your friend send their first payment.
          </Text>
        </View>

        <View style={styles.pagination}>
          <View style={[styles.pageDot, styles.pageDotActive]} />
          <View style={styles.pageDot} />
          <View style={styles.pageDot} />
          <View style={styles.pageDot} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: PRIMARY,
  },
  headerBar: {
    backgroundColor: PRIMARY,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  menuButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  appTitle: {
    flex: 1,
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '700',
    marginLeft: 8,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  actionIcon: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scroll: {
    flex: 1,
    backgroundColor: BG,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 28,
  },
  accountCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#A8E6DF',
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
    marginBottom: 22,
  },
  accountTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  accountBadge: {
    backgroundColor: '#D8F5EC',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  accountBadgeText: {
    color: '#0D9488',
    fontSize: 13,
    fontWeight: '600',
  },
  accountNumber: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
    letterSpacing: 0.5,
  },
  branchLabel: {
    fontSize: 13,
    color: '#9CA3AF',
    marginBottom: 14,
  },
  balanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  balanceMeta: {
    flex: 1,
  },
  balanceCaption: {
    fontSize: 11,
    color: '#9CA3AF',
    letterSpacing: 0.8,
    fontWeight: '600',
    marginBottom: 8,
  },
  balanceAmount: {
    fontSize: 26,
    fontWeight: '700',
    color: '#111827',
  },
  balanceDots: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    height: 28,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#9CA3AF',
  },
  eyeButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#D8F5F1',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#E5E7EB',
    marginBottom: 14,
  },
  accountFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  accountName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
  },
  trendBadge: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: PRIMARY,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addMoneyBtn: {
    height: 52,
    backgroundColor: PRIMARY,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addMoneyText: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '700',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: PRIMARY,
    marginBottom: 14,
  },
  quickLinkRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  quickLinkItem: {
    width: '23%',
    alignItems: 'center',
  },
  quickIcon: {
    width: 58,
    height: 58,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  quickLabel: {
    color: '#374151',
    fontSize: 11,
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 14,
  },
  promoCard: {
    backgroundColor: '#E8D94A',
    borderRadius: 20,
    padding: 20,
    paddingTop: 16,
    overflow: 'hidden',
    minHeight: 200,
    justifyContent: 'flex-end',
  },
  promoTag: {
    position: 'absolute',
    top: 14,
    right: 14,
    backgroundColor: 'rgba(255,255,255,0.35)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  promoTagText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: 0.5,
  },
  promoGraphic: {
    alignItems: 'center',
    marginBottom: 12,
  },
  promoCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: '#9B59C9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  promoCoin: {
    fontSize: 36,
    fontWeight: '800',
    color: '#F5D76E',
  },
  promoTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#ffffff',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 6,
    textShadowColor: 'rgba(0,0,0,0.15)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  promoSubtitle: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.95)',
    textAlign: 'center',
    lineHeight: 17,
    fontWeight: '500',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    marginTop: 12,
  },
  pageDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#CBD5E1',
  },
  pageDotActive: {
    backgroundColor: PRIMARY,
    width: 8,
    height: 8,
  },
});

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import {
  DrawerContentScrollView,
  DrawerContentComponentProps,
} from '@react-navigation/drawer';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import {
  X,
  ChevronRight,
  User,
  ArrowLeftRight,
  ArrowUpCircle,
  Briefcase,
  Gift,
  Star,
  Settings,
  CircleHelp,
  LogOut,
  MessageSquare,
  Phone
} from 'lucide-react-native';
import { RootState } from '../../store/store';
import { confirmLogout } from '../../utils/logout';

const PRIMARY = '#14B8A6';

type MenuItem = {
  label: string;
  icon: typeof ArrowLeftRight;
  iconBg: string;
  iconColor: string;
  tab?: string;
  screen?: string;
};

type MenuSection = {
  title: string;
  items: MenuItem[];
};

const SECTIONS: MenuSection[] = [
  {
    title: 'QUICK SERVICES',
    items: [
      { label: 'Payments', icon: ArrowLeftRight, iconBg: '#D8F5F1', iconColor: PRIMARY, tab: 'Transfers' },
      { label: 'Top up', icon: ArrowUpCircle, iconBg: '#FDE8C8', iconColor: '#F59E0B', tab: 'Transfers' },
      { label: 'Product & Services', icon: Briefcase, iconBg: '#EBE4FF', iconColor: '#7C6BCF', screen: 'About' },
      { label: 'Rewards', icon: Gift, iconBg: '#D9F5DE', iconColor: '#22A85A', tab: 'Dashboard' },
    ],
  },
  {
    title: 'SERVICES',
    items: [
      { label: 'Treasury', icon: Briefcase, iconBg: '#E5E7EB', iconColor: '#64748B', screen: 'About' },
      { label: 'Loyalty', icon: Star, iconBg: '#DBEAFE', iconColor: '#3B82F6', tab: 'Profile' },
    ],
  },
  {
    title: 'HELP & SUPPORT',
    items: [
      { label: 'Settings', icon: Settings, iconBg: '#E5E7EB', iconColor: '#6B7280', screen: 'Settings' },
      { label: 'Help', icon: CircleHelp, iconBg: '#DBEAFE', iconColor: '#2563EB', screen: 'Support' },
      { label: 'Feedback', icon: MessageSquare, iconBg: '#FEF3C7', iconColor: '#D97706', screen: 'Feedback' },
      { label: 'Contact Us', icon: Phone, iconBg: '#DCFCE7', iconColor: '#16A34A', screen: 'ContactUs' },
    ],
  },
];

export function DrawerContent(props: DrawerContentComponentProps) {
  const insets = useSafeAreaInsets();
  const user = useSelector((s: RootState) => s.auth.user);
  const displayName = user ? `${user.firstName} ${user.lastName}` : 'Shashidhar Reddy';

  const navigateTab = (tab: string) => {
    props.navigation.closeDrawer();
    props.navigation.navigate('MainTabs', { screen: tab } as never);
  };

  const navigateScreen = (screen: string) => {
    props.navigation.closeDrawer();
    props.navigation.navigate(screen as never);
  };

  return (
    <DrawerContentScrollView
      {...props}
      scrollEnabled={false}
      contentContainerStyle={styles.scrollContent}
      style={styles.drawer}
    >
      <View style={[styles.container, { paddingBottom: insets.bottom + 8 }]}>
        <View style={[styles.header, { paddingTop: Math.max(insets.top, 16) }]}>
          <TouchableOpacity
            style={styles.closeBtn}
            onPress={() => props.navigation.closeDrawer()}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <X size={20} color="#ffffff" strokeWidth={2.4} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.userRow}
            activeOpacity={0.85}
            onPress={() => navigateTab('Profile')}
          >
            <View style={styles.avatar}>
              <User size={26} color="#ffffff" strokeWidth={1.8} />
            </View>
            <View style={styles.userMeta}>
              <Text style={styles.userName}>{displayName}</Text>
              <Text style={styles.lastLogin}>Last Login at 05-10-2026 03:57</Text>
            </View>
            <ChevronRight size={18} color="rgba(255,255,255,0.85)" strokeWidth={2.4} />
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.menu}
          contentContainerStyle={styles.menuContent}
          showsVerticalScrollIndicator={false}
        >
          {SECTIONS.map((section) => (
            <View key={section.title} style={styles.section}>
              <Text style={styles.sectionTitle}>{section.title}</Text>
              {section.items.map((item) => {
                const Icon = item.icon;
                return (
                  <TouchableOpacity
                    key={item.label}
                    style={styles.menuItem}
                    activeOpacity={0.75}
                    onPress={() => {
                      if (item.tab) navigateTab(item.tab);
                      else if (item.screen) navigateScreen(item.screen);
                    }}
                  >
                    <View style={[styles.iconWrap, { backgroundColor: item.iconBg }]}>
                      <Icon size={18} color={item.iconColor} strokeWidth={2.2} />
                    </View>
                    <Text style={styles.menuLabel}>{item.label}</Text>
                    <ChevronRight size={16} color="#CBD5E1" strokeWidth={2.2} />
                  </TouchableOpacity>
                );
              })}
            </View>
          ))}

          <TouchableOpacity
            style={styles.logoutBtn}
            activeOpacity={0.85}
            onPress={() => {
              props.navigation.closeDrawer();
              confirmLogout(props.navigation as never);
            }}
          >
            <LogOut size={18} color="#EF4444" strokeWidth={2.2} />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>

          <Text style={styles.copyright}>© 2026 Miracle Banking</Text>
        </ScrollView>
      </View>
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  drawer: { backgroundColor: '#fff' },
  scrollContent: { flex: 1 },
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    backgroundColor: PRIMARY,
    paddingHorizontal: 16,
    paddingBottom: 18,
  },
  closeBtn: {
    alignSelf: 'flex-end',
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.22)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  userMeta: { flex: 1 },
  userName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 2,
  },
  lastLogin: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.75)',
  },
  menu: { flex: 1 },
  menuContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
  },
  section: { marginTop: 14 },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: PRIMARY,
    letterSpacing: 0.8,
    marginBottom: 6,
    marginLeft: 4,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 4,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  menuLabel: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
    color: '#111827',
  },
  logoutBtn: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#FEE2E2',
    borderRadius: 14,
    paddingVertical: 14,
  },
  logoutText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#EF4444',
  },
  copyright: {
    marginTop: 16,
    textAlign: 'center',
    fontSize: 12,
    color: '#9CA3AF',
  },
});

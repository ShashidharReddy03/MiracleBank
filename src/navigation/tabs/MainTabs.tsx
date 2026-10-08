import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, I18nManager } from 'react-native';
import { createBottomTabNavigator, BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { Home, Wallet, ScanLine, Clock3, UserRound, Bell, Menu } from 'lucide-react-native';
import { useTheme } from '../../ui-kit/theme/ThemeProvider';
import { AccountsScreen } from '../../screens/accounts/AccountsScreen';
import { ProfileScreen } from '../../screens/profile/ProfileScreen';
import { HomeStack } from '../stacks/HomeStack';
import { QrCodeScreen } from '../../screens/scan/QrCodeScreen';
import { RecentTransactionsScreen } from '../../screens/history/RecentTransactionsScreen';
import { RootState } from '../../store/store';

export type AccountsTab = 'mini' | 'full' | 'details';
export type ProfileTab = 'edit' | 'security' | 'mpin';

export type MainTabParamList = {
  Dashboard: undefined;
  Transfers: { tab?: AccountsTab } | undefined;
  Scan: undefined;
  History: undefined;
  Profile: { tab?: ProfileTab } | undefined;
};

type TabRouteName = keyof MainTabParamList;

const Tab = createBottomTabNavigator<MainTabParamList>();

const TAB_LABELS: Record<TabRouteName, string> = {
  Dashboard: 'Home',
  Transfers: 'Accounts',
  Scan: 'Scan',
  History: 'History',
  Profile: 'Profile',
};

function TabIcon({ routeName, focused, color }: { routeName: TabRouteName; focused: boolean; color: string }) {
  const iconMap = {
    Dashboard: Home,
    Transfers: Wallet,
    Scan: ScanLine,
    History: Clock3,
    Profile: UserRound,
  } as const;

  const Icon = iconMap[routeName];

  return (
    <View style={tabStyles.iconWrapper}>
      {routeName === 'Scan' ? (
        <View style={[tabStyles.scanButton, focused && { backgroundColor: '#12B8AF', transform: [{ scale: 1.04 }] }]}>
          <Icon size={28} color={focused ? '#fff' : '#0f172a'} strokeWidth={2.3} />
        </View>
      ) : (
        <Icon size={22} color={focused ? color : '#7B8A9A'} strokeWidth={2.2} />
      )}
    </View>
  );
}

function AppHeader({ title }: { title: string }) {
  const t = useTheme();
  const navigation = useNavigation();
  const unread = useSelector((s: RootState) => s.notifications.unreadCount);
  const isRTL = I18nManager.isRTL;

  return (
    <View
      style={[
        tabStyles.header,
        { backgroundColor: t.colors.surface, borderBottomColor: t.colors.border },
        isRTL ? { flexDirection: 'row-reverse' } : { flexDirection: 'row' },
      ]}
    >
      <TouchableOpacity
        onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        style={[
          tabStyles.hamburger,
          isRTL ? { marginLeft: 12, marginRight: 0 } : { marginRight: 12, marginLeft: 0 },
        ]}
      >
        <Menu size={26} color={t.colors.text} strokeWidth={2.2} />
      </TouchableOpacity>
      <Text
        style={[
          tabStyles.headerTitle,
          {
            color: t.colors.text,
            fontFamily: t.typography.fontFamily.bold,
            fontSize: t.typography.fontSize.lg,
            textAlign: isRTL ? 'right' : 'left',
          },
        ]}
      >
        {title}
      </Text>
      <TouchableOpacity
        style={tabStyles.notifButton}
        onPress={() => navigation.dispatch(DrawerActions.jumpTo('Notifications' as never))}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Bell size={22} color={t.colors.text} strokeWidth={2.2} />
        {unread > 0 && (
          <View style={tabStyles.notifBadge}>
            <Text style={tabStyles.notifBadgeText}>{unread > 9 ? '9+' : unread}</Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
}

function buildScreenOptions(
  routeName: TabRouteName,
  showHeader = true,
): BottomTabNavigationOptions {
  return {
    header: () => <AppHeader title={TAB_LABELS[routeName]} />,
    headerShown: showHeader,
    tabBarLabel: TAB_LABELS[routeName],
    tabBarIcon: ({ focused, color }) => <TabIcon routeName={routeName} focused={focused} color={color} />,
    tabBarActiveTintColor: '#12B8AF',
    tabBarInactiveTintColor: '#7B8A9A',
    tabBarStyle: {
      backgroundColor: '#F9FAFB',
      borderTopWidth: 0,
      elevation: 0,
      height: 74,
      paddingBottom: 12,
      paddingTop: 8,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: -3 },
      shadowOpacity: 0.04,
      shadowRadius: 8,
    },
    tabBarLabelStyle: {
      fontSize: 11,
      fontFamily: 'System',
      fontWeight: '500',
      marginTop: 6,
    },
    tabBarItemStyle: {
      alignItems: 'center',
      justifyContent: 'center',
    },
  };
}

export function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarShowLabel: true,
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#F9FAFB',
          borderTopWidth: 0,
          height: 74,
          paddingBottom: 12,
          paddingTop: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -3 },
          shadowOpacity: 0.04,
          shadowRadius: 8,
        },
      }}
    >
      <Tab.Screen name="Dashboard" component={HomeStack} options={buildScreenOptions('Dashboard', false)} />
      <Tab.Screen name="Transfers" component={AccountsScreen} options={buildScreenOptions('Transfers', false)} />
      <Tab.Screen name="Scan" component={QrCodeScreen} options={buildScreenOptions('Scan', false)} />
      <Tab.Screen name="History" component={RecentTransactionsScreen} options={buildScreenOptions('History', false)} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={buildScreenOptions('Profile', false)} />
    </Tab.Navigator>
  );
}

const tabStyles = StyleSheet.create({
  iconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 42,
    height: 42,
  },
  scanButton: {
    width: 66,
    height: 66,
    borderRadius: 33,
    backgroundColor: '#E8FAF7',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -18,
    borderWidth: 5,
    borderColor: '#F9FAFB',
    shadowColor: '#12B8AF',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
  },
  header: {
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 48,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  hamburger: { padding: 4 },
  headerTitle: { flex: 1 },
  notifButton: { position: 'relative', padding: 4 },
  notifBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#FF3B30',
    borderRadius: 9,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  notifBadgeText: { fontSize: 10, fontWeight: '700', color: '#fff' },
});

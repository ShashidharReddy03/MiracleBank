import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, I18nManager } from 'react-native';
import { createBottomTabNavigator, BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import { useSelector }    from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useTheme }        from '../../ui-kit/theme/ThemeProvider';
import { DashboardScreen } from '../../screens/dashboard/DashboardScreen';
import { TransfersScreen } from '../../screens/transfers/TransfersScreen';
import { ProfileScreen }   from '../../screens/profile/ProfileScreen';
import { SettingsScreen }  from '../../screens/settings/SettingsScreen';
import { RootState }       from '../../store/store';

export type MainTabParamList = {
  Dashboard: undefined;
  Transfers: undefined;
  Profile:   undefined;
  Settings:  undefined;
};

type TabRouteName = keyof MainTabParamList;

const Tab = createBottomTabNavigator<MainTabParamList>();

const TAB_ICONS: Record<TabRouteName, string> = {
  Dashboard: '⊞',
  Transfers: '⇄',
  Profile:   '◎',
  Settings:  '⚙',
};

const TAB_I18N_KEYS: Record<TabRouteName, string> = {
  Dashboard: 'tabs.home',
  Transfers: 'tabs.transfer',
  Profile:   'tabs.profile',
  Settings:  'tabs.settings',
};

// ── Tab icon ──────────────────────────────────────────────────────────────────

function TabIcon({ routeName, focused, color }: {
  routeName: TabRouteName;
  focused:   boolean;
  color:     string;
}) {
  return (
    <View style={tabStyles.iconWrapper}>
      {focused && <View style={[tabStyles.activeDot, { backgroundColor: color }]} />}
      <Text style={[tabStyles.iconText, { color, opacity: focused ? 1 : 0.5 }]}>
        {TAB_ICONS[routeName]}
      </Text>
    </View>
  );
}

// ── Header — RTL aware ────────────────────────────────────────────────────────

function AppHeader({ titleKey }: { titleKey: string }) {
  const t          = useTheme();
  const { t: tr }  = useTranslation();
  const navigation = useNavigation();
  const unread     = useSelector((s: RootState) => s.notifications.unreadCount);
  const isRTL      = I18nManager.isRTL;

  const Hamburger = (
    <TouchableOpacity
      onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
      style={[
        tabStyles.hamburger,
        // RTL: hamburger on RIGHT side, LTR: LEFT side
        isRTL ? { marginLeft: 12, marginRight: 0 } : { marginRight: 12, marginLeft: 0 },
      ]}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
    >
      <View style={[tabStyles.hamburgerLine, { backgroundColor: t.colors.text }]} />
      <View style={[tabStyles.hamburgerLine, { backgroundColor: t.colors.text, width: 20 }]} />
      <View style={[tabStyles.hamburgerLine, { backgroundColor: t.colors.text }]} />
    </TouchableOpacity>
  );

  const NotifBell = (
    <TouchableOpacity
      style={tabStyles.notifButton}
      onPress={() => navigation.dispatch(DrawerActions.jumpTo('Notifications' as never))}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
    >
      <Text style={{ fontSize: 22 }}>🔔</Text>
      {unread > 0 && (
        <View style={tabStyles.notifBadge}>
          <Text style={tabStyles.notifBadgeText}>{unread > 9 ? '9+' : unread}</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={[
      tabStyles.header,
      { backgroundColor: t.colors.surface, borderBottomColor: t.colors.border },
      // RTL: reverse row direction
      isRTL ? { flexDirection: 'row-reverse' } : { flexDirection: 'row' },
    ]}>
      {/*
        LTR: Hamburger — Title — Bell
        RTL: Bell — Title — Hamburger   (row-reverse flips order)
      */}
      {Hamburger}

      <Text style={[
        tabStyles.headerTitle,
        {
          color:      t.colors.text,
          fontFamily: t.typography.fontFamily.bold,
          fontSize:   t.typography.fontSize.lg,
          // RTL: align text to right
          textAlign: isRTL ? 'right' : 'left',
        },
      ]}>
        {tr(titleKey)}
      </Text>

      {NotifBell}
    </View>
  );
}

// ── Screen options builder ────────────────────────────────────────────────────

function buildScreenOptions(
  routeName: TabRouteName,
  t:         ReturnType<typeof useTheme>,
  tr:        (key: string) => string,
): BottomTabNavigationOptions {
  return {
    header:      () => <AppHeader titleKey={TAB_I18N_KEYS[routeName]} />,
    headerShown: true,
    tabBarLabel: tr(TAB_I18N_KEYS[routeName]),

    tabBarIcon: ({ focused, color }) => (
      <TabIcon routeName={routeName} focused={focused} color={color} />
    ),

    tabBarActiveTintColor:   t.colors.primary,
    tabBarInactiveTintColor: t.colors.textSecondary,

    tabBarStyle: {
      backgroundColor: t.colors.surface,
      borderTopColor:  t.colors.border,
      borderTopWidth:  1,
      height:          64,
      paddingBottom:   8,
      paddingTop:      4,
      elevation:       8,
    },

    tabBarLabelStyle: {
      fontSize:   t.typography.fontSize.xs,
      fontFamily: t.typography.fontFamily.medium,
      marginTop:  2,
    },
  };
}

// ── MainTabs ──────────────────────────────────────────────────────────────────

export function MainTabs() {
  const t      = useTheme();
  const { t: tr } = useTranslation();

  return (
    <Tab.Navigator>
      <Tab.Screen name="Dashboard" component={DashboardScreen} options={buildScreenOptions('Dashboard', t, tr)} />
      <Tab.Screen name="Transfers" component={TransfersScreen} options={buildScreenOptions('Transfers', t, tr)} />
      <Tab.Screen name="Profile"   component={ProfileScreen}   options={buildScreenOptions('Profile', t, tr)} />
      <Tab.Screen name="Settings"  component={SettingsScreen}  options={buildScreenOptions('Settings', t, tr)} />
    </Tab.Navigator>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const tabStyles = StyleSheet.create({
  iconWrapper:    { alignItems: 'center', justifyContent: 'center', width: 40, height: 32 },
  iconText:       { fontSize: 22, lineHeight: 26 },
  activeDot:      { position: 'absolute', top: -6, width: 4, height: 4, borderRadius: 2 },

  header:         {
    alignItems:        'center',
    paddingHorizontal: 16,
    paddingTop:        48,
    paddingBottom:     12,
    borderBottomWidth: 1,
  },
  hamburger:      { gap: 5, padding: 4 },
  hamburgerLine:  { width: 26, height: 2, borderRadius: 2 },
  headerTitle:    { flex: 1 },

  notifButton:    { position: 'relative', padding: 4 },
  notifBadge:     {
    position:         'absolute',
    top:              0,
    right:            0,
    backgroundColor:  '#FF3B30',
    borderRadius:     8,
    minWidth:         16,
    height:           16,
    alignItems:       'center',
    justifyContent:   'center',
    paddingHorizontal: 3,
  },
  notifBadgeText: { fontSize: 10, fontWeight: '700', color: '#fff' },
});

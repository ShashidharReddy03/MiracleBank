import React from 'react';
import {
  View, Text, TouchableOpacity,
  StyleSheet, ScrollView,
} from 'react-native';
import { DrawerContentScrollView, DrawerContentComponentProps } from '@react-navigation/drawer';
import { useSelector }    from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useTheme }  from '../../ui-kit/theme/ThemeProvider';
import { useAuth }   from '../../core/auth/useAuth';
import { RootState } from '../../store/store';
import { appConfig } from '../../config/appConfig';
import { useLanguage } from '../../localization/LanguageContext';

interface MenuItem {
  labelKey: string;
  icon:     string;
  screen?:  string;
  tab?:     string;
  onPress?: () => void;
  danger?:  boolean;
  divider?: boolean;
}

export function DrawerContent(props: DrawerContentComponentProps) {
  const t         = useTheme();
  const { t: tr } = useTranslation();
  const { logout } = useAuth();
  const user   = useSelector((s: RootState) => s.auth.user);
  const unread = useSelector((s: RootState) => s.notifications.unreadCount);
  const isRTL  = useLanguage();

  const navigate    = (screen: string) => {
    props.navigation.closeDrawer();
    props.navigation.navigate(screen as never);
  };
  const navigateTab = (tab: string) => {
    props.navigation.closeDrawer();
    props.navigation.navigate('MainTabs' as never);
    setTimeout(() => props.navigation.navigate('MainTabs', { screen: tab } as never), 100);
  };

  const activeRoute = props.state.routeNames[props.state.index];

  const MENU_ITEMS: MenuItem[] = [
    { labelKey: 'drawer.home',          icon: '⊞', tab: 'Dashboard' },
    { labelKey: 'drawer.transfer',      icon: '⇄', tab: 'Transfers' },
    { labelKey: 'drawer.profile',       icon: '◎', tab: 'Profile'   },
    { labelKey: 'drawer.notifications', icon: '🔔', screen: 'Notifications', divider: true },
    { labelKey: 'drawer.support',       icon: '🎧', screen: 'Support' },
    { labelKey: 'drawer.about',         icon: 'ℹ',  screen: 'About' },
    {
      labelKey: 'drawer.logout', icon: '🚪',
      danger: true, divider: true,
      onPress: async () => { props.navigation.closeDrawer(); await logout(); },
    },
  ];

  return (
    <DrawerContentScrollView
      {...props}
      scrollEnabled={false}
      contentContainerStyle={{ flex: 1 }}
    >
      <View style={styles.container}>

        {/* ── Header ───────────────────────────────────────────────────── */}
        <View style={styles.header}>
          {/* Logo + bank name row — RTL aware */}
          <View style={[styles.logoRow, isRTL && { flexDirection: 'row-reverse' }]}>
            <View style={styles.logoBox}>
              <Text style={styles.logoText}>{appConfig.bankName.charAt(0)}</Text>
            </View>
          </View>

          <Text style={[styles.bankName, isRTL && { textAlign: 'right' }]}>
            {appConfig.bankName}
          </Text>

          <View style={styles.headerDivider} />

          {/* User row — RTL: avatar on right */}
          <View style={[styles.userRow, isRTL && { flexDirection: 'row-reverse' }]}>
            <View style={[styles.avatar, isRTL ? { marginLeft: 12, marginRight: 0 } : { marginRight: 12 }]}>
              <Text style={styles.avatarText}>{user?.firstName?.charAt(0) ?? '?'}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.userName, isRTL && { textAlign: 'right' }]}>
                {user ? `${user.firstName} ${user.lastName}` : 'Welcome'}
              </Text>
              <Text style={[styles.userEmail, isRTL && { textAlign: 'right' }]} numberOfLines={1}>
                {user?.email ?? ''}
              </Text>
            </View>
          </View>
        </View>

        {/* ── Menu items ───────────────────────────────────────────────── */}
        <ScrollView style={styles.menu} showsVerticalScrollIndicator={false}>
          {MENU_ITEMS.map((item, idx) => {
            const isActive = item.screen ? activeRoute === item.screen : false;
            return (
              <View key={idx}>
                {item.divider && <View style={styles.divider} />}

                <TouchableOpacity
                  style={[
                    styles.menuItem,
                    isActive && styles.menuItemActive,
                    // RTL: reverse menu item row
                    isRTL && { flexDirection: 'row-reverse' },
                  ]}
                  activeOpacity={0.7}
                  onPress={() => {
                    if (item.onPress)     item.onPress();
                    else if (item.screen) navigate(item.screen);
                    else if (item.tab)    navigateTab(item.tab);
                  }}
                >
                  {/* Icon */}
                  <Text style={[
                    styles.menuIcon,
                    item.danger && styles.menuIconDanger,
                    // RTL: icon on right side → flip margin
                    isRTL
                      ? { marginLeft: 14, marginRight: 0 }
                      : { marginRight: 14, marginLeft: 0 },
                  ]}>
                    {item.icon}
                  </Text>

                  {/* Label */}
                  <Text style={[
                    styles.menuLabel,
                    isActive && styles.menuLabelActive,
                    item.danger && styles.menuLabelDanger,
                    isRTL && { textAlign: 'right' },
                  ]}>
                    {tr(item.labelKey)}
                  </Text>

                  {/* Notification badge */}
                  {item.screen === 'Notifications' && unread > 0 && (
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>{unread > 99 ? '99+' : unread}</Text>
                    </View>
                  )}

                  {/* Active indicator bar — RTL: on left side, LTR: on right */}
                  {isActive && (
                    <View style={[
                      styles.activeBar,
                      isRTL ? { left: 0, right: undefined } : { right: 0, left: undefined },
                    ]} />
                  )}
                </TouchableOpacity>
              </View>
            );
          })}
        </ScrollView>

        {/* ── Footer ───────────────────────────────────────────────────── */}
        <View style={[styles.footer, isRTL && { flexDirection: 'row-reverse' }]}>
          <Text style={styles.footerText}>{appConfig.bankName} v1.0.0</Text>
          <Text style={styles.footerText}>{appConfig.bankCode}</Text>
        </View>
      </View>
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  container:       { flex: 1 },

  header:          { paddingTop: 48, paddingHorizontal: 24, paddingBottom: 20 },
  logoRow:         { flexDirection: 'row', marginBottom: 12 },
  logoBox:         {
    width: 52, height: 52, borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center', justifyContent: 'center',
  },
  logoText:        { fontSize: 26, fontWeight: '700', color: '#fff' },
  bankName:        { fontSize: 20, fontWeight: '700', color: '#fff', marginBottom: 16 },
  headerDivider:   { height: 1, backgroundColor: 'rgba(255,255,255,0.2)', marginBottom: 16 },

  userRow:         { flexDirection: 'row', alignItems: 'center' },
  avatar:          {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center', justifyContent: 'center',
  },
  avatarText:      { fontSize: 18, fontWeight: '700', color: '#fff' },
  userName:        { fontSize: 14, fontWeight: '600', color: '#fff' },
  userEmail:       { fontSize: 12, color: 'rgba(255,255,255,0.65)', marginTop: 2 },

  menu:            { flex: 1, paddingHorizontal: 12, paddingTop: 8 },
  menuItem:        {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: 13, paddingHorizontal: 12,
    borderRadius: 12, marginBottom: 2, position: 'relative',
  },
  menuItemActive:  { backgroundColor: 'rgba(255,255,255,0.15)' },
  menuIcon:        { fontSize: 20, width: 26, textAlign: 'center' },
  menuIconDanger:  { opacity: 0.8 },
  menuLabel:       { flex: 1, fontSize: 15, fontWeight: '500', color: 'rgba(255,255,255,0.75)' },
  menuLabelActive: { color: '#fff', fontWeight: '700' },
  menuLabelDanger: { color: 'rgba(255,120,120,0.9)' },

  activeBar:       {
    position: 'absolute', top: '20%',
    height: '60%', width: 3, borderRadius: 2,
    backgroundColor: '#fff',
  },
  badge:           {
    backgroundColor: '#FF3B30', borderRadius: 10,
    minWidth: 20, height: 20,
    alignItems: 'center', justifyContent: 'center',
    paddingHorizontal: 5,
  },
  badgeText:       { fontSize: 11, fontWeight: '700', color: '#fff' },

  divider:         {
    height: 1, backgroundColor: 'rgba(255,255,255,0.15)',
    marginVertical: 8, marginHorizontal: 12,
  },
  footer:          { padding: 24, flexDirection: 'row', justifyContent: 'space-between' },
  footerText:      { fontSize: 11, color: 'rgba(255,255,255,0.4)' },
});

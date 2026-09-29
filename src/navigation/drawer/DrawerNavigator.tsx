import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { useTheme }              from '../../ui-kit/theme/ThemeProvider';
import { MainTabs }              from '../tabs/MainTabs';
import { NotificationsScreen }   from '../../screens/notifications/NotificationsScreen';
import { SupportScreen }         from '../../screens/support/SupportScreen';
import { AboutScreen }           from '../../screens/about/AboutScreen';
import { DrawerContent }         from './DrawerContent';
import { useLanguage } from '../../localization/LanguageContext';

export type DrawerParamList = {
  MainTabs:      undefined;
  Notifications: undefined;
  Support:       undefined;
  About:         undefined;
};

const Drawer = createDrawerNavigator<DrawerParamList>();

export function DrawerNavigator() {
  const t   = useTheme();
  const {isRTL} = useLanguage();

  return (
    <Drawer.Navigator
      drawerContent={(props) => <DrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        // drawerType:  'slide',

        // ── RTL: drawer slides from RIGHT, LTR: from LEFT ─────────────────
        drawerPosition: isRTL ? 'right' : 'left',

        drawerStyle: {
          backgroundColor: t.colors.primary,
          width:           350,
        },

        overlayColor:                'rgba(0,0,0,0.5)',
        drawerActiveTintColor:       '#FFFFFF',
        drawerInactiveTintColor:     'rgba(255,255,255,0.6)',
        drawerActiveBackgroundColor: 'rgba(255,255,255,0.15)',

        drawerLabelStyle: {
          fontSize:   t.typography.fontSize.md,
          fontFamily: t.typography.fontFamily.medium,
          marginLeft: -8,
        },
      }}
    >
      <Drawer.Screen
        name="MainTabs"
        component={MainTabs}
        options={{ drawerItemStyle: { display: 'none' } }}
      />
      <Drawer.Screen name="Notifications" component={NotificationsScreen} />
      <Drawer.Screen name="Support"       component={SupportScreen} />
      <Drawer.Screen name="About"         component={AboutScreen} />
    </Drawer.Navigator>
  );
}

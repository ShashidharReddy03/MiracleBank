import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { MainTabs } from '../tabs/MainTabs';
import { NotificationsScreen } from '../../screens/notifications/NotificationsScreen';
import { SupportScreen } from '../../screens/support/SupportScreen';
import { AboutScreen } from '../../screens/about/AboutScreen';
import SettingsScreen from '../../screens/settings/SettingsScreen';
import { DrawerContent } from './DrawerContent';
import { useLanguage } from '../../localization/LanguageContext';

export type DrawerParamList = {
  MainTabs: undefined | { screen?: string };
  Notifications: undefined;
  Support: undefined;
  About: undefined;
  Settings: undefined;
};

const Drawer = createDrawerNavigator<DrawerParamList>();

export function DrawerNavigator() {
  const { isRTL } = useLanguage();

  return (
    <Drawer.Navigator
      drawerContent={(props) => <DrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerPosition: isRTL ? 'right' : 'left',
        drawerStyle: {
          backgroundColor: '#ffffff',
          width: 320,
        },
        overlayColor: 'rgba(0,0,0,0.45)',
      }}
    >
      <Drawer.Screen
        name="MainTabs"
        component={MainTabs}
        options={{ drawerItemStyle: { display: 'none' } }}
      />
      <Drawer.Screen name="Notifications" component={NotificationsScreen} />
      <Drawer.Screen name="Support" component={SupportScreen} />
      <Drawer.Screen name="About" component={AboutScreen} />
      <Drawer.Screen name="Settings" component={SettingsScreen} />
    </Drawer.Navigator>
  );
}

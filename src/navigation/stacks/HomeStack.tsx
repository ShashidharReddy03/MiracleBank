import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { DashboardScreen } from '../../screens/dashboard/DashboardScreen';
import { AirtimeTopupScreen } from '../../screens/airtime/AirtimeTopupScreen';
import { AddMoneyScreen } from '../../screens/money/AddMoneyScreen';

export type HomeStackParamList = {
  HomeMain: undefined;
  AirtimeTopup: undefined;
  AddMoney: { provider?: 'etl' | 'vcl' } | undefined;
};

const Stack = createNativeStackNavigator<HomeStackParamList>();

export function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeMain" component={DashboardScreen} />
      <Stack.Screen name="AirtimeTopup" component={AirtimeTopupScreen} />
      <Stack.Screen name="AddMoney" component={AddMoneyScreen} />
    </Stack.Navigator>
  );
}

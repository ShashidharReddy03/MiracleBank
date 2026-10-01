import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LoginScreen } from '../../screens/auth/login/LoginScreen';
import { OTPScreen } from '../../screens/auth/otp/OTPScreen';
import { BiometricSetupScreen } from '../../screens/auth/biometric/BiometricSetupScreen';
import { DrawerNavigator } from '../drawer/DrawerNavigator';
// import  MFLoginScreen  from "";
import MFLoginScreen from '../../screens/prelogin/LoginScreen';
import PreLoginFlow from '../../screens/prelogin/PreLoginFlow';

export type AuthStackParamList = {
  PreLogin: undefined;
  Login: undefined;
  MFLogin: undefined;
  Dashboard: undefined;
  OTP: { phone: string; maskedPhone: string };
  BiometricSetup: undefined;
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

export function AuthStack() {
  return (
    <Stack.Navigator initialRouteName="PreLogin" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="PreLogin" component={PreLoginFlow} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="MFLogin" component={MFLoginScreen} />
      <Stack.Screen name="OTP" component={OTPScreen} />
      <Stack.Screen name="Dashboard" component={DrawerNavigator} />
      <Stack.Screen name="BiometricSetup" component={BiometricSetupScreen} />
    </Stack.Navigator>
  );
}

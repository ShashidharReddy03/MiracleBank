import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LoginScreen } from '../../screens/auth/login/LoginScreen';
import { OTPScreen } from '../../screens/auth/otp/OTPScreen';
import { BiometricSetupScreen } from '../../screens/auth/biometric/BiometricSetupScreen';
import CreateAccount from '../../screens/account/CreateAccount';
import { DrawerNavigator } from '../drawer/DrawerNavigator';
// import  MFLoginScreen  from "";
import MFLoginScreen from '../../screens/prelogin/LoginScreen';
import PreLoginFlow from '../../screens/prelogin/PreLoginFlow';
import ForgotPasswordFlow from '../../screens/account/ForgotPasswordFlow';
import ContactUsScreen from '../../screens/settings/ContactUsScreen';
import SettingsDestinationScreen from '../../screens/settings/SettingsDestinationScreen';

export type AuthStackParamList = {
  PreLogin: undefined;
  Login: undefined;
  MFLogin: undefined;
  Dashboard: undefined;
  OTP: { phone: string; maskedPhone: string };
  BiometricSetup: undefined;
  createAccount: undefined;
  ForgotPassword: undefined;
  ContactUs: undefined;
  LocateUs: undefined;
  Offers: undefined;
  AppCode: undefined;
  Help: undefined;
  FAQ: undefined;
  ReferAFriend: undefined;
  RateUs: undefined;
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

export function AuthStack() {
  return (
    <Stack.Navigator initialRouteName="PreLogin" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="PreLogin" component={PreLoginFlow} />
      {/* <Stack.Screen name="Login" component={LoginScreen} /> */}
      <Stack.Screen name="MFLogin" component={MFLoginScreen} />
      <Stack.Screen name="OTP" component={OTPScreen} />
      <Stack.Screen name="Dashboard" component={DrawerNavigator} />
      <Stack.Screen name="BiometricSetup" component={BiometricSetupScreen} />
      <Stack.Screen name="createAccount" component={CreateAccount} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordFlow} />
      <Stack.Screen name="ContactUs" component={ContactUsScreen} />
      <Stack.Screen name="LocateUs" component={SettingsDestinationScreen} />
      <Stack.Screen name="Offers" component={SettingsDestinationScreen} />
      <Stack.Screen name="AppCode" component={SettingsDestinationScreen} />
      <Stack.Screen name="Help" component={SettingsDestinationScreen} />
      <Stack.Screen name="FAQ" component={SettingsDestinationScreen} />
      <Stack.Screen name="ReferAFriend" component={SettingsDestinationScreen} />
      <Stack.Screen name="RateUs" component={SettingsDestinationScreen} />
    </Stack.Navigator>
  );
}

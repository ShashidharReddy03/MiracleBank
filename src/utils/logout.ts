import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Keychain from 'react-native-keychain';
import { CommonActions } from '@react-navigation/native';
import { store } from '../store/store';
import { logout as logoutAction } from '../store/slices/authSlice';
import { authManager } from '../core/auth/AuthManager';

type NavLike = {
  dispatch: (action: unknown) => void;
  getParent?: () => NavLike | undefined;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function confirmLogout(navigation: any) {
  Alert.alert(
    'Logout',
    'Are you sure you want to logout from Miracle Mobile Banking?',
    [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Yes',
        style: 'destructive',
        onPress: async () => {
          try {
            await AsyncStorage.clear();
            await Keychain.resetGenericPassword();
            await authManager.clearTokens();
            store.dispatch(logoutAction());
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{ name: 'MFLogin' }],
              }))
          } catch (error) {
            console.error('Logout failed:', error);
            Alert.alert('Error', 'Unable to logout. Please try again.');
          }
        },
      },
    ],
    { cancelable: true },
  );
}

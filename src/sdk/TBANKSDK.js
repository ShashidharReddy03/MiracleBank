import { NativeModules } from 'react-native';

const { TBankSDKBridge } = NativeModules;

export const TBankSDK = {
  configure: () => TBankSDKBridge.configure(),

  login: (uid, pwd) =>
    TBankSDKBridge.login(uid, pwd),

  fetchBalance: (sourceAccount, kind) =>
    TBankSDKBridge.fetchBalance(sourceAccount, kind),
};
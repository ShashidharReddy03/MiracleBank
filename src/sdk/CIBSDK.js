import { NativeModules } from 'react-native';

const { CIBSDKBridge } = NativeModules;

export const CIBSDK = {
  /** metadata + request → payload for the encryption layer */
  buildRequest: (metadataJson, requestJson) =>
    CIBSDKBridge.buildRequest(metadataJson, requestJson),

  /** adds TPIN to a confirmed request */
  mergeTpin: (tpin, requestJson) =>
    CIBSDKBridge.mergeTpin(tpin, requestJson),

  /** fund transfer — own account, confirmation step */
  ownAccountConfirm: (params) =>
    CIBSDKBridge.ownAccountConfirm(params),
};
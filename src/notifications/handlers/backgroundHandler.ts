import messaging from '@react-native-firebase/messaging';

/**
 * registerBackgroundHandler — MUST be called at the very top of index.js,
 * before AppRegistry.registerComponent.
 */
export function registerBackgroundHandler() {
  messaging().setBackgroundMessageHandler(async (remoteMessage) => {
    // Background notifications land here — update badges, local DB, etc.
    console.log('[BG Notification]', remoteMessage.messageId);
  });
}

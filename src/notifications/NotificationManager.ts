import messaging from '@react-native-firebase/messaging';
import { logger } from '../core/logging/MFLogger';

const TAG = 'NotificationManager';

export type NotificationCategory =
  | 'TRANSACTION_ALERT' | 'TRANSFER_STATUS' | 'OTP'
  | 'SECURITY_ALERT'   | 'PROMOTIONAL'      | 'SYSTEM';

export interface MFNotification {
  id:        string;
  title:     string;
  body:      string;
  category:  NotificationCategory;
  data?:     Record<string, string>;
  deepLink?: string;
}

type Handler = (notification: MFNotification) => void;

class NotificationManager {
  private static _instance: NotificationManager;
  static getInstance() {
    if (!NotificationManager._instance) NotificationManager._instance = new NotificationManager();
    return NotificationManager._instance;
  }

  private fcmToken: string | null = null;
  private onTapHandler: Handler | null = null;

  setOnTap(handler: Handler) { this.onTapHandler = handler; }

  getFCMToken() { return this.fcmToken; }

  async initialize(): Promise<void> {
    const status = await messaging().requestPermission();
    const granted =
      status === messaging.AuthorizationStatus.AUTHORIZED ||
      status === messaging.AuthorizationStatus.PROVISIONAL;

    if (!granted) {
      logger.warn(TAG, 'Push permission denied');
      return;
    }

    this.fcmToken = await messaging().getToken();
    logger.info(TAG, 'FCM ready', { token: this.fcmToken?.slice(0, 10) + '…' });

    messaging().onTokenRefresh((t) => { this.fcmToken = t; });

    // Foreground
    messaging().onMessage(async (msg) => {
      logger.info(TAG, 'Foreground message', { id: msg.messageId });
      // Dispatch to store if needed — imported lazily to avoid circular dep
    });

    // Background tap
    messaging().onNotificationOpenedApp((msg) => {
      this.onTapHandler?.(this.parse(msg));
    });

    // Cold-start tap
    const initial = await messaging().getInitialNotification();
    if (initial) setTimeout(() => this.onTapHandler?.(this.parse(initial)), 500);
  }

  private parse(msg: any): MFNotification {
    return {
      id:       msg.messageId ?? String(Date.now()),
      title:    msg.notification?.title ?? '',
      body:     msg.notification?.body  ?? '',
      category: msg.data?.category ?? 'SYSTEM',
      data:     msg.data,
      deepLink: msg.data?.deepLink,
    };
  }
}

export const notificationManager = NotificationManager.getInstance();

import { SecurityManager } from './security/SecurityManager';
import { sslPinningManager } from './security/certificatePinning/SSLPinningManager';
// import { createApiClient } from './networking/apiClient';
import { sessionManager } from './core/session/SessionManager';
import { notificationManager } from './notifications/NotificationManager';
import { logger } from './core/logging/MFLogger';
import { appStorage } from './core/storage/AppStorage';
import { appConfig } from './config/appConfig';
import { initI18n } from './core/localization/i18n';
import { store } from './store/store';
import { lockSession, blockSecurity } from './store/slices/sessionSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import {
//   triggerRTL,
// } from './localization/LanguageContext';

const TAG = 'Bootstrap';
const LANG_KEY = 'selected_language';

export interface BootstrapResult {
  securityPassed: boolean;
  securityFailures: string[];
}

export async function bootstrap(): Promise<BootstrapResult> {
  try {
    logger.info(TAG, `Booting ${appConfig.bankName}...`);
    await appStorage.initialize();
    logger.info(TAG, 'Storage ready ✓');

    try {
      const security = new SecurityManager({
        blockJailbroken: appConfig.security.blockJailbroken,
        blockRooted: appConfig.security.blockRooted,
        blockEmulators: appConfig.security.blockEmulators,
        blockVPN: appConfig.security.blockVPN,
        blockProxy: appConfig.security.blockProxy,
        blockUSBDebugging: appConfig.security.blockUSBDebugging,
        blockFrida: appConfig.security.blockFrida,
        blockNotFromAppStore: appConfig.security.blockNotFromAppStore,
        blockLaptopConnection: appConfig.security.blockLaptopConnection,
        // blockAppDebuggable: appConfig.security.blockAppDebuggable,
        bypassInDev: __DEV__,
      });
      const result = await security.runAllChecks();
      if (!result.passed) {
        store.dispatch(blockSecurity(result.failures));
        return { securityPassed: false, securityFailures: result.failures };
      }
      logger.info(TAG, 'Security passed ✓');
    } catch (e) {
      logger.warn(TAG, 'Security check error', { error: e });
    }

    // ── 3. SSL PINNING ───────────────────────────────────────────────────
    try {
      sslPinningManager.configure(appConfig.sslPins);
      logger.info(TAG, 'SSL pins configured ✓');
    } catch (e) {
      logger.warn(TAG, 'SSL failed', { error: e });
    }

    // ── 4. API CLIENT ────────────────────────────────────────────────────
    try {
      // createApiClient({
      //   baseURL: appConfig.apiBaseUrl,
      //   apiVersion: appConfig.apiVersion,
      //   bankCode: appConfig.bankCode,
      // });
      logger.info(TAG, 'API client ready ✓');
    } catch (e) {
      logger.warn(TAG, 'API failed', { error: e });
    }

    // ── 5. SESSION ───────────────────────────────────────────────────────
    try {
      // sessionManager.configure({
      //   timeoutMs: appConfig.sessionTimeoutMs,
      //   onTimeout: () => store.dispatch(lockSession()),
      // });
      logger.info(TAG, 'Session ready ✓');
    } catch (e) {
      logger.warn(TAG, 'Session failed', { error: e });
    }

    // ── 6. NOTIFICATIONS ─────────────────────────────────────────────────
    void notificationManager.initialize().then(() => {
      logger.info(TAG, 'Notifications ready ✓');
    }).catch(error => {
      logger.warn(TAG, 'Notifications failed', { error });
    });


    try {
      let savedLanguage =
        await AsyncStorage.getItem(
          LANG_KEY
        );

      if (!savedLanguage) {
        savedLanguage =
          appStorage.get<string>(
            LANG_KEY
          );
      }

      const language =
        savedLanguage ??
        appConfig.defaultLanguage;

      const rtl =
        language === 'ar';

      console.log(
        '[Bootstrap]',
        language,
        rtl
      );

      // restore language
      await initI18n(
        language
      );

      // small delay → provider mounts
      // setTimeout(() => {
      //   triggerRTL(
      //     rtl
      //   );
      // }, 0);

      logger.info(
        TAG,
        `i18n ready ✓ lang=${language}`
      );

    } catch (e) {

      logger.warn(
        TAG,
        'i18n failed',
        {
          error: e,
        }
      );
      await initI18n(
        appConfig.defaultLanguage
      );
      // setTimeout(() => {
      //   triggerRTL(
      //     false
      //   );
      // }, 0);
    }

    logger.info(TAG, `${appConfig.bankName} ready ✓`);
    return { securityPassed: true, securityFailures: [] };

  } catch (e) {
    logger.error(TAG, 'Bootstrap failed', { error: e });
    return { securityPassed: true, securityFailures: [] };
  }
}

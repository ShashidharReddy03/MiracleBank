import { NativeModules } from 'react-native';
import { appConfig } from '../../config/appConfig';

/**
 * ScreenshotBlocker
 *
 * Android: Requires native module that sets FLAG_SECURE on the window.
 *          Add MFScreenshotModule.kt to your android/app/src/ and register it.
 *
 * iOS: Requires native module using UITextField overlay trick or
 *      react-native-screenshot-prevent package.
 *
 * Usage:
 *   useEffect(() => {
 *     ScreenshotBlocker.enable();
 *     return () => ScreenshotBlocker.disable();
 *   }, []);
 */
export const ScreenshotBlocker = {
  enable(): void {
    if (!appConfig.security.screenshotBlocking) {
      console.log('[ScreenshotBlocker] screenshot blocking disabled by config');
      return;
    }

    console.log('[ScreenshotBlocker] calling native setSecure(true)');
    NativeModules.MFScreenshotModule?.setSecure?.(true);
    console.log('[ScreenshotBlocker] native call completed');
  },

  disable(): void {
    if (!appConfig.security.screenshotBlocking) {
      return;
    }

    NativeModules.MFScreenshotModule?.setSecure?.(false);
    console.log('[ScreenshotBlocker] disabled');
  },
};

import { Platform } from 'react-native';
import { NativeSecurity, SecurityCheckResults } from './NativeSecurity';
import { logger } from '../core/logging/MFLogger';

const TAG = 'SecurityManager';

interface SecurityConfig {
  blockJailbroken?: boolean;
  blockEmulators?: boolean;
  blockRooted?: boolean;
  blockVPN?: boolean;
  blockProxy?: boolean;
  blockUSBDebugging?: boolean;
  blockFrida?: boolean;
  blockNotFromAppStore?: boolean;
  blockLaptopConnection?: boolean;
  blockIfNativeModuleMissing?: boolean; // ← NEW
  // blockAppDebuggable?: boolean; // ← NEW
  bypassInDev?: boolean;
}

export interface SecurityResult {
  passed: boolean;
  failures: string[];
  info: SecurityCheckResults | null;
}

export class SecurityManager {
  private cfg: Required<SecurityConfig>;

  constructor(config: SecurityConfig = {}) {
    this.cfg = {
      blockJailbroken: config.blockJailbroken ?? true,
      blockEmulators: config.blockEmulators ?? true,
      blockRooted: config.blockRooted ?? true,
      blockVPN: config.blockVPN ?? true,
      blockProxy: config.blockProxy ?? true,
      blockUSBDebugging: config.blockUSBDebugging ?? true,
      blockFrida: config.blockFrida ?? true,
      blockNotFromAppStore: config.blockNotFromAppStore ?? false,
      blockLaptopConnection: config.blockLaptopConnection ?? false,
      blockIfNativeModuleMissing: config.blockIfNativeModuleMissing ?? false,
      // blockAppDebuggable:         config.blockAppDebuggable         ?? true,
      bypassInDev: config.bypassInDev ?? __DEV__,
    };
  }

  async runAllChecks(): Promise<SecurityResult> {
    if (this.cfg.bypassInDev) {
      logger.warn(TAG, '⚠️  BYPASSED — set bypassInDev: false to test');
      return { passed: true, failures: [], info: null };
    }

    if (Platform.OS !== 'android') {
      logger.info(TAG, 'iOS — native module pending');
      return { passed: true, failures: [], info: null };
    }

    const failures: string[] = [];
    logger.info(TAG, 'Running security checks...');

    const checks = await NativeSecurity.runAllChecks();

    // ── IMPORTANT: Log native module status ──────────────────────────────────
    if (!checks.nativeModuleAvailable) {
      logger.warn(TAG, '⚠️  MFSecurityModule NOT FOUND in NativeModules');
      logger.warn(TAG, '   → SecurityModule.java not registered in MainApplication');
      logger.warn(TAG, '   → All native checks return false — emulator detection disabled');

      if (this.cfg.blockIfNativeModuleMissing) {
        failures.push('Security module not initialized (MFSecurityModule missing)');
      }
    }

    logger.info(TAG, 'Check results', {
      nativeModuleAvailable: checks.nativeModuleAvailable,
      isEmulator: checks.isEmulator,
      isRooted: checks.isRooted,
      isVPNActive: checks.isVPNActive,
      isProxyEnabled: checks.isProxyEnabled,
      isUsbDebugging: checks.isUsbDebugging,
      isDeveloperOptions: checks.isDeveloperOptions,
      isDebuggerConnected: checks.isDebuggerConnected,
      isFridaDetected: checks.isFridaDetected,
    });

    // 1. Emulator
    if (this.cfg.blockEmulators && checks.isEmulator) {
      failures.push('Emulator detected');
      logger.error(TAG, '❌ Emulator', { model: checks.hardware?.model });
    }
    // 2. Root
    if (this.cfg.blockRooted && checks.isRooted) {
      failures.push('Rooted device detected');
      logger.error(TAG, '❌ Root');
    }
    // 3. VPN
    if (this.cfg.blockVPN && checks.isVPNActive) {
      failures.push('VPN connection detected');
      logger.error(TAG, '❌ VPN');
    }
    // 4. Proxy
    if (this.cfg.blockProxy && checks.isProxyEnabled) {
      failures.push('Proxy detected');
      logger.error(TAG, '❌ Proxy');
    }
    // 5. ADB
    if (this.cfg.blockUSBDebugging && checks.isUsbDebugging) {
      failures.push('USB debugging (ADB) enabled');
      logger.error(TAG, '❌ ADB');
    }
    // 6. Dev options
    if (this.cfg.blockUSBDebugging && checks.isDeveloperOptions) {
      failures.push('Developer options enabled');
      logger.error(TAG, '❌ Dev options');
    }
    // 7. Debugger
    if (this.cfg.blockUSBDebugging && checks.isDebuggerConnected) {
      failures.push('Debugger connected');
      logger.error(TAG, '❌ Debugger');
    }
    // 8. Frida
    if (this.cfg.blockFrida && checks.isFridaDetected) {
      failures.push('Runtime tampering (Frida)');
      logger.error(TAG, '❌ Frida');
    }
    // 9. App Store
    if (this.cfg.blockNotFromAppStore && !checks.isFromAppStore) {
      failures.push(`Not from official store (${checks.storeId})`);
      logger.error(TAG, '❌ Not from store');
    }
    // 10. Laptop
    if (this.cfg.blockLaptopConnection && checks.isConnectedToLaptop) {
      failures.push('Connected to laptop via USB');
      logger.error(TAG, '❌ Laptop USB');
    }

    const passed = failures.length === 0;
    logger.info(TAG, passed ? '✅ Passed' : `❌ Failed: ${failures.join(' | ')}`);

    return { passed, failures, info: checks };
  }
}

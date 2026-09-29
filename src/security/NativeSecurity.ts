import { NativeModules, Platform } from 'react-native';

const { MFSecurityModule } = NativeModules;

if (__DEV__) {
  console.log('[NativeSecurity] MFSecurityModule available:', !!MFSecurityModule);
  console.log('[NativeSecurity] All NativeModules:', Object.keys(NativeModules).join(', '));
}

export interface HardwareInfo {
  hardware:     string;
  model:        string;
  manufacturer: string;
  product:      string;
  isEmulator:   boolean;
}

export interface SimInfo {
  slot:    number;
  carrier: string;
}

export interface SystemVersion {
  release:       string;
  sdkInt:        number;
  securityPatch: string;
  incremental:   string;
  codename:      string;
}

export interface UsbDebuggingInfo {
  adbEnabled:        boolean;
  devOptions:        boolean;
  debuggerConnected: boolean;
}

export interface AppStoreInfo {
  isFromStore: boolean;
  storeId:     string;
}

export interface SecurityCheckResults {
  hardware:             HardwareInfo | null;
  isEmulator:           boolean;
  isVPNActive:          boolean;
  isProxyEnabled:       boolean;
  isUsbDebugging:       boolean;
  isDeveloperOptions:   boolean;
  isDebuggerConnected:  boolean;
  isRooted:             boolean;
  isFridaDetected:      boolean;
  isFromAppStore:       boolean;
  isConnectedToLaptop:  boolean;
  sims:                 SimInfo[];
  systemVersion:        SystemVersion | null;
  storeId:              string;
  nativeModuleAvailable: boolean; // ← tells SecurityManager if module loaded
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function isAndroid(): boolean {
  return Platform.OS === 'android';
}

function hasModule(): boolean {
  return !!MFSecurityModule;
}

function androidReady(): boolean {
  return isAndroid() && hasModule();
}

// ── JS-level fallback emulator detection (no native module needed) ─────────────

function jsEmulatorCheck(): boolean {
  // React Native sets __DEV__ true in dev mode but that alone isn't enough.
  // We check the user agent string on Android which often contains emulator hints.
  if (!isAndroid()) return false;

  // Check global navigator userAgent (available in RN JS environment)
  const ua = (global as any).navigator?.userAgent ?? '';
  if (ua.toLowerCase().includes('emulator')) return true;
  if (ua.toLowerCase().includes('sdk_gphone')) return true;

  return false;
}

// ── Native bridge ─────────────────────────────────────────────────────────────

export const NativeSecurity = {

  // ── 1. Hardware + Emulator ─────────────────────────────────────────────────
  async getHardware(): Promise<HardwareInfo> {
    if (!androidReady()) {
      return { hardware: '', model: '', manufacturer: '', product: '', isEmulator: false };
    }
    try {
      return await MFSecurityModule.getHardware();
    } catch {
      return { hardware: '', model: '', manufacturer: '', product: '', isEmulator: false };
    }
  },

  // ── 2. VPN ─────────────────────────────────────────────────────────────────
  async isVPNActive(): Promise<boolean> {
    if (!androidReady()) return false;
    try {
      const result = await MFSecurityModule.isVPNActive();
      return result.active ?? false;
    } catch { return false; }
  },

  // ── 3. Proxy ───────────────────────────────────────────────────────────────
  async isProxyEnabled(): Promise<boolean> {
    if (!androidReady()) return false;
    try {
      const result = await MFSecurityModule.isProxyEnabled();
      return result.enabled ?? false;
    } catch { return false; }
  },

  // ── 4. USB Debugging ───────────────────────────────────────────────────────
  async isUsbDebuggingEnabled(): Promise<UsbDebuggingInfo> {
    if (!androidReady()) {
      return { adbEnabled: false, devOptions: false, debuggerConnected: false };
    }
    try {
      return await MFSecurityModule.isUsbDebuggingEnabled();
    } catch {
      return { adbEnabled: false, devOptions: false, debuggerConnected: false };
    }
  },

  // ── 5. Root ────────────────────────────────────────────────────────────────
  async isDeviceRooted(): Promise<boolean> {
    if (!androidReady()) return false;
    try {
      const result = await MFSecurityModule.isDeviceRooted();
      return result.rooted ?? false;
    } catch { return false; }
  },

  // ── 6. Frida ───────────────────────────────────────────────────────────────
  async isFridaDetected(): Promise<boolean> {
    if (!androidReady()) return false;
    try {
      const result = await MFSecurityModule.isFridaDetected();
      return result.detected ?? false;
    } catch { return false; }
  },

  // ── 7. SIM ─────────────────────────────────────────────────────────────────
  async getSimData(): Promise<SimInfo[]> {
    if (!androidReady()) return [];
    try {
      const result = await MFSecurityModule.getSimData();
      return result.sims ?? [];
    } catch { return []; }
  },

  // ── 8. App Store ───────────────────────────────────────────────────────────
  async isAppInstalledFromAppStore(): Promise<AppStoreInfo> {
    if (!androidReady()) return { isFromStore: true, storeId: 'unknown' };
    try {
      return await MFSecurityModule.isAppInstalledFromAppStore();
    } catch { return { isFromStore: false, storeId: 'unknown' }; }
  },

  // ── 9. System version ──────────────────────────────────────────────────────
  async currentSystemVersion(): Promise<SystemVersion | null> {
    if (!androidReady()) return null;
    try {
      return await MFSecurityModule.currentSystemVersion();
    } catch { return null; }
  },

  // ── 10. Laptop USB ─────────────────────────────────────────────────────────
  async isConnectedToLaptop(): Promise<boolean> {
    if (!androidReady()) return false;
    try {
      const result = await MFSecurityModule.isConnectedToLaptop();
      return result.connected ?? false;
    } catch { return false; }
  },

  // ── Run ALL checks ──────────────────────────────────────────────────────────
  async runAllChecks(): Promise<SecurityCheckResults> {
    const moduleAvailable = androidReady();

    console.log('[NativeSecurity] runAllChecks — module available:', moduleAvailable);

    const [
      hardware,
      vpn,
      proxy,
      usb,
      rooted,
      frida,
      sims,
      appStore,
      systemVersion,
      laptop,
    ] = await Promise.all([
      NativeSecurity.getHardware(),
      NativeSecurity.isVPNActive(),
      NativeSecurity.isProxyEnabled(),
      NativeSecurity.isUsbDebuggingEnabled(),
      NativeSecurity.isDeviceRooted(),
      NativeSecurity.isFridaDetected(),
      NativeSecurity.getSimData(),
      NativeSecurity.isAppInstalledFromAppStore(),
      NativeSecurity.currentSystemVersion(),
      NativeSecurity.isConnectedToLaptop(),
    ]);

    // Use native result first, fallback to JS check if module not available
    const isEmulator = hardware.isEmulator || (!moduleAvailable && jsEmulatorCheck());

    return {
      hardware,
      isEmulator,
      isVPNActive:          vpn,
      isProxyEnabled:       proxy,
      isUsbDebugging:       usb.adbEnabled,
      isDeveloperOptions:   usb.devOptions,
      isDebuggerConnected:  usb.debuggerConnected,
      isRooted:             rooted,
      isFridaDetected:      frida,
      sims,
      isFromAppStore:       appStore.isFromStore,
      storeId:              appStore.storeId,
      systemVersion,
      isConnectedToLaptop:  laptop,
      nativeModuleAvailable: moduleAvailable,
    };
  },
};

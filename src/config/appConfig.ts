
export interface SSLPin {
  domain:           string;
  pins:             string[];   // SHA-256 SPKI base64 hashes
  includeSubdomains: boolean;
}

export interface AppConfig {
  appName:  string;
  bankName: string;
  bankCode: string;

  apiBaseUrl: string;
  apiVersion: string;

  keycloak: {
    realm:         string;
    authServerUrl: string;
    clientId:      string;
  };

  sslPins: SSLPin[];
  security: {
    blockJailbroken:       boolean;

    // Android
    blockRooted:           boolean;
    blockEmulators:        boolean;
    blockVPN:              boolean;
    blockProxy:            boolean;
    blockUSBDebugging:     boolean;
    blockFrida:            boolean;

    // Both platforms
    screenshotBlocking:    boolean;

    // Optional — enable in production release builds only
    blockNotFromAppStore:  boolean;  // false = dev/QA builds allowed
    blockLaptopConnection: boolean;  // false = USB testing allowed
    // blockAppDebuggable: boolean; 
  };

  // ── Session ────────────────────────────────────────────────────────────────
  sessionTimeoutMs: number;

  // ── Features ───────────────────────────────────────────────────────────────
  features: {
    biometricLogin:  boolean;
    fundTransfer:    boolean;
    billPayments:    boolean;
    cardManagement:  boolean;
    investments:     boolean;
    loans:           boolean;
    qrPayments:      boolean;
  };

  defaultLanguage:    string;
  supportedLanguages: string[];

  support: {
    phone:      string;
    email:      string;
    whatsapp?:  string;
  };
}



export const appConfig: AppConfig = {

  // ── Identity ───────────────────────────────────────────────────────────────
  appName:  'BankingApp',   // Must match android/build.gradle + iOS Bundle ID
  bankName: 'My Bank',
  bankCode: 'MYBANK',

  // ── API ────────────────────────────────────────────────────────────────────
  apiBaseUrl: 'https://api.mybank.com',
  apiVersion: 'v1',

  // ── Auth ───────────────────────────────────────────────────────────────────
  keycloak: {
    realm:         'mybank',
    authServerUrl: 'https://auth.mybank.com',
    clientId:      'mobile-app',
  },

  // ── SSL Pinning ────────────────────────────────────────────────────────────
  sslPins: [
    {
      domain: 'api.mybank.com',
      pins: [
        'REPLACE_WITH_YOUR_PRIMARY_CERT_SHA256_HASH=',
        'REPLACE_WITH_YOUR_BACKUP_CERT_SHA256_HASH=',
      ],
      includeSubdomains: true,
    },
  ],

  // ── Security ───────────────────────────────────────────────────────────────
  security: {
    // ── iOS ─────────────────────────────────────────────────────────────────
    blockJailbroken:       true,

    // ── Android ─────────────────────────────────────────────────────────────
    blockRooted:           true,
    blockEmulators:        true,   // blocks Android emulator / Genymotion
    blockVPN:              true,   // blocks active VPN connections
    blockProxy:            true,   // blocks HTTP proxy (Charles, Burp, etc.)
    blockUSBDebugging:     true,   // blocks ADB / USB debugging mode
    blockFrida:            true,   // blocks Frida dynamic instrumentation

    // ── Both platforms ───────────────────────────────────────────────────────
    screenshotBlocking:    true,   // prevents screen capture on sensitive screens

    // ── Production only — keep false during dev/QA ───────────────────────────
    blockNotFromAppStore:  false,  // true = only allow Play Store / App Store installs
    blockLaptopConnection: false,  // true = blocks USB laptop connection
    // blockAppDebuggable:    true,  // true = blocks debug builds (dev/QA only)
    
  },

  // ── Session ────────────────────────────────────────────────────────────────
  sessionTimeoutMs: 5 * 60 * 1000, // 5 minutes idle → auto lock

  // ── Features ───────────────────────────────────────────────────────────────
  features: {
    biometricLogin:  true,
    fundTransfer:    true,
    billPayments:    true,
    cardManagement:  false,
    investments:     false,
    loans:           false,
    qrPayments:      false,
  },

  // ── Localization ───────────────────────────────────────────────────────────
  defaultLanguage:    'en',
  supportedLanguages: ['en', 'ar'],

  // ── Support ────────────────────────────────────────────────────────────────
  support: {
    phone:     '+1-800-000-0000',
    email:     'support@mybank.com',
    whatsapp:  '+1-800-000-0001',
  },
};

export const { appName } = appConfig;

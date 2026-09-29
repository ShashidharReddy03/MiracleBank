import { MMKV } from 'react-native-mmkv';
import * as Keychain from 'react-native-keychain';

const MMKV_KEY_SERVICE = 'mf_mmkv_encryption_key';


export class AppStorage {
  private static _instance: AppStorage;
  private mmkv: MMKV | null = null;

private constructor() {}

  static getInstance(): AppStorage {
    if (!AppStorage._instance) AppStorage._instance = new AppStorage();
    return AppStorage._instance;
  }

  // ── Call once in bootstrap.ts BEFORE using any get/set ───────────────────
  async initialize(): Promise<void> {
  try {
    const { MMKV } = require('react-native-mmkv'); // ← lazy require
    const encryptionKey = await getOrCreateEncryptionKey();
    this.mmkv = new MMKV({
      id: 'mf-app-storage',
      encryptionKey,
    });
    console.log('[AppStorage] Initialized ✓');
  } catch (e) {
    console.warn('[AppStorage] MMKV failed — falling back to no-op', e);
    // app continues without storage — won't crash
  }
}
  // ── Internal guard ────────────────────────────────────────────────────────
  private storage(): MMKV {
    if (!this.mmkv) {
      throw new Error(
        '[AppStorage] Not initialized. Call appStorage.initialize() in bootstrap.ts first.',
      );
    }
    return this.mmkv;
  }

  // ── SAVE ─────────────────────────────────────────────────────────────────
  set<T>(key: string, value: T): void {
    this.storage().set(key, JSON.stringify(value));
  }

  // ── READ ─────────────────────────────────────────────────────────────────
  get<T>(key: string): T | null {
    const raw = this.storage().getString(key);
    return raw ? (JSON.parse(raw) as T) : null;
  }

  // ── DELETE ONE ────────────────────────────────────────────────────────────
  delete(key: string): void {
    this.storage().delete(key);
  }

  clearAll(): void {
    this.storage().clearAll();
  }

  // ── CHECK KEY EXISTS ──────────────────────────────────────────────────────
  contains(key: string): boolean {
    return this.storage().contains(key);
  }
}

// ── Encryption Key Management ─────────────────────────────────────────────────

async function getOrCreateEncryptionKey(): Promise<string> {
  // Check if key already exists in Keychain
  const existing = await Keychain.getGenericPassword({
    service: MMKV_KEY_SERVICE,
  });

  if (existing) {
    // Reuse same key every launch — same key = same encrypted data accessible
    return existing.password;
  }

  // First launch — generate a new random 32-byte key
  const newKey = generateRandomKey(32);

  // Store key in Keychain (hardware protected)
  await Keychain.setGenericPassword('mmkv_key', newKey, {
    service: MMKV_KEY_SERVICE,
    accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
    // ↑ key only works when phone is unlocked
    // ↑ tied to this device — cannot be backed up or transferred
  });

  return newKey;
}

function generateRandomKey(length: number): string {
  const chars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Pre-created singleton — import this directly anywhere in the app
export const appStorage = AppStorage.getInstance();

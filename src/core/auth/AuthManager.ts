import * as Keychain from 'react-native-keychain';
import { AuthTokens } from '../../types/banking';

const SERVICE_KEY = 'mf_auth_tokens';

export class AuthManager {
  private static _instance: AuthManager;
  static getInstance() {
    if (!AuthManager._instance) AuthManager._instance = new AuthManager();
    return AuthManager._instance;
  }

  async saveTokens(tokens: AuthTokens): Promise<void> {
    await Keychain.setGenericPassword(SERVICE_KEY, JSON.stringify(tokens), {
      service: SERVICE_KEY,
      accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
    });
  }

  async getTokens(): Promise<AuthTokens | null> {
    const result = await Keychain.getGenericPassword({ service: SERVICE_KEY });
    if (!result) return null;
    return JSON.parse(result.password) as AuthTokens;
  }

  async clearTokens(): Promise<void> {
    await Keychain.resetGenericPassword({ service: SERVICE_KEY });
  }

  async isTokenExpired(): Promise<boolean> {
    const tokens = await this.getTokens();
    if (!tokens) return true;
    return Date.now() / 1000 >= tokens.expiresAt;
  }
}

export const authManager = AuthManager.getInstance();

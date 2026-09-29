import axios, { AxiosInstance } from 'axios';
import { authManager } from '../core/auth/AuthManager'
import { logger } from '../core/logging/MFLogger';

const TAG = 'ApiClient';

interface ApiClientConfig {
  baseURL:    string;
  apiVersion: string;
  bankCode:   string;
}

let _client: AxiosInstance;

export function createApiClient(config: ApiClientConfig): AxiosInstance {
  _client = axios.create({
    baseURL:  `${config.baseURL}/${config.apiVersion}`,
    timeout:  30_000,
    headers: {
      'Content-Type':  'application/json',
      'Accept':        'application/json',
      'X-Platform':    'mobile',
      'X-Bank-Code':   config.bankCode,
    },
  });

  // ── Request — inject JWT + request ID ────────────────────────────────────
  _client.interceptors.request.use(async (req) => {
    const tokens = await authManager.getTokens();
    if (tokens?.accessToken) {
      req.headers.Authorization = `Bearer ${tokens.accessToken}`;
    }
    req.headers['X-Request-ID'] = Math.random().toString(36).slice(2, 10);
    req.headers['X-Timestamp']  = Date.now().toString();
    logger.debug(TAG, `→ ${req.method?.toUpperCase()} ${req.url}`);
    return req;
  });

  // ── Response — auto token refresh on 401 ─────────────────────────────────
  _client.interceptors.response.use(
    (res) => {
      logger.debug(TAG, `← ${res.status} ${res.config.url}`);
      return res;
    },
    async (error) => {
      const original = error.config;
      logger.error(TAG, `← ${error.response?.status} ${original?.url}`, { msg: error.message });

      if (error.response?.status === 401 && !original._retry) {
        original._retry = true;
        try {
          const tokens = await authManager.getTokens();
          if (tokens?.refreshToken) {
            // TODO: call your refresh endpoint
            // const fresh = await refreshTokens(tokens.refreshToken);
            // await authManager.saveTokens(fresh);
            // original.headers.Authorization = `Bearer ${fresh.accessToken}`;
            // return _client(original);
          }
        } catch {
          await authManager.clearTokens();
        }
      }
      return Promise.reject(error);
    },
  );

  return _client;
}

export function getApiClient(): AxiosInstance {
  if (!_client) throw new Error('API client not initialized. Call createApiClient() in bootstrap.');
  return _client;
}

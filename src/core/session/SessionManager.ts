import { AppState, AppStateStatus } from 'react-native';

interface SessionConfig {
  timeoutMs: number;
  onTimeout: () => void;
}

export class SessionManager {
  private static _instance: SessionManager;
  static getInstance() {
    if (!SessionManager._instance) SessionManager._instance = new SessionManager();
    return SessionManager._instance;
  }

  private timer: ReturnType<typeof setTimeout> | null = null;
  private lastActiveAt: number = Date.now();
  private config: SessionConfig = { timeoutMs: 300_000, onTimeout: () => {} };
  private subscription: any = null;

  configure(config: SessionConfig) {
    this.config = config;
    this.subscription?.remove();
    this.subscription = AppState.addEventListener('change', this.onAppStateChange);
    this.resetTimer();
  }

  touch() {
    this.lastActiveAt = Date.now();
    this.resetTimer();
  }

  destroy() {
    if (this.timer) clearTimeout(this.timer);
    this.subscription?.remove();
  }

  private resetTimer() {
    if (this.timer) clearTimeout(this.timer);
    this.timer = setTimeout(() => this.config.onTimeout(), this.config.timeoutMs);
  }

  private onAppStateChange = (state: AppStateStatus) => {
    if (state === 'active') {
      const idle = Date.now() - this.lastActiveAt;
      if (idle >= this.config.timeoutMs) {
        this.config.onTimeout();
      } else {
        this.resetTimer();
      }
    } else {
      if (this.timer) clearTimeout(this.timer);
    }
  };
}

export const sessionManager = SessionManager.getInstance();

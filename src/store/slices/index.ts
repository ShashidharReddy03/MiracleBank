import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserProfile, AuthTokens, BankAccount, Transaction } from '../../types/banking';
import { MFNotification } from '../../notifications/NotificationManager';

// ── Auth Slice ────────────────────────────────────────────────────────────────

interface AuthState {
  isAuthenticated: boolean;
  user:            UserProfile | null;
  tokens:          AuthTokens  | null;
  biometricEnabled: boolean;
}

export const authSlice = createSlice({
  name: 'auth',
  initialState: { isAuthenticated: false, user: null, tokens: null, biometricEnabled: false } as AuthState,
  reducers: {
    loginSuccess(state, action: PayloadAction<{ user: UserProfile; tokens: AuthTokens }>) {
      state.isAuthenticated = true;
      state.user   = action.payload.user;
      state.tokens = action.payload.tokens;
    },
    logout() {
      return { isAuthenticated: false, user: null, tokens: null, biometricEnabled: false };
    },
    setBiometricEnabled(state, a: PayloadAction<boolean>) { state.biometricEnabled = a.payload; },
    updateTokens(state, a: PayloadAction<AuthTokens>)     { state.tokens = a.payload; },
  },
});
export const { loginSuccess, logout, setBiometricEnabled, updateTokens } = authSlice.actions;

// ── Account Slice ─────────────────────────────────────────────────────────────

interface AccountState {
  accounts:          BankAccount[];
  selectedAccountId: string | null;
  loading:           boolean;
  error:             string | null;
}

export const accountSlice = createSlice({
  name: 'accounts',
  initialState: { accounts: [], selectedAccountId: null, loading: false, error: null } as AccountState,
  reducers: {
    fetchStart(state)  { state.loading = true; state.error = null; },
    fetchSuccess(state, a: PayloadAction<BankAccount[]>) {
      state.accounts = a.payload;
      state.loading  = false;
      if (!state.selectedAccountId && a.payload.length > 0) {
        state.selectedAccountId = a.payload.find((x) => x.isDefault)?.id ?? a.payload[0].id;
      }
    },
    fetchFail(state, a: PayloadAction<string>) { state.loading = false; state.error = a.payload; },
    selectAccount(state, a: PayloadAction<string>) { state.selectedAccountId = a.payload; },
  },
});
export const { fetchStart, fetchSuccess, fetchFail, selectAccount } = accountSlice.actions;

// ── Transaction Slice ─────────────────────────────────────────────────────────

interface TransactionState {
  transactions: Transaction[];
  loading:      boolean;
  hasMore:      boolean;
  page:         number;
}

export const transactionSlice = createSlice({
  name: 'transactions',
  initialState: { transactions: [], loading: false, hasMore: true, page: 1 } as TransactionState,
  reducers: {
    txFetchStart(state) { state.loading = true; },
    txFetchSuccess(state, a: PayloadAction<{ items: Transaction[]; hasMore: boolean; page: number }>) {
      state.transactions = a.payload.page === 1 ? a.payload.items : [...state.transactions, ...a.payload.items];
      state.hasMore = a.payload.hasMore;
      state.page    = a.payload.page;
      state.loading = false;
    },
    prependTx(state, a: PayloadAction<Transaction>) {
      state.transactions = [a.payload, ...state.transactions];
    },
    resetTx() { return { transactions: [], loading: false, hasMore: true, page: 1 }; },
  },
});
export const { txFetchStart, txFetchSuccess, prependTx, resetTx } = transactionSlice.actions;

// ── Notification Slice ────────────────────────────────────────────────────────

interface NotificationState {
  notifications: MFNotification[];
  unreadCount:   number;
  fcmToken:      string | null;
}

export const notificationSlice = createSlice({
  name: 'notifications',
  initialState: { notifications: [], unreadCount: 0, fcmToken: null } as NotificationState,
  reducers: {
    addNotification(state, a: PayloadAction<MFNotification>) {
      state.notifications = [a.payload, ...state.notifications];
      state.unreadCount  += 1;
    },
    markAllRead(state)                            { state.unreadCount = 0; },
    setFcmToken(state, a: PayloadAction<string>)  { state.fcmToken = a.payload; },
  },
});
export const { addNotification, markAllRead, setFcmToken } = notificationSlice.actions;

// ── Session Slice — see sessionSlice.ts (contains securityBlocked) ─────────────
// DO NOT define sessionSlice here — it is defined in sessionSlice.ts

// ─── Auth ─────────────────────────────────────────────────────────────────────

export interface AuthTokens {
  accessToken:  string;
  refreshToken: string;
  expiresAt:    number; // Unix timestamp (seconds)
  tokenType:    string;
}

// ─── User ─────────────────────────────────────────────────────────────────────

export interface UserProfile {
  id:        string;
  firstName: string;
  lastName:  string;
  email:     string;
  phone:     string;
  kycStatus: 'PENDING' | 'VERIFIED' | 'REJECTED';
  accounts:  BankAccount[];
}

// ─── Accounts ─────────────────────────────────────────────────────────────────

export interface Money {
  amount:   number;
  currency: string;
}

export interface BankAccount {
  id:               string;
  accountNumber:    string;
  iban?:            string;
  accountType:      'SAVINGS' | 'CURRENT' | 'FIXED_DEPOSIT' | 'WALLET';
  balance:          Money;
  availableBalance: Money;
  bankName?:        string;
  nickname?:        string;
  isDefault:        boolean;
}

// ─── Transactions ─────────────────────────────────────────────────────────────

export interface Transaction {
  id:          string;
  type:        'CREDIT' | 'DEBIT';
  amount:      Money;
  narration:   string;
  reference:   string;
  status:      'PENDING' | 'SUCCESS' | 'FAILED' | 'REVERSED';
  channel:     string;
  createdAt:   string;
  accountId:   string;
}

// ─── Transfer ────────────────────────────────────────────────────────────────

export interface FundTransferRequest {
  fromAccountId:  string;
  toAccountId?:   string;
  toIban?:        string;
  toBankCode?:    string;
  toAccountName:  string;
  amount:         number;
  currency:       string;
  narration:      string;
  otp?:           string;
  transactionPin?: string;
}

export interface FundTransferResponse {
  transactionId: string;
  reference:     string;
  status:        'PENDING' | 'SUCCESS' | 'FAILED';
  message:       string;
}

// ─── API Wrappers ─────────────────────────────────────────────────────────────

export interface ApiResponse<T> {
  success:   boolean;
  data:      T;
  message?:  string;
  code?:     string;
  timestamp: string;
}

export interface PaginatedResponse<T> {
  items:    T[];
  total:    number;
  page:     number;
  pageSize: number;
  hasMore:  boolean;
}

export type BankAccountSummary = {
  accountNumber: string;
  holderName: string;
  accountType: string;
  userId: string;
  currency: string;
};

export const ACCOUNT_OPTIONS: BankAccountSummary[] = [
  {
    accountNumber: '917981976686',
    holderName: 'Shashidhar Reddy',
    accountType: 'Savings Account',
    userId: '917981976686',
    currency: 'USD',
  },
];

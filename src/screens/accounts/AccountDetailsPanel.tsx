import React, { useState } from 'react';
import { Pressable, Share, StyleSheet, Text, View } from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { CreditCard, DollarSign, Hash, Info, Share2, User, Wallet } from 'lucide-react-native';
import { MFCard } from '../../ui-kit/components/cards/MFCard';
import { MFDialog } from '../../ui-kit/components/modals/MFModals';
import { AccountPicker } from './AccountPicker';
import { ACCOUNT_OPTIONS, BankAccountSummary } from './accountData';

const PRIMARY = '#14B8A6';

type DetailsForm = {
  accountNumber: string;
};

const ROWS: {
  key: keyof BankAccountSummary;
  label: string;
  icon: typeof User;
}[] = [
  { key: 'holderName', label: 'ACCOUNT HOLDER', icon: User },
  { key: 'accountNumber', label: 'ACCOUNT NUMBER', icon: CreditCard },
  { key: 'accountType', label: 'ACCOUNT TYPE', icon: Wallet },
  { key: 'userId', label: 'CUSTOMER/USER ID', icon: Hash },
  { key: 'currency', label: 'CURRENCY', icon: DollarSign },
];

export function AccountDetailsPanel() {
  const [infoOpen, setInfoOpen] = useState(false);
  const { control, watch } = useForm<DetailsForm>({
    defaultValues: { accountNumber: ACCOUNT_OPTIONS[0].accountNumber },
  });
  const accountNumber = watch('accountNumber');
  const account =
    ACCOUNT_OPTIONS.find(item => item.accountNumber === accountNumber) ??
    ACCOUNT_OPTIONS[0];

  const shareDetails = () => {
    Share.share({
      message: [
        `Account holder: ${account.holderName}`,
        `Account number: ${account.accountNumber}`,
        `Account type: ${account.accountType}`,
        `Customer/User ID: ${account.userId}`,
        `Currency: ${account.currency}`,
      ].join('\n'),
    });
  };

  return (
    <View style={styles.wrap}>
      <MFCard elevated={false} style={styles.selectorCard}>
        <Controller
          control={control}
          name="accountNumber"
          render={({ field: { value, onChange } }) => (
            <AccountPicker value={value} onChange={onChange} />
          )}
        />
        <View style={styles.tools}>
          <Pressable onPress={() => setInfoOpen(true)} hitSlop={8}>
            <Info size={18} color={PRIMARY} strokeWidth={2.2} />
          </Pressable>
          <Pressable onPress={shareDetails} hitSlop={8}>
            <Share2 size={18} color={PRIMARY} strokeWidth={2.2} />
          </Pressable>
        </View>
      </MFCard>

      {ROWS.map(row => {
        const Icon = row.icon;
        return (
          <MFCard key={row.key} elevated={false} style={styles.detailCard}>
            <View style={styles.iconBox}>
              <Icon size={18} color={PRIMARY} strokeWidth={2.2} />
            </View>
            <View style={styles.detailText}>
              <Text style={styles.detailLabel}>{row.label}</Text>
              <Text style={styles.detailValue}>{account[row.key]}</Text>
            </View>
          </MFCard>
        );
      })}

      <MFDialog
        visible={infoOpen}
        title="Account details"
        message="These details identify the selected account. Share them only with people you trust."
        confirmLabel="OK"
        onConfirm={() => setInfoOpen(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: 16,
    gap: 10,
  },
  selectorCard: {
    padding: 12,
    marginBottom: 4,
  },
  tools: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 12,
    paddingLeft: 4,
  },
  detailCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: 14,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#E7F4F2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailText: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#9CA3AF',
    letterSpacing: 0.4,
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
});

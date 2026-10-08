import React, { useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { ChevronDown } from 'lucide-react-native';
import { ACCOUNT_OPTIONS, BankAccountSummary } from './accountData';

const PRIMARY = '#14B8A6';

type AccountPickerProps = {
  value: string;
  onChange: (accountNumber: string) => void;
};

export function AccountPicker({ value, onChange }: AccountPickerProps) {
  const [open, setOpen] = useState(false);
  const selected =
    ACCOUNT_OPTIONS.find(account => account.accountNumber === value) ??
    ACCOUNT_OPTIONS[0];

  const choose = (account: BankAccountSummary) => {
    onChange(account.accountNumber);
    setOpen(false);
  };

  return (
    <>
      <Pressable style={styles.selector} onPress={() => setOpen(true)}>
        <Text style={styles.selectorText}>{selected.accountNumber}</Text>
        <ChevronDown size={18} color={PRIMARY} strokeWidth={2.4} />
      </Pressable>

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable style={styles.overlay} onPress={() => setOpen(false)}>
          <Pressable style={styles.sheet}>
            <Text style={styles.sheetTitle}>Select account</Text>
            {ACCOUNT_OPTIONS.map(account => {
              const active = account.accountNumber === selected.accountNumber;
              return (
                <Pressable
                  key={account.accountNumber}
                  style={[styles.row, active && styles.rowActive]}
                  onPress={() => choose(account)}
                >
                  <Text style={styles.rowNumber}>{account.accountNumber}</Text>
                  <Text style={styles.rowType}>{account.accountType}</Text>
                </Pressable>
              );
            })}
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  selector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
    backgroundColor: '#fff',
  },
  selectorText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  sheet: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
  },
  sheetTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
  },
  row: {
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  rowActive: {
    backgroundColor: '#E7F4F2',
  },
  rowNumber: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },
  rowType: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
  },
});

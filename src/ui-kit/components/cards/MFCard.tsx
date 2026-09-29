import React from 'react';
import { View, Text, TouchableOpacity, ViewStyle } from 'react-native';
import { useTheme } from '../../../../src/ui-kit/theme/ThemeProvider';
import { BankAccount } from '../../../types/banking';

// ── MFCard ───────────────────────────────────────────────────────────────────

interface MFCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  elevated?: boolean;
  onPress?: () => void;
}

export function MFCard({ children, style, elevated = true, onPress }: MFCardProps) {
  const t = useTheme();
  const containerStyle: ViewStyle = {
    backgroundColor: t.colors.card,
    borderRadius: t.radius.lg,
    padding: t.spacing.md,
    ...(elevated ? (t.shadows.md as ViewStyle) : {}),
  };
  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={[containerStyle, style]}>
        {children}
      </TouchableOpacity>
    );
  }
  return <View style={[containerStyle, style]}>{children}</View>;
}

// ── MFAccountCard ─────────────────────────────────────────────────────────────

interface MFAccountCardProps {
  account: BankAccount;
  style?: ViewStyle;
  onPress?: () => void;
}

export function MFAccountCard({ account, style, onPress }: MFAccountCardProps) {
  const t = useTheme();
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={onPress ? 0.9 : 1}
      style={[{
        backgroundColor: t.colors.primary,
        borderRadius: t.radius.xl,
        padding: t.spacing.lg,
        ...(t.shadows.lg as ViewStyle),
        minHeight: 160,
        justifyContent: 'space-between',
      }, style]}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={{ color: 'rgba(84, 51, 51, 0.75)', fontSize: t.typography.fontSize.sm, fontFamily: t.typography.fontFamily.medium }}>
          {account.accountType}
        </Text>
        <Text style={{ color: 'rgba(255,255,255,0.75)', fontSize: t.typography.fontSize.sm }}>
          {account.bankName ?? ''}
        </Text>
      </View>

      <View>
        <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: t.typography.fontSize.sm, marginBottom: 4 }}>
          Available Balance
        </Text>
        <Text style={{ color: '#fff', fontSize: t.typography.fontSize.display, fontFamily: t.typography.fontFamily.bold }}>
          {account.availableBalance.currency}{' '}
          {account.availableBalance.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
        </Text>
      </View>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: t.typography.fontSize.sm, letterSpacing: 3 }}>
          ···· ···· ···· {account.accountNumber.slice(-4)}
        </Text>
        {account.isDefault && (
          <View style={{ backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: t.radius.full, paddingHorizontal: 10, paddingVertical: 3 }}>
            <Text style={{ color: '#fff', fontSize: t.typography.fontSize.xs }}>Default</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

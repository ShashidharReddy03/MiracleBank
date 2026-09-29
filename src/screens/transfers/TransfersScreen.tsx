import React, { useState } from 'react';
import { View } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { MFScreenWrapper } from '../../ui-kit/layouts/MFScreenWrapper';
import { MFInput }         from '../../ui-kit/components/inputs/MFInput';
import { MFButton }        from '../../ui-kit/components/buttons/MFButton';
import { MFHeading }       from '../../ui-kit/components/typography/MFText';
import { MFText }          from '../../ui-kit/components/typography/MFText';
import { MFCard }          from '../../ui-kit/components/cards/MFCard';
import { MFDialog }        from '../../ui-kit/components/modals/MFModals';
import { useTheme }        from '../../ui-kit/theme/ThemeProvider';
import { RootState }       from '../../store/store';
import { FundTransferRequest } from '../../types/banking';

const schema = z.object({
  toAccountNumber: z.string().min(10, 'Enter a valid account number'),
  toAccountName:   z.string().min(2, 'Enter account name'),
  amount:          z.string().refine(v => !isNaN(Number(v)) && Number(v) > 0, 'Enter a valid amount'),
  narration:       z.string().min(3, 'Enter a narration').max(100),
});
type TransferForm = z.infer<typeof schema>;

export function TransfersScreen() {
  const t        = useTheme();
  const { t: tr} = useTranslation();
  const { accounts, selectedAccountId } = useSelector((s: RootState) => s.accounts);
  const selectedAccount = accounts.find(a => a.id === selectedAccountId) ?? accounts[0];
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [pending, setPending]   = useState<TransferForm | null>(null);

  const { control, handleSubmit, reset, formState: { errors } } = useForm<TransferForm>({ resolver: zodResolver(schema) });

  const onSubmit = (data: TransferForm) => { setPending(data); setConfirmVisible(true); };

  const handleConfirm = async () => {
    if (!pending) return;
    setLoading(true);
    setConfirmVisible(false);
    try {
      // await transferService.initiate(payload);
      reset();
    } finally { setLoading(false); }
  };

  return (
    <MFScreenWrapper scrollable keyboardAvoiding>
      <MFHeading level={2} style={{ marginBottom: t.spacing.lg }}>{tr('transfers.title')}</MFHeading>

      {selectedAccount && (
        <MFCard style={{ marginBottom: t.spacing.lg, backgroundColor: t.colors.primaryLight }}>
          <MFText variant="sm" color="secondary" weight="medium">{tr('transfers.from')}</MFText>
          <MFText variant="lg" weight="bold" style={{ marginTop: 4 }}>{selectedAccount.accountType}</MFText>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 }}>
            <MFText variant="sm" color="secondary">···· {selectedAccount.accountNumber.slice(-4)}</MFText>
            <MFText variant="sm" weight="semiBold" color="primary">
              {tr('transfers.balance')}: {selectedAccount.availableBalance.currency} {selectedAccount.availableBalance.amount.toLocaleString()}
            </MFText>
          </View>
        </MFCard>
      )}

      <Controller control={control} name="toAccountNumber"
        render={({ field: { onChange, value } }) => (
          <MFInput label={tr('transfers.accountNum')} placeholder="0123456789" keyboardType="number-pad" value={value} onChangeText={onChange} error={errors.toAccountNumber?.message} />
        )}
      />
      <Controller control={control} name="toAccountName"
        render={({ field: { onChange, value } }) => (
          <MFInput label={tr('transfers.accountName')} placeholder="John Doe" value={value} onChangeText={onChange} error={errors.toAccountName?.message} />
        )}
      />
      <Controller control={control} name="amount"
        render={({ field: { onChange, value } }) => (
          <MFInput label={tr('transfers.amount')} placeholder="0.00" keyboardType="decimal-pad" value={value} onChangeText={onChange} error={errors.amount?.message} />
        )}
      />
      <Controller control={control} name="narration"
        render={({ field: { onChange, value } }) => (
          <MFInput label={tr('transfers.narration')} placeholder="Payment for..." value={value} onChangeText={onChange} error={errors.narration?.message} />
        )}
      />

      <MFButton label={tr('transfers.proceed')} onPress={handleSubmit(onSubmit)} loading={loading} style={{ marginTop: t.spacing.sm }} />

      <MFDialog
        visible={confirmVisible}
        title={tr('transfers.confirmTitle')}
        message={tr('transfers.confirmMsg', {
          currency: selectedAccount?.balance.currency ?? '',
          amount:   pending?.amount ?? '',
          name:     pending?.toAccountName ?? '',
          narration:pending?.narration ?? '',
        })}
        confirmLabel={tr('transfers.transferNow')}
        cancelLabel={tr('common.cancel')}
        onConfirm={handleConfirm}
        onCancel={() => setConfirmVisible(false)}
        loading={loading}
      />
    </MFScreenWrapper>
  );
}

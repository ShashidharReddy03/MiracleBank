import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Calendar, Clock3, FileText } from 'lucide-react-native';
import { MFButton } from '../../ui-kit/components/buttons/MFButton';
import { MFInput } from '../../ui-kit/components/inputs/MFInput';
import { MFDialog } from '../../ui-kit/components/modals/MFModals';
import { AccountPicker } from './AccountPicker';
import { ACCOUNT_OPTIONS } from './accountData';

const PRIMARY = '#14B8A6';
const DATE_PATTERN = /^(0[1-9]|[12]\d|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;

const PERIODS = ['15', '30', '45', '60'] as const;
const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'income', label: 'Income' },
  { key: 'expenses', label: 'Expenses' },
] as const;

const schema = z
  .object({
    accountNumber: z.string().min(1, 'Select an account'),
    filter: z.enum(['all', 'income', 'expenses']),
    mode: z.enum(['period', 'range']),
    period: z.enum(PERIODS).optional(),
    fromDate: z.string().optional(),
    toDate: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.mode === 'period' && !data.period) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Select a period',
        path: ['period'],
      });
    }

    if (data.mode !== 'range') {
      return;
    }

    if (!data.fromDate || !DATE_PATTERN.test(data.fromDate)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Enter a from date as DD/MM/YYYY',
        path: ['fromDate'],
      });
    }

    if (!data.toDate || !DATE_PATTERN.test(data.toDate)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Enter a to date as DD/MM/YYYY',
        path: ['toDate'],
      });
    }

    if (
      data.fromDate &&
      data.toDate &&
      DATE_PATTERN.test(data.fromDate) &&
      DATE_PATTERN.test(data.toDate) &&
      parseDate(data.fromDate) > parseDate(data.toDate)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'From date must be before the to date',
        path: ['toDate'],
      });
    }
  });

type StatementForm = z.infer<typeof schema>;
type Notice = { title: string; message: string } | null;

function parseDate(value: string) {
  const [day, month, year] = value.split('/').map(Number);
  return new Date(year, month - 1, day).getTime();
}

export function FullStatementPanel() {
  const [viewed, setViewed] = useState(false);
  const [notice, setNotice] = useState<Notice>(null);
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<StatementForm>({
    resolver: zodResolver(schema),
    defaultValues: {
      accountNumber: ACCOUNT_OPTIONS[0].accountNumber,
      filter: 'all',
      mode: 'period',
      period: '15',
      fromDate: '',
      toDate: '',
    },
  });

  const mode = watch('mode');
  const filter = watch('filter');
  const period = watch('period');

  const onView = handleSubmit(() => {
    setViewed(true);
  });

  const onDownload = handleSubmit(() => {
    setNotice({
      title: 'Download statement',
      message: 'Your statement file is ready to download.',
    });
  });

  const onEmail = handleSubmit(() => {
    setNotice({
      title: 'Email statement',
      message: 'The statement will be sent to your registered email.',
    });
  });

  return (
    <View>
      <View style={styles.card}>
        <Controller
          control={control}
          name="accountNumber"
          render={({ field: { value, onChange } }) => (
            <AccountPicker value={value} onChange={onChange} />
          )}
        />
        {errors.accountNumber?.message ? (
          <Text style={styles.error}>{errors.accountNumber.message}</Text>
        ) : null}

        <View style={styles.filterRow}>
          {FILTERS.map(item => {
            const active = filter === item.key;
            return (
              <Pressable
                key={item.key}
                style={[styles.filterChip, active && styles.filterChipActive]}
                onPress={() => setValue('filter', item.key, { shouldValidate: true })}
              >
                <Text style={[styles.filterLabel, active && styles.filterLabelActive]}>
                  {item.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.prompt}>Please select the statement type:</Text>

        <View style={styles.modeRow}>
          <Pressable
            style={[styles.modeChip, mode === 'period' && styles.modeChipActive]}
            onPress={() => setValue('mode', 'period', { shouldValidate: true })}
          >
            <Clock3 size={16} color={mode === 'period' ? '#fff' : '#6B7280'} />
            <Text style={[styles.modeLabel, mode === 'period' && styles.modeLabelActive]}>
              Period
            </Text>
          </Pressable>
          <Pressable
            style={[styles.modeChip, mode === 'range' && styles.modeChipActive]}
            onPress={() => setValue('mode', 'range', { shouldValidate: true })}
          >
            <Calendar size={16} color={mode === 'range' ? '#fff' : '#6B7280'} />
            <Text style={[styles.modeLabel, mode === 'range' && styles.modeLabelActive]}>
              Date Range
            </Text>
          </Pressable>
        </View>

        {mode === 'period' ? (
          <View>
            <View style={styles.periodRow}>
              {PERIODS.map(days => {
                const active = period === days;
                return (
                  <Pressable
                    key={days}
                    style={[styles.periodChip, active && styles.periodChipActive]}
                    onPress={() => setValue('period', days, { shouldValidate: true })}
                  >
                    <Text style={[styles.periodLabel, active && styles.periodLabelActive]}>
                      {days} Days
                    </Text>
                  </Pressable>
                );
              })}
            </View>
            {errors.period?.message ? (
              <Text style={styles.error}>{errors.period.message}</Text>
            ) : null}
          </View>
        ) : (
          <View style={styles.dateFields}>
            <Controller
              control={control}
              name="fromDate"
              render={({ field: { value, onChange, onBlur } }) => (
                <MFInput
                  label="From date"
                  placeholder="DD/MM/YYYY"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.fromDate?.message}
                />
              )}
            />
            <Controller
              control={control}
              name="toDate"
              render={({ field: { value, onChange, onBlur } }) => (
                <MFInput
                  label="To date"
                  placeholder="DD/MM/YYYY"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.toDate?.message}
                />
              )}
            />
          </View>
        )}

        <View style={styles.actions}>
          <MFButton
            label="View"
            onPress={onView}
            size="sm"
            fullWidth={false}
            style={styles.viewButton}
            testID="view-statement"
          />
          <MFButton
            label="Download"
            onPress={onDownload}
            variant="outline"
            size="sm"
            fullWidth={false}
            style={styles.outlineButton}
            testID="download-statement"
          />
          <MFButton
            label="Email"
            onPress={onEmail}
            variant="outline"
            size="sm"
            fullWidth={false}
            style={styles.outlineButton}
            testID="email-statement"
          />
        </View>
      </View>

      <View style={styles.empty}>
        <View style={styles.emptyIcon}>
          <FileText size={36} color={PRIMARY} strokeWidth={1.8} />
        </View>
        <Text style={styles.emptyTitle}>No Transactions Found</Text>
        <Text style={styles.emptyBody}>
          {viewed
            ? 'No transactions found for the selected criteria'
            : 'Select a period or date range and click "View" to see your transactions'}
        </Text>
      </View>

      <MFDialog
        visible={!!notice}
        title={notice?.title ?? ''}
        message={notice?.message ?? ''}
        confirmLabel="OK"
        onConfirm={() => setNotice(null)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginBottom: 12,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 14,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    backgroundColor: '#fff',
  },
  filterChipActive: {
    backgroundColor: PRIMARY,
    borderColor: PRIMARY,
  },
  filterLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
  },
  filterLabelActive: { color: '#fff' },
  prompt: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  modeRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },
  modeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#F3F4F6',
  },
  modeChipActive: {
    backgroundColor: PRIMARY,
    borderColor: PRIMARY,
  },
  modeLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
  },
  modeLabelActive: { color: '#fff' },
  periodRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  periodChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
  },
  periodChipActive: {
    backgroundColor: '#D8F5F1',
  },
  periodLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
  },
  periodLabelActive: { color: PRIMARY },
  dateFields: {
    marginTop: 4,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 14,
  },
  viewButton: {
    flex: 1,
    backgroundColor: PRIMARY,
  },
  outlineButton: {
    flex: 1,
    backgroundColor: '#fff',
  },
  error: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: 6,
  },
  empty: {
    alignItems: 'center',
    paddingHorizontal: 28,
    paddingTop: 28,
  },
  emptyIcon: {
    width: 72,
    height: 72,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyBody: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
  },
});

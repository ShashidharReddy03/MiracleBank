import React, { useState } from 'react';
import { Pressable, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Calendar, CreditCard, User } from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';
import { MFButton } from '../../ui-kit/components/buttons/MFButton';
import { MFInput } from '../../ui-kit/components/inputs/MFInput';
import { MFDialog } from '../../ui-kit/components/modals/MFModals';
import { BankHeader } from '../common/BankHeader';

const PRIMARY = '#14B8A6';
const BG = '#F7FBFB';

const schema = z.object({
  amount: z
    .string()
    .trim()
    .min(1, 'Amount is required')
    .refine(value => Number(value) > 0, 'Enter an amount greater than 0'),
  name: z
    .string()
    .trim()
    .min(2, 'Enter the name printed on the card')
    .regex(/^[A-Za-z\s'.-]+$/, 'Enter a valid name'),
  cardNumber: z
    .string()
    .trim()
    .refine(value => value.replace(/\D/g, '').length === 16, 'Enter a 16-digit card number'),
  expiryMonth: z
    .string()
    .trim()
    .regex(/^(0[1-9]|1[0-2])$/, 'Enter a month from 01 to 12'),
  expiryYear: z
    .string()
    .trim()
    .regex(/^\d{4}$/, 'Enter a 4-digit year')
    .refine(value => Number(value) >= new Date().getFullYear(), 'Card year has passed'),
});

type AddMoneyForm = z.infer<typeof schema>;
type Step = 1 | 2 | 3;

const STEPS = [
  { id: 1, label: 'Amount' },
  { id: 2, label: 'Verify Card' },
  { id: 3, label: 'Confirm' },
] as const;

function formatCard(value: string) {
  return value
    .replace(/\D/g, '')
    .slice(0, 16)
    .replace(/(\d{4})(?=\d)/g, '$1 ')
    .trim();
}

export function AddMoneyScreen() {
  const insets = useSafeAreaInsets();
  const [step, setStep] = useState<Step>(1);
  const [done, setDone] = useState(false);
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<AddMoneyForm>({
    resolver: zodResolver(schema),
    defaultValues: {
      amount: '',
      name: '',
      cardNumber: '',
      expiryMonth: '',
      expiryYear: '',
    },
  });

  const name = watch('name');
  const cardNumber = watch('cardNumber');
  const expiryMonth = watch('expiryMonth');
  const expiryYear = watch('expiryYear');
  const amount = watch('amount');
  const masked = cardNumber.replace(/\d(?=\d{4})/g, '•');

  const goNext = handleSubmit(() => {
    setStep(2);
  });

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" backgroundColor={PRIMARY} />
      <BankHeader title="Add Money" />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.stepper}>
          {STEPS.map((item, index) => {
            const active = step === item.id;
            return (
              <React.Fragment key={item.id}>
                <View style={styles.stepItem}>
                  <View style={[styles.stepCircle, active && styles.stepCircleActive]}>
                    <Text style={[styles.stepNumber, active && styles.stepNumberActive]}>
                      {item.id}
                    </Text>
                  </View>
                  <Text style={[styles.stepLabel, active && styles.stepLabelActive]}>
                    {item.label}
                  </Text>
                </View>
                {index < STEPS.length - 1 ? <View style={styles.stepLine} /> : null}
              </React.Fragment>
            );
          })}
        </View>

        <LinearGradient colors={['#12A89F', '#0E918A']} style={styles.card}>
          <View style={styles.chip} />
          <Text style={styles.cardBrand}>CARD</Text>
          <Text style={styles.cardNumber}>{masked || '•••• •••• •••• ••••'}</Text>
          <View style={styles.cardFooter}>
            <Text style={styles.cardMeta}>{name || 'YOUR NAME'}</Text>
            <Text style={styles.cardMeta}>
              {expiryMonth || 'MM'}/{expiryYear ? expiryYear.slice(-2) : 'YYYY'}
            </Text>
          </View>
        </LinearGradient>

        {step === 1 && (
          <View>
            <Controller
              control={control}
              name="amount"
              render={({ field: { value, onChange, onBlur } }) => (
                <MFInput
                  label="Amount To Add *"
                  placeholder="Enter Amount"
                  keyboardType="decimal-pad"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.amount?.message}
                />
              )}
            />
            <Controller
              control={control}
              name="name"
              render={({ field: { value, onChange, onBlur } }) => (
                <MFInput
                  label="Name On Card *"
                  placeholder="As Printed On Card"
                  autoCapitalize="words"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.name?.message}
                  leftIcon={<User size={16} color="#6B7280" />}
                />
              )}
            />
            <Controller
              control={control}
              name="cardNumber"
              render={({ field: { value, onChange, onBlur } }) => (
                <MFInput
                  label="Card Number *"
                  placeholder="1234 5678 9012 3456"
                  keyboardType="number-pad"
                  value={value}
                  onChangeText={text => onChange(formatCard(text))}
                  onBlur={onBlur}
                  error={errors.cardNumber?.message}
                  leftIcon={<CreditCard size={16} color="#6B7280" />}
                />
              )}
            />
            <Controller
              control={control}
              name="expiryMonth"
              render={({ field: { value, onChange, onBlur } }) => (
                <MFInput
                  label="Expiry Month *"
                  placeholder="MM"
                  keyboardType="number-pad"
                  maxLength={2}
                  value={value}
                  onChangeText={text => onChange(text.replace(/\D/g, '').slice(0, 2))}
                  onBlur={onBlur}
                  error={errors.expiryMonth?.message}
                  leftIcon={<Calendar size={16} color="#6B7280" />}
                />
              )}
            />
            <Controller
              control={control}
              name="expiryYear"
              render={({ field: { value, onChange, onBlur } }) => (
                <MFInput
                  label="Expiry Year *"
                  placeholder="YYYY"
                  keyboardType="number-pad"
                  maxLength={4}
                  value={value}
                  onChangeText={text => onChange(text.replace(/\D/g, '').slice(0, 4))}
                  onBlur={onBlur}
                  error={errors.expiryYear?.message}
                  leftIcon={<Calendar size={16} color="#6B7280" />}
                />
              )}
            />
            <MFButton label="Proceed" onPress={goNext} testID="add-money-proceed" />
          </View>
        )}

        {step === 2 && (
          <View style={styles.panel}>
            <Text style={styles.panelTitle}>Verify Card</Text>
            <Text style={styles.panelLine}>Name: {name}</Text>
            <Text style={styles.panelLine}>Card: {masked}</Text>
            <Text style={styles.panelLine}>
              Expiry: {expiryMonth}/{expiryYear}
            </Text>
            <MFButton label="Verify" onPress={() => setStep(3)} testID="verify-card" />
            <Pressable onPress={() => setStep(1)}>
              <Text style={styles.link}>Edit details</Text>
            </Pressable>
          </View>
        )}

        {step === 3 && (
          <View style={styles.panel}>
            <Text style={styles.panelTitle}>Confirm</Text>
            <Text style={styles.panelLine}>Amount: {amount}</Text>
            <Text style={styles.panelLine}>Card ending {cardNumber.replace(/\D/g, '').slice(-4)}</Text>
            <MFButton
              label="Confirm"
              onPress={() => setDone(true)}
              testID="confirm-add-money"
            />
          </View>
        )}
      </ScrollView>

      <MFDialog
        visible={done}
        title="Money added"
        message={`Amount ${amount} was submitted from the card ending ${cardNumber.replace(/\D/g, '').slice(-4)}.`}
        confirmLabel="OK"
        onConfirm={() => setDone(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: PRIMARY },
  scroll: { flex: 1, backgroundColor: BG },
  content: { padding: 16, paddingBottom: 32 },
  stepper: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginBottom: 16,
  },
  stepItem: { alignItems: 'center', width: 78 },
  stepCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepCircleActive: { backgroundColor: PRIMARY },
  stepNumber: { color: '#6B7280', fontWeight: '700' },
  stepNumberActive: { color: '#fff' },
  stepLabel: { marginTop: 6, fontSize: 12, color: '#6B7280', textAlign: 'center' },
  stepLabelActive: { color: '#111827', fontWeight: '700' },
  stepLine: {
    width: 36,
    height: 2,
    backgroundColor: '#D1D5DB',
    marginTop: 13,
  },
  card: {
    borderRadius: 16,
    minHeight: 170,
    padding: 18,
    marginBottom: 18,
  },
  chip: {
    width: 36,
    height: 26,
    borderRadius: 6,
    backgroundColor: '#E8C56B',
  },
  cardBrand: {
    position: 'absolute',
    top: 18,
    right: 18,
    color: 'rgba(255,255,255,0.85)',
    fontWeight: '700',
    letterSpacing: 1,
  },
  cardNumber: {
    marginTop: 28,
    color: '#fff',
    fontSize: 18,
    letterSpacing: 2,
    fontWeight: '600',
  },
  cardFooter: {
    marginTop: 22,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardMeta: { color: '#fff', fontWeight: '700', letterSpacing: 0.4 },
  panel: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    gap: 8,
  },
  panelTitle: { fontSize: 18, fontWeight: '700', color: '#111827', marginBottom: 8 },
  panelLine: { fontSize: 15, color: '#374151', marginBottom: 6 },
  link: { textAlign: 'center', color: PRIMARY, fontWeight: '600', marginTop: 8 },
});

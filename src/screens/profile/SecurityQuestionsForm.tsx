import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { MFButton } from '../../ui-kit/components/buttons/MFButton';
import { MFInput } from '../../ui-kit/components/inputs/MFInput';
import { MFDialog } from '../../ui-kit/components/modals/MFModals';

const PRIMARY = '#14B8A6';
const MINT = '#E7F4F2';

const GROUPS = [
  {
    title: 'Select First Security Question',
    question: 'firstQuestion',
    answer: 'firstAnswer',
    options: ['What is your nick name?', 'What is your shoe size?'],
  },
  {
    title: 'Select Second Security Question',
    question: 'secondQuestion',
    answer: 'secondAnswer',
    options: ['What is your village name?', 'What is your age?'],
  },
  {
    title: 'Select Third Security Question',
    question: 'thirdQuestion',
    answer: 'thirdAnswer',
    options: ["What is your mother's maiden name?", 'What is your first school name?'],
  },
] as const;

const schema = z.object({
  firstQuestion: z.string().min(1, 'Select a security question'),
  firstAnswer: z.string().trim().min(2, 'Enter your answer'),
  secondQuestion: z.string().min(1, 'Select a security question'),
  secondAnswer: z.string().trim().min(2, 'Enter your answer'),
  thirdQuestion: z.string().min(1, 'Select a security question'),
  thirdAnswer: z.string().trim().min(2, 'Enter your answer'),
});

type SecurityForm = z.infer<typeof schema>;

export function SecurityQuestionsForm() {
  const [saved, setSaved] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SecurityForm>({
    resolver: zodResolver(schema),
    defaultValues: {
      firstQuestion: '',
      firstAnswer: '',
      secondQuestion: '',
      secondAnswer: '',
      thirdQuestion: '',
      thirdAnswer: '',
    },
  });

  const onSubmit = async (_data: SecurityForm) => {
    setSaved(true);
  };

  return (
    <View style={styles.wrap}>
      {GROUPS.map(group => (
        <View key={group.question} style={styles.group}>
          <Text style={styles.heading}>{group.title}</Text>

          <Controller
            control={control}
            name={group.question}
            render={({ field: { value, onChange } }) => (
              <View>
                {group.options.map(option => {
                  const selected = value === option;
                  return (
                    <Pressable
                      key={option}
                      onPress={() => onChange(option)}
                      style={styles.option}
                    >
                      <View style={[styles.radio, selected && styles.radioSelected]}>
                        {selected ? <View style={styles.radioDot} /> : null}
                      </View>
                      <Text style={styles.optionText}>{option}</Text>
                    </Pressable>
                  );
                })}
                {errors[group.question]?.message ? (
                  <Text style={styles.error}>{errors[group.question]?.message}</Text>
                ) : null}
              </View>
            )}
          />

          <Controller
            control={control}
            name={group.answer}
            render={({ field: { value, onChange, onBlur } }) => (
              <MFInput
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder="Enter your answer"
                error={errors[group.answer]?.message}
                containerStyle={styles.answer}
              />
            )}
          />
        </View>
      ))}

      <MFButton
        label="Save"
        onPress={handleSubmit(onSubmit)}
        loading={isSubmitting}
        testID="save-security-questions"
      />

      <MFDialog
        visible={saved}
        title="Security questions saved"
        message="Your security questions have been updated."
        confirmLabel="OK"
        onConfirm={() => setSaved(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: 16,
  },
  group: {
    marginBottom: 8,
  },
  heading: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: MINT,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 14,
    marginBottom: 10,
    gap: 12,
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: '#9CA3AF',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  radioSelected: {
    borderColor: PRIMARY,
  },
  radioDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: PRIMARY,
  },
  optionText: {
    flex: 1,
    fontSize: 15,
    color: '#1F2937',
  },
  answer: {
    marginTop: 2,
    marginBottom: 8,
  },
  error: {
    color: '#EF4444',
    fontSize: 12,
    marginBottom: 8,
    marginTop: -4,
  },
});

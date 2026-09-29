import React, { useRef, useState } from 'react';
import { View, TextInput } from 'react-native';
import { useTheme } from '../../../../src/ui-kit/theme/ThemeProvider';

interface MFOTPInputProps {
  length?: number;
  secure?: boolean;
  onComplete: (otp: string) => void;
  onChangeOTP?: (otp: string) => void;
}

export function MFOTPInput({ length = 6, secure = true, onComplete, onChangeOTP }: MFOTPInputProps) {
  const t = useTheme();
  const [values, setValues] = useState<string[]>(Array(length).fill(''));
  const refs = useRef<(TextInput | null)[]>([]);

  const handleChange = (text: string, index: number) => {
    const cleaned = text.replace(/[^0-9]/g, '').slice(-1);
    const next = [...values];
    next[index] = cleaned;
    setValues(next);

    const combined = next.join('');
    onChangeOTP?.(combined);

    if (cleaned && index < length - 1) refs.current[index + 1]?.focus();
    if (combined.length === length && !next.includes('')) onComplete(combined);
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === 'Backspace' && !values[index] && index > 0) {
      refs.current[index - 1]?.focus();
    }
  };

  return (
    <View style={{ flexDirection: 'row', gap: t.spacing.sm }}>
      {Array.from({ length }).map((_, i) => (
        <TextInput
          key={i}
          ref={(r) => { refs.current[i] = r; }}
          value={secure && values[i] ? '●' : values[i]}
          onChangeText={(txt) => handleChange(txt, i)}
          onKeyPress={(e) => handleKeyPress(e.nativeEvent.key, i)}
          keyboardType="number-pad"
          maxLength={secure ? 1 : 1}
          selectTextOnFocus
          style={{
            flex: 1, height: 56,
            borderRadius: t.radius.md,
            borderWidth: 1.5,
            borderColor: values[i] ? t.colors.primary : t.colors.border,
            textAlign: 'center',
            fontSize: secure ? 20 : t.typography.fontSize.xl,
            color: t.colors.text,
            backgroundColor: values[i] ? t.colors.primaryLight : t.colors.surface,
            fontFamily: t.typography.fontFamily.bold,
          }}
        />
      ))}
    </View>
  );
}

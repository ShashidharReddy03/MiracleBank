import React, {
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  I18nManager,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { LanguageContext } from '../../localization/LanguageContext';

interface OtpInputProps {
  length?: number;
  onVerify: (otp: string) => void;
  isLoading?: boolean;
  clearTrigger?: number;
}

const OtpInput = ({
  length = 5,
  onVerify,
  isLoading = false,
  clearTrigger = 0,
}: OtpInputProps) => {
  const inputs = useRef<Array<TextInput | null>>([]);

  const [otpDigits, setOtpDigits] = useState<string[]>(
    Array(length).fill(''),
  );
  const [error, setError] = useState('');

  const languageContext = useContext(LanguageContext);

  const translations =
    languageContext?.translations;

  const isRTL =
    languageContext?.language === 'ar';

  /**
   * Translation helper
   */
  const t = (
    key: string,
    fallback: string,
  ) => {
    try {
      if (!translations) {
        return fallback;
      }

      const keys = key.split('.');
      let value: unknown = translations;

      for (const k of keys) {
        if (
          typeof value === 'object' &&
          value !== null &&
          k in value
        ) {
          value = (
            value as Record<string, unknown>
          )[k];
        } else {
          return fallback;
        }
      }

      return typeof value === 'string'
        ? value
        : fallback;
    } catch {
      return fallback;
    }
  };

  /**
   * Clear OTP
   */
  useEffect(() => {
    if (clearTrigger > 0) {
      const emptyDigits =
        Array(length).fill('');

      setOtpDigits(emptyDigits);
      setError('');

      setTimeout(() => {
        if (isRTL) {
          inputs.current[
            length - 1
          ]?.focus();
        } else {
          inputs.current[0]?.focus();
        }
      }, 100);
    }
  }, [clearTrigger, length, isRTL]);

  /**
   * Update OTP
   */
  const updateOtpValueFromDigits = (
    digits: string[],
  ) => {
    return digits.join('');
  };

  /**
   * Handle digit change
   */
  const handleChange = (
    value: string,
    index: number,
  ) => {
    const digit = value
      .replace(/\D/g, '')
      .slice(-1);

    const newDigits = [...otpDigits];

    newDigits[index] = digit;

    setOtpDigits(newDigits);
    setError('');

    updateOtpValueFromDigits(newDigits);

    /**
     * Move focus
     */
    if (digit) {
      if (
        !isRTL &&
        index < length - 1
      ) {
        inputs.current[
          index + 1
        ]?.focus();
      }

      if (
        isRTL &&
        index > 0
      ) {
        inputs.current[
          index - 1
        ]?.focus();
      }
    }
  };

  /**
   * Handle backspace
   */
  const handleKeyPress = (
    event: any,
    index: number,
  ) => {
    if (
      event.nativeEvent.key !==
      'Backspace'
    ) {
      return;
    }

    const newDigits = [...otpDigits];

    /**
     * Current box has a digit
     */
    if (newDigits[index]) {
      newDigits[index] = '';

      setOtpDigits(newDigits);

      updateOtpValueFromDigits(
        newDigits,
      );

      return;
    }

    /**
     * Current box is empty.
     * Move to previous box.
     */
    const previousIndex = isRTL
      ? index + 1
      : index - 1;

    if (
      previousIndex >= 0 &&
      previousIndex < length
    ) {
      inputs.current[
        previousIndex
      ]?.focus();

      newDigits[
        previousIndex
      ] = '';

      setOtpDigits(newDigits);

      updateOtpValueFromDigits(
        newDigits,
      );
    }
  };

  /**
   * Verify OTP
   */
  const handleVerifyClick = () => {
    const finalOtp =
      updateOtpValueFromDigits(
        otpDigits,
      );

    if (
      finalOtp.length !== length ||
      otpDigits.includes('')
    ) {
      setError(
        t(
          'otp.errMessage',
          'Please enter a valid 5-digit OTP.',
        ),
      );
      return;
    }

    setError('');
    onVerify(finalOtp);
  };

  return (
    <View
      style={[
        styles.container,
        {
          direction: isRTL
            ? 'rtl'
            : 'ltr',
        },
      ]}
    >
      {/* OTP Boxes */}
      <View
        style={[
          styles.otpContainer,
          isRTL &&
            styles.otpContainerRTL,
        ]}
      >
        {Array.from({
          length,
        }).map((_, index) => (
          <TextInput
            key={index}
            ref={ref => {
              inputs.current[index] =
                ref;
            }}
            value={
              otpDigits[index]
                ? '•'
                : ''
            }
            onChangeText={value =>
              handleChange(
                value,
                index,
              )
            }
            onKeyPress={event =>
              handleKeyPress(
                event,
                index,
              )
            }
            keyboardType="number-pad"
            maxLength={1}
            editable={!isLoading}
            secureTextEntry={false}
            autoCorrect={false}
            autoComplete="off"
            textContentType="oneTimeCode"
            selectTextOnFocus
            style={[
              styles.otpInput,
              isLoading &&
                styles.disabledInput,
            ]}
          />
        ))}
      </View>

      {error ? (
        <Text style={styles.errorText}>
          {error}
        </Text>
      ) : null}

      {/* Verify Button */}
      <TouchableOpacity
        onPress={
          handleVerifyClick
        }
        disabled={isLoading}
        activeOpacity={0.8}
        style={[
          styles.verifyButton,
          isLoading &&
            styles.disabledButton,
        ]}
      >
        <Text
          style={
            styles.verifyButtonText
          }
        >
          {isLoading
            ? t(
                'loginOTP.verify',
                'Verifying...',
              )
            : t(
                'loginOTP.btnText',
                'Verify OTP',
              )}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
  },

  otpContainer: {
    flexDirection: 'row',
    justifyContent:
      'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 24,
  },

  otpContainerRTL: {
    flexDirection: 'row-reverse',
  },

  otpInput: {
    width: 48,
    height: 48,

    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 6,

    backgroundColor: '#FFFFFF',

    textAlign: 'center',
    fontSize: 22,
    color: '#1F2937',

    padding: 0,
  },

  disabledInput: {
    opacity: 0.5,
  },

  errorText: {
    width: '100%',
    marginTop: -12,
    marginBottom: 12,
    color: '#EF4444',
    fontSize: 12,
    textAlign: 'center',
  },

  verifyButton: {
    width: '100%',
    height: 48,

    alignItems: 'center',
    justifyContent: 'center',

    borderRadius: 8,

    backgroundColor: '#3EC6BC',
  },

  disabledButton: {
    opacity: 0.5,
  },

  verifyButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default OtpInput;
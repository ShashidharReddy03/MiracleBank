import React, { useContext, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Svg, {
  Circle,
  Path,
  Rect,
} from 'react-native-svg';
import { useNavigation } from '@react-navigation/native';

import PreLoginLayout from '../prelogin/PreLoginLayout';
import { LanguageContext } from '../../localization/LanguageContext';

import StepBasicDetails, {
  BasicDetailsForm,
} from './StepBasicDetails';
import StepOtp from './StepOtp';
import StepSecurityQuestion from './StepSecurityQuestion';
import SetPinScreen from './SetPin';
import AppLoader from '../../ui-kit/components/loaders/AppLoader';

type StepNumber = 1 | 2 | 3 | 4;

const CreateAccount = () => {
  const navigation = useNavigation<any>();
  const languageContext = useContext(LanguageContext);
  const translations = languageContext?.translations;

  const [step, setStep] = useState<StepNumber>(1);
  const [isCreating, setIsCreating] = useState(false);
  const [cif, setCif] = useState('');
  const [formData, setFormData] = useState<BasicDetailsForm | null>(
    null,
  );

  const t = (key: string, fallback: string): string => {
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
          value = (value as Record<string, unknown>)[k];
        } else {
          return fallback;
        }
      }

      return typeof value === 'string' ? value : fallback;
    } catch {
      return fallback;
    }
  };

  const next = () => {
    setStep(current =>
      current < 4 ? ((current + 1) as StepNumber) : current,
    );
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(current => (current - 1) as StepNumber);
      return;
    }

    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  const handleCreate = async (form: BasicDetailsForm) => {
    setIsCreating(true);

    try {
      /*
       * API will be wired later.
       * Temporary success path for UI flow testing.
       */
      await new Promise<void>(resolve => setTimeout(resolve, 400));

      const mergedMobile =
        form.countryCode.replace(/[+\s]/g, '') + form.mobile;

      setFormData(form);
      setCif(mergedMobile);
      next();
    } finally {
      setIsCreating(false);
    }
  };

  const handleOtpSuccess = () => {
    next();
  };

  const handleSecuritySuccess = () => {
    next();
  };

  const handleMpinSuccess = () => {
    navigation.navigate('MFLogin');
  };

  const steps = [
    {
      label: t('register.accountDetails', 'Account Details'),
      icon: (
        <UserRoundIcon
          width={22}
          height={22}
          color={step === 1 ? '#FFFFFF' : '#6B7280'}
        />
      ),
    },
    {
      label: t('forgotPassword.otp', 'OTP'),
      icon: (
        <SmartphoneIcon
          width={22}
          height={22}
          color={step === 2 ? '#FFFFFF' : '#6B7280'}
        />
      ),
    },
    {
      label: t(
        'forgotPassword.securityQuestions',
        'Security Questions',
      ),
      icon: (
        <ShieldQuestionIcon
          width={22}
          height={22}
          color={step === 3 ? '#FFFFFF' : '#6B7280'}
        />
      ),
    },
    {
      label: t('forgotPassword.setMpin', 'Set MPIN'),
      icon: (
        <KeyRoundIcon
          width={22}
          height={22}
          color={step === 4 ? '#FFFFFF' : '#6B7280'}
        />
      ),
    },
  ];

  return (
    <PreLoginLayout onBack={handleBack}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.card}>
          {step > 1 && (
            <>
              <Text style={styles.title}>
                {t('register.title', 'Account Registration')}
              </Text>

              <View style={styles.stepper}>
                {steps.map((stepItem, index) => {
                  const stepNumber = index + 1;
                  const isActive = step === stepNumber;

                  return (
                    <View key={index} style={styles.stepItem}>
                      {isActive ? (
                        <LinearGradient
                          colors={['#12A89F', '#0E918A']}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 1 }}
                          style={[
                            styles.stepCircle,
                            styles.activeStepCircle,
                          ]}
                        >
                          {stepItem.icon}
                        </LinearGradient>
                      ) : (
                        <View
                          style={[
                            styles.stepCircle,
                            styles.inactiveStepCircle,
                          ]}
                        >
                          {stepItem.icon}
                        </View>
                      )}

                      <Text
                        style={[
                          styles.stepLabel,
                          {
                            color: isActive ? '#20242A' : '#6B7280',
                            fontWeight: isActive ? '600' : '400',
                          },
                        ]}
                        numberOfLines={2}
                      >
                        {stepItem.label}
                      </Text>
                    </View>
                  );
                })}
              </View>
            </>
          )}

          <View style={styles.stepContent}>
            {step === 1 && (
              <StepBasicDetails
                onCreate={handleCreate}
                isLoading={isCreating}
              />
            )}

            {step === 2 && (
              <StepOtp
                cif={cif || formData?.mobile || ''}
                onOtpSuccess={handleOtpSuccess}
              />
            )}

            {step === 3 && (
              <StepSecurityQuestion onNext={handleSecuritySuccess} />
            )}

            {step === 4 && (
              <SetPinScreen onSuccess={handleMpinSuccess} />
            )}
          </View>
        </View>
      </ScrollView>
    </PreLoginLayout>
  );
};

const UserRoundIcon = ({
  width = 24,
  height = 24,
  color = '#000000',
}: {
  width?: number;
  height?: number;
  color?: string;
}) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="8" r="3.5" stroke={color} strokeWidth="1.8" />
    <Path
      d="M5 20C5.6 16.5 8.1 14.5 12 14.5C15.9 14.5 18.4 16.5 19 20"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </Svg>
);

const SmartphoneIcon = ({
  width = 24,
  height = 24,
  color = '#000000',
}: {
  width?: number;
  height?: number;
  color?: string;
}) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
    <Rect
      x="6"
      y="2.5"
      width="12"
      height="19"
      rx="2"
      stroke={color}
      strokeWidth="1.7"
    />
    <Path
      d="M10 5H14"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <Circle cx="12" cy="18" r="1" fill={color} />
  </Svg>
);

const ShieldQuestionIcon = ({
  width = 24,
  height = 24,
  color = '#000000',
}: {
  width?: number;
  height?: number;
  color?: string;
}) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 3L19 6V11C19 15.5 16.2 18.7 12 21C7.8 18.7 5 15.5 5 11V6L12 3Z"
      stroke={color}
      strokeWidth="1.6"
      strokeLinejoin="round"
    />
    <Path
      d="M9.7 9.3C9.9 8 10.8 7.3 12 7.3C13.3 7.3 14.3 8.1 14.3 9.3C14.3 10.6 13.2 11.1 12.6 11.7C12.1 12.1 12 12.5 12 13"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <Circle cx="12" cy="15.8" r="0.8" fill={color} />
  </Svg>
);

const KeyRoundIcon = ({
  width = 24,
  height = 24,
  color = '#000000',
}: {
  width?: number;
  height?: number;
  color?: string;
}) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
    <Circle cx="8" cy="15" r="4" stroke={color} strokeWidth="1.7" />
    <Path
      d="M11 12L20 3"
      stroke={color}
      strokeWidth="1.7"
      strokeLinecap="round"
    />
    <Path
      d="M16 7L19 10"
      stroke={color}
      strokeWidth="1.7"
      strokeLinecap="round"
    />
    <Path
      d="M13 10L16 13"
      stroke={color}
      strokeWidth="1.7"
      strokeLinecap="round"
    />
  </Svg>
);

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },

  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 14,
  },

  card: {
    width: '100%',
    maxWidth: 500,
    minHeight: 400,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
    marginBottom: 24,
    elevation: 5,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
  },

  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 20,
  },

  stepper: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-start',
    marginBottom: 24,
  },

  stepItem: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 2,
  },

  stepCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },

  activeStepCircle: {
    borderWidth: 3,
    borderColor: '#8DE0DA',
    shadowColor: '#12A89F',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },

  inactiveStepCircle: {
    backgroundColor: '#F1F3F5',
    borderWidth: 3,
    borderColor: '#D9DEE5',
  },

  stepLabel: {
    fontSize: 10,
    textAlign: 'center',
    marginTop: 7,
    minHeight: 28,
  },

  stepContent: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    paddingBottom: 8,
  },
});

export default CreateAccount;

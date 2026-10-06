import React, {
  useContext,
  useState,
} from 'react';

import {
  StyleSheet,
  Text,
  View,
  ScrollView,
} from 'react-native';

import LinearGradient from 'react-native-linear-gradient';
import Svg, {
  Circle,
  Path,
  Rect,
} from 'react-native-svg';

import {
  useNavigation,
} from '@react-navigation/native';

import PreLoginLayout from '../prelogin/PreLoginLayout';

import StepOtp from './StepOtp';
import StepAccount from './StepAccount';
import SecurityQuestions from './StepSecurityQuestion';
// import StepReset from './StepReset';

import {
  LanguageContext,
} from '../../localization/LanguageContext';


/* =========================================================
   TYPES
========================================================= */

type StepNumber = 1 | 2 | 3 | 4;


/* =========================================================
   FORGOT PASSWORD FLOW
========================================================= */

const ForgotPasswordFlow = () => {
  const navigation = useNavigation<any>();

  const [step, setStep] =
    useState<StepNumber>(1);

  const [cif, setCif] =
    useState('');

  const [rawResultMessage, setRawResultMessage] =
    useState('');

  const [mobileNumber, setMobileNumber] =
    useState('');


  /* =======================================================
     LANGUAGE
  ======================================================= */

  const languageContext =
    useContext(LanguageContext);

  const translations =
    languageContext?.translations;


  const t = (
    key: string,
    fallback: string,
  ): string => {
    try {
      if (!translations) {
        return fallback;
      }

      const keys = key.split('.');

      let value: unknown =
        translations;

      for (const k of keys) {
        if (
          typeof value === 'object' &&
          value !== null &&
          k in value
        ) {
          value = (
            value as Record<
              string,
              unknown
            >
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


  /* =======================================================
     NEXT STEP
  ======================================================= */

  const next = () => {
    setStep(
      current =>
        current < 4
          ? ((current + 1) as StepNumber)
          : current,
    );
  };


  /* =======================================================
     OTP SUCCESS
  ======================================================= */

  const handleOtpSuccess = (
    resultMessage: string,
  ) => {
    setRawResultMessage(
      resultMessage,
    );

    setMobileNumber(cif);

    next();
  };


  /* =======================================================
     STEPS
  ======================================================= */

  const steps = [
    {
      label: t(
        'forgotPassword.accountDetails',
        'Account Details',
      ),
      icon: (
        <UserRoundIcon
          width={22}
          height={22}
          color={
            step === 1
              ? '#FFFFFF'
              : '#6B7280'
          }
        />
      ),
    },

    {
      label: t(
        'forgotPassword.otp',
        'OTP',
      ),
      icon: (
        <SmartphoneIcon
          width={22}
          height={22}
          color={
            step === 2
              ? '#FFFFFF'
              : '#6B7280'
          }
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
          color={
            step === 3
              ? '#FFFFFF'
              : '#6B7280'
          }
        />
      ),
    },

    {
      label: t(
        'forgotPassword.setMpin',
        'Set MPIN',
      ),
      icon: (
        <KeyRoundIcon
          width={22}
          height={22}
          color={
            step === 4
              ? '#FFFFFF'
              : '#6B7280'
          }
        />
      ),
    },
  ];


  /* =======================================================
     SUCCESS FROM RESET
  ======================================================= */

  const handleResetSuccess = () => {
    navigation.navigate('Login');
  };


  /* =======================================================
     UI
  ======================================================= */

  return (
    <View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={
          styles.scrollContent
        }
        showsVerticalScrollIndicator={
          false
        }
        keyboardShouldPersistTaps="handled"
      >

        {/* =================================================
            CARD
        ================================================= */}

        <View style={styles.card}>

          {/* =================================================
              TITLE
          ================================================= */}

          <Text style={styles.title}>
            {t(
              'forgotPassword.title',
              'Forgot MPIN ?',
            )}
          </Text>


          {/* =================================================
              STEPPER
          ================================================= */}

          <View style={styles.stepper}>

            {steps.map(
              (stepItem, index) => {

                const stepNumber =
                  index + 1;

                const isActive =
                  step === stepNumber;

                return (
                  <View
                    key={index}
                    style={styles.stepItem}
                  >

                    {/* STEP CIRCLE */}

                    {isActive ? (
                      <LinearGradient
                        colors={[
                          '#12A89F',
                          '#0E918A',
                        ]}
                        start={{
                          x: 0,
                          y: 0,
                        }}
                        end={{
                          x: 1,
                          y: 1,
                        }}
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

                    {/* LABEL */}

                    <Text
                      style={[
                        styles.stepLabel,
                        {
                          color: isActive
                            ? '#20242A'
                            : '#6B7280',
                          fontWeight:
                            isActive
                              ? '600'
                              : '400',
                        },
                      ]}
                      numberOfLines={2}
                    >
                      {stepItem.label}
                    </Text>

                  </View>
                );
              },
            )}

          </View>


          {/* =================================================
              STEP CONTENT
          ================================================= */}

          <View style={styles.stepContent}>

            {step === 1 && (
              <StepAccount
                onNext={next}
                setCif={setCif}
              />
            )}

            {step === 2 && (
              <StepOtp
                onOtpSuccess={
                  handleOtpSuccess
                }
                cif={cif}
              />
            )}

            {step === 3 && (
              // <SecurityQuestions
              //   onNext={next}
              //   rawResultMessage={
              //     rawResultMessage
              //   }
              //   mobileNumber={
              //     mobileNumber
              //   }
              // />
              <></>
            )}

            {step === 4 && (
              // <StepReset
              //   cif={cif}
              //   onSuccess={
              //     handleResetSuccess
              //   }
              // />
              <View></View>
            )}

          </View>

        </View>

      </ScrollView>

    </View>
  );
};


/* =========================================================
   ICON COMPONENTS
========================================================= */

/* =========================================================
   USER ROUND
========================================================= */

const UserRoundIcon = ({
  width = 24,
  height = 24,
  color = '#000000',
}: {
  width?: number;
  height?: number;
  color?: string;
}) => (
  <Svg
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill="none"
  >
    <Circle
      cx="12"
      cy="8"
      r="3.5"
      stroke={color}
      strokeWidth="1.8"
    />

    <Path
      d="M5 20C5.6 16.5 8.1 14.5 12 14.5C15.9 14.5 18.4 16.5 19 20"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </Svg>
);


/* =========================================================
   SMARTPHONE
========================================================= */

const SmartphoneIcon = ({
  width = 24,
  height = 24,
  color = '#000000',
}: {
  width?: number;
  height?: number;
  color?: string;
}) => (
  <Svg
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill="none"
  >
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

    <Circle
      cx="12"
      cy="18"
      r="1"
      fill={color}
    />
  </Svg>
);


/* =========================================================
   SHIELD QUESTION
========================================================= */

const ShieldQuestionIcon = ({
  width = 24,
  height = 24,
  color = '#000000',
}: {
  width?: number;
  height?: number;
  color?: string;
}) => (
  <Svg
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill="none"
  >
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

    <Circle
      cx="12"
      cy="15.8"
      r="0.8"
      fill={color}
    />
  </Svg>
);


/* =========================================================
   KEY ROUND
========================================================= */

const KeyRoundIcon = ({
  width = 24,
  height = 24,
  color = '#000000',
}: {
  width?: number;
  height?: number;
  color?: string;
}) => (
  <Svg
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill="none"
  >
    <Circle
      cx="8"
      cy="15"
      r="4"
      stroke={color}
      strokeWidth="1.7"
    />

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


/* =========================================================
   STYLES
========================================================= */

const styles = StyleSheet.create({

  /* =======================================================
     ROOT
  ======================================================= */

  scroll: {
    flex: 1,
  },

  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 10,
  },


  /* =======================================================
     CARD
  ======================================================= */

  card: {
    width: '100%',
    maxWidth: 500,

    minHeight: 400,

    backgroundColor: '#FFFFFF',

    borderRadius: 10,

    paddingHorizontal: 24,
    paddingTop: 22,
    paddingBottom: 20,

    marginBottom: 24,

    elevation: 5,

    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.12,
    shadowRadius: 10,
  },


  /* =======================================================
     TITLE
  ======================================================= */

  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#20242A',
    textAlign: 'center',
    marginBottom: 20,
  },


  /* =======================================================
     STEPPER
  ======================================================= */

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
    shadowOffset: {
      width: 0,
      height: 4,
    },
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


  /* =======================================================
     CONTENT
  ======================================================= */

  stepContent: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    paddingBottom: 8,
  },

});


export default ForgotPasswordFlow;
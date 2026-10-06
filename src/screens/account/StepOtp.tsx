import React, { useContext, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

import OtpInput from './OtpInput';

// import { useAppModal } from '../../context/AppModalContext';
// API commented for now
// import {
//   registerotpverify,
// } from '../../services/ReqServiceApi/ReqServiceApi';

import {
  LanguageContext,
} from '../../localization/LanguageContext';

interface StepOtpProps {
  cif: string;
  onOtpSuccess: (resultMessage: string) => void;
}

const StepOtp = ({
  cif,
  onOtpSuccess,
}: StepOtpProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [clearOtp, setClearOtp] = useState(0);

  // const { showModal } = useAppModal();

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

  const handleVerify = async (
    otp: string,
  ) => {

    /* ===================================================
       VALIDATION
    =================================================== */

    if (!otp || otp.length !== 5) {
      // showModal({
      //   type: 'error',
      //   title: t(
      //     'otp.invalid',
      //     'Invalid OTP',
      //   ),
      //   message: t(
      //     'otp.errMessage',
      //     'Please enter a valid 5-digit OTP.',
      //   ),
      //   width: 400,
      //   height: 'h-32',
      // });

      setClearOtp(
        previous => previous + 1,
      );

      return;
    }

    setIsLoading(true);

    try {

      /* =================================================
         API CODE — COMMENTED FOR NOW
      =================================================

      const response =
        await registerotpverify(
          otp,
          cif,
          'NOT',
        );

      console.log(
        'OTP Verification Response:',
        response,
      );

      const resultMessage =
        response?.ResultMessage;

      const parsed =
        resultMessage
          ? JSON.parse(resultMessage)
          : null;

      const statusCode =
        parsed?.statusCode?.trim();

      const messageText =
        parsed?.Message
          ?.replace(/\s+/g, ' ')
          ?.trim();

      if (statusCode === '00') {
        showModal({
          type: 'success',
          title: t(
            'otp.valid',
            'OTP Verified',
          ),
          message: t(
            'otp.statusOk',
            messageText,
          ),
          width: 400,
          height: 'h-32',
        });

        onOtpSuccess(
          response.ResultMessage,
        );

      } else {
        showModal({
          type: 'error',
          title: t(
            'otp.failed',
            'Verification Failed',
          ),
          message: t(
            'otp.statusCodeOne',
            messageText,
          ),
          width: 400,
          height: 'h-32',
        });

        setClearOtp(
          previous => previous + 1,
        );
      }

      ================================================= */


      /* =================================================
         TEMPORARY UI TEST
         API WILL BE ADDED LATER
      ================================================= */

      // await new Promise(resolve =>
      //   // setTimeout(resolve, 500),
      // );

      // showModal({
      //   type: 'success',
      //   title: t(
      //     'otp.valid',
      //     'OTP Verified',
      //   ),
      //   message: t(
      //     'otp.statusOk',
      //     'OTP verified successfully.',
      //   ),
      //   width: 400,
      //   height: 'h-32',
      // });

      onOtpSuccess(
        JSON.stringify({
          statusCode: '00',
          Message: 'OTP verified successfully.',
        }),
      );

    } catch (error) {

      console.error(
        'OTP Verification Error:',
        error,
      );

      // showModal({
      //   type: 'error',
      //   title: t(
      //     'otp.reqErr',
      //     'Request Error',
      //   ),
      //   message: t(
      //     'otp.reqMessage',
      //     'Failed to verify OTP. Please try again.',
      //   ),
      //   width: 400,
      //   height: 'h-32',
      // });

      setClearOtp(
        previous => previous + 1,
      );

    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>

      <Text style={styles.description}>
        {t(
          'loginOTP.desc',
          'Enter the 5-digit OTP sent to your registered email id.',
        )}
      </Text>

      <OtpInput
        length={5}
        onVerify={handleVerify}
        isLoading={isLoading}
        clearTrigger={clearOtp}
      />

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },

  description: {
    fontSize: 14,
    color: '#20242A',
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 20,
  },
});

export default StepOtp;
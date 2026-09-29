import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { MFScreenWrapper } from '../../../ui-kit/layouts/MFScreenWrapper';
import { MFOTPInput }      from '../../../ui-kit/components/otp/MFOTPInput';
import { MFButton }        from '../../../ui-kit/components/buttons/MFButton';
import { MFText }          from '../../../ui-kit/components/typography/MFText';
import { MFHeading }       from '../../../ui-kit/components/typography/MFText';
import { AuthStackParamList } from '../../../navigation/stacks/AuthStack';

type OTPRoute = RouteProp<AuthStackParamList, 'OTP'>;

export function OTPScreen() {
  const { params } = useRoute<OTPRoute>();
  const nav        = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
  const { t }      = useTranslation();
  const [otp, setOtp]         = useState('');
  const [loading, setLoading] = useState(false);
  const [resendSec, setResend] = useState(30);

  useEffect(() => {
    if (resendSec <= 0) return;
    const timer = setTimeout(() => setResend(s => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendSec]);

  const handleVerify = async () => {
    if (otp.length < 6) return;
    setLoading(true);
    try {
      // await authService.verifyOTP(params.phone, otp);
      nav.navigate('Dashboard' as never);
    } finally { setLoading(false); }
  };

  return (
    <MFScreenWrapper keyboardAvoiding>
      <View style={{ flex: 1, paddingTop: 60 }}>
        <MFHeading level={2}>{t('auth.otp.title')}</MFHeading>
        <MFText variant="md" color="secondary" style={{ marginTop: 8, marginBottom: 40 }}>
          {t('auth.otp.subtitle', { phone: params.maskedPhone })}
        </MFText>
        <MFOTPInput length={6} secure onComplete={setOtp} />
        <MFButton
          label={t('auth.otp.verify')}
          onPress={handleVerify} loading={loading}
          disabled={otp.length < 6}
          style={{ marginTop: 40 }}
        />
        <MFButton
          label={resendSec > 0 ? t('auth.otp.resendIn', { seconds: resendSec }) : t('auth.otp.resend')}
          variant="ghost" disabled={resendSec > 0}
          onPress={() => setResend(30)}
          style={{ marginTop: 12 }}
        />
      </View>
    </MFScreenWrapper>
  );
}

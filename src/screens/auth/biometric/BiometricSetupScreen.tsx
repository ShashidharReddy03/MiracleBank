import React from 'react';
import { View } from 'react-native';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { MFScreenWrapper } from '../../../ui-kit/layouts/MFScreenWrapper';
import { MFButton }        from '../../../ui-kit/components/buttons/MFButton';
import { MFText }          from '../../../ui-kit/components/typography/MFText';
import { MFHeading }       from '../../../ui-kit/components/typography/MFText';
import { useBiometrics }   from '../../../core/biometrics/useBiometrics';
import { setBiometricEnabled } from '../../../store/slices/authSlice';

export function BiometricSetupScreen() {
  const dispatch          = useDispatch();
  const { t }             = useTranslation();
  const { biometryType, authenticate } = useBiometrics();
  const type  = biometryType === 'FaceID' ? 'Face ID' : 'Fingerprint';

  return (
    <MFScreenWrapper>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 }}>
        <MFHeading level={2} style={{ textAlign: 'center', marginBottom: 12 }}>
          {t('auth.biometric.title', { type })}
        </MFHeading>
        <MFText variant="md" color="secondary" style={{ textAlign: 'center', marginBottom: 48 }}>
          {t('auth.biometric.subtitle')}
        </MFText>
        <MFButton
          label={t('auth.biometric.enable', { type })}
          onPress={async () => {
            const ok = await authenticate();
            if (ok) dispatch(setBiometricEnabled(true));
          }}
        />
        <MFButton
          label={t('auth.biometric.skip')}
          variant="ghost"
          onPress={() => dispatch(setBiometricEnabled(false))}
          style={{ marginTop: 12 }}
        />
      </View>
    </MFScreenWrapper>
  );
}

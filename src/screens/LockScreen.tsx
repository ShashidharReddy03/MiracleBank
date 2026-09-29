import React, { useState } from 'react';
import { View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation }           from 'react-i18next';

import { MFScreenWrapper } from '../ui-kit/layouts/MFScreenWrapper';
import { MFButton }        from '../ui-kit/components/buttons/MFButton';
import { MFText }          from '../ui-kit/components/typography/MFText';
import { MFHeading }       from '../ui-kit/components/typography/MFText';
import { MFPinInput }      from '../ui-kit/components/inputs/MFPinInput';
import { useTheme }        from '../ui-kit/theme/ThemeProvider';
import { useBiometrics }   from '../core/biometrics/useBiometrics';
import { useAuth }         from '../core/auth/useAuth';
import { unlockSession }   from '../store/slices/sessionSlice';
import { RootState }       from '../store/store';
import { appConfig }       from '../config/appConfig';

export function LockScreen() {
  const t             = useTheme();
  const { t: tr }     = useTranslation();
  const dispatch      = useDispatch();
  const { logout }    = useAuth();
  const { available, biometryType, authenticate } = useBiometrics();
  const biometricEnabled = useSelector((s: RootState) => s.auth.biometricEnabled);

  const [pinKey, setPinKey]     = useState(0);    // increment to reset pin input
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  const biometricLabel = biometryType === 'FaceID' ? 'Face ID' : 'Fingerprint';

  const handlePinComplete = async (pin: string) => {
    setLoading(true);
    setError('');
    try {
      // TODO: verify pin against your auth service
      // const ok = await authService.verifyPin(pin);
      const ok = true; // placeholder — replace with real verification

      if (ok) {
        dispatch(unlockSession());
      } else {
        setError('Incorrect PIN. Try again.');
        // Reset pin input and re-focus automatically
        setPinKey(prev => prev + 1); // changing key remounts MFPinInput → auto-focus fires
      }
    } catch {
      setError('Verification failed. Try again.');
      setPinKey(prev => prev + 1);
    } finally {
      setLoading(false);
    }
  };

  const handleBiometric = async () => {
    const ok = await authenticate(`Unlock ${appConfig.bankName}`);
    if (ok) dispatch(unlockSession());
  };

  return (
    <MFScreenWrapper>
      <View style={{
        flex:           1,
        alignItems:     'center',
        justifyContent: 'center',
        padding:        t.spacing.xl,
      }}>

        {/* Lock icon */}
        <View style={{
          width:           72,
          height:          72,
          borderRadius:    36,
          backgroundColor: t.colors.primaryLight,
          alignItems:      'center',
          justifyContent:  'center',
          marginBottom:    t.spacing.lg,
        }}>
          <MFText variant="display">🔒</MFText>
        </View>

        <MFHeading level={2} style={{ textAlign: 'center', marginBottom: t.spacing.sm }}>
          {tr('lock.title')}
        </MFHeading>

        <MFText variant="md" color="secondary" style={{ textAlign: 'center', marginBottom: t.spacing.xxl }}>
          {tr('lock.subtitle')}
        </MFText>

        {/* PIN input
            key={pinKey} → when pinKey changes React unmounts+remounts
            the component, which fires useEffect([]) → auto-focus again  */}
        <MFPinInput
          key={pinKey}
          length={4}
          autoFocus={true}     // ← keyboard opens immediately
          onComplete={handlePinComplete}
        />

        {/* Error message */}
        {error ? (
          <MFText
            variant="sm"
            style={{ color: t.colors.error, marginTop: t.spacing.md, textAlign: 'center' }}
          >
            {error}
          </MFText>
        ) : null}

        {/* Biometric unlock */}
        {available && biometricEnabled && (
          <MFButton
            label={`Unlock with ${biometricLabel}`}
            variant="outline"
            onPress={handleBiometric}
            style={{ marginTop: t.spacing.xl }}
          />
        )}

        {/* Logout */}
        <MFButton
          label={tr('lock.logout')}
          variant="ghost"
          onPress={logout}
          style={{ marginTop: t.spacing.md }}
        />
      </View>
    </MFScreenWrapper>
  );
}

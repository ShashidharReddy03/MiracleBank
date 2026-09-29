import { useCallback, useEffect, useState } from 'react';
import ReactNativeBiometrics from 'react-native-biometrics';

export type BiometricType = 'FaceID' | 'TouchID' | 'Biometrics' | 'None';

const rnBiometrics = new ReactNativeBiometrics({ allowDeviceCredentials: false });

export function useBiometrics() {
  const [available, setAvailable] = useState(false);
  const [biometryType, setBiometryType] = useState<BiometricType>('None');

  useEffect(() => {
    rnBiometrics.isSensorAvailable().then(({ available, biometryType }) => {
      setAvailable(available);
      setBiometryType((biometryType as BiometricType) ?? 'None');
    });
  }, []);

  const authenticate = useCallback(async (reason = 'Authenticate to continue'): Promise<boolean> => {
    const { success } = await rnBiometrics.simplePrompt({ promptMessage: reason });
    return success;
  }, []);

  return { available, biometryType, authenticate };
}

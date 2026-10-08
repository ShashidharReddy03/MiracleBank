
import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { runWithLoader } from '../../ui-kit/components/loaders/loaderService';

type SetPinScreenProps = {
  onSuccess?: () => void;
};

const SetPinScreen = ({ onSuccess }: SetPinScreenProps) => {
  const [mpin, setMpin] = useState('');
  const [confirmMpin, setConfirmMpin] = useState('');
  const [showMpin, setShowMpin] = useState(false);
  const [showConfirmMpin, setShowConfirmMpin] = useState(false);
  const [mpinError, setMpinError] = useState('');
  const [confirmError, setConfirmError] = useState('');

  const handleSubmit = () => {
    const pin = mpin.trim();
    const confirm = confirmMpin.trim();
    let nextMpinError = '';
    let nextConfirmError = '';

    if (!pin) {
      nextMpinError = 'MPIN is required';
    } else if (!/^\d{5}$/.test(pin)) {
      nextMpinError = 'Enter a 5-digit MPIN';
    }

    if (!confirm) {
      nextConfirmError = 'Confirm MPIN is required';
    } else if (pin && confirm !== pin) {
      nextConfirmError = 'MPIN does not match';
    }

    setMpinError(nextMpinError);
    setConfirmError(nextConfirmError);

    if (nextMpinError || nextConfirmError) {
      return;
    }

    void runWithLoader(() => {
      onSuccess?.();
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Set MPIN
      </Text>

      <View style={styles.fieldContainer}>
        <Text style={styles.label}>
          MPIN *
        </Text>

        <View
          style={[
            styles.inputContainer,
            mpinError ? styles.inputError : null,
          ]}
        >
          <TextInput
            value={mpin}
            onChangeText={value => {
              setMpin(value.replace(/\D/g, '').slice(0, 5));
              if (mpinError) {
                setMpinError('');
              }
            }}
            placeholder="Enter 5-digit MPIN"
            placeholderTextColor="#9CA3AF"
            secureTextEntry={!showMpin}
            keyboardType="number-pad"
            maxLength={5}
            style={styles.input}
          />

          <TouchableOpacity
            onPress={() => setShowMpin(!showMpin)}
            style={styles.eyeButton}
          >
            <Text style={styles.eyeText}>
              {showMpin ? 'Hide' : 'Show'}
            </Text>
          </TouchableOpacity>
        </View>

        {mpinError ? (
          <Text style={styles.errorText}>{mpinError}</Text>
        ) : null}
      </View>

      <View style={styles.fieldContainer}>
        <Text style={styles.label}>
          Confirm MPIN *
        </Text>

        <View
          style={[
            styles.inputContainer,
            confirmError ? styles.inputError : null,
          ]}
        >
          <TextInput
            value={confirmMpin}
            onChangeText={value => {
              setConfirmMpin(value.replace(/\D/g, '').slice(0, 5));
              if (confirmError) {
                setConfirmError('');
              }
            }}
            placeholder="Confirm 5-digit MPIN"
            placeholderTextColor="#9CA3AF"
            secureTextEntry={!showConfirmMpin}
            keyboardType="number-pad"
            maxLength={5}
            style={styles.input}
          />

          <TouchableOpacity
            onPress={() => setShowConfirmMpin(!showConfirmMpin)}
            style={styles.eyeButton}
          >
            <Text style={styles.eyeText}>
              {showConfirmMpin ? 'Hide' : 'Show'}
            </Text>
          </TouchableOpacity>
        </View>

        {confirmError ? (
          <Text style={styles.errorText}>{confirmError}</Text>
        ) : null}
      </View>

      <TouchableOpacity
        style={styles.submitButton}
        onPress={handleSubmit}
        activeOpacity={0.8}
      >
        <Text style={styles.submitText}>
          Submit
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },

  title: {
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 28,
    color: '#222222',
  },

  fieldContainer: {
    marginBottom: 20,
  },

  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
    color: '#333333',
  },

  inputContainer: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
  },

  inputError: {
    borderColor: '#F87171',
  },

  errorText: {
    marginTop: 4,
    fontSize: 12,
    color: '#EF4444',
  },

  input: {
    flex: 1,
    height: '100%',
    paddingHorizontal: 14,
    fontSize: 16,
    color: '#222222',
  },

  eyeButton: {
    paddingHorizontal: 14,
  },

  eyeText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#1D5D9B',
  },

  submitButton: {
    height: 48,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    backgroundColor: '#3EC6BC',
  },

  submitText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default SetPinScreen;


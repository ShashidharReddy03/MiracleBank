
import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const SetPinScreen = () => {
  const [mpin, setMpin] = useState('');
  const [confirmMpin, setConfirmMpin] = useState('');
  const [showMpin, setShowMpin] = useState(false);
  const [showConfirmMpin, setShowConfirmMpin] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        {/* Title */}
        <Text style={styles.title}>
          Set MPIN
        </Text>

        {/* MPIN */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>
            MPIN
          </Text>

          <View style={styles.inputContainer}>
            <TextInput
              value={mpin}
              onChangeText={setMpin}
              placeholder="Enter 5-digit MPIN"
              placeholderTextColor="#999"
              secureTextEntry={!showMpin}
              keyboardType="number-pad"
              maxLength={5}
              style={styles.input}
            />

            <TouchableOpacity
              onPress={() =>
                setShowMpin(!showMpin)
              }
              style={styles.eyeButton}
            >
              <Text style={styles.eyeText}>
                {showMpin ? 'Hide' : 'Show'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Confirm MPIN */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>
            Confirm MPIN
          </Text>

          <View style={styles.inputContainer}>
            <TextInput
              value={confirmMpin}
              onChangeText={setConfirmMpin}
              placeholder="Confirm 5-digit MPIN"
              placeholderTextColor="#999"
              secureTextEntry={!showConfirmMpin}
              keyboardType="number-pad"
              maxLength={5}
              style={styles.input}
            />

            <TouchableOpacity
              onPress={() =>
                setShowConfirmMpin(
                  !showConfirmMpin,
                )
              }
              style={styles.eyeButton}
            >
              <Text style={styles.eyeText}>
                {showConfirmMpin ? 'Hide' : 'Show'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Submit */}
        <TouchableOpacity
          style={[
            styles.submitButton,
            {
              opacity:
                mpin.length === 5 &&
                confirmMpin.length === 5
                  ? 1
                  : 0.5,
            },
          ]}
          disabled={
            mpin.length !== 5 ||
            confirmMpin.length !== 5
          }
        >
          <Text style={styles.submitText}>
            Submit
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#F5F7FA',
  },

  card: {
    width: '100%',
    maxWidth: 500,
    padding: 20,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
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
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D5D9DE',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
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
    height: 52,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    backgroundColor: '#1D5D9B',
  },

  submitText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default SetPinScreen;


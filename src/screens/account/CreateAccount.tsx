import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import Svg, {
  Circle,
  Path,
  Rect,
} from 'react-native-svg';

const CreateAccount = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');

  const [showCountries, setShowCountries] =
    useState(false);

  const countries = [
    { name: 'India', code: '+91' },
    { name: 'UAE', code: '+971' },
    { name: 'Saudi Arabia', code: '+966' },
    { name: 'Qatar', code: '+974' },
  ];

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={
        Platform.OS === 'ios'
          ? 'padding'
          : undefined
      }
    >
      <ScrollView
        contentContainerStyle={
          styles.scrollContent
        }
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>

          {/* Header */}

          <View style={styles.header}>
            <View style={styles.iconCircle}>
              <UserIcon
                width={32}
                height={32}
              />
            </View>

            <Text style={styles.title}>
              Create Account
            </Text>

            <Text style={styles.subtitle}>
              Basic Details
            </Text>
          </View>

          {/* First Name */}

          <View style={styles.field}>
            <Text style={styles.label}>
              First Name
            </Text>

            <View style={styles.inputContainer}>
              <UserIcon
                width={20}
                height={20}
              />

              <TextInput
                value={firstName}
                onChangeText={setFirstName}
                placeholder="Enter your first name"
                placeholderTextColor="#9CA3AF"
                style={styles.input}
                autoCapitalize="words"
              />
            </View>
          </View>

          {/* Last Name */}

          <View style={styles.field}>
            <Text style={styles.label}>
              Last Name
            </Text>

            <View style={styles.inputContainer}>
              <UserIcon
                width={20}
                height={20}
              />

              <TextInput
                value={lastName}
                onChangeText={setLastName}
                placeholder="Enter your last name"
                placeholderTextColor="#9CA3AF"
                style={styles.input}
                autoCapitalize="words"
              />
            </View>
          </View>

          {/* Country Code */}

          <View style={styles.field}>
            <Text style={styles.label}>
              Country Code
            </Text>

            <Pressable
              onPress={() =>
                setShowCountries(
                  !showCountries,
                )
              }
              style={styles.inputContainer}
            >
              <GlobeIcon
                width={20}
                height={20}
              />

              <Text style={styles.selectText}>
                {countryCode}
              </Text>

              <ChevronIcon
                width={18}
                height={18}
              />
            </Pressable>

            {showCountries && (
              <View style={styles.dropdown}>
                {countries.map(country => (
                  <Pressable
                    key={country.code}
                    onPress={() => {
                      setCountryCode(
                        country.code,
                      );
                      setShowCountries(false);
                    }}
                    style={styles.dropdownItem}
                  >
                    <Text
                      style={
                        styles.countryName
                      }
                    >
                      {country.name}
                    </Text>

                    <Text
                      style={
                        styles.countryCode
                      }
                    >
                      {country.code}
                    </Text>
                  </Pressable>
                ))}
              </View>
            )}
          </View>

          {/* Mobile Number */}

          <View style={styles.field}>
            <Text style={styles.label}>
              Mobile Number
            </Text>

            <View style={styles.inputContainer}>
              <PhoneIcon
                width={20}
                height={20}
              />

              <TextInput
                value={mobile}
                onChangeText={text =>
                  setMobile(
                    text.replace(
                      /[^0-9]/g,
                      '',
                    ),
                  )
                }
                placeholder="Enter mobile number"
                placeholderTextColor="#9CA3AF"
                keyboardType="phone-pad"
                maxLength={15}
                style={styles.input}
              />
            </View>
          </View>

          {/* Email */}

          <View style={styles.field}>
            <Text style={styles.label}>
              Email Address
            </Text>

            <View style={styles.inputContainer}>
              <MailIcon
                width={20}
                height={20}
              />

              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="Enter your email address"
                placeholderTextColor="#9CA3AF"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                style={styles.input}
              />
            </View>
          </View>

          {/* Buttons */}

          <View style={styles.buttons}>

            <Pressable
              style={styles.cancelButton}
              onPress={() => {
                setFirstName('');
                setLastName('');
                setCountryCode('+91');
                setMobile('');
                setEmail('');
              }}
            >
              <Text
                style={
                  styles.cancelButtonText
                }
              >
                Cancel
              </Text>
            </Pressable>

            <Pressable
              style={styles.createButton}
              onPress={() => {
                console.log(
                  'Create Account',
                );
              }}
            >
              <Text
                style={
                  styles.createButtonText
                }
              >
                Create
              </Text>
            </Pressable>

          </View>

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

/* =========================================================
   User Icon
========================================================= */

const UserIcon = ({
  width = 24,
  height = 24,
}: {
  width?: number;
  height?: number;
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
      stroke="#6366F1"
      strokeWidth="1.8"
    />

    <Path
      d="M5 20C5.5 16.5 8.2 14.5 12 14.5C15.8 14.5 18.5 16.5 19 20"
      stroke="#6366F1"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </Svg>
);

/* =========================================================
   Globe Icon
========================================================= */

const GlobeIcon = ({
  width = 24,
  height = 24,
}: {
  width?: number;
  height?: number;
}) => (
  <Svg
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill="none"
  >
    <Circle
      cx="12"
      cy="12"
      r="9"
      stroke="#6366F1"
      strokeWidth="1.8"
    />

    <Path
      d="M3 12H21"
      stroke="#6366F1"
      strokeWidth="1.5"
    />

    <Path
      d="M12 3C14.2 5.4 15.3 8.4 15.3 12C15.3 15.6 14.2 18.6 12 21"
      stroke="#6366F1"
      strokeWidth="1.5"
    />

    <Path
      d="M12 3C9.8 5.4 8.7 8.4 8.7 12C8.7 15.6 9.8 18.6 12 21"
      stroke="#6366F1"
      strokeWidth="1.5"
    />
  </Svg>
);

/* =========================================================
   Phone Icon
========================================================= */

const PhoneIcon = ({
  width = 24,
  height = 24,
}: {
  width?: number;
  height?: number;
}) => (
  <Svg
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill="none"
  >
    <Path
      d="M6.5 3.5L9 3L11 8L8.5 9.5C9.5 12 12 14.5 14.5 15.5L16 13L21 15L20.5 17.5C20.2 19 19 20 17.5 20C9.5 19.5 4.5 14.5 4 6.5C4 5 5 3.8 6.5 3.5Z"
      stroke="#6366F1"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

/* =========================================================
   Mail Icon
========================================================= */

const MailIcon = ({
  width = 24,
  height = 24,
}: {
  width?: number;
  height?: number;
}) => (
  <Svg
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill="none"
  >
    <Rect
      x="3"
      y="5"
      width="18"
      height="14"
      rx="2"
      stroke="#6366F1"
      strokeWidth="1.8"
    />

    <Path
      d="M4 7L12 13L20 7"
      stroke="#6366F1"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

/* =========================================================
   Chevron Icon
========================================================= */

const ChevronIcon = ({
  width = 24,
  height = 24,
}: {
  width?: number;
  height?: number;
}) => (
  <Svg
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill="none"
  >
    <Path
      d="M7 9L12 14L17 9"
      stroke="#6B7280"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

/* =========================================================
   Styles
========================================================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FB',
  },

  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },

  card: {
    width: '100%',
    maxWidth: 500,

    backgroundColor: '#FFFFFF',

    borderRadius: 16,

    padding: 24,

    elevation: 5,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.12,
    shadowRadius: 8,
  },

  /* Header */

  header: {
    alignItems: 'center',
    marginBottom: 24,
  },

  iconCircle: {
    width: 64,
    height: 64,

    borderRadius: 32,

    backgroundColor: '#EEF2FF',

    alignItems: 'center',
    justifyContent: 'center',

    marginBottom: 12,
  },

  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',

    textAlign: 'center',

    marginBottom: 5,
  },

  subtitle: {
    fontSize: 14,
    color: '#6B7280',

    textAlign: 'center',
  },

  /* Fields */

  field: {
    marginBottom: 17,
  },

  label: {
    fontSize: 14,
    fontWeight: '600',

    color: '#374151',

    marginBottom: 7,
  },

  inputContainer: {
    height: 50,

    width: '100%',

    borderWidth: 1,
    borderColor: '#D1D5DB',

    borderRadius: 9,

    backgroundColor: '#FFFFFF',

    flexDirection: 'row',

    alignItems: 'center',

    paddingHorizontal: 13,
  },

  input: {
    flex: 1,

    height: 48,

    marginLeft: 10,

    fontSize: 15,

    color: '#111827',
  },

  selectText: {
    flex: 1,

    marginLeft: 10,

    fontSize: 15,

    color: '#111827',
  },

  /* Dropdown */

  dropdown: {
    marginTop: 5,

    borderWidth: 1,
    borderColor: '#D1D5DB',

    borderRadius: 9,

    backgroundColor: '#FFFFFF',

    overflow: 'hidden',

    elevation: 5,
  },

  dropdownItem: {
    minHeight: 48,

    paddingHorizontal: 14,

    flexDirection: 'row',

    alignItems: 'center',

    justifyContent: 'space-between',

    borderBottomWidth: 1,

    borderBottomColor: '#F3F4F6',
  },

  countryName: {
    fontSize: 14,
    color: '#374151',
  },

  countryCode: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6366F1',
  },

  /* Buttons */

  buttons: {
    flexDirection: 'row',

    justifyContent: 'flex-end',

    gap: 10,

    marginTop: 8,
  },

  cancelButton: {
    height: 48,

    paddingHorizontal: 22,

    borderRadius: 9,

    borderWidth: 1,
    borderColor: '#D1D5DB',

    alignItems: 'center',
    justifyContent: 'center',
  },

  cancelButtonText: {
    fontSize: 15,

    fontWeight: '600',

    color: '#374151',
  },

  createButton: {
    height: 48,

    paddingHorizontal: 28,

    borderRadius: 9,

    backgroundColor: '#4F46E5',

    alignItems: 'center',
    justifyContent: 'center',
  },

  createButtonText: {
    fontSize: 15,

    fontWeight: '600',

    color: '#FFFFFF',
  },
});

export default CreateAccount;
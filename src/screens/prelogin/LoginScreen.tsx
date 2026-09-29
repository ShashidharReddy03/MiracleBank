import React, { useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import {
  Building2,
  ChevronDown,
  ChevronRight,
  Eye,
  EyeOff,
  Globe,
  Keyboard,
  Lock,
  Menu,
  Phone,
} from '../../ui-kit/components/icons/MFIcons';
// ../ui-kit/components/icons/MFIcons';

interface Country {
  code: string;
  name: string;
}

interface MFLoginScreenProps {
  onLogin?: (countryCode: string, mobileNumber: string, mpin: string) => void;
  onNotYou?: () => void;
  onForgotMPIN?: () => void;
  onOpenAccount?: () => void;
  onMenuPress?: () => void;
}

const COUNTRY_CODES: Country[] = [
  { code: '+91', name: 'India' },
  { code: '+971', name: 'United Arab Emirates' },
  { code: '+966', name: 'Saudi Arabia' },
  { code: '+974', name: 'Qatar' },
  { code: '+968', name: 'Oman' },
  { code: '+965', name: 'Kuwait' },
  { code: '+973', name: 'Bahrain' },
];

const MAX_MPIN_LENGTH = 5;

const MFLoginScreen = ({
  onLogin,
  onNotYou,
  onForgotMPIN,
  onOpenAccount,
  onMenuPress,
}: MFLoginScreenProps) => {
  const [countryCode, setCountryCode] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [mpin, setMpin] = useState('');

  const [showMPIN, setShowMPIN] = useState(false);
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [showLanguagePicker, setShowLanguagePicker] = useState(false);

  const [language, setLanguage] = useState('English');

  const isLoginEnabled = useMemo(() => {
    return (
      countryCode.trim().length > 0 &&
      mobileNumber.trim().length >= 10 &&
      mpin.trim().length === MAX_MPIN_LENGTH
    );
  }, [countryCode, mobileNumber, mpin]);

  const handleMobileChange = (value: string) => {
    const numericValue = value.replace(/\D/g, '');
    setMobileNumber(numericValue);
  };

  const handleMPINChange = (value: string) => {
    const numericValue = value
      .replace(/\D/g, '')
      .slice(0, MAX_MPIN_LENGTH);

    setMpin(numericValue);
  };

  const handleLogin = () => {
    if (!isLoginEnabled) {
      return;
    }

    onLogin?.(countryCode, mobileNumber, mpin);
  };

  const selectCountry = (country: Country) => {
    setCountryCode(country.code);
    setShowCountryPicker(false);
  };

  return (
    <View style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* =========================================================
            HEADER
        ========================================================= */}
        <View style={styles.header}>
          <Pressable
            style={styles.menuButton}
            onPress={onMenuPress}
            hitSlop={8}
          >
            <Menu size={21} color="#FFFFFF" strokeWidth={2} />
          </Pressable>

          <Text style={styles.headerTitle}>Miracle Banking</Text>

          <Pressable
            style={styles.languageButton}
            onPress={() => setShowLanguagePicker(true)}
          >
            <Globe size={14} color="#555555" strokeWidth={2} />

            <Text style={styles.languageText}>
              {language}
            </Text>

            <ChevronDown
              size={14}
              color="#555555"
              strokeWidth={2}
            />
          </Pressable>
        </View>

        {/* =========================================================
            BACKGROUND
        ========================================================= */}
        <View style={styles.background}>
          {/* Decorative banking pattern */}
          <View pointerEvents="none" style={styles.pattern}>
            {Array.from({ length: 30 }).map((_, index) => (
              <View
                key={index}
                style={styles.patternItem}
              >
                <Building2
                  size={30}
                  color="#B9DCDD"
                  strokeWidth={1.2}
                />
              </View>
            ))}
          </View>

          <ScrollView
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* =====================================================
                LOGIN CARD
            ===================================================== */}
            <View style={styles.loginCard}>

              {/* Title */}
              <Text style={styles.loginTitle}>
                Login
              </Text>

              {/* ===================================================
                  COUNTRY CODE
              =================================================== */}
              <View style={styles.fieldContainer}>
                <Text style={styles.label}>
                  Country Code
                  <Text style={styles.required}>*</Text>
                </Text>

                <Pressable
                  style={styles.selectInput}
                  onPress={() => setShowCountryPicker(true)}
                >
                  <Text
                    style={[
                      styles.selectText,
                      !countryCode && styles.placeholder,
                    ]}
                  >
                    {countryCode
                      ? COUNTRY_CODES.find(
                          item => item.code === countryCode,
                        )?.name || countryCode
                      : 'Select Country Code'}
                  </Text>

                  <ChevronDown
                    size={16}
                    color="#8C969E"
                    strokeWidth={1.8}
                  />
                </Pressable>
              </View>

              {/* ===================================================
                  MOBILE NUMBER
              =================================================== */}
              <View style={styles.fieldContainer}>
                <Text style={styles.label}>
                  Mobile Number
                  <Text style={styles.required}>*</Text>
                </Text>

                <View style={styles.inputWrapper}>
                  <Phone
                    size={15}
                    color="#8D969E"
                    strokeWidth={1.7}
                  />

                  <TextInput
                    value={mobileNumber}
                    onChangeText={handleMobileChange}
                    placeholder="Enter Mobile Number"
                    placeholderTextColor="#A3ACB5"
                    keyboardType="phone-pad"
                    maxLength={15}
                    style={styles.textInput}
                  />
                </View>
              </View>

              {/* ===================================================
                  MPIN
              =================================================== */}
              <View style={styles.fieldContainer}>
                <Text style={styles.label}>
                  MPIN
                  <Text style={styles.required}>*</Text>
                </Text>

                <View style={styles.inputWrapper}>
                  <Lock
                    size={15}
                    color="#8D969E"
                    strokeWidth={1.7}
                  />

                  <TextInput
                    value={mpin}
                    onChangeText={handleMPINChange}
                    placeholder="Enter MPIN"
                    placeholderTextColor="#A3ACB5"
                    secureTextEntry={!showMPIN}
                    keyboardType="number-pad"
                    maxLength={MAX_MPIN_LENGTH}
                    style={styles.textInput}
                  />

                  <Pressable
                    onPress={() => setShowMPIN(prev => !prev)}
                    hitSlop={8}
                    style={styles.iconButton}
                  >
                    {showMPIN ? (
                      <EyeOff
                        size={17}
                        color="#63717A"
                      />
                    ) : (
                      <Eye
                        size={17}
                        color="#63717A"
                      />
                    )}
                  </Pressable>

                  <Pressable
                    onPress={() => {
                      // Native keyboard will open when input is focused.
                    }}
                    hitSlop={8}
                    style={styles.iconButton}
                  >
                    <Keyboard
                      size={16}
                      color="#12B8B0"
                    />
                  </Pressable>
                </View>
              </View>

              {/* ===================================================
                  LINKS
              =================================================== */}
              <View style={styles.linkRow}>
                <Pressable onPress={onNotYou}>
                  <Text style={styles.link}>
                    Not You?
                  </Text>
                </Pressable>

                <Pressable onPress={onForgotMPIN}>
                  <Text style={styles.link}>
                    Forgot MPIN
                  </Text>
                </Pressable>
              </View>

              {/* ===================================================
                  LOGIN BUTTON
              =================================================== */}
              <Pressable
                onPress={handleLogin}
                disabled={!isLoginEnabled}
                style={[
                  styles.loginButton,
                  isLoginEnabled
                    ? styles.loginButtonEnabled
                    : styles.loginButtonDisabled,
                ]}
              >
                <Text style={styles.loginButtonText}>
                  Login
                </Text>
              </Pressable>

              {/* ===================================================
                  OPEN ACCOUNT
              =================================================== */}
              <Pressable
                onPress={onOpenAccount}
                style={styles.openAccountButton}
              >
                <Text style={styles.openAccountText}>
                  Don't have Account? Open Now
                </Text>
              </Pressable>
            </View>
          </ScrollView>
        </View>

        {/* =========================================================
            COUNTRY CODE MODAL
        ========================================================= */}
        <Modal
          visible={showCountryPicker}
          transparent
          animationType="fade"
          onRequestClose={() => setShowCountryPicker(false)}
        >
          <Pressable
            style={styles.modalOverlay}
            onPress={() => setShowCountryPicker(false)}
          >
            <Pressable
              style={styles.countryModal}
              onPress={event => event.stopPropagation()}
            >
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>
                  Select Country Code
                </Text>

                <Pressable
                  onPress={() => setShowCountryPicker(false)}
                >
                  <Text style={styles.closeText}>
                    ×
                  </Text>
                </Pressable>
              </View>

              {COUNTRY_CODES.map(country => (
                <Pressable
                  key={country.code}
                  style={styles.countryItem}
                  onPress={() => selectCountry(country)}
                >
                  <Text style={styles.countryCode}>
                    {country.code}
                  </Text>

                  <Text style={styles.countryName}>
                    {country.name}
                  </Text>

                  <ChevronRight
                    size={16}
                    color="#A0A8AE"
                  />
                </Pressable>
              ))}
            </Pressable>
          </Pressable>
        </Modal>

        {/* =========================================================
            LANGUAGE MODAL
        ========================================================= */}
        <Modal
          visible={showLanguagePicker}
          transparent
          animationType="fade"
          onRequestClose={() => setShowLanguagePicker(false)}
        >
          <Pressable
            style={styles.modalOverlay}
            onPress={() => setShowLanguagePicker(false)}
          >
            <Pressable
              style={styles.languageModal}
              onPress={event => event.stopPropagation()}
            >
              <Text style={styles.modalTitle}>
                Select Language
              </Text>

              <Pressable
                style={styles.languageOption}
                onPress={() => {
                  setLanguage('English');
                  setShowLanguagePicker(false);
                }}
              >
                <Text style={styles.languageOptionText}>
                  English
                </Text>
              </Pressable>

              <Pressable
                style={styles.languageOption}
                onPress={() => {
                  setLanguage('العربية');
                  setShowLanguagePicker(false);
                }}
              >
                <Text style={styles.languageOptionText}>
                  العربية
                </Text>
              </Pressable>
            </Pressable>
          </Pressable>
        </Modal>
      </KeyboardAvoidingView>
    </View>
  );
};

export default MFLoginScreen;

/* ================================================================
   STYLES
================================================================ */

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#EAF7F7',
  },

  container: {
    flex: 1,
  },

  /* ---------------------------------------------------------------
     HEADER
  --------------------------------------------------------------- */

  header: {
    height: 50,
    backgroundColor: '#12B8B0',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 3,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    zIndex: 10,
  },

  menuButton: {
    width: 30,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },

  headerTitle: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    marginLeft: 2,
  },

  languageButton: {
    height: 32,
    minWidth: 94,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 11,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
  },

  languageText: {
    color: '#4E565B',
    fontSize: 11,
    fontWeight: '500',
  },

  /* ---------------------------------------------------------------
     BACKGROUND
  --------------------------------------------------------------- */

  background: {
    flex: 1,
    backgroundColor: '#EAF7F7',
  },

  pattern: {
     ...StyleSheet.absoluteFill,
    flexDirection: 'row',
    flexWrap: 'wrap',
    opacity: 0.42,
    paddingTop: 10,
    paddingHorizontal: 4,
  },

  patternItem: {
    width: '25%',
    height: 72,
    alignItems: 'center',
    justifyContent: 'center',
  },

  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingTop: 91,
    paddingBottom: 30,
  },

  /* ---------------------------------------------------------------
     LOGIN CARD
  --------------------------------------------------------------- */

  loginCard: {
    width: '100%',
    maxWidth: 390,
    alignSelf: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 17,

    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: {
      width: 0,
      height: 5,
    },

    elevation: 5,
  },

  loginTitle: {
    textAlign: 'center',
    color: '#222222',
    fontSize: 19,
    fontWeight: '700',
    marginBottom: 11,
  },

  /* ---------------------------------------------------------------
     FORM
  --------------------------------------------------------------- */

  fieldContainer: {
    marginBottom: 15,
  },

  label: {
    color: '#222222',
    fontSize: 11.5,
    fontWeight: '500',
    marginBottom: 5,
  },

  required: {
    color: '#E63946',
  },

  selectInput: {
    height: 31,
    borderWidth: 1,
    borderColor: '#DCE1E5',
    borderRadius: 6,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
  },

  selectText: {
    color: '#4C565D',
    fontSize: 11,
    flex: 1,
  },

  placeholder: {
    color: '#8E979F',
  },

  inputWrapper: {
    height: 31,
    borderWidth: 1,
    borderColor: '#DCE1E5',
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 9,
    backgroundColor: '#FFFFFF',
  },

  textInput: {
    flex: 1,
    height: '100%',
    paddingHorizontal: 7,
    paddingVertical: 0,
    color: '#30383D',
    fontSize: 11,
  },

  iconButton: {
    marginLeft: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },

  /* ---------------------------------------------------------------
     LINKS
  --------------------------------------------------------------- */

  linkRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: -1,
    marginBottom: 9,
  },

  link: {
    color: '#12AFA8',
    fontSize: 9.5,
    fontWeight: '500',
  },

  /* ---------------------------------------------------------------
     LOGIN BUTTON
  --------------------------------------------------------------- */

  loginButton: {
    height: 29,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },

  loginButtonEnabled: {
    backgroundColor: '#12B8B0',
  },

  loginButtonDisabled: {
    backgroundColor: '#9AA5AD',
  },

  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 11.5,
    fontWeight: '700',
  },

  /* ---------------------------------------------------------------
     OPEN ACCOUNT
  --------------------------------------------------------------- */

  openAccountButton: {
    height: 31,
    borderRadius: 6,
    marginTop: 12,
    backgroundColor: '#12B8B0',
    alignItems: 'center',
    justifyContent: 'center',
  },

  openAccountText: {
    color: '#FFFFFF',
    fontSize: 10.5,
    fontWeight: '700',
  },

  /* ---------------------------------------------------------------
     MODALS
  --------------------------------------------------------------- */

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    paddingHorizontal: 25,
  },

  countryModal: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 15,
    shadowOffset: {
      width: 0,
      height: 5,
    },
  },

  languageModal: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 18,
    elevation: 8,
  },

  modalHeader: {
    height: 52,
    paddingHorizontal: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  modalTitle: {
    color: '#222222',
    fontSize: 15,
    fontWeight: '700',
  },

  closeText: {
    color: '#777777',
    fontSize: 27,
    lineHeight: 27,
  },

  countryItem: {
    minHeight: 48,
    paddingHorizontal: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F1F1',
    flexDirection: 'row',
    alignItems: 'center',
  },

  countryCode: {
    width: 55,
    color: '#12AFA8',
    fontSize: 13,
    fontWeight: '700',
  },

  countryName: {
    flex: 1,
    color: '#333333',
    fontSize: 13,
  },

  languageOption: {
    height: 48,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
    justifyContent: 'center',
  },

  languageOptionText: {
    color: '#333333',
    fontSize: 14,
  },
});
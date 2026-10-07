import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Keyboard,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

import Svg, {
  Circle,
  Path,
  Polyline,
} from 'react-native-svg';

// import { useAppModal } from '../../context/AppModalContext';
// import { forgotPassword } from '../../services/ReqServiceApi/ReqServiceApi';
import { LanguageContext } from '../../localization/LanguageContext';
import countryList from '../../assets/country-codes.json';

interface StepAccountProps {
  onNext: () => void;
  setCif: (value: string) => void;
}

interface Country {
  code: string;
  name: string;
}

interface CountryOption extends Country {
  value: string;
  label: string;
}

const StepAccount: React.FC<StepAccountProps> = ({
  onNext,
  setCif,
}) => {
  const [UserID, setUserID] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [error, setError] = useState('');
  const [touched, setTouched] = useState(false);

  const [selectedCountry, setSelectedCountry] = useState<Country>({
    code: '',
    name: '',
  });

  const [countryError, setCountryError] = useState('');
  const [countryTouched, setCountryTouched] = useState(false);

  const [countryModalVisible, setCountryModalVisible] = useState(false);
  const [countrySearch, setCountrySearch] = useState('');

  const countrySelectedRef = useRef(false);

  // const { showModal } = useAppModal();

  const languageContext = useContext(LanguageContext);
  const translations = languageContext?.translations;
  const language = languageContext?.language || 'en';

  const isArabic = language === 'ar';

  /*
   * Translation helper
   */
  const t = (key: string, fallback: string): string => {
    try {
      if (!translations) {
        return fallback;
      }

      const keys = key.split('.');
      let value: unknown = translations;

      for (const k of keys) {
        if (
          typeof value === 'object' &&
          value !== null &&
          k in value
        ) {
          value = (value as Record<string, unknown>)[k];
        } else {
          return fallback;
        }
      }

      return typeof value === 'string' ? value : fallback;
    } catch {
      return fallback;
    }
  };

  /*
   * Reset validation when language changes
   */
  useEffect(() => {
    setError('');
    setTouched(false);
    setCountryError('');
    setCountryTouched(false);
  }, [language]);

  /*
   * User ID validation
   */
  const isValidUserId =
    UserID.length >= 7 && UserID.length <= 15 && !/^0+$/.test(UserID);

  const hasValue = UserID.length > 0;

  const hasError = touched && !!error;

  /*
   * Country options
   */
  const options: CountryOption[] = useMemo(() => {
    return (countryList as Country[]).map((country) => ({
      value: country.code,
      label: `${country.code} — ${country.name}`,
      code: country.code,
      name: country.name,
    }));
  }, []);

  /*
   * Filter countries
   */
  const filteredCountries = useMemo(() => {
    const search = countrySearch.trim().toLowerCase();

    if (!search) {
      return options;
    }

    return options.filter(
      country =>
        country.name.toLowerCase().includes(search) ||
        country.code.toLowerCase().includes(search),
    );
  }, [countrySearch, options]);

  /*
   * Validate mobile number
   */
  const validate = () => {
    const trimmed = UserID.trim();

    if (!trimmed) {
      setError(
        t(
          'validation.mblReq',
          'Mobile number is required',
        ),
      );

      return false;
    }

    if (trimmed.length < 7 || trimmed.length > 15) {
      setError(
        t(
          'validation.mblNum',
          'Mobile number must be 7 to 15 digits',
        ),
      );

      return false;
    }

    if (/^0+$/.test(trimmed)) {
      setError(
        t(
          'validation.mobileNotZero',
          'Mobile Number should not be 0',
        ),
      );

      return false;
    }

    setError('');

    return true;
  };

  /*
   * Validate country
   */
  const validateCountry = () => {
    if (!selectedCountry.code) {
      setCountryError(
        t(
          'validation.selectCountry',
          'Please select a country code',
        ),
      );

      return false;
    }

    setCountryError('');

    return true;
  };

  /*
   * Open country selector
   */
  const openCountrySelector = () => {
    if (isLoading) {
      return;
    }

    Keyboard.dismiss();

    countrySelectedRef.current = false;

    if (selectedCountry.code) {
      setCountryTouched(false);
      setCountryError('');
    }

    setCountrySearch('');
    setCountryModalVisible(true);
  };

  /*
   * Close country selector
   */
  const closeCountrySelector = () => {
    setCountryModalVisible(false);

    if (
      !countrySelectedRef.current &&
      !selectedCountry.code
    ) {
      setCountryTouched(true);

      setCountryError(
        t(
          'validation.selectCountry',
          'Please select a country code',
        ),
      );
    }
  };

  /*
   * Select country
   */
  const handleCountrySelect = (country: CountryOption) => {
    countrySelectedRef.current = true;

    setSelectedCountry({
      code: country.code,
      name: country.name,
    });

    setCountryTouched(false);
    setCountryError('');
    setCountryModalVisible(false);
    setCountrySearch('');
  };

  /*
   * Submit
   */
  const handleSubmit = async () => {
    setCountryTouched(true);

    const isUserValid = validate();
    const isCountryValid = validateCountry();

    const mergeCodeWithNumber =
      selectedCountry.code.replace(/[+\s]/g, '') +
      UserID;

    setTouched(true);

    if (!isUserValid || !isCountryValid) {
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      /*
       * ==========================================
       * API CODE
       * ==========================================
       *
       * Uncomment when API integration is required.
       */

      /*
      const response = await forgotPassword(
        mergeCodeWithNumber,
      );

      const resultMessage = response?.ResultMessage;

      const parsedResult = resultMessage
        ? JSON.parse(resultMessage)
        : null;

      const statusCode =
        parsedResult?.statusCode?.trim();

      const messageText =
        parsedResult?.Message
          ?.replace(/\s+/g, ' ')
          .trim();

      if (statusCode === '00') {
        setCif(mergeCodeWithNumber);
        onNext();
      } else if (statusCode === '01') {
        showModal({
          type: 'error',
          title: 'Failure',
          message: messageText,
          width: 400,
          height: 'h-32',
        });

        setUserID('');
      } else {
        showModal({
          type: 'error',
          title: 'Unexpected Response',
          message:
            'Received unknown status code from server.',
          width: 400,
          height: 'h-32',
        });

        setUserID('');
      }
      */

      /*
       * ==========================================
       * TEMPORARY UI TEST
       * ==========================================
       *
       * Remove this block when API is enabled.
       */

      await new Promise<void>(resolve =>
        setTimeout(resolve, 500),
      );

      setCif(mergeCodeWithNumber);

      // showModal({
      //   type: 'success',
      //   title: 'Account Details',
      //   message: 'Account details validated successfully.',
      //   width: 400,
      //   height: 'h-32',
      // });

      onNext();
    } catch (err) {
      console.error('Forgot Password Error:', err);

      // showModal({
      //   type: 'error',
      //   title: 'Request Error',
      //   message:
      //     'Something went wrong while validating your account. Please try again.',
      //   width: 450,
      //   height: 'h-36',
      // });

      setUserID('');
    } finally {
      setIsLoading(false);
    }
  };

  /*
   * Mobile number change
   */
  const handleUserIdChange = (value: string) => {
    const onlyDigits = value.replace(/\D/g, '');

    setUserID(onlyDigits);

    if (error) {
      setError('');
    }
  };

  /*
   * Mobile number blur
   */
  const handleUserIdBlur = () => {
    const onlyDigits = UserID.replace(/\D/g, '');

    setUserID(onlyDigits);
    setTouched(true);

    validate();
  };

  /*
   * Country border color
   */
  const countryBorderColor =
    countryError && countryTouched
      ? '#f87171'
      : selectedCountry.code
        ? '#12A89F'
        : '#d1d5db';

  return (
    <View style={styles.container}>

      {/* =========================================
          COUNTRY CODE
      ========================================= */}

      <View style={styles.fieldContainer}>

        <Text
          style={[
            styles.label,
            {
              textAlign: isArabic ? 'right' : 'left',
            },
          ]}
        >
          {t(
            'register.fields.countryCode',
            'Country Code',
          )}{' '}
          <Text style={styles.required}>*</Text>
        </Text>

        <Pressable
          disabled={isLoading}
          onPress={openCountrySelector}
          style={[
            styles.countrySelector,
            {
              borderColor: countryBorderColor,
              flexDirection: isArabic
                ? 'row-reverse'
                : 'row',
            },
          ]}
        >
          <Text
            numberOfLines={1}
            style={[
              styles.countryText,
              {
                color: selectedCountry.code
                  ? '#20242A'
                  : '#9CA3AF',
                textAlign: isArabic
                  ? 'right'
                  : 'left',
              },
            ]}
          >
            {selectedCountry.code
              ? `${selectedCountry.code} — ${selectedCountry.name}`
              : t(
                  'register.selectCountryCode',
                  'Select Country Code',
                )}
          </Text>

          <ChevronDownIcon
            size={18}
            color="#6B7280"
          />
        </Pressable>

        {/* Country validation icon */}
        {countryTouched && countryError && (
          <View
            style={[
              styles.validationIcon,
              isArabic
                ? styles.validationIconLeft
                : styles.validationIconRight,
            ]}
          >
            <AlertCircleIcon
              size={16}
              color="#DC2626"
            />
          </View>
        )}

        {countryTouched && countryError ? (
          <Text
            style={[
              styles.errorText,
              {
                textAlign: isArabic
                  ? 'right'
                  : 'left',
              },
            ]}
          >
            {countryError}
          </Text>
        ) : (
          <View style={styles.errorPlaceholder} />
        )}
      </View>

      {/* =========================================
          MOBILE NUMBER
      ========================================= */}

      <View style={styles.fieldContainer}>

        <Text
          style={[
            styles.label,
            {
              textAlign: isArabic ? 'right' : 'left',
            },
          ]}
        >
          {t(
            'register.fields.mobileNumber',
            'Mobile Number',
          )}{' '}
          <Text style={styles.required}>*</Text>
        </Text>

        <View style={styles.mobileInputContainer}>

          {/* Phone icon */}
          <View
            style={[
              styles.phoneIconContainer,
              isArabic
                ? styles.phoneIconRight
                : styles.phoneIconLeft,
              {
                backgroundColor: hasValue
                  ? '#E0F7F5'
                  : '#FFFFFF',
              },
            ]}
          >
            <PhoneIcon
              size={15}
              color={
                hasValue
                  ? '#12A89F'
                  : '#6B7280'
              }
            />
          </View>

          <TextInput
            value={UserID}
            onChangeText={handleUserIdChange}
            onBlur={handleUserIdBlur}
            editable={!isLoading}
            keyboardType="number-pad"
            maxLength={15}
            autoCorrect={false}
            autoCapitalize="none"
            placeholder={t(
              'register.placeHolder.mobileNumber',
              'Enter Mobile Number',
            )}
            placeholderTextColor="#9CA3AF"
            style={[
              styles.mobileInput,
              {
                textAlign: isArabic
                  ? 'right'
                  : 'left',

                paddingLeft: isArabic
                  ? 12
                  : 42,

                paddingRight: isArabic
                  ? 42
                  : 12,

                borderColor: hasError
                  ? '#f87171'
                  : hasValue
                    ? '#12A89F'
                    : '#d1d5db',

                backgroundColor: '#FFFFFF',
                color: '#20242A',
              },
            ]}
          />

          {/* Success / error icon */}
          {hasValue &&
            !hasError &&
            isValidUserId && (
              <View
                style={[
                  styles.validationIcon,
                  isArabic
                    ? styles.validationIconLeft
                    : styles.validationIconRight,
                ]}
              >
                <CheckCircleIcon
                  size={16}
                  color="#12A89F"
                />
              </View>
            )}

          {hasError && (
            <View
              style={[
                styles.validationIcon,
                isArabic
                  ? styles.validationIconLeft
                  : styles.validationIconRight,
              ]}
            >
              <AlertCircleIcon
                size={16}
                color="#DC2626"
              />
            </View>
          )}
        </View>

        {hasError ? (
          <Text
            style={[
              styles.errorText,
              {
                textAlign: isArabic
                  ? 'right'
                  : 'left',
              },
            ]}
          >
            {error}
          </Text>
        ) : (
          <View style={styles.errorPlaceholder} />
        )}
      </View>

      {/* =========================================
          NEXT BUTTON
      ========================================= */}

      <View style={styles.buttonContainer}>

        <Pressable
          disabled={isLoading}
          onPress={handleSubmit}
          style={({ pressed }) => [
            styles.nextButton,
            {
              backgroundColor: isLoading
                ? '#9CA3AF'
                : pressed
                  ? '#2BB5AC'
                  : '#3EC6BC',
            },
          ]}
        >
          {isLoading ? (
            <View style={styles.buttonContent}>
              <ActivityIndicator
                size="small"
                color="#FFFFFF"
              />

              <Text style={styles.buttonText}>
                {t(
                  'forgotPassword.processing',
                  'Processing...',
                )}
              </Text>
            </View>
          ) : (
            <View style={styles.buttonContent}>
              <CheckCircleIcon
                size={16}
                color="#FFFFFF"
              />

              <Text style={styles.buttonText}>
                {t(
                  'forgotPassword.next',
                  'Next',
                )}
              </Text>
            </View>
          )}
        </Pressable>

      </View>

      {/* =========================================
          COUNTRY MODAL
      ========================================= */}

      <Modal
        visible={countryModalVisible}
        transparent
        animationType="fade"
        onRequestClose={closeCountrySelector}
      >
        <TouchableWithoutFeedback
          onPress={closeCountrySelector}
        >
          <View style={styles.modalOverlay}>

            <TouchableWithoutFeedback>
              <View
                style={[
                  styles.countryModal,
                  {
                    direction: isArabic
                      ? 'rtl'
                      : 'ltr',
                  },
                ]}
              >

                {/* Modal header */}
                <View
                  style={[
                    styles.modalHeader,
                    {
                      flexDirection: isArabic
                        ? 'row-reverse'
                        : 'row',
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.modalTitle,
                      {
                        textAlign: isArabic
                          ? 'right'
                          : 'left',
                      },
                    ]}
                  >
                    {t(
                      'register.selectCountryCode',
                      'Select Country Code',
                    )}
                  </Text>

                  <Pressable
                    onPress={closeCountrySelector}
                    style={styles.closeButton}
                  >
                    <Text style={styles.closeText}>
                      ×
                    </Text>
                  </Pressable>
                </View>

                {/* Search */}
                <TextInput
                  value={countrySearch}
                  onChangeText={value =>
                    setCountrySearch(
                      value.replace(
                        /[^a-zA-Z0-9\s]/g,
                        '',
                      ),
                    )
                  }
                  placeholder={t(
                    'register.searchCountry',
                    'Search country',
                  )}
                  placeholderTextColor="#9CA3AF"
                  autoCorrect={false}
                  style={[
                    styles.searchInput,
                    {
                      textAlign: isArabic
                        ? 'right'
                        : 'left',
                    },
                  ]}
                />

                {/* Country list */}
                <FlatList
                  data={filteredCountries}
                  keyExtractor={item =>
                    `${item.code}-${item.name}`
                  }
                  keyboardShouldPersistTaps="handled"
                  showsVerticalScrollIndicator
                  style={styles.countryList}
                  renderItem={({ item }) => {
                    const isSelected =
                      item.code ===
                        selectedCountry.code &&
                      item.name ===
                        selectedCountry.name;

                    return (
                      <Pressable
                        onPress={() =>
                          handleCountrySelect(
                            item,
                          )
                        }
                        style={({ pressed }) => [
                          styles.countryItem,
                          {
                            flexDirection:
                              isArabic
                                ? 'row-reverse'
                                : 'row',

                            backgroundColor:
                              pressed
                                ? '#F1F5F5'
                                : isSelected
                                  ? '#E0F7F5'
                                  : '#FFFFFF',
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.countryCode,
                            {
                              textAlign:
                                isArabic
                                  ? 'right'
                                  : 'left',
                            },
                          ]}
                        >
                          {item.code}
                        </Text>

                        <Text
                          numberOfLines={1}
                          style={[
                            styles.countryName,
                            {
                              textAlign:
                                isArabic
                                  ? 'right'
                                  : 'left',
                            },
                          ]}
                        >
                          {item.name}
                        </Text>

                        {isSelected && (
                          <CheckCircleIcon
                            size={18}
                            color="#12A89F"
                          />
                        )}
                      </Pressable>
                    );
                  }}
                  ListEmptyComponent={
                    <View
                      style={
                        styles.emptyCountryContainer
                      }
                    >
                      <Text
                        style={
                          styles.emptyCountryText
                        }
                      >
                        {t(
                          'register.noCountriesFound',
                          'No countries found',
                        )}
                      </Text>
                    </View>
                  }
                />

              </View>
            </TouchableWithoutFeedback>

          </View>
        </TouchableWithoutFeedback>
      </Modal>

    </View>
  );
};

export default StepAccount;

/* =========================================================
   SVG ICONS
========================================================= */

interface IconProps {
  size?: number;
  color?: string;
}

const CheckCircleIcon: React.FC<IconProps> = ({
  size = 20,
  color = '#12A89F',
}) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
  >
    <Circle
      cx="12"
      cy="12"
      r="9"
      stroke={color}
      strokeWidth="2"
    />

    <Polyline
      points="8,12 11,15 16,9"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const AlertCircleIcon: React.FC<IconProps> = ({
  size = 20,
  color = '#DC2626',
}) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
  >
    <Circle
      cx="12"
      cy="12"
      r="9"
      stroke={color}
      strokeWidth="2"
    />

    <Path
      d="M12 8V12"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />

    <Circle
      cx="12"
      cy="16"
      r="1"
      fill={color}
    />
  </Svg>
);

const ChevronDownIcon: React.FC<IconProps> = ({
  size = 20,
  color = '#6B7280',
}) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
  >
    <Path
      d="M6 9L12 15L18 9"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const PhoneIcon: React.FC<IconProps> = ({
  size = 20,
  color = '#6B7280',
}) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
  >
    <Path
      d="M22 16.92V19.92C22 20.47 21.55 20.92 21 20.92C10.51 20.92 3.08 13.49 3.08 3C3.08 2.45 3.53 2 4.08 2H7.08C7.58 2 8.01 2.37 8.08 2.86C8.17 3.5 8.36 4.12 8.64 4.7C8.76 4.95 8.7 5.25 8.51 5.45L6.81 7.15C8.3 10.07 10.93 12.7 13.85 14.19L15.55 12.49C15.75 12.3 16.05 12.24 16.3 12.36C16.88 12.64 17.5 12.83 18.14 12.92C18.63 12.99 19 13.42 19 13.92V16.92C19 17.47 18.55 17.92 18 17.92"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

/* =========================================================
   STYLES
========================================================= */

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },

  fieldContainer: {
    marginBottom: 8,
    position: 'relative',
  },

  label: {
    fontSize: 12,
    fontWeight: '500',
    color: '#20242A',
    marginBottom: 5,
  },

  required: {
    color: '#EF4444',
  },

  /* Country selector */

  countrySelector: {
    minHeight: 42,
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  countryText: {
    flex: 1,
    fontSize: 14,
    marginRight: 8,
  },

  /* Mobile number */

  mobileInputContainer: {
    position: 'relative',
  },

  mobileInput: {
    width: '100%',
    minHeight: 42,
    borderWidth: 1,
    borderRadius: 8,
    fontSize: 14,
  },

  phoneIconContainer: {
    position: 'absolute',
    zIndex: 2,
    top: 10,
    width: 24,
    height: 24,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },

  phoneIconLeft: {
    left: 10,
  },

  phoneIconRight: {
    right: 10,
  },

  validationIcon: {
    position: 'absolute',
    top: 13,
    zIndex: 3,
  },

  validationIconLeft: {
    left: 8,
  },

  validationIconRight: {
    right: 8,
  },

  errorText: {
    color: '#EF4444',
    fontSize: 11,
    marginTop: 3,
  },

  errorPlaceholder: {
    height: 15,
  },

  /* Button */

  buttonContainer: {
    paddingTop: 10,
  },

  nextButton: {
    width: '100%',
    minHeight: 44,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },

  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },

  /* Country modal */

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },

  countryModal: {
    width: '100%',
    maxWidth: 500,
    maxHeight: '75%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,

    elevation: 10,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },

  modalHeader: {
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },

  modalTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#20242A',
  },

  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },

  closeText: {
    fontSize: 26,
    lineHeight: 28,
    color: '#6B7280',
  },

  searchInput: {
    height: 42,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 14,
    color: '#20242A',
    marginBottom: 10,
  },

  countryList: {
    maxHeight: 350,
  },

  countryItem: {
    minHeight: 46,
    paddingHorizontal: 10,
    borderRadius: 7,
    alignItems: 'center',
    gap: 10,
  },

  countryCode: {
    width: 55,
    fontSize: 14,
    fontWeight: '500',
    color: '#20242A',
  },

  countryName: {
    flex: 1,
    fontSize: 14,
    color: '#374151',
  },

  emptyCountryContainer: {
    paddingVertical: 30,
    alignItems: 'center',
  },

  emptyCountryText: {
    fontSize: 14,
    color: '#6B7280',
  },
});
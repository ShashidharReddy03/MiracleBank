import React, {
  useContext,
  useMemo,
  useRef,
  useState,
} from 'react';
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
  Rect,
} from 'react-native-svg';

import { LanguageContext } from '../../localization/LanguageContext';
import countryList from '../../assets/country-codes.json';

export type BasicDetailsForm = {
  firstName: string;
  lastName: string;
  countryCode: string;
  countryName: string;
  mobile: string;
  email: string;
};

type StepBasicDetailsProps = {
  onCreate: (form: BasicDetailsForm) => void;
  isLoading?: boolean;
};

type Country = {
  code: string;
  name: string;
};

type CountryOption = Country & {
  value: string;
  label: string;
};

type FieldErrors = {
  firstName?: string;
  lastName?: string;
  countryCode?: string;
  mobile?: string;
  email?: string;
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const NAME_REGEX = /^[A-Za-z\s'.-]+$/;

const StepBasicDetails = ({
  onCreate,
  isLoading = false,
}: StepBasicDetailsProps) => {
  const languageContext = useContext(LanguageContext);
  const translations = languageContext?.translations;
  const language = languageContext?.language || 'en';
  const isArabic = language === 'ar';

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<Country>({
    code: '',
    name: '',
  });

  const [errors, setErrors] = useState<FieldErrors>({});
  const [touched, setTouched] = useState<Record<keyof FieldErrors, boolean>>({
    firstName: false,
    lastName: false,
    countryCode: false,
    mobile: false,
    email: false,
  });

  const [countryModalVisible, setCountryModalVisible] = useState(false);
  const [countrySearch, setCountrySearch] = useState('');
  const countrySelectedRef = useRef(false);

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

  const options: CountryOption[] = useMemo(
    () =>
      (countryList as Country[]).map(country => ({
        value: country.code,
        label: `${country.code} — ${country.name}`,
        code: country.code,
        name: country.name,
      })),
    [],
  );

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

  const validateFirstName = (value: string) => {
    const trimmed = value.trim();

    if (!trimmed) {
      return t('validation.required', 'First Name is required').includes('is required')
        ? `${t('register.fields.firstName', 'First Name')} ${t('validation.required', 'is required')}`
        : 'First Name is required';
    }

    if (trimmed.length < 2) {
      return 'First Name must be at least 2 characters';
    }

    if (!NAME_REGEX.test(trimmed)) {
      return 'Enter a valid first name';
    }

    return '';
  };

  const validateLastName = (value: string) => {
    const trimmed = value.trim();

    if (!trimmed) {
      return 'Last Name is required';
    }

    if (trimmed.length < 2) {
      return 'Last Name must be at least 2 characters';
    }

    if (!NAME_REGEX.test(trimmed)) {
      return 'Enter a valid last name';
    }

    return '';
  };

  const validateCountry = (code: string) => {
    if (!code) {
      return t(
        'validation.selectCountry',
        'Please select a country code',
      );
    }

    return '';
  };

  const validateMobile = (value: string) => {
    const digits = value.replace(/\D/g, '');

    if (!digits) {
      return t('validation.mblReq', 'Mobile number is required');
    }

    if (digits.length < 7 || digits.length > 15) {
      return t(
        'validation.mblNum',
        'Mobile number must be 7 or 15 digits',
      );
    }

    if (/^0+$/.test(digits)) {
      return t(
        'validation.mobileNotZero',
        'Mobile Number should not be 0',
      );
    }

    return '';
  };

  const validateEmail = (value: string) => {
    const trimmed = value.trim();

    if (!trimmed) {
      return 'Email Address is required';
    }

    if (!EMAIL_REGEX.test(trimmed)) {
      return t(
        'validation.validEmail',
        'Enter a valid email address',
      );
    }

    return '';
  };

  const validateAll = () => {
    const nextErrors: FieldErrors = {
      firstName: validateFirstName(firstName),
      lastName: validateLastName(lastName),
      countryCode: validateCountry(selectedCountry.code),
      mobile: validateMobile(mobile),
      email: validateEmail(email),
    };

    setErrors(nextErrors);
    setTouched({
      firstName: true,
      lastName: true,
      countryCode: true,
      mobile: true,
      email: true,
    });

    return !Object.values(nextErrors).some(Boolean);
  };

  const markTouched = (field: keyof FieldErrors) => {
    setTouched(previous => ({ ...previous, [field]: true }));
  };

  const updateFieldError = (
    field: keyof FieldErrors,
    message: string,
  ) => {
    setErrors(previous => ({
      ...previous,
      [field]: message || undefined,
    }));
  };

  const openCountrySelector = () => {
    if (isLoading) {
      return;
    }

    Keyboard.dismiss();
    countrySelectedRef.current = false;
    setCountrySearch('');
    setCountryModalVisible(true);
  };

  const closeCountrySelector = () => {
    setCountryModalVisible(false);

    if (!countrySelectedRef.current && !selectedCountry.code) {
      markTouched('countryCode');
      updateFieldError(
        'countryCode',
        t('validation.selectCountry', 'Please select a country code'),
      );
    }
  };

  const handleCountrySelect = (country: CountryOption) => {
    countrySelectedRef.current = true;
    setSelectedCountry({
      code: country.code,
      name: country.name,
    });
    markTouched('countryCode');
    updateFieldError('countryCode', '');
    setCountryModalVisible(false);
    setCountrySearch('');
  };

  const handleCreate = () => {
    if (!validateAll()) {
      return;
    }

    onCreate({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      countryCode: selectedCountry.code,
      countryName: selectedCountry.name,
      mobile: mobile.replace(/\D/g, ''),
      email: email.trim().toLowerCase(),
    });
  };

  const firstNameError = touched.firstName ? errors.firstName : '';
  const lastNameError = touched.lastName ? errors.lastName : '';
  const countryError = touched.countryCode ? errors.countryCode : '';
  const mobileError = touched.mobile ? errors.mobile : '';
  const emailError = touched.email ? errors.email : '';

  const firstNameValid =
    !!firstName.trim() && !validateFirstName(firstName);
  const lastNameValid =
    !!lastName.trim() && !validateLastName(lastName);
  const countryValid = !!selectedCountry.code && !validateCountry(selectedCountry.code);
  const mobileValid =
    !!mobile.replace(/\D/g, '') && !validateMobile(mobile);
  const emailValid =
    !!email.trim() && !validateEmail(email);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          {t('register.title', 'Account Registration')}
        </Text>

        <View style={styles.iconCircle}>
          <IdCardIcon width={28} height={28} color="#FFFFFF" />
        </View>

        <Text style={styles.subtitle}>
          {t('register.subTitle', 'Basic Details')}
        </Text>
      </View>

      {/* First Name */}
      <ValidatedField
        label={`${t('register.fields.firstName', 'First Name')} *`}
        isArabic={isArabic}
        error={firstNameError}
        isValid={firstNameValid}
        leftIcon={
          <UserIcon
            size={16}
            color={firstNameValid ? '#12A89F' : '#6B7280'}
          />
        }
      >
        <TextInput
          value={firstName}
          onChangeText={value => {
            setFirstName(value);
            if (touched.firstName) {
              updateFieldError('firstName', validateFirstName(value));
            }
          }}
          onBlur={() => {
            markTouched('firstName');
            updateFieldError('firstName', validateFirstName(firstName));
          }}
          editable={!isLoading}
          placeholder={t(
            'register.placeHolder.firstName',
            'Enter your first name',
          )}
          placeholderTextColor="#9CA3AF"
          autoCapitalize="words"
          style={[
            styles.input,
            {
              textAlign: isArabic ? 'right' : 'left',
              borderColor: firstNameError
                ? '#F87171'
                : firstNameValid
                  ? '#12A89F'
                  : '#D1D5DB',
            },
          ]}
        />
      </ValidatedField>

      {/* Last Name */}
      <ValidatedField
        label={`${t('register.fields.lastName', 'Last Name')} *`}
        isArabic={isArabic}
        error={lastNameError}
        isValid={lastNameValid}
        leftIcon={
          <UserIcon
            size={16}
            color={lastNameValid ? '#12A89F' : '#6B7280'}
          />
        }
      >
        <TextInput
          value={lastName}
          onChangeText={value => {
            setLastName(value);
            if (touched.lastName) {
              updateFieldError('lastName', validateLastName(value));
            }
          }}
          onBlur={() => {
            markTouched('lastName');
            updateFieldError('lastName', validateLastName(lastName));
          }}
          editable={!isLoading}
          placeholder={t(
            'register.placeHolder.lastName',
            'Enter your last name',
          )}
          placeholderTextColor="#9CA3AF"
          autoCapitalize="words"
          style={[
            styles.input,
            {
              textAlign: isArabic ? 'right' : 'left',
              borderColor: lastNameError
                ? '#F87171'
                : lastNameValid
                  ? '#12A89F'
                  : '#D1D5DB',
            },
          ]}
        />
      </ValidatedField>

      {/* Country Code */}
      <ValidatedField
        label={`${t('register.fields.countryCode', 'Country Code')} *`}
        isArabic={isArabic}
        error={countryError}
        isValid={countryValid}
        showSuccessIcon={false}
        hideStatusIcon
      >
        <Pressable
          disabled={isLoading}
          onPress={openCountrySelector}
          style={[
            styles.countrySelector,
            {
              borderColor: countryError
                ? '#F87171'
                : countryValid
                  ? '#12A89F'
                  : '#D1D5DB',
              flexDirection: isArabic ? 'row-reverse' : 'row',
            },
          ]}
        >
          <Text
            numberOfLines={1}
            style={[
              styles.countryText,
              {
                color: selectedCountry.code ? '#20242A' : '#9CA3AF',
                textAlign: isArabic ? 'right' : 'left',
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

          {countryError ? (
            <AlertCircleIcon size={18} color="#DC2626" />
          ) : (
            <ChevronDownIcon size={18} color="#6B7280" />
          )}
        </Pressable>
      </ValidatedField>

      {/* Mobile Number */}
      <ValidatedField
        label={`${t('register.fields.mobileNumber', 'Mobile Number')} *`}
        isArabic={isArabic}
        error={mobileError}
        isValid={mobileValid}
        leftIcon={
          <PhoneIcon
            size={15}
            color={mobileValid ? '#12A89F' : '#6B7280'}
          />
        }
      >
        <TextInput
          value={mobile}
          onChangeText={value => {
            const digits = value.replace(/\D/g, '').slice(0, 15);
            setMobile(digits);
            if (touched.mobile) {
              updateFieldError('mobile', validateMobile(digits));
            }
          }}
          onBlur={() => {
            markTouched('mobile');
            updateFieldError('mobile', validateMobile(mobile));
          }}
          editable={!isLoading}
          keyboardType="number-pad"
          maxLength={15}
          placeholder={t(
            'register.placeHolder.mobileNumber',
            'Enter Mobile Number',
          )}
          placeholderTextColor="#9CA3AF"
          style={[
            styles.input,
            {
              textAlign: isArabic ? 'right' : 'left',
              borderColor: mobileError
                ? '#F87171'
                : mobileValid
                  ? '#12A89F'
                  : '#D1D5DB',
            },
          ]}
        />
      </ValidatedField>

      {/* Email */}
      <ValidatedField
        label={`${t('register.fields.emailAddress', 'Email Address')} *`}
        isArabic={isArabic}
        error={emailError}
        isValid={emailValid}
        leftIcon={
          <MailIcon
            size={16}
            color={emailValid ? '#12A89F' : '#6B7280'}
          />
        }
      >
        <TextInput
          value={email}
          onChangeText={value => {
            setEmail(value);
            if (touched.email) {
              updateFieldError('email', validateEmail(value));
            }
          }}
          onBlur={() => {
            markTouched('email');
            updateFieldError('email', validateEmail(email));
          }}
          editable={!isLoading}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          placeholder={t(
            'register.placeHolder.emailAddress',
            'Enter your email address',
          )}
          placeholderTextColor="#9CA3AF"
          style={[
            styles.input,
            {
              textAlign: isArabic ? 'right' : 'left',
              borderColor: emailError
                ? '#F87171'
                : emailValid
                  ? '#12A89F'
                  : '#D1D5DB',
            },
          ]}
        />
      </ValidatedField>

      <Pressable
        disabled={isLoading}
        onPress={handleCreate}
        style={({ pressed }) => [
          styles.createButton,
          {
            backgroundColor: isLoading
              ? '#9CA3AF'
              : pressed
                ? '#0F998F'
                : '#12A89F',
          },
        ]}
      >
        {isLoading ? (
          <View style={styles.buttonContent}>
            <ActivityIndicator size="small" color="#FFFFFF" />
            <Text style={styles.buttonText}>
              {t('forgotPassword.processing', 'Processing...')}
            </Text>
          </View>
        ) : (
          <View style={styles.buttonContent}>
            <CheckCircleIcon size={16} color="#FFFFFF" />
            <Text style={styles.buttonText}>
              {t('register.create', 'Create')}
            </Text>
          </View>
        )}
      </Pressable>

      <Modal
        visible={countryModalVisible}
        transparent
        animationType="fade"
        onRequestClose={closeCountrySelector}
      >
        <TouchableWithoutFeedback onPress={closeCountrySelector}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.countryModal}>
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
                  <Text style={styles.modalTitle}>
                    {t(
                      'register.selectCountryCode',
                      'Select Country Code',
                    )}
                  </Text>

                  <Pressable
                    onPress={closeCountrySelector}
                    style={styles.closeButton}
                  >
                    <Text style={styles.closeText}>×</Text>
                  </Pressable>
                </View>

                <TextInput
                  value={countrySearch}
                  onChangeText={value =>
                    setCountrySearch(
                      value.replace(/[^a-zA-Z0-9\s+]/g, ''),
                    )
                  }
                  placeholder={t(
                    'register.searchCountry',
                    'Search country',
                  )}
                  placeholderTextColor="#9CA3AF"
                  style={[
                    styles.searchInput,
                    { textAlign: isArabic ? 'right' : 'left' },
                  ]}
                />

                <FlatList
                  data={filteredCountries}
                  keyExtractor={item => `${item.code}-${item.name}`}
                  keyboardShouldPersistTaps="handled"
                  style={styles.countryList}
                  renderItem={({ item }) => {
                    const isSelected =
                      item.code === selectedCountry.code &&
                      item.name === selectedCountry.name;

                    return (
                      <Pressable
                        onPress={() => handleCountrySelect(item)}
                        style={({ pressed }) => [
                          styles.countryItem,
                          {
                            flexDirection: isArabic
                              ? 'row-reverse'
                              : 'row',
                            backgroundColor: pressed
                              ? '#F1F5F5'
                              : isSelected
                                ? '#E0F7F5'
                                : '#FFFFFF',
                          },
                        ]}
                      >
                        <Text style={styles.countryCode}>
                          {item.code}
                        </Text>
                        <Text
                          numberOfLines={1}
                          style={styles.countryName}
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
                    <View style={styles.emptyCountryContainer}>
                      <Text style={styles.emptyCountryText}>
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

type ValidatedFieldProps = {
  label: string;
  isArabic: boolean;
  error?: string;
  isValid: boolean;
  leftIcon?: React.ReactNode;
  showSuccessIcon?: boolean;
  hideStatusIcon?: boolean;
  children: React.ReactNode;
};

const ValidatedField = ({
  label,
  isArabic,
  error,
  isValid,
  leftIcon,
  showSuccessIcon = true,
  hideStatusIcon = false,
  children,
}: ValidatedFieldProps) => (
  <View style={styles.fieldContainer}>
    <Text
      style={[
        styles.label,
        { textAlign: isArabic ? 'right' : 'left' },
      ]}
    >
      {label.endsWith('*') ? (
        <>
          {label.slice(0, -1).trim()}{' '}
          <Text style={styles.required}>*</Text>
        </>
      ) : (
        label
      )}
    </Text>

    <View style={styles.inputWrapper}>
      {leftIcon ? (
        <View
          style={[
            styles.leftIcon,
            isArabic ? styles.leftIconRtl : styles.leftIconLtr,
          ]}
        >
          {leftIcon}
        </View>
      ) : null}

      <View
        style={[
          styles.childInput,
          leftIcon
            ? isArabic
              ? styles.childInputWithIconRtl
              : styles.childInputWithIconLtr
            : null,
        ]}
      >
        {children}
      </View>

      {!hideStatusIcon && error ? (
        <View
          style={[
            styles.validationIcon,
            isArabic
              ? styles.validationIconLeft
              : styles.validationIconRight,
          ]}
        >
          <AlertCircleIcon size={16} color="#DC2626" />
        </View>
      ) : !hideStatusIcon && showSuccessIcon && isValid ? (
        <View
          style={[
            styles.validationIcon,
            isArabic
              ? styles.validationIconLeft
              : styles.validationIconRight,
          ]}
        >
          <CheckCircleIcon size={16} color="#12A89F" />
        </View>
      ) : null}
    </View>

    {error ? (
      <Text
        style={[
          styles.errorText,
          { textAlign: isArabic ? 'right' : 'left' },
        ]}
      >
        {error}
      </Text>
    ) : (
      <View style={styles.errorPlaceholder} />
    )}
  </View>
);

interface IconProps {
  size?: number;
  color?: string;
  width?: number;
  height?: number;
}

const CheckCircleIcon: React.FC<IconProps> = ({
  size = 20,
  color = '#12A89F',
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="9" stroke={color} strokeWidth="2" />
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
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="9" stroke={color} strokeWidth="2" />
    <Path
      d="M12 8V12"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
    <Circle cx="12" cy="16" r="1" fill={color} />
  </Svg>
);

const ChevronDownIcon: React.FC<IconProps> = ({
  size = 20,
  color = '#6B7280',
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M6 9L12 15L18 9"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const UserIcon: React.FC<IconProps> = ({
  size = 20,
  color = '#6B7280',
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="8" r="3.5" stroke={color} strokeWidth="1.8" />
    <Path
      d="M5 20C5.6 16.5 8.1 14.5 12 14.5C15.9 14.5 18.4 16.5 19 20"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </Svg>
);

const PhoneIcon: React.FC<IconProps> = ({
  size = 20,
  color = '#6B7280',
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M22 16.92V19.92C22 20.47 21.55 20.92 21 20.92C10.51 20.92 3.08 13.49 3.08 3C3.08 2.45 3.53 2 4.08 2H7.08C7.58 2 8.01 2.37 8.08 2.86C8.17 3.5 8.36 4.12 8.64 4.7C8.76 4.95 8.7 5.25 8.51 5.45L6.81 7.15C8.3 10.07 10.93 12.7 13.85 14.19L15.55 12.49C15.75 12.3 16.05 12.24 16.3 12.36C16.88 12.64 17.5 12.83 18.14 12.92C18.63 12.99 19 13.42 19 13.92V16.92C19 17.47 18.55 17.92 18 17.92"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const MailIcon: React.FC<IconProps> = ({
  size = 20,
  color = '#6B7280',
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect
      x="3"
      y="5"
      width="18"
      height="14"
      rx="2"
      stroke={color}
      strokeWidth="1.8"
    />
    <Path
      d="M4 7L12 13L20 7"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const IdCardIcon = ({
  width = 24,
  height = 24,
  color = '#FFFFFF',
}: IconProps) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
    <Rect
      x="2.5"
      y="5"
      width="19"
      height="14"
      rx="2"
      stroke={color}
      strokeWidth="1.7"
    />
    <Circle cx="8.5" cy="11" r="2.2" stroke={color} strokeWidth="1.5" />
    <Path
      d="M5.5 16C5.8 14.4 7 13.5 8.5 13.5C10 13.5 11.2 14.4 11.5 16"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <Path
      d="M13.5 10H18"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <Path
      d="M13.5 13.5H17"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </Svg>
);

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },

  header: {
    alignItems: 'center',
    marginBottom: 18,
  },

  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#12996A',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },

  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 16,
  },

  subtitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
  },

  fieldContainer: {
    marginBottom: 4,
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

  inputWrapper: {
    position: 'relative',
    justifyContent: 'center',
  },

  leftIcon: {
    position: 'absolute',
    zIndex: 2,
    top: 12,
    width: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },

  leftIconLtr: {
    left: 10,
  },

  leftIconRtl: {
    right: 10,
  },

  childInput: {
    width: '100%',
  },

  childInputWithIconLtr: {
    paddingLeft: 0,
  },

  childInputWithIconRtl: {
    paddingRight: 0,
  },

  input: {
    width: '100%',
    minHeight: 44,
    borderWidth: 1,
    borderRadius: 8,
    fontSize: 14,
    color: '#20242A',
    backgroundColor: '#FFFFFF',
    paddingLeft: 40,
    paddingRight: 36,
  },

  countrySelector: {
    minHeight: 44,
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

  validationIcon: {
    position: 'absolute',
    top: 14,
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

  createButton: {
    width: '100%',
    minHeight: 44,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
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
    fontWeight: '600',
  },

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

export default StepBasicDetails;

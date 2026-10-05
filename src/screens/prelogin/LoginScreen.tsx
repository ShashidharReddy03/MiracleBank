import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ArrowLeft, Check, Moon, Palette, Sun } from 'lucide-react-native';

import {
  KeyboardAvoidingView,
  Modal,
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
import { SafeAreaView } from 'react-native-safe-area-context';
/* =========================================================
   TYPES
========================================================= */

type Country = {
  name: string;
  code: string;
};

type MenuItemProps = {
  icon: React.ReactNode;
  iconBackground: string;
  title: string;
  description: string;
  onPress?: () => void;
};

type AuthNavigation = NativeStackNavigationProp<{
  createAccount: undefined;
}>;

/* =========================================================
   MAIN LOGIN SCREEN
========================================================= */

const MFLoginScreen = () => {
  const navigation = useNavigation<AuthNavigation>();
  /* -----------------------------
     Login State
  ----------------------------- */

  const [countryCode, setCountryCode] = useState('');
  const [countryName, setCountryName] = useState('');

  const [mobileNumber, setMobileNumber] =
    useState('');

  const [mpin, setMpin] = useState('');

  const [showPassword, setShowPassword] =
    useState(false);

  /* -----------------------------
     Dropdowns
  ----------------------------- */

  const [showCountryMenu, setShowCountryMenu] =
    useState(false);

  const [showLanguageMenu, setShowLanguageMenu] =
    useState(false);

  /* -----------------------------
     Bottom Sheet
  ----------------------------- */

  const [showMenuSheet, setShowMenuSheet] =
    useState(false);

  const [showAppearance, setShowAppearance] =
    useState(false);

  const [appearanceTheme, setAppearanceTheme] =
    useState<'Light' | 'Dark' | 'Blue' | 'Yellow'>('Light');

  /* -----------------------------
     Language
  ----------------------------- */

  const [language, setLanguage] =
    useState<'en' | 'ar'>('en');

  /* -----------------------------
     Countries
  ----------------------------- */

  const countries: Country[] = [
    {
      name: 'India',
      code: '+91',
    },
    {
      name: 'UAE',
      code: '+971',
    },
    {
      name: 'Saudi Arabia',
      code: '+966',
    },
    {
      name: 'Qatar',
      code: '+974',
    },
  ];

  /* -----------------------------
     Select Country
  ----------------------------- */

  const selectCountry = (
    country: Country,
  ) => {
    setCountryCode(country.code);
    setCountryName(country.name);
    setShowCountryMenu(false);
  };

  /* -----------------------------
     Clear / Cancel
  ----------------------------- */

  const handleCancel = () => {
    setCountryCode('');
    setCountryName('');
    setMobileNumber('');
    setMpin('');
  };

  /* -----------------------------
     Login
  ----------------------------- */

  const handleLogin = () => {
    console.log('Login');

    console.log({
      countryCode,
      countryName,
      mobileNumber,
      mpin,
    });
  };

  /* -----------------------------
     Language
  ----------------------------- */

  const changeLanguage = (
    value: 'en' | 'ar',
  ) => {
    setLanguage(value);
    setShowLanguageMenu(false);
  };

  const closeMenuSheet = () => {
    setShowMenuSheet(false);
    setShowAppearance(false);
  };

  const openSelfRegistration = () => {
    closeMenuSheet();
    navigation.navigate('createAccount');
  };

  const appearanceOptions = [
    { name: 'Light' as const, Icon: Sun, color: '#12B8AF' },
    { name: 'Dark' as const, Icon: Moon, color: '#00B8A9' },
    { name: 'Blue' as const, Icon: Palette, color: '#334E75' },
    { name: 'Yellow' as const, Icon: Sun, color: '#F5A800' },
  ];

  const appearanceColors = {
    Light: { accent: '#12B8AF', background: '#EAF7F8' },
    Dark: { accent: '#111827', background: '#1F2937' },
    Blue: { accent: '#2563EB', background: '#EAF2FF' },
    Yellow: { accent: '#B77900', background: '#FFF8E1' },
  }[appearanceTheme];

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={
          Platform.OS === 'ios'
            ? 'padding'
            : undefined
        }
      >
        {/* =================================================
            HEADER
        ================================================= */}

        <View style={[styles.header, { backgroundColor: appearanceColors.accent }]}>
          {/* LEFT */}

          <View style={styles.headerLeft}>
            <Pressable
              style={styles.menuButton}
              onPress={() =>
                setShowMenuSheet(true)
              }
            >
              <MenuIcon
                width={22}
                height={22}
                color="#FFFFFF"
              />
            </Pressable>

            <Text style={styles.headerTitle}>
              Miracle Banking
            </Text>
          </View>

          {/* LANGUAGE */}

          <View>
            <Pressable
              style={styles.languagePill}
              onPress={() =>
                setShowLanguageMenu(
                  !showLanguageMenu,
                )
              }
            >
              <GlobeIcon
                width={14}
                height={14}
                color="#374151"
              />

              <Text
                style={styles.languageText}
              >
                {language === 'ar'
                  ? 'العربية'
                  : 'English'}
              </Text>

              <ChevronDownIcon
                width={13}
                height={13}
                color="#6B7280"
              />
            </Pressable>

            {showLanguageMenu && (
              <View
                style={
                  styles.languageDropdown
                }
              >
                <Pressable
                  style={
                    styles.languageOption
                  }
                  onPress={() =>
                    changeLanguage('en')
                  }
                >
                  <Text
                    style={
                      styles.languageOptionText
                    }
                  >
                    English
                  </Text>
                </Pressable>

                <Pressable
                  style={
                    styles.languageOption
                  }
                  onPress={() =>
                    changeLanguage('ar')
                  }
                >
                  <Text
                    style={
                      styles.languageOptionText
                    }
                  >
                    العربية
                  </Text>
                </Pressable>
              </View>
            )}
          </View>
        </View>

        {/* =================================================
            LOGIN BACKGROUND
        ================================================= */}

        <View style={[styles.patternBackground, { backgroundColor: appearanceColors.background }]}>
          <BankPattern />

          <ScrollView
            contentContainerStyle={
              styles.loginContent
            }
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={
              false
            }
          >
            {/* =================================================
                LOGIN CARD
            ================================================= */}

            <View style={styles.loginCard}>
              {/* TITLE */}

              <Text style={styles.loginTitle}>
                Login123
              </Text>

              {/* =================================================
                  COUNTRY CODE
              ================================================= */}

              <View style={styles.field}>
                <Text style={styles.label}>
                  Country Code
                  <Text
                    style={styles.required}
                  >
                    *
                  </Text>
                </Text>

                <Pressable
                  onPress={() =>
                    setShowCountryMenu(
                      !showCountryMenu,
                    )
                  }
                  style={
                    styles.inputContainer
                  }
                >
                  <Text
                    style={[
                      styles.selectText,
                      {
                        color:
                          countryCode
                            ? '#374151'
                            : '#8B95A5',
                      },
                    ]}
                  >
                    {countryCode
                      ? `${countryCode} ${countryName}`
                      : 'Select Country Code'}
                  </Text>

                  <ChevronDownIcon
                    width={14}
                    height={14}
                    color="#8B95A5"
                  />
                </Pressable>

                {showCountryMenu && (
                  <View
                    style={
                      styles.countryDropdown
                    }
                  >
                    {countries.map(
                      country => (
                        <Pressable
                          key={
                            country.code
                          }
                          style={
                            styles.countryItem
                          }
                          onPress={() =>
                            selectCountry(
                              country,
                            )
                          }
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
                      ),
                    )}
                  </View>
                )}
              </View>

              {/* =================================================
                  MOBILE NUMBER
              ================================================= */}

              <View style={styles.field}>
                <Text style={styles.label}>
                  Mobile Number
                  <Text
                    style={styles.required}
                  >
                    *
                  </Text>
                </Text>

                <View
                  style={
                    styles.inputContainer
                  }
                >
                  <PhoneIcon
                    width={15}
                    height={15}
                    color="#8B95A5"
                  />

                  <TextInput
                    value={mobileNumber}
                    onChangeText={value =>
                      setMobileNumber(
                        value.replace(
                          /[^0-9]/g,
                          '',
                        ),
                      )
                    }
                    placeholder="Enter Mobile Number"
                    placeholderTextColor="#9AA4B2"
                    keyboardType="number-pad"
                    maxLength={15}
                    style={styles.textInput}
                  />
                </View>
              </View>

              {/* =================================================
                  MPIN
              ================================================= */}

              <View style={styles.field}>
                <Text style={styles.label}>
                  MPIN
                  <Text
                    style={styles.required}
                  >
                    *
                  </Text>
                </Text>

                <View
                  style={
                    styles.inputContainer
                  }
                >
                  <LockIcon
                    width={15}
                    height={15}
                    color="#8B95A5"
                  />

                  <TextInput
                    value={mpin}
                    onChangeText={value =>
                      setMpin(
                        value.replace(
                          /[^0-9]/g,
                          '',
                        ),
                      )
                    }
                    placeholder="Enter MPIN"
                    placeholderTextColor="#9AA4B2"
                    secureTextEntry={
                      !showPassword
                    }
                    keyboardType="number-pad"
                    maxLength={6}
                    style={styles.textInput}
                  />

                  {/* EYE */}

                  <Pressable
                    style={
                      styles.iconButton
                    }
                    onPress={() =>
                      setShowPassword(
                        !showPassword,
                      )
                    }
                  >
                    {showPassword ? (
                      <EyeOffIcon
                        width={16}
                        height={16}
                        color="#526174"
                      />
                    ) : (
                      <EyeIcon
                        width={16}
                        height={16}
                        color="#526174"
                      />
                    )}
                  </Pressable>

                  {/* KEYBOARD */}

                  <Pressable
                    style={
                      styles.iconButton
                    }
                  >
                    <KeyboardIcon
                      width={16}
                      height={16}
                      color="#12B8AF"
                    />
                  </Pressable>
                </View>
              </View>

              {/* =================================================
                  LINKS
              ================================================= */}

              <View
                style={styles.loginLinks}
              >
                <Pressable>
                  <Text
                    style={styles.linkText}
                  >
                    Not You?
                  </Text>
                </Pressable>

                <Pressable>
                  <Text
                    style={styles.linkText}
                  >
                    Forgot MPIN
                  </Text>
                </Pressable>
              </View>

              {/* =================================================
                  LOGIN BUTTON
              ================================================= */}

              <Pressable
                style={[styles.loginButton, { backgroundColor: appearanceColors.accent }]}
                onPress={handleLogin}
              >
                <Text
                  style={
                    styles.loginButtonText
                  }
                >
                  Login
                </Text>
              </Pressable>

              {/* =================================================
                  OPEN ACCOUNT
              ================================================= */}

              <Pressable
                style={
                  [styles.openAccountButton, { backgroundColor: appearanceColors.accent }]
                }
                onPress={() =>
                  console.log(
                    'Open Account',
                  )
                }
              >
                <Text
                  style={
                    styles.openAccountText
                  }
                >
                  Don't have Account? Open Now
                </Text>
              </Pressable>
            </View>
          </ScrollView>
        </View>

        {/* =====================================================
            BOTTOM SHEET
        ===================================================== */}

        <Modal
          visible={showMenuSheet}
          transparent
          animationType="slide"
            onRequestClose={closeMenuSheet}
        >
          <View
            style={
              styles.bottomSheetRoot
            }
          >
            {/* OVERLAY */}

            <Pressable
              style={
                styles.bottomSheetOverlay
              }
              onPress={closeMenuSheet}
            />

            {/* SHEET */}

            <View
              style={styles.bottomSheet}
            >
              {/* HANDLE */}

              <View
                style={styles.sheetHandle}
              />

              {/* =================================================
                  SHEET HEADER
              ================================================= */}

              {showAppearance ? (
                <View style={styles.appearanceHeader}>
                  <Pressable
                    accessibilityLabel="Back to menu"
                    style={styles.appearanceBackButton}
                    onPress={() => setShowAppearance(false)}
                  >
                    <ArrowLeft size={19} color="#64748B" />
                  </Pressable>
                  <View style={styles.appearanceHeaderIcon}>
                    <Palette size={20} color="#FFFFFF" />
                  </View>
                  <View style={styles.appearanceHeaderText}>
                    <Text style={styles.appearanceTitle}>Appearance</Text>
                    <Text style={styles.appearanceSubtitle}>Choose how the app looks to you</Text>
                  </View>
                  <Pressable
                    accessibilityLabel="Close menu"
                    style={styles.sheetCloseButton}
                    onPress={closeMenuSheet}
                  >
                    <CloseIcon width={15} height={15} color="#7C8795" />
                  </Pressable>
                </View>
              ) : (
              <View
                style={styles.sheetHeader}
              >
                <View
                  style={styles.sheetBrand}
                >
                  <View
                    style={styles.sheetLogo}
                  >
                    <BankBuildingIcon
                      width={27}
                      height={27}
                      color="#12B8AF"
                    />
                  </View>

                  <View>
                    <Text
                      style={
                        styles.sheetTitle
                      }
                    >
                      Miracle Banking
                    </Text>

                    <Text
                      style={
                        styles.sheetVersion
                      }
                    >
                      App Version 1.0.034567
                    </Text>
                  </View>
                </View>

                <Pressable
                  style={
                    styles.sheetCloseButton
                  }
                  onPress={() =>
                    closeMenuSheet()
                  }
                >
                  <CloseIcon
                    width={15}
                    height={15}
                    color="#7C8795"
                  />
                </Pressable>
              </View>
              )}

              {/* =================================================
                  SHEET CONTENT
              ================================================= */}

              {showAppearance ? (
                <ScrollView
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={styles.appearanceContent}
                >
                  <Text style={styles.sheetSectionTitle}>APPEARANCE</Text>
                  <View style={styles.appearanceGrid}>
                    {appearanceOptions.map(({ name, Icon, color }) => {
                      const isSelected = appearanceTheme === name;
                      return (
                        <Pressable
                          key={name}
                          accessibilityRole="button"
                          accessibilityState={{ selected: isSelected }}
                          onPress={() => setAppearanceTheme(name)}
                          style={[
                            styles.appearanceOption,
                            isSelected && styles.appearanceOptionSelected,
                          ]}
                        >
                          <View style={styles.appearanceOptionIcon}>
                            <Icon size={17} color={color} />
                          </View>
                          <Text style={styles.appearanceOptionLabel}>{name}</Text>
                          {isSelected && (
                            <View style={styles.appearanceCheck}>
                              <Check size={11} color="#FFFFFF" strokeWidth={3} />
                            </View>
                          )}
                        </Pressable>
                      );
                    })}
                  </View>

                  <View style={styles.appearanceStatus}>
                    <View style={styles.appearanceStatusDot} />
                    <Text style={styles.appearanceStatusText}>
                      {appearanceTheme} theme is currently active
                    </Text>
                  </View>

                  <Text style={[styles.sheetSectionTitle, styles.languageSectionTitle]}>LANGUAGE</Text>
                  <View style={styles.languageGrid}>
                    {([
                      { code: 'en', label: 'English', native: 'English', region: 'US' },
                      { code: 'ar', label: 'العربية', native: 'Arabic', region: 'SA' },
                    ] as const).map(option => {
                      const isSelected = language === option.code;
                      return (
                        <Pressable
                          key={option.code}
                          accessibilityRole="button"
                          accessibilityState={{ selected: isSelected }}
                          onPress={() => changeLanguage(option.code)}
                          style={[
                            styles.languageCard,
                            isSelected && styles.languageCardSelected,
                          ]}
                        >
                          <Text style={styles.languageRegion}>{option.region}</Text>
                          <View style={styles.languageCardText}>
                            <Text style={styles.languageCardLabel}>{option.label}</Text>
                            <Text style={styles.languageCardNative}>{option.native}</Text>
                          </View>
                          {isSelected && (
                            <View style={styles.appearanceCheck}>
                              <Check size={11} color="#FFFFFF" strokeWidth={3} />
                            </View>
                          )}
                        </Pressable>
                      );
                    })}
                  </View>

                  <View style={styles.appearanceStatus}>
                    <Text style={styles.languageStatusIcon}>◎</Text>
                    <Text style={styles.appearanceStatusText}>
                      {language === 'en' ? 'English' : 'Arabic'} is currently active
                    </Text>
                  </View>
                </ScrollView>
              ) : (
              <ScrollView
                showsVerticalScrollIndicator={
                  false
                }
                contentContainerStyle={
                  styles.sheetScrollContent
                }
              >
                {/* EXPLORE */}

                <Text
                  style={
                    styles.sheetSectionTitle
                  }
                >
                  EXPLORE
                </Text>

                <View
                  style={
                    styles.sheetMenuCard
                  }
                >
                  <BottomSheetItem
                    icon={
                      <MapPinIcon
                        width={19}
                        height={19}
                        color="#12B8AF"
                      />
                    }
                    iconBackground="#E8F8F7"
                    title="Locate Us"
                    description="Find branches & ATMs nearby"
                    onPress={() =>
                      console.log(
                        'Locate Us',
                      )
                    }
                  />

                  <BottomSheetItem
                    icon={
                      <GiftIcon
                        width={19}
                        height={19}
                        color="#F59E0B"
                      />
                    }
                    iconBackground="#FFF5E6"
                    title="Offers"
                    description="Exclusive deals & promotions"
                    onPress={() =>
                      console.log(
                        'Offers',
                      )
                    }
                  />

                  <BottomSheetItem
                    icon={
                      <UserPlusIcon
                        width={19}
                        height={19}
                        color="#EC4899"
                      />
                    }
                    iconBackground="#FCECF5"
                    title="App Code"
                    description="Tap here to generate your secure App Code for activating the application"
                    onPress={() =>
                      console.log(
                        'App Code',
                      )
                    }
                  />
                </View>

                {/* SUPPORT */}

                <Text
                  style={
                    styles.sheetSectionTitle
                  }
                >
                  SUPPORT
                </Text>

                <View
                  style={
                    styles.sheetMenuCard
                  }
                >
                  <BottomSheetItem
                    icon={
                      <PhoneCallIcon
                        width={19}
                        height={19}
                        color="#3B82F6"
                      />
                    }
                    iconBackground="#EAF2FF"
                    title="Contact Us"
                    description="Get in touch with us"
                    onPress={() =>
                      console.log(
                        'Contact Us',
                      )
                    }
                  />

                  <BottomSheetItem
                    icon={
                      <HelpIcon
                        width={19}
                        height={19}
                        color="#8B5CF6"
                      />
                    }
                    iconBackground="#F1ECFF"
                    title="Help"
                    description="Guides & troubleshooting"
                    onPress={() =>
                      console.log(
                        'Help',
                      )
                    }
                  />

                  <BottomSheetItem
                    icon={
                      <QuestionIcon
                        width={19}
                        height={19}
                        color="#6366F1"
                      />
                    }
                    iconBackground="#EEF0FF"
                    title="FAQ"
                    description="Frequently asked questions"
                    onPress={() =>
                      console.log(
                        'FAQ',
                      )
                    }
                  />
                </View>

                {/* SETTINGS */}

                <Text style={styles.sheetSectionTitle}>SETTINGS</Text>
                <View style={styles.sheetMenuCard}>
                  <BottomSheetItem
                    icon={<Palette width={19} height={19} color="#EC4899" />}
                    iconBackground="#FCECF5"
                    title="Appearance"
                    description="Theme & language settings"
                    onPress={() => setShowAppearance(true)}
                  />
                </View>

                {/* MORE */}

                <Text
                  style={
                    styles.sheetSectionTitle
                  }
                >
                  MORE
                </Text>

                <View
                  style={
                    styles.sheetMenuCard
                  }
                >
                  <BottomSheetItem
                    icon={
                      <ShareIcon
                        width={19}
                        height={19}
                        color="#10B981"
                      />
                    }
                    iconBackground="#EAFBF5"
                    title="Refer a Friend"
                    description="Share & earn rewards"
                    onPress={() =>
                      console.log(
                        'Refer a Friend',
                      )
                    }
                  />

                  <BottomSheetItem
                    icon={
                      <StarIcon
                        width={19}
                        height={19}
                        color="#F59E0B"
                      />
                    }
                    iconBackground="#FFF7E7"
                    title="Rate Us"
                    description="Leave a review"
                    onPress={() =>
                      console.log(
                        'Rate Us',
                      )
                    }
                  />

                  <BottomSheetItem
                    icon={
                      <UserPlusIcon
                        width={19}
                        height={19}
                        color="#EC4899"
                      />
                    }
                    iconBackground="#FCECF5"
                    title="Self Registration"
                    description="Open a new account"
                    onPress={openSelfRegistration}
                  />
                </View>

                <View
                  style={
                    styles.sheetBottomSpace
                  }
                />
              </ScrollView>
              )}
            </View>
          </View>
        </Modal>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

/* =========================================================
   BOTTOM SHEET ITEM
========================================================= */

const BottomSheetItem = ({
  icon,
  iconBackground,
  title,
  description,
  onPress,
}: MenuItemProps) => {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.bottomSheetItem,
        pressed && {
          opacity: 0.65,
        },
      ]}
    >
      <View
        style={[
          styles.bottomSheetIcon,
          {
            backgroundColor:
              iconBackground,
          },
        ]}
      >
        {icon}
      </View>

      <View
        style={
          styles.bottomSheetItemContent
        }
      >
        <Text
          style={
            styles.bottomSheetItemTitle
          }
        >
          {title}
        </Text>

        <Text
          style={
            styles.bottomSheetItemDescription
          }
          numberOfLines={2}
        >
          {description}
        </Text>
      </View>

      <ChevronRightIcon
        width={14}
        height={14}
        color="#B7C0CA"
      />
    </Pressable>
  );
};

/* =========================================================
   BANKING BACKGROUND PATTERN
========================================================= */

const BankPattern = () => {
  const rows = 9;
  const columns = 5;

  return (
    <View
      pointerEvents="none"
      style={StyleSheet.absoluteFill}
    >
      {Array.from({
        length: rows,
      }).map((_, row) =>
        Array.from({
          length: columns,
        }).map((_, column) => (
          <View
            key={`${row}-${column}`}
            style={{
              position: 'absolute',
              left:
                15 + column * 75,
              top:
                15 + row * 72,
              opacity: 0.07,
            }}
          >
            <BankBuildingIcon
              width={45}
              height={45}
              color="#55BFC0"
            />
          </View>
        )),
      )}
    </View>
  );
};

/* =========================================================
   SVG ICONS
========================================================= */

/* ---------------- MENU ---------------- */

const MenuIcon = ({
  width = 24,
  height = 24,
  color = '#000',
}: {
  width?: number;
  height?: number;
  color?: string;
}) => (
  <Svg
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill="none"
  >
    <Path
      d="M4 7H20"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />

    <Path
      d="M4 12H20"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />

    <Path
      d="M4 17H20"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
  </Svg>
);

/* ---------------- GLOBE ---------------- */

const GlobeIcon = ({
  width = 24,
  height = 24,
  color = '#000',
}: {
  width?: number;
  height?: number;
  color?: string;
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
      stroke={color}
      strokeWidth="1.6"
    />

    <Path
      d="M3 12H21"
      stroke={color}
      strokeWidth="1.5"
    />

    <Path
      d="M12 3C14.2 5.4 15.3 8.4 15.3 12C15.3 15.6 14.2 18.6 12 21"
      stroke={color}
      strokeWidth="1.4"
    />

    <Path
      d="M12 3C9.8 5.4 8.7 8.4 8.7 12C8.7 15.6 9.8 18.6 12 21"
      stroke={color}
      strokeWidth="1.4"
    />
  </Svg>
);

/* ---------------- CHEVRON DOWN ---------------- */

const ChevronDownIcon = ({
  width = 24,
  height = 24,
  color = '#000',
}: {
  width?: number;
  height?: number;
  color?: string;
}) => (
  <Svg
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill="none"
  >
    <Path
      d="M6 9L12 15L18 9"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

/* ---------------- CHEVRON RIGHT ---------------- */

const ChevronRightIcon = ({
  width = 24,
  height = 24,
  color = '#000',
}: {
  width?: number;
  height?: number;
  color?: string;
}) => (
  <Svg
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill="none"
  >
    <Path
      d="M9 6L15 12L9 18"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

/* ---------------- PHONE ---------------- */

const PhoneIcon = ({
  width = 24,
  height = 24,
  color = '#000',
}: {
  width?: number;
  height?: number;
  color?: string;
}) => (
  <Svg
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill="none"
  >
    <Path
      d="M6.5 3.5L9 3L11 8L8.5 9.5C9.5 12 12 14.5 14.5 15.5L16 13L21 15L20.5 17.5C20.2 19 19 20 17.5 20C9.5 19.5 4.5 14.5 4 6.5C4 5 5 3.8 6.5 3.5Z"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

/* ---------------- LOCK ---------------- */

const LockIcon = ({
  width = 24,
  height = 24,
  color = '#000',
}: {
  width?: number;
  height?: number;
  color?: string;
}) => (
  <Svg
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill="none"
  >
    <Rect
      x="5"
      y="10"
      width="14"
      height="10"
      rx="2"
      stroke={color}
      strokeWidth="1.6"
    />

    <Path
      d="M8 10V7C8 4.8 9.8 3 12 3C14.2 3 16 4.8 16 7V10"
      stroke={color}
      strokeWidth="1.6"
      strokeLinecap="round"
    />
  </Svg>
);

/* ---------------- EYE ---------------- */

const EyeIcon = ({
  width = 24,
  height = 24,
  color = '#000',
}: {
  width?: number;
  height?: number;
  color?: string;
}) => (
  <Svg
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill="none"
  >
    <Path
      d="M2.5 12C4.7 7.8 8 5.5 12 5.5C16 5.5 19.3 7.8 21.5 12C19.3 16.2 16 18.5 12 18.5C8 18.5 4.7 16.2 2.5 12Z"
      stroke={color}
      strokeWidth="1.5"
    />

    <Circle
      cx="12"
      cy="12"
      r="2.5"
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

/* ---------------- EYE OFF ---------------- */

const EyeOffIcon = ({
  width = 24,
  height = 24,
  color = '#000',
}: {
  width?: number;
  height?: number;
  color?: string;
}) => (
  <Svg
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill="none"
  >
    <Path
      d="M3 3L21 21"
      stroke={color}
      strokeWidth="1.6"
      strokeLinecap="round"
    />

    <Path
      d="M10 5.8C10.65 5.6 11.3 5.5 12 5.5C16 5.5 19.3 7.8 21.5 12C20.8 13.4 19.9 14.6 18.8 15.6"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
    />

    <Path
      d="M6.1 7.2C4.6 8.3 3.4 9.9 2.5 12C4.7 16.2 8 18.5 12 18.5C13.3 18.5 14.5 18.2 15.6 17.7"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </Svg>
);

/* ---------------- KEYBOARD ---------------- */

const KeyboardIcon = ({
  width = 24,
  height = 24,
  color = '#000',
}: {
  width?: number;
  height?: number;
  color?: string;
}) => (
  <Svg
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill="none"
  >
    <Rect
      x="3"
      y="6"
      width="18"
      height="12"
      rx="2"
      stroke={color}
      strokeWidth="1.5"
    />

    <Path
      d="M6 10H6.01M9 10H9.01M12 10H12.01M15 10H15.01M18 10H18.01"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />

    <Path
      d="M7 14H17"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </Svg>
);

/* ---------------- CLOSE ---------------- */

const CloseIcon = ({
  width = 24,
  height = 24,
  color = '#000',
}: {
  width?: number;
  height?: number;
  color?: string;
}) => (
  <Svg
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill="none"
  >
    <Path
      d="M6 6L18 18"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
    />

    <Path
      d="M18 6L6 18"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </Svg>
);

/* ---------------- BANK BUILDING ---------------- */

const BankBuildingIcon = ({
  width = 42,
  height = 42,
  color = '#55BFC0',
}: {
  width?: number;
  height?: number;
  color?: string;
}) => (
  <Svg
    width={width}
    height={height}
    viewBox="0 0 42 42"
    fill="none"
  >
    <Path
      d="M5 15L21 7L37 15"
      stroke={color}
      strokeWidth="1.4"
    />

    <Path
      d="M8 16H34"
      stroke={color}
      strokeWidth="1.4"
    />

    <Path
      d="M11 17V29"
      stroke={color}
      strokeWidth="1.4"
    />

    <Path
      d="M17 17V29"
      stroke={color}
      strokeWidth="1.4"
    />

    <Path
      d="M25 17V29"
      stroke={color}
      strokeWidth="1.4"
    />

    <Path
      d="M31 17V29"
      stroke={color}
      strokeWidth="1.4"
    />

    <Path
      d="M7 30H35"
      stroke={color}
      strokeWidth="1.4"
    />

    <Path
      d="M5 34H37"
      stroke={color}
      strokeWidth="1.4"
    />
  </Svg>
);

/* ---------------- MAP PIN ---------------- */

const MapPinIcon = ({
  width = 24,
  height = 24,
  color = '#000',
}: {
  width?: number;
  height?: number;
  color?: string;
}) => (
  <Svg
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill="none"
  >
    <Path
      d="M20 10C20 15.5 12 21 12 21C12 21 4 15.5 4 10C4 5.6 7.6 3 12 3C16.4 3 20 5.6 20 10Z"
      stroke={color}
      strokeWidth="1.5"
    />

    <Circle
      cx="12"
      cy="10"
      r="2.5"
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

/* ---------------- GIFT ---------------- */

const GiftIcon = ({
  width = 24,
  height = 24,
  color = '#000',
}: {
  width?: number;
  height?: number;
  color?: string;
}) => (
  <Svg
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill="none"
  >
    <Rect
      x="4"
      y="9"
      width="16"
      height="11"
      rx="1.5"
      stroke={color}
      strokeWidth="1.5"
    />

    <Path
      d="M3 9H21V6.5H3V9Z"
      stroke={color}
      strokeWidth="1.5"
    />

    <Path
      d="M12 6.5V20"
      stroke={color}
      strokeWidth="1.5"
    />

    <Path
      d="M12 6.5C12 4.5 10.7 3 9 3C7.5 3 6.5 4 6.5 5.1C6.5 6.1 7.5 6.5 9 6.5H12Z"
      stroke={color}
      strokeWidth="1.3"
    />

    <Path
      d="M12 6.5C12 4.5 13.3 3 15 3C16.5 3 17.5 4 17.5 5.1C17.5 6.1 16.5 6.5 15 6.5H12Z"
      stroke={color}
      strokeWidth="1.3"
    />
  </Svg>
);

/* ---------------- USER PLUS ---------------- */

const UserPlusIcon = ({
  width = 24,
  height = 24,
  color = '#000',
}: {
  width?: number;
  height?: number;
  color?: string;
}) => (
  <Svg
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill="none"
  >
    <Circle
      cx="9"
      cy="8"
      r="3"
      stroke={color}
      strokeWidth="1.5"
    />

    <Path
      d="M3.5 19C4 15.8 6 14 9 14C12 14 14 15.8 14.5 19"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
    />

    <Path
      d="M18 9V15"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
    />

    <Path
      d="M15 12H21"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </Svg>
);

/* ---------------- PHONE CALL ---------------- */

const PhoneCallIcon = ({
  width = 24,
  height = 24,
  color = '#000',
}: {
  width?: number;
  height?: number;
  color?: string;
}) => (
  <Svg
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill="none"
  >
    <Path
      d="M6.5 3.5L9 3L11 8L8.5 9.5C9.5 12 12 14.5 14.5 15.5L16 13L21 15L20.5 17.5C20.2 19 19 20 17.5 20C9.5 19.5 4.5 14.5 4 6.5C4 5 5 3.8 6.5 3.5Z"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />

    <Path
      d="M15 4C17.2 4.5 19 6.2 19.5 8.5"
      stroke={color}
      strokeWidth="1.3"
      strokeLinecap="round"
    />
  </Svg>
);

/* ---------------- HELP ---------------- */

const HelpIcon = ({
  width = 24,
  height = 24,
  color = '#000',
}: {
  width?: number;
  height?: number;
  color?: string;
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
      stroke={color}
      strokeWidth="1.5"
    />

    <Path
      d="M9.5 9C9.7 7.6 10.6 7 12 7C13.4 7 14.5 7.8 14.5 9C14.5 10.5 13.2 11.1 12.5 11.7C12 12.1 12 12.5 12 13"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
    />

    <Circle
      cx="12"
      cy="16.5"
      r="0.8"
      fill={color}
    />
  </Svg>
);

/* ---------------- QUESTION ---------------- */

const QuestionIcon = ({
  width = 24,
  height = 24,
  color = '#000',
}: {
  width?: number;
  height?: number;
  color?: string;
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
      stroke={color}
      strokeWidth="1.5"
    />

    <Path
      d="M9.5 9C9.7 7.6 10.7 7 12 7C13.5 7 14.5 7.8 14.5 9C14.5 10.5 13.2 11.2 12.5 11.8C12 12.2 12 12.7 12 13"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
    />

    <Circle
      cx="12"
      cy="16.5"
      r="0.8"
      fill={color}
    />
  </Svg>
);

/* ---------------- SHARE ---------------- */

const ShareIcon = ({
  width = 24,
  height = 24,
  color = '#000',
}: {
  width?: number;
  height?: number;
  color?: string;
}) => (
  <Svg
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill="none"
  >
    <Circle
      cx="18"
      cy="5"
      r="2.5"
      stroke={color}
      strokeWidth="1.5"
    />

    <Circle
      cx="6"
      cy="12"
      r="2.5"
      stroke={color}
      strokeWidth="1.5"
    />

    <Circle
      cx="18"
      cy="19"
      r="2.5"
      stroke={color}
      strokeWidth="1.5"
    />

    <Path
      d="M8.2 10.8L15.8 6.2"
      stroke={color}
      strokeWidth="1.5"
    />

    <Path
      d="M8.2 13.2L15.8 17.8"
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

/* ---------------- STAR ---------------- */

const StarIcon = ({
  width = 24,
  height = 24,
  color = '#000',
}: {
  width?: number;
  height?: number;
  color?: string;
}) => (
  <Svg
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill="none"
  >
    <Path
      d="M12 3L14.8 8.7L21 9.6L16.5 14L17.6 20.2L12 17.3L6.4 20.2L7.5 14L3 9.6L9.2 8.7L12 3Z"
      stroke={color}
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
  </Svg>
);

/* =========================================================
   STYLES
========================================================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EAF7F8',
  },

  flex: {
    flex: 1,
  },

  /* =====================================================
     HEADER
  ===================================================== */

  header: {
    height: 58,
    backgroundColor: '#12B8AF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 9,
    zIndex: 50,
  },

  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  menuButton: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
  },

  headerTitle: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
    marginLeft: 2,
  },

  /* =====================================================
     LANGUAGE
  ===================================================== */

  languagePill: {
    height: 36,
    minWidth: 95,
    paddingHorizontal: 9,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
  },

  languageText: {
    color: '#374151',
    fontSize: 12,
    fontWeight: '600',
  },

  languageDropdown: {
    position: 'absolute',
    right: 0,
    top: 42,
    width: 140,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingVertical: 5,
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    zIndex: 100,
  },

  languageOption: {
    height: 42,
    paddingHorizontal: 12,
    justifyContent: 'center',
  },

  languageOptionText: {
    fontSize: 13,
    color: '#374151',
  },

  /* =====================================================
     BACKGROUND
  ===================================================== */

  patternBackground: {
    flex: 1,
    backgroundColor: '#EAF7F8',
    position: 'relative',
    overflow: 'hidden',
  },

  loginContent: {
    flexGrow: 1,
    alignItems: 'center',
    paddingTop: 91,
    paddingHorizontal: 18,
    paddingBottom: 30,
  },

  /* =====================================================
     LOGIN CARD
  ===================================================== */

  loginCard: {
    width: '100%',
    maxWidth: 350,
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 18,

    shadowColor: '#000',
    shadowOpacity: 0.13,
    shadowRadius: 12,
    shadowOffset: {
      width: 0,
      height: 5,
    },

    elevation: 7,
  },

  loginTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#20242A',
    textAlign: 'center',
    marginBottom: 10,
  },

  field: {
    marginBottom: 8,
  },

  label: {
    fontSize: 12,
    fontWeight: '500',
    color: '#20242A',
    marginBottom: 4,
  },

  required: {
    color: '#EF4444',
  },

  inputContainer: {
    height: 31,
    borderWidth: 1,
    borderRadius: 6,
    borderColor: '#D9DEE5',
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },

  selectText: {
    flex: 1,
    fontSize: 11,
  },

  textInput: {
    flex: 1,
    height: 31,
    marginLeft: 6,
    paddingVertical: 0,
    fontSize: 11,
    color: '#374151',
  },

  iconButton: {
    width: 24,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* =====================================================
     COUNTRY DROPDOWN
  ===================================================== */

  countryDropdown: {
    marginTop: 3,
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D9DEE5',
    overflow: 'hidden',
    elevation: 6,
    zIndex: 20,
  },

  countryItem: {
    height: 38,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F2F4',
  },

  countryName: {
    fontSize: 11,
    color: '#374151',
  },

  countryCode: {
    fontSize: 11,
    color: '#12B8AF',
    fontWeight: '700',
  },

  /* =====================================================
     LINKS
  ===================================================== */

  loginLinks: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: -1,
    marginBottom: 8,
  },

  linkText: {
    color: '#12B8AF',
    fontSize: 10,
    fontWeight: '500',
  },

  /* =====================================================
     LOGIN
  ===================================================== */

  loginButton: {
    height: 29,
    borderRadius: 6,
    backgroundColor: '#9CA8B2',
    alignItems: 'center',
    justifyContent: 'center',
  },

  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },

  /* =====================================================
     OPEN ACCOUNT
  ===================================================== */

  openAccountButton: {
    height: 29,
    borderRadius: 6,
    marginTop: 10,
    backgroundColor: '#12B8AF',
    alignItems: 'center',
    justifyContent: 'center',
  },

  openAccountText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },

  /* =====================================================
     BOTTOM SHEET
  ===================================================== */

  bottomSheetRoot: {
    flex: 1,
    justifyContent: 'flex-end',
  },

  bottomSheetOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor:
      'rgba(0,0,0,0.40)',
  },

  bottomSheet: {
    height: '84%',
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 27,
    borderTopRightRadius: 27,
    overflow: 'hidden',
    elevation: 20,
  },

  sheetHandle: {
    width: 38,
    height: 4,
    borderRadius: 4,
    backgroundColor: '#D9DEE5',
    alignSelf: 'center',
    marginTop: 7,
    marginBottom: 6,
  },

  /* =====================================================
     SHEET HEADER
  ===================================================== */

  sheetHeader: {
    minHeight: 67,
    paddingHorizontal: 20,
    paddingTop: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#EEF0F2',
  },

  appearanceHeader: {
    minHeight: 81,
    paddingHorizontal: 16,
    paddingTop: 4,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#EEF0F2',
  },

  appearanceBackButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#F1F3F5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },

  appearanceHeaderIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: '#EC4899',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },

  appearanceHeaderText: {
    flex: 1,
  },

  appearanceTitle: {
    color: '#20242A',
    fontSize: 13,
    fontWeight: '800',
  },

  appearanceSubtitle: {
    color: '#7E8895',
    fontSize: 9,
    marginTop: 4,
  },

  sheetBrand: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  sheetLogo: {
    width: 34,
    height: 34,
    marginRight: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },

  sheetTitle: {
    color: '#20242A',
    fontSize: 12,
    fontWeight: '800',
  },

  sheetVersion: {
    color: '#8993A0',
    fontSize: 9,
    marginTop: 4,
  },

  sheetCloseButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#F1F3F5',
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* =====================================================
     SHEET CONTENT
  ===================================================== */

  sheetScrollContent: {
    paddingHorizontal: 19,
    paddingTop: 9,
    paddingBottom: 25,
  },

  appearanceContent: {
    paddingHorizontal: 16,
    paddingTop: 13,
    paddingBottom: 24,
  },

  sheetSectionTitle: {
    color: '#929CAA',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.6,
    marginTop: 4,
    marginBottom: 6,
  },

  appearanceGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 8,
  },

  appearanceOption: {
    width: '48.5%',
    minHeight: 56,
    paddingHorizontal: 11,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E8EAED',
    borderRadius: 12,
    backgroundColor: '#FAFAFA',
  },

  appearanceOptionSelected: {
    borderWidth: 1.5,
    borderColor: '#00AFA6',
    backgroundColor: '#F0FAF9',
  },

  appearanceOptionIcon: {
    width: 30,
    height: 30,
    borderRadius: 9,
    backgroundColor: '#E8F8F7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },

  appearanceOptionLabel: {
    color: '#20242A',
    fontSize: 11,
    fontWeight: '700',
  },

  appearanceCheck: {
    position: 'absolute',
    top: 5,
    right: 5,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#00AFA6',
    alignItems: 'center',
    justifyContent: 'center',
  },

  appearanceStatus: {
    minHeight: 34,
    marginTop: 11,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 9,
    backgroundColor: '#EFF9F8',
  },

  appearanceStatusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#00AFA6',
    marginRight: 8,
  },

  appearanceStatusText: {
    color: '#64748B',
    fontSize: 9,
  },

  languageSectionTitle: {
    marginTop: 17,
  },

  languageGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    columnGap: 8,
  },

  languageCard: {
    flex: 1,
    minHeight: 67,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E8EAED',
    borderRadius: 12,
    backgroundColor: '#FAFAFA',
  },

  languageCardSelected: {
    borderWidth: 1.5,
    borderColor: '#00AFA6',
    backgroundColor: '#F0FAF9',
  },

  languageRegion: {
    color: '#20242A',
    fontSize: 12,
    fontWeight: '600',
    marginRight: 9,
  },

  languageCardText: {
    flex: 1,
  },

  languageCardLabel: {
    color: '#20242A',
    fontSize: 10,
    fontWeight: '700',
  },

  languageCardNative: {
    color: '#7E8895',
    fontSize: 9,
    marginTop: 4,
  },

  languageStatusIcon: {
    color: '#00AFA6',
    fontSize: 13,
    marginRight: 7,
  },

  sheetMenuCard: {
    borderRadius: 13,
    borderWidth: 1,
    borderColor: '#EEF0F2',
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
    marginBottom: 12,
  },

  bottomSheetItem: {
    minHeight: 67,
    paddingHorizontal: 11,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F2F4',
  },

  bottomSheetIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },

  bottomSheetItemContent: {
    flex: 1,
    paddingRight: 5,
  },

  bottomSheetItemTitle: {
    color: '#20242A',
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 4,
  },

  bottomSheetItemDescription: {
    color: '#7E8895',
    fontSize: 9,
    lineHeight: 12,
  },

  sheetBottomSpace: {
    height: 15,
  },
});

export default MFLoginScreen;
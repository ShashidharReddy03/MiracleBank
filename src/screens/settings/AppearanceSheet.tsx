import React from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Theme = 'Light' | 'Dark' | 'Blue' | 'Yellow';
type Language = 'English' | 'Arabic';

interface AppearanceSheetProps {
  visible: boolean;
  onClose: () => void;

  selectedTheme?: Theme;
  selectedLanguage?: Language;

  onThemeChange?: (theme: Theme) => void;
  onLanguageChange?: (language: Language) => void;
}

const themes: {
  name: Theme;
  icon: string;
}[] = [
  {
    name: 'Light',
    icon: '☀',
  },
  {
    name: 'Dark',
    icon: '☾',
  },
  {
    name: 'Blue',
    icon: '◉',
  },
  {
    name: 'Yellow',
    icon: '☼',
  },
];

const languages: {
  name: Language;
  country: string;
  code: string;
}[] = [
  {
    name: 'English',
    country: 'US',
    code: 'English',
  },
  {
    name: 'Arabic',
    country: 'SA',
    code: 'Arabic',
  },
];

export default function AppearanceSheet({
  visible,
  onClose,
  selectedTheme = 'Light',
  selectedLanguage = 'English',
  onThemeChange,
  onLanguageChange,
}: AppearanceSheetProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        {/* Close when tapping outside */}
        <Pressable
          style={styles.overlayPress}
          onPress={onClose}
        />

        <SafeAreaView style={styles.sheet}>
          {/* Drag indicator */}
          <View style={styles.dragIndicator} />

          {/* Header */}
          <View style={styles.header}>
            <Pressable
              style={styles.circleButton}
              onPress={onClose}
            >
              <Text style={styles.backIcon}>‹</Text>
            </Pressable>

            <View style={styles.appearanceIcon}>
              <Text style={styles.paletteIcon}>♧</Text>
            </View>

            <View style={styles.headerText}>
              <Text style={styles.title}>Appearance</Text>

              <Text style={styles.subtitle}>
                Choose how the app looks to you
              </Text>
            </View>

            <Pressable
              style={styles.circleButton}
              onPress={onClose}
            >
              <Text style={styles.closeIcon}>×</Text>
            </Pressable>
          </View>

          <View style={styles.divider} />

          {/* APPEARANCE */}
          <Text style={styles.sectionTitle}>
            APPEARANCE
          </Text>

          <View style={styles.grid}>
            {themes.map(theme => {
              const selected =
                selectedTheme === theme.name;

              return (
                <Pressable
                  key={theme.name}
                  style={[
                    styles.themeCard,
                    selected && styles.selectedCard,
                  ]}
                  onPress={() =>
                    onThemeChange?.(theme.name)
                  }
                >
                  <View
                    style={[
                      styles.themeIconContainer,
                      selected &&
                        styles.selectedIconContainer,
                    ]}
                  >
                    <Text
                      style={[
                        styles.themeIcon,
                        selected &&
                          styles.selectedThemeIcon,
                      ]}
                    >
                      {theme.icon}
                    </Text>
                  </View>

                  <Text style={styles.themeName}>
                    {theme.name}
                  </Text>

                  {selected && (
                    <View style={styles.checkCircle}>
                      <Text style={styles.check}>
                        ✓
                      </Text>
                    </View>
                  )}
                </Pressable>
              );
            })}
          </View>

          {/* Active theme message */}
          <View style={styles.infoBox}>
            <View style={styles.infoDot} />

            <Text style={styles.infoText}>
              {selectedTheme} theme is currently active
            </Text>
          </View>

          {/* LANGUAGE */}
          <Text
            style={[
              styles.sectionTitle,
              styles.languageTitle,
            ]}
          >
            LANGUAGE
          </Text>

          <View style={styles.languageRow}>
            {languages.map(language => {
              const selected =
                selectedLanguage === language.name;

              return (
                <Pressable
                  key={language.name}
                  style={[
                    styles.languageCard,
                    selected &&
                      styles.selectedCard,
                  ]}
                  onPress={() =>
                    onLanguageChange?.(language.name)
                  }
                >
                  <Text style={styles.countryCode}>
                    {language.country}
                  </Text>

                  <View style={styles.languageDetails}>
                    <Text
                      style={styles.languageName}
                    >
                      {language.name}
                    </Text>

                    <Text
                      style={styles.languageNative}
                    >
                      {language.code}
                    </Text>
                  </View>

                  {selected && (
                    <View style={styles.checkCircle}>
                      <Text style={styles.check}>
                        ✓
                      </Text>
                    </View>
                  )}
                </Pressable>
              );
            })}
          </View>

          {/* Active language */}
          <View style={styles.infoBox}>
            <Text style={styles.languageGlobe}>
              ◎
            </Text>

            <Text style={styles.infoText}>
              {selectedLanguage} is currently active
            </Text>
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    justifyContent: 'flex-end',
  },

  overlayPress: {
    flex: 1,
  },

  sheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
    minHeight: 280,
  },

  dragIndicator: {
    width: 32,
    height: 4,
    borderRadius: 4,
    backgroundColor: '#C9CDD2',
    alignSelf: 'center',
    marginBottom: 10,
  },

  header: {
    height: 54,
    flexDirection: 'row',
    alignItems: 'center',
  },

  circleButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F5F7',
    alignItems: 'center',
    justifyContent: 'center',
  },

  backIcon: {
    fontSize: 25,
    color: '#89909A',
    lineHeight: 28,
  },

  closeIcon: {
    fontSize: 24,
    color: '#89909A',
    lineHeight: 25,
  },

  appearanceIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#D936C5',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },

  paletteIcon: {
    color: '#FFFFFF',
    fontSize: 19,
  },

  headerText: {
    flex: 1,
    marginLeft: 8,
  },

  title: {
    fontSize: 15,
    fontWeight: '700',
    color: '#202632',
  },

  subtitle: {
    fontSize: 9,
    color: '#7A818B',
    marginTop: 3,
  },

  divider: {
    height: 1,
    backgroundColor: '#ECEDEF',
    marginVertical: 8,
  },

  sectionTitle: {
    fontSize: 9,
    fontWeight: '700',
    color: '#9298A2',
    letterSpacing: 0.5,
    marginTop: 2,
    marginBottom: 8,
  },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  themeCard: {
    width: '48.5%',
    height: '25%',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E8E8EA',
    backgroundColor: '#FAFAFA',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginBottom: 9,
  },

  selectedCard: {
    borderColor: '#00B8B0',
    borderWidth: 1.5,
    backgroundColor: '#F8FFFF',
  },

  themeIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#EAF7F7',
    alignItems: 'center',
    justifyContent: 'center',
  },

  selectedIconContainer: {
    backgroundColor: '#DDF6F5',
  },

  themeIcon: {
    fontSize: 18,
    color: '#28636A',
  },

  selectedThemeIcon: {
    color: '#00AFA8',
  },

  themeName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#202632',
    marginLeft: 8,
  },

  checkCircle: {
    position: 'absolute',
    right: 7,
    top: 7,
    width: 17,
    height: 17,
    borderRadius: 9,
    backgroundColor: '#09ADA5',
    alignItems: 'center',
    justifyContent: 'center',
  },

  check: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },

  infoBox: {
    height: 32,
    borderRadius: 9,
    backgroundColor: '#EDF9F8',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    marginTop: 2,
  },

  infoDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#00AFA8',
    marginRight: 8,
  },

  infoText: {
    fontSize: 9,
    color: '#59656A',
  },

  languageTitle: {
    marginTop: 14,
  },

  languageRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  languageCard: {
    width: '48.5%',
    height: 69,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E8E8EA',
    backgroundColor: '#FAFAFA',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
  },

  countryCode: {
    fontSize: 12,
    color: '#202632',
    fontWeight: '500',
  },

  languageDetails: {
    marginLeft: 12,
  },

  languageName: {
    fontSize: 11,
    color: '#202632',
    fontWeight: '700',
  },

  languageNative: {
    fontSize: 9,
    color: '#777E87',
    marginTop: 4,
  },

  languageGlobe: {
    fontSize: 14,
    color: '#00AFA8',
    marginRight: 7,
  },
});
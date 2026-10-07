import React, { useContext, useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import Svg, { Circle, Path } from 'react-native-svg';

import { LanguageContext } from '../../localization/LanguageContext';

type PreLoginLayoutProps = {
  children: React.ReactNode;
  showBack?: boolean;
  onBack?: () => void;
};

const PreLoginLayout = ({
  children,
  showBack = true,
  onBack,
}: PreLoginLayoutProps) => {
  const navigation = useNavigation();
  const languageContext = useContext(LanguageContext);
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);

  const language = languageContext?.language || 'en';
  const setLanguage = languageContext?.setLanguage;

  const handleBack = () => {
    if (onBack) {
      onBack();
      return;
    }

    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
        <LinearGradient
          colors={['#12A89F', '#0E918A']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.header}
        >
          <View style={styles.headerLeft}>
            {showBack ? (
              <Pressable style={styles.backButton} onPress={handleBack}>
                <BackIcon width={20} height={20} color="#FFFFFF" />
              </Pressable>
            ) : (
              <View style={styles.backPlaceholder} />
            )}

            <Text style={styles.headerTitle}>Miracle Banking</Text>
          </View>

          <View>
            <Pressable
              style={styles.languagePill}
              onPress={() => setShowLanguageMenu(previous => !previous)}
            >
              <GlobeIcon width={14} height={14} color="#374151" />
              <Text style={styles.languageText}>
                {language === 'ar' ? 'العربية' : 'English'}
              </Text>
              <ChevronIcon width={14} height={14} color="#6B7280" />
            </Pressable>

            {showLanguageMenu && (
              <View style={styles.languageMenu}>
                <Pressable
                  style={styles.languageItem}
                  onPress={() => {
                    setLanguage?.('en');
                    setShowLanguageMenu(false);
                  }}
                >
                  <Text style={styles.languageItemText}>English</Text>
                </Pressable>

                <Pressable
                  style={styles.languageItem}
                  onPress={() => {
                    setLanguage?.('ar');
                    setShowLanguageMenu(false);
                  }}
                >
                  <Text style={styles.languageItemText}>العربية</Text>
                </Pressable>
              </View>
            )}
          </View>
        </LinearGradient>

        <View style={styles.content}>{children}</View>
      </View>
    </SafeAreaView>
  );
};

const BackIcon = ({
  width = 24,
  height = 24,
  color = '#FFFFFF',
}: {
  width?: number;
  height?: number;
  color?: string;
}) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
    <Path
      d="M15 18L9 12L15 6"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const GlobeIcon = ({
  width = 24,
  height = 24,
  color = '#000000',
}: {
  width?: number;
  height?: number;
  color?: string;
}) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="9" stroke={color} strokeWidth="1.6" />
    <Path d="M3 12H21" stroke={color} strokeWidth="1.4" />
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

const ChevronIcon = ({
  width = 24,
  height = 24,
  color = '#6B7280',
}: {
  width?: number;
  height?: number;
  color?: string;
}) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
    <Path
      d="M7 9L12 14L17 9"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#12A89F',
  },

  container: {
    flex: 1,
    backgroundColor: '#E8F4F3',
  },

  header: {
    minHeight: 56,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },

  backButton: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  backPlaceholder: {
    width: 36,
    height: 36,
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  languagePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },

  languageText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
  },

  languageMenu: {
    position: 'absolute',
    top: 40,
    right: 0,
    width: 130,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    overflow: 'hidden',
    zIndex: 20,
  },

  languageItem: {
    paddingHorizontal: 14,
    paddingVertical: 12,
  },

  languageItemText: {
    fontSize: 13,
    color: '#20242A',
  },

  content: {
    flex: 1,
  },
});

export default PreLoginLayout;

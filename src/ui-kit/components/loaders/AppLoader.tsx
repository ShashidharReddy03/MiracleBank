import React, { useContext, useState } from 'react';
import {
  Image,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
  ImageSourcePropType,
} from 'react-native';
import { LanguageContext } from '../../../localization/LanguageContext'; // adjust path as needed

const miracleLoader = require('../../../assets/loaders/miracle_loader.gif'); // adjust path as needed

interface AppLoaderProps {
  fullscreen?: boolean;
  message?: string;
  style?: StyleProp<ViewStyle>;
  gifName?: string;
}

const loaderMap: Record<string, ImageSourcePropType> = {
  'miracle_loader.gif': miracleLoader,
};

const AppLoader: React.FC<AppLoaderProps> = ({
  fullscreen = false,
  message,
  style,
  gifName = 'miracle_loader.gif',
}) => {
  const languageContext = useContext(LanguageContext);
  const translations = languageContext?.translations;
  const [imageFailed, setImageFailed] = useState(false);

  const t = (key: string, fallback: string): string => {
    try {
      if (!translations) return fallback;
      let value: any = translations;
      for (const k of key.split('.')) {
        value = value?.[k];
        if (!value) return fallback;
      }
      return value || fallback;
    } catch {
      return fallback;
    }
  };

  // Resolve default message via translation if no explicit message passed
  const resolvedMessage =
    message !== undefined ? message : t('appLoader.loading', 'Loading...');

  const gifSrc = loaderMap[gifName] || miracleLoader;

  const imageSize = fullscreen ? styles.imageLarge : styles.imageSmall;
  const textSize = fullscreen ? styles.textLarge : styles.textSmall;

  const content = (
    <>
      {!imageFailed && (
        <Image
          source={gifSrc}
          accessibilityLabel={t('appLoader.loadingAlt', 'Loading...')}
          style={imageSize}
          resizeMode="contain"
          onError={() => {
            console.error(`Failed to load loader image: ${gifName}`);
            setImageFailed(true);
          }}
        />
      )}
      {!!resolvedMessage && <Text style={[styles.text, textSize]}>{resolvedMessage}</Text>}
    </>
  );

  if (fullscreen) {
    return (
      <View style={[styles.fullscreen, style]} pointerEvents="auto">
        {content}
      </View>
    );
  }

  return <View style={[styles.inline, style]}>{content}</View>;
};

const styles = StyleSheet.create({
  fullscreen: {
    ...StyleSheet.absoluteFill,          // fixed inset-0
    zIndex: 50,                                // z-50
    backgroundColor: 'rgba(255,255,255,0.7)',  // bg-white bg-opacity-70
    alignItems: 'center',
    justifyContent: 'center',
  },
  inline: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageLarge: { width: 80, height: 80, marginBottom: 12 }, // w-20 h-20 mb-3
  imageSmall: { width: 64, height: 64, marginBottom: 8 },  // w-16 h-16 mb-2
  text: { color: '#4B5563', fontWeight: '500' },           // text-gray-600 font-medium
  textLarge: { fontSize: 14 },                             // text-sm
  textSmall: { fontSize: 12 },                             // text-xs
});

export default AppLoader;
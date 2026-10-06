import React, {useState} from 'react';
import {
  Pressable,
  Text,
  View,
} from 'react-native';

import AppearanceSheet from './AppearanceSheet';

export default function SettingsScreen() {
  const [appearanceVisible, setAppearanceVisible] =
    useState(false);

  return (
    <View style={{flex: 1}}>
      <Pressable
        onPress={() => setAppearanceVisible(true)}
      >
        <Text>Appearance</Text>
      </Pressable>

      <AppearanceSheet
        visible={appearanceVisible}
        onClose={() =>
          setAppearanceVisible(false)
        }
        selectedTheme="Light"
        selectedLanguage="English"
        onThemeChange={theme => {
          console.log('Theme:', theme);
        }}
        onLanguageChange={language => {
          console.log('Language:', language);
        }}
      />
    </View>
  );
}
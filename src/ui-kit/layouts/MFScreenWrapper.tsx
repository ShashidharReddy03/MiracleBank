import React from 'react';
import {
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../theme/ThemeProvider';

interface MFScreenWrapperProps {
  children: React.ReactNode;
  scrollable?: boolean;
  keyboardAvoiding?: boolean;
  style?: any;
  contentStyle?: any;
  statusBarStyle?: 'light-content' | 'dark-content';
  statusBarColor?: string;
}

export function MFScreenWrapper({
  children,
  scrollable = false,
  keyboardAvoiding = true,
  style,
  contentStyle,
  statusBarStyle = 'dark-content',
  statusBarColor,
}: MFScreenWrapperProps) {
  const t = useTheme();

  const content = scrollable ? (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={[{ padding: t.spacing.md, flexGrow: 1 }, contentStyle]}
      keyboardShouldPersistTaps="always"
      keyboardDismissMode="none"
      showsVerticalScrollIndicator={false}
    >
      {children}
    </ScrollView>
  ) : (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={[{ flex: 1, padding: t.spacing.md }, contentStyle]}>
        {children}
      </View>
    </TouchableWithoutFeedback>
  );

  const wrapped = keyboardAvoiding ? (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {content}
    </KeyboardAvoidingView>
  ) : (
    content
  );

  return (
    <SafeAreaView
      style={[{ flex: 1, backgroundColor: t.colors.background }, style]}
    >
      <StatusBar
        barStyle={statusBarStyle}
        backgroundColor={statusBarColor ?? t.colors.background}
        translucent={false}
      />
      {wrapped}
    </SafeAreaView>
  );
}

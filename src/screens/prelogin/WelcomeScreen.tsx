import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface MobileWelcomeScreenProps {
  onLogin: () => void;
}

const MobileWelcomeScreen: React.FC<MobileWelcomeScreenProps> = ({ onLogin }) => (
  <SafeAreaView style={styles.safeArea}>
    <View style={styles.content}>
      <View style={styles.logoMark}>
        <Text style={styles.logoText}>MB</Text>
      </View>
      <Text style={styles.eyebrow}>MIRACLE BANKING</Text>
      <Text style={styles.title}>Welcome to simpler banking.</Text>
      <Text style={styles.description}>
        Your everyday banking, ready whenever you are.
      </Text>
      <Pressable accessibilityRole="button" onPress={onLogin} style={styles.button}>
        <Text style={styles.buttonText}>Continue to login</Text>
      </Pressable>
    </View>
  </SafeAreaView>
);

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F4F7F6',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 28,
  },
  logoMark: {
    width: 72,
    height: 72,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 36,
    borderRadius: 20,
    backgroundColor: '#087F76',
  },
  logoText: {
    color: '#FFFFFF',
    fontSize: 23,
    fontWeight: '700',
  },
  eyebrow: {
    color: '#087F76',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.5,
  },
  title: {
    maxWidth: 340,
    marginTop: 14,
    color: '#17302E',
    fontSize: 36,
    fontWeight: '700',
    lineHeight: 43,
  },
  description: {
    marginTop: 14,
    color: '#5D706E',
    fontSize: 16,
    lineHeight: 24,
  },
  button: {
    minHeight: 54,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
    borderRadius: 8,
    backgroundColor: '#087F76',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default MobileWelcomeScreen;
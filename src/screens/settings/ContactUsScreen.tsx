import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/stacks/AuthStack';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
export default function ContactUsScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          style={styles.headerButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backIcon}>‹</Text>
        </Pressable>

        <View style={styles.helpIcon}>
          <Text style={styles.questionMark}>?</Text>
        </View>

        <Text style={styles.headerTitle}>
          Contact Us
        </Text>

        <View style={styles.headerRight} />
      </View>

      {/* Content */}
      <View style={styles.content}>
        <View style={styles.contactCard}>
          {/* Email */}
          <View style={styles.contactItem}>
            <View style={styles.contactIconContainer}>
              <Text style={styles.contactIcon}>
                ✉
              </Text>
            </View>

            <View style={styles.contactText}>
              <Text style={styles.label}>
                Email Us
              </Text>

              <Text style={styles.value}>
                Loading...
              </Text>
            </View>
          </View>

          {/* Call */}
          <View style={styles.contactItem}>
            <View style={styles.contactIconContainer}>
              <Text style={styles.contactIcon}>
                ♧
              </Text>
            </View>

            <View style={styles.contactText}>
              <Text style={styles.label}>
                Call Us
              </Text>

              <Text style={styles.value}>
                Loading...
              </Text>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EAF8FA',
  },

  header: {
    height: 52,
    backgroundColor: '#21C4C0',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
  },

  headerButton: {
    width: 36,
    height: 36,
    borderRadius: 9,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  backIcon: {
    color: '#FFFFFF',
    fontSize: 28,
    lineHeight: 30,
  },

  helpIcon: {
    width: 24,
    height: 24,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },

  questionMark: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },

  headerTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    marginLeft: 8,
  },

  headerRight: {
    flex: 1,
  },

  content: {
    flex: 1,
    padding: 16,
  },

  contactCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.12,
    shadowRadius: 8,

    elevation: 4,
  },

  contactItem: {
    height: 76,
    borderRadius: 9,
    backgroundColor: '#E8F7F7',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    marginBottom: 12,
  },

  contactItemLast: {
    marginBottom: 0,
  },

  contactIconContainer: {
    width: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },

  contactIcon: {
    fontSize: 21,
    color: '#00AFA8',
  },

  contactText: {
    marginLeft: 8,
  },

  label: {
    fontSize: 11,
    color: '#717983',
    marginBottom: 7,
  },

  value: {
    fontSize: 13,
    color: '#20242A',
    fontWeight: '500',
  },
});
import React from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthStackParamList } from '../../navigation/stacks/AuthStack';

type DestinationName =
  | 'LocateUs'
  | 'Offers'
  | 'AppCode'
  | 'Help'
  | 'FAQ'
  | 'ReferAFriend'
  | 'RateUs';

type Props = NativeStackScreenProps<AuthStackParamList, DestinationName>;

const destinationTitles: Record<DestinationName, string> = {
  LocateUs: 'Locate Us',
  Offers: 'Offers',
  AppCode: 'App Code',
  Help: 'Help',
  FAQ: 'FAQ',
  ReferAFriend: 'Refer a Friend',
  RateUs: 'Rate Us',
};

export default function SettingsDestinationScreen({
  navigation,
  route,
}: Props) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable
          accessibilityLabel="Go back"
          style={styles.headerButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backIcon}>‹</Text>
        </Pressable>

        <View style={styles.helpIcon}>
          <Text style={styles.questionMark}>?</Text>
        </View>

        <Text style={styles.headerTitle}>
          {destinationTitles[route.name]}
        </Text>

        <View style={styles.headerRight} />
      </View>

      <View style={styles.content}>
        <Text style={styles.loading}>Loading</Text>
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  loading: {
    color: '#717983',
    fontSize: 20,
    fontWeight: '500',
  },
});
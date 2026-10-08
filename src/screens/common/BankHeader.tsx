import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ChevronLeft, LogOut } from 'lucide-react-native';
import { confirmLogout } from '../../utils/logout';

const PRIMARY = '#14B8A6';

type BankHeaderProps = {
  title: string;
};

export function BankHeader({ title }: BankHeaderProps) {
  const navigation = useNavigation<any>();

  return (
    <View style={styles.bar}>
      <Pressable
        style={styles.button}
        onPress={() => {
          if (navigation.canGoBack()) {
            navigation.goBack();
            return;
          }
          navigation.navigate('Dashboard');
        }}
      >
        <ChevronLeft size={22} color="#ffffff" strokeWidth={2.4} />
      </Pressable>
      <Text style={styles.title}>{title}</Text>
      <Pressable style={styles.button} onPress={() => confirmLogout(navigation)}>
        <LogOut size={18} color="#ffffff" strokeWidth={2.2} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    backgroundColor: PRIMARY,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  button: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    flex: 1,
    textAlign: 'center',
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
});

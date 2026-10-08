import React, { useState } from 'react';
import { Pressable, Share, StatusBar, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Download, Share2 } from 'lucide-react-native';
import QRCode from 'react-native-qrcode-svg';
import { BankHeader } from '../common/BankHeader';
import { MFDialog } from '../../ui-kit/components/modals/MFModals';
import { runWithLoader } from '../../ui-kit/components/loaders/loaderService';

const PRIMARY = '#14B8A6';
const BG = '#F7FBFB';
const QR_VALUE = 'miracle-banking://pay?account=917981976686&name=Shashidhar%20Reddy';

export function QrCodeScreen() {
  const insets = useSafeAreaInsets();
  const [notice, setNotice] = useState('');

  const shareCode = () => {
    void runWithLoader(async () => {
      await Share.share({ message: QR_VALUE, title: 'Miracle Banking QR' });
    });
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" backgroundColor={PRIMARY} />
      <BankHeader title="QR Code" />
      <View style={styles.body}>
        <View style={styles.qrCard}>
          <QRCode value={QR_VALUE} size={210} />
        </View>
        <View style={styles.actions}>
          <Pressable
            style={styles.action}
            onPress={() => {
              void runWithLoader(() => {
                setNotice('QR code is ready. Use Share to send it.');
              });
            }}
          >
            <Download size={22} color={PRIMARY} />
            <Text style={styles.actionLabel}>Download</Text>
          </Pressable>
          <Pressable style={styles.action} onPress={shareCode}>
            <Share2 size={22} color={PRIMARY} />
            <Text style={styles.actionLabel}>Share</Text>
          </Pressable>
        </View>
      </View>
      <MFDialog
        visible={!!notice}
        title="Download"
        message={notice}
        confirmLabel="OK"
        onConfirm={() => setNotice('')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: PRIMARY },
  body: { flex: 1, backgroundColor: BG, alignItems: 'center', paddingTop: 28 },
  qrCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 18,
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  actions: { flexDirection: 'row', gap: 16, marginTop: 22 },
  action: {
    width: 120,
    height: 88,
    borderRadius: 16,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    elevation: 2,
  },
  actionLabel: { fontSize: 14, fontWeight: '600', color: '#111827' },
});

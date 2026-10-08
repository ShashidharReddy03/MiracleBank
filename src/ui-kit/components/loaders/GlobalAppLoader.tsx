import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/store';
import AppLoader from './AppLoader';

export function GlobalAppLoader() {
  const visible = useSelector((state: RootState) => state.loader.isLoading);

  if (!visible) {
    return null;
  }

  return (
    <View style={styles.overlay} pointerEvents="auto">
      <AppLoader fullscreen />
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFill,
    zIndex: 10000,
    elevation: 10000,
  },
});

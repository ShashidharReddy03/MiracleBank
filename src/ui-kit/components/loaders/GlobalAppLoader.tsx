import React from 'react';
import { Modal } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/store';
import AppLoader from './AppLoader';

export function GlobalAppLoader() {
  const visible = useSelector((state: RootState) => state.loader.isLoading);

  if (!visible) {
    return null;
  }

  return (
    <Modal
      visible
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={() => undefined}
    >
      <AppLoader fullscreen />
    </Modal>
  );
}

import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import { useEffect, useState } from 'react';
import NetInfo from '@react-native-community/netinfo';
import type { RootState, AppDispatch } from '../store/store';

/** Typed Redux hooks — use these instead of plain useDispatch / useSelector */
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

/** Network connectivity hook */
export function useNetwork() {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [connectionType, setConnectionType] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected);
      setConnectionType(state.type);
    });
    return unsubscribe;
  }, []);

  return { isConnected, connectionType };
}

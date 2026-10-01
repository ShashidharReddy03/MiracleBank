import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from '@reduxjs/toolkit';
 
interface MiracleModalState {
  errorModal:        { isOpen: boolean; title: string; message: string };
  sessionModal:      { isOpen: boolean; message: string };
  closeAllModals:    boolean;
  sessionExpired:    boolean;
  closeAllModalsKey: number;
}
 
const initialState: MiracleModalState = {
  errorModal:        { isOpen: false, title: "", message: "" },
  sessionModal:      { isOpen: false, message: "" },
  closeAllModals:    false,
  sessionExpired:    false,
  closeAllModalsKey: 0,
};
 
const MiracleGlobalModalSlice = createSlice({
  name: "MiracleGlobalModal",
  initialState,
  reducers: {
    showMiracleError: (state, action: PayloadAction<{ title?: string; message: string }>) => {
      if (state.sessionExpired) return;
      state.errorModal = {
        isOpen:  true,
        title:   action.payload.title || "Error",
        message: action.payload.message,
      };
    },
    hideMiracleError: (state) => {
      state.errorModal = { isOpen: false, title: "", message: "" };
    },
    showMiracleSession: (state, action: PayloadAction<{ message: string }>) => {
      if (state.sessionExpired) return;
      state.sessionModal   = { isOpen: true, message: action.payload.message };
      state.sessionExpired = true;
      state.errorModal     = { isOpen: false, title: "", message: "" };
    },
    hideMiracleSession: (state) => {
      state.sessionModal   = { isOpen: false, message: "" };
      state.sessionExpired = false;
    },
    triggerCloseAllModals: (state) => {
      if (state.sessionExpired && state.closeAllModals) return;
      state.closeAllModals    = true;
      state.closeAllModalsKey = state.closeAllModalsKey + 1;
    },
    resetCloseAllModals: (state) => {
      state.closeAllModals = false;
    },
  },
});
 
export const {
  showMiracleError,
  hideMiracleError,
  showMiracleSession,
  hideMiracleSession,
  triggerCloseAllModals,
  resetCloseAllModals,
} = MiracleGlobalModalSlice.actions;
 
export default MiracleGlobalModalSlice.reducer;
 
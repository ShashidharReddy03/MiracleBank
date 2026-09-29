import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SessionState {
  locked:           boolean;
  securityBlocked:  boolean;
  securityFailures: string[];
}

const initialState: SessionState = {
  locked:           false,
  securityBlocked:  false,
  securityFailures: [],
};

export const sessionSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    lockSession(state) {
      state.locked = true;
    },
    unlockSession(state) {
      state.locked = false;
    },
    // Called from bootstrap when security checks fail
    blockSecurity(state, action: PayloadAction<string[]>) {
      state.securityBlocked  = true;
      state.securityFailures = action.payload;
    },
    clearSecurityBlock(state) {
      state.securityBlocked  = false;
      state.securityFailures = [];
    },
  },
});

export const {
  lockSession,
  unlockSession,
  blockSecurity,
  clearSecurityBlock,
} = sessionSlice.actions;

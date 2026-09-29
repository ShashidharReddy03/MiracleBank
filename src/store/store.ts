import { configureStore } from '@reduxjs/toolkit';
import { authSlice }         from './slices/authSlice';
import { accountSlice }      from './slices/accountSlice';
import { transactionSlice }  from './slices/transactionSlice';
import { notificationSlice } from './slices/notificationSlice';
import { sessionSlice }      from './slices/sessionSlice'; // ← has securityBlocked
import { sessionMiddleware }  from './middleware/sessionMiddleware';

export const store = configureStore({
  reducer: {
    auth:          authSlice.reducer,
    accounts:      accountSlice.reducer,
    transactions:  transactionSlice.reducer,
    notifications: notificationSlice.reducer,
    session:       sessionSlice.reducer,
  },
  middleware: (getDefault) =>
    getDefault({ serializableCheck: false }).concat(sessionMiddleware),
});

export type RootState   = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

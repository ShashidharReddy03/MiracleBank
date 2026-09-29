import { Middleware } from '@reduxjs/toolkit';
import { sessionManager } from '../../core/session/SessionManager';

export const sessionMiddleware: Middleware = () => (next) => (action) => {
  sessionManager.touch();
  return next(action);
};

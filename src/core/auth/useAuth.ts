import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { authManager } from   './AuthManager'
import { AuthTokens } from '../../types/banking';
import { RootState } from '../../store/store';
import { loginSuccess, logout as logoutAction } from '../../store/slices/authSlice';

export function useAuth() {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((s: RootState) => s.auth.isAuthenticated);
  const user = useSelector((s: RootState) => s.auth.user);

  const login = useCallback(async (tokens: AuthTokens, user: any) => {
    await authManager.saveTokens(tokens);
    dispatch(loginSuccess({ tokens, user }));
  }, [dispatch]);

  const logout = useCallback(async () => {
    await authManager.clearTokens();
    dispatch(logoutAction());
  }, [dispatch]);

  return { isAuthenticated, user, login, logout };
}

import { useState, useEffect } from 'react';
import { getAuthCookie, clearAuthCookie } from '../utils/cookies';
import { AuthState } from '../types/auth';

export function useAuth() {
  const [auth, setAuth] = useState<AuthState | null>(null);

  useEffect(() => {
    const cookie = getAuthCookie();
    setAuth(cookie);
  }, []);

  const logout = () => {
    clearAuthCookie();
    setAuth(null);
  };

  const login = (newAuth: AuthState) => {
    setAuth(newAuth);
  };

  return {
    accessToken: auth?.access_token || null,
    isAuthenticated: !!auth?.access_token,
    logout,
    login,
    auth
  };
}

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import authApi from '../api/authApi.js';
import { setAccessToken } from '../api/axiosClient.js';

const AuthContext = createContext(null);

/**
 * Provides authentication state + actions to the whole app.
 * - Bootstraps session on load by attempting a token refresh.
 * - Exposes login/verify/logout + user mutation helpers.
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const isAuthenticated = Boolean(user);

  /* --- Try to restore session using the httpOnly refresh cookie --- */
  const bootstrap = useCallback(async () => {
    try {
      const { data } = await authApi.refresh();
      setAccessToken(data.accessToken);
      const me = await authApi.getMe();
      setUser(me.data.user);
    } catch {
      setUser(null);
      setAccessToken(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    bootstrap();
  }, [bootstrap]);

  /* ------------------------- Actions ------------------------- */
  const login = async (payload) => {
    const res = await authApi.login(payload);
    setAccessToken(res.data.accessToken);
    setUser(res.data.user);
    return res;
  };

  const verifyOtp = async (payload) => {
    const res = await authApi.verifyOtp(payload);
    setAccessToken(res.data.accessToken);
    setUser(res.data.user);
    return res;
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } finally {
      setUser(null);
      setAccessToken(null);
    }
  };

  const updateUser = (partial) => setUser((prev) => ({ ...prev, ...partial }));

  const value = { user, loading, isAuthenticated, login, verifyOtp, logout, updateUser };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuthContext must be used within AuthProvider');
  return ctx;
};

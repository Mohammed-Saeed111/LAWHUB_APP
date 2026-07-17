import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import lawhubApi from '../api/lawhubApi.js';
import useAuth from '../hooks/useAuth.js';

const AppContext = createContext(null);

/**
 * Client-journey store (favorites + in-progress booking draft).
 * Favorites are synced with the backend and re-loaded whenever the
 * authentication state changes (login/logout).
 */
export const AppProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [favorites, setFavorites] = useState([]); // lawyer ids (string)
  const [booking, setBooking] = useState(null);

  const loadFavorites = useCallback(async () => {
    if (!isAuthenticated) { setFavorites([]); return; }
    try {
      const { ids } = await lawhubApi.getFavorites();
      setFavorites(ids.map(String));
    } catch {
      setFavorites([]);
    }
  }, [isAuthenticated]);

  useEffect(() => { loadFavorites(); }, [loadFavorites]);

  const isFavorite = useCallback((id) => favorites.includes(String(id)), [favorites]);

  const toggleFavorite = useCallback(async (id) => {
    const key = String(id);
    setFavorites((prev) => (prev.includes(key) ? prev.filter((x) => x !== key) : [...prev, key]));
    try { await lawhubApi.toggleFavorite(key); }
    catch { setFavorites((prev) => (prev.includes(key) ? prev.filter((x) => x !== key) : [...prev, key])); }
  }, []);

  const value = { favorites, isFavorite, toggleFavorite, refreshFavorites: loadFavorites, booking, setBooking };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};

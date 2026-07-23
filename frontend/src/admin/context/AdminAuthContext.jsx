import { createContext, useContext, useState, useEffect } from 'react';
import { adminAuthApi, setAdminToken } from '../api/adminApi.js';

const AdminAuthContext = createContext(null);

export const AdminAuthProvider = ({ children }) => {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const d  = await adminAuthApi.refresh();
        setAdminToken(d.accessToken);
        const me = await adminAuthApi.me();
        // Only allow admin / moderator / support roles into the console
        if (['admin', 'moderator', 'support'].includes(me.user?.role)) {
          setUser(me.user);
        } else {
          setUser(null);
        }
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const login = async (email, password) => {
    const d = await adminAuthApi.login({ email, password });
    setAdminToken(d.accessToken);
    if (!['admin', 'moderator', 'support'].includes(d.user?.role)) {
      throw new Error('ليس لديك صلاحية الدخول إلى لوحة التحكم.');
    }
    setUser(d.user);
    return d.user;
  };

  const logout = async () => {
    try { await adminAuthApi.logout(); } finally { setAdminToken(null); setUser(null); }
  };

  return (
    <AdminAuthContext.Provider value={{ user, loading, authed: Boolean(user), login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const c = useContext(AdminAuthContext);
  if (!c) throw new Error('useAdminAuth must be used within AdminAuthProvider');
  return c;
};

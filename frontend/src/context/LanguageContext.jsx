import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { translations } from '../i18n/translations.js';

const LanguageContext = createContext(null);

/**
 * Provides the active language, a translation helper `t('section.key')`,
 * and a setter that also updates <html dir/lang> for correct RTL/LTR.
 */
export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(() => localStorage.getItem('lawhub_lang') || 'ar');

  useEffect(() => {
    const dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.setAttribute('dir', dir);
    document.documentElement.setAttribute('lang', lang);
    localStorage.setItem('lawhub_lang', lang);
  }, [lang]);

  /** Dot-path translation lookup with graceful fallback to the key. */
  const t = useCallback(
    (path) => {
      const value = path
        .split('.')
        .reduce((acc, key) => (acc ? acc[key] : undefined), translations[lang]);
      return value ?? path;
    },
    [lang]
  );

  const toggleLang = () => setLang((l) => (l === 'ar' ? 'en' : 'ar'));

  const value = { lang, isRTL: lang === 'ar', setLang, toggleLang, t };
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
};

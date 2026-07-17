import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Logo from '../../components/ui/Logo.jsx';
import useAuth from '../../hooks/useAuth.js';
import { useLanguage } from '../../context/LanguageContext.jsx';

/**
 * SCREEN 1 — Splash Screen
 * First touch-point. Premium logo animation (justice scale + shield) on deep
 * navy (#0A0E17) with a warm-gold spotlight glow. Tone: "Legal Luxury".
 * Auto-routes to language selection (or success if already signed in).
 */
const SplashScreen = () => {
  const navigate = useNavigate();
  const { isAuthenticated, loading } = useAuth();
  const { t } = useLanguage();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (loading) return;
      navigate(isAuthenticated ? '/' : '/language', { replace: true });
    }, 2600);
    return () => clearTimeout(timer);
  }, [navigate, isAuthenticated, loading]);

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-navy">
      {/* Spotlight glow */}
      <div className="absolute inset-0 bg-gold-radial" />

      <motion.div
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: 'easeOut' }}
        className="relative z-10 flex flex-col items-center"
      >
        <Logo size={130} />

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="mt-8 font-serif text-5xl font-bold text-gold"
        >
          محاميك
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="mt-2 text-xl text-ink"
          dir="ltr"
        >
          Egypt LawHub
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.8 }}
          className="mt-5 text-sm tracking-wide text-ink-muted"
        >
          {t('brand.tagline')}
        </motion.p>
      </motion.div>

      {/* Loader bar */}
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: '160px' }}
        transition={{ delay: 1.6, duration: 1 }}
        className="absolute bottom-16 h-0.5 overflow-hidden rounded-full bg-gold/20"
      >
        <div className="h-full w-full animate-pulse bg-gold" />
      </motion.div>
    </div>
  );
};

export default SplashScreen;

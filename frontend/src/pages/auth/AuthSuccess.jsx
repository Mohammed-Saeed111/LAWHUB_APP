import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiLogOut } from 'react-icons/fi';
import { MdVerifiedUser } from 'react-icons/md';
import Logo from '../../components/ui/Logo.jsx';
import Button from '../../components/ui/Button.jsx';
import useAuth from '../../hooks/useAuth.js';
import { useLanguage } from '../../context/LanguageContext.jsx';

/**
 * SCREEN 10 — Success & Authentication Completion.
 * A celebratory screen with a gold "verified" shield and a CTA into the
 * role-based dashboard (wired in later phases).
 */
const AuthSuccess = () => {
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  // Enter the client platform (Phase B home). Professionals could branch here later.
  const goDashboard = () => navigate('/', { replace: true });

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-navy bg-gold-radial px-6 text-center">
      {/* Verified shield with pulse ring */}
      <div className="relative flex items-center justify-center">
        <motion.span
          className="absolute h-24 w-24 rounded-full border-2 border-gold"
          animate={{ scale: [0.9, 1.6], opacity: [0.7, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="flex h-24 w-24 items-center justify-center rounded-full border-2 border-gold bg-gold/10 shadow-gold-lg"
        >
          <MdVerifiedUser size={48} className="text-gold" />
        </motion.div>
      </div>

      <motion.h1
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-8 text-2xl font-bold text-ink"
      >
        {t('success.title')}
      </motion.h1>

      <p className="mt-2 max-w-sm text-ink-muted">
        {t('success.subtitle')}
        {user?.fullName ? ` — ${user.fullName}` : ''}
      </p>

      <div className="mt-10 w-full max-w-xs space-y-3">
        <Button onClick={goDashboard}>{t('success.goDashboard')}</Button>
        <Button variant="outline" onClick={logout} className="flex items-center justify-center gap-2">
          <FiLogOut /> {t('success.logout')}
        </Button>
      </div>

      <div className="mt-16 opacity-50">
        <Logo size={40} glow={false} />
      </div>
    </div>
  );
};

export default AuthSuccess;

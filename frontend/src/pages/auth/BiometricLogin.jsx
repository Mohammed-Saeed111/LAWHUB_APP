import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { MdFingerprint } from 'react-icons/md';
import Logo from '../../components/ui/Logo.jsx';
import { useLanguage } from '../../context/LanguageContext.jsx';

/**
 * SCREEN 9 — Secure Login / Biometric Entry.
 * A large glowing gold fingerprint is the focal point for fast, high-security
 * re-entry (e.g. returning lawyers). Falls back to password login.
 *
 * NOTE: real biometric auth uses the WebAuthn API (navigator.credentials).
 * Here we simulate the ceremony; wire WebAuthn in production.
 */
const BiometricLogin = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [scanning, setScanning] = useState(false);

  const scan = () => {
    if (scanning) return;
    setScanning(true);
    // Simulated biometric ceremony. Replace with WebAuthn in production.
    setTimeout(() => {
      toast('👉 WebAuthn integration goes here.', { icon: '🔒' });
      setScanning(false);
      navigate('/login');
    }, 1800);
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-navy bg-gold-radial px-6 text-center">
      <div className="absolute top-10">
        <Logo size={56} glow={false} />
      </div>

      <h1 className="text-2xl font-bold text-ink">{t('biometric.title')}</h1>
      <p className="mt-1 text-ink-muted">{t('biometric.welcome')} 👋</p>

      {/* Glowing fingerprint */}
      <button onClick={scan} className="relative mt-12 flex items-center justify-center" aria-label="Scan fingerprint">
        {[0, 1].map((i) => (
          <motion.span
            key={i}
            className="absolute rounded-full border border-gold/40"
            initial={{ width: 120, height: 120, opacity: 0.6 }}
            animate={
              scanning
                ? { width: 240, height: 240, opacity: 0 }
                : { width: 160, height: 160, opacity: 0.25 }
            }
            transition={{ duration: 1.6, repeat: Infinity, delay: i * 0.5 }}
          />
        ))}
        <motion.span
          className="absolute h-40 w-40 rounded-full bg-gold/20 blur-2xl"
          animate={{ opacity: scanning ? [0.4, 0.9, 0.4] : 0.4 }}
          transition={{ duration: 1.2, repeat: Infinity }}
        />
        <span
          className={`relative flex h-32 w-32 items-center justify-center rounded-full border-2 transition ${
            scanning ? 'border-gold bg-gold/20' : 'border-gold/60 bg-navy-700'
          }`}
        >
          <MdFingerprint size={72} className="text-gold" />
        </span>
      </button>

      <p className="mt-12 text-sm text-ink-muted">
        {scanning ? t('biometric.authenticating') : t('biometric.instruction')}
      </p>

      <button onClick={() => navigate('/login')} className="mt-6 link-gold text-sm">
        {t('biometric.usePassword')}
      </button>
    </div>
  );
};

export default BiometricLogin;

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiCheck } from 'react-icons/fi';
import { GiGavel } from 'react-icons/gi';
import Logo from '../../components/ui/Logo.jsx';
import Button from '../../components/ui/Button.jsx';
import { useLanguage } from '../../context/LanguageContext.jsx';

/**
 * SCREEN 2 — Language Selection.
 * Two large, elegant gold-bordered cards (Arabic / English) with a subtle glow.
 * A faint gavel motif reinforces the legal context. High-contrast & accessible.
 */
const LanguageSelection = () => {
  const navigate = useNavigate();
  const { lang, setLang, t } = useLanguage();
  const [selected, setSelected] = useState(lang);

  const OPTIONS = [
    { code: 'ar', label: 'العربية', sub: 'Arabic', dir: 'rtl' },
    { code: 'en', label: 'English', sub: 'الإنجليزية', dir: 'ltr' },
  ];

  const confirm = () => {
    setLang(selected);
    navigate('/login');
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-navy bg-gold-radial px-6">
      {/* Faint legal motif */}
      <GiGavel className="pointer-events-none absolute -right-10 bottom-0 text-gold/5" size={320} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md text-center"
      >
        <div className="flex justify-center">
          <Logo size={72} />
        </div>
        <h1 className="mt-6 text-2xl font-bold text-ink">{t('language.title')}</h1>
        <p className="mt-1 text-sm text-ink-muted">{t('language.subtitle')}</p>

        <div className="mt-8 grid grid-cols-2 gap-4">
          {OPTIONS.map((opt) => {
            const active = selected === opt.code;
            return (
              <button
                key={opt.code}
                onClick={() => setSelected(opt.code)}
                dir={opt.dir}
                className={`relative flex flex-col items-center justify-center gap-1 rounded-2xl border p-6 transition ${
                  active
                    ? 'border-gold bg-gold/10 shadow-gold'
                    : 'border-gold/20 bg-navy-700 hover:border-gold/50'
                }`}
              >
                {active && (
                  <span className="absolute right-3 top-3 text-gold">
                    <FiCheck size={18} />
                  </span>
                )}
                <span className="text-xl font-bold text-ink">{opt.label}</span>
                <span className="text-xs text-ink-muted">{opt.sub}</span>
              </button>
            );
          })}
        </div>

        <div className="mt-8">
          <Button onClick={confirm}>{t('common.continue')}</Button>
        </div>
      </motion.div>
    </div>
  );
};

export default LanguageSelection;

import { motion } from 'framer-motion';
import Logo from '../components/ui/Logo.jsx';
import LanguageSwitcher from '../components/ui/LanguageSwitcher.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';

/**
 * Two-column auth shell:
 *  - Left (desktop): branded "Legal Luxury" panel with logo + tagline.
 *  - Right: the actual form card (children), animated in.
 * Includes a language switcher in the corner on every auth screen.
 */
const AuthLayout = ({ title, subtitle, children }) => {
  const { t } = useLanguage();

  return (
    <div className="relative min-h-screen bg-navy bg-gold-radial flex flex-col lg:flex-row">
      <div className="absolute top-4 z-20 ltr:right-4 rtl:left-4">
        <LanguageSwitcher />
      </div>

      {/* Brand panel */}
      <aside className="relative hidden lg:flex w-1/2 flex-col items-center justify-center p-12 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-navy-800 to-navy" />
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7 }}
          className="relative z-10 text-center"
        >
          <Logo size={110} />
          <h1 className="mt-8 font-serif text-4xl font-bold text-gold">محاميك</h1>
          <p className="mt-1 text-lg text-ink" dir="ltr">
            Egypt LawHub
          </p>
          <p className="mt-6 max-w-sm text-ink-muted">{t('brand.tagline')}</p>
          <div className="mx-auto mt-8 h-px w-24 bg-gradient-to-r from-transparent via-gold to-transparent" />
        </motion.div>
      </aside>

      {/* Form panel */}
      <main className="flex w-full lg:w-1/2 items-center justify-center p-6 sm:p-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Mobile header */}
          <div className="mb-8 flex flex-col items-center lg:hidden">
            <Logo size={64} />
            <h1 className="mt-3 font-serif text-2xl font-bold text-gold">محاميك</h1>
          </div>

          <div className="card-luxury p-6 sm:p-8">
            {title && <h2 className="text-2xl font-bold text-ink">{title}</h2>}
            {subtitle && <p className="mt-1 text-sm text-ink-muted">{subtitle}</p>}
            <div className="mt-6">{children}</div>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default AuthLayout;

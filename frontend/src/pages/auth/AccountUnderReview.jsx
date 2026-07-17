import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FiCheckCircle, FiClock } from 'react-icons/fi';
import Logo from '../../components/ui/Logo.jsx';
import Button from '../../components/ui/Button.jsx';
import useAuth from '../../hooks/useAuth.js';
import { useLanguage } from '../../context/LanguageContext.jsx';

/**
 * SCREEN 8 — Account Under Review.
 * Reassures the lawyer after submitting credentials: shows completed steps
 * (account created, docs uploaded) and the pending step (bar review), plus a
 * "48-hour review cycle" badge to set professional expectations.
 */
const AccountUnderReview = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { t } = useLanguage();

  const steps = [
    { label: t('review.stepAccount'), done: true },
    { label: t('review.stepDocs'), done: true },
    { label: t('review.stepReview'), done: false },
  ];

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-navy bg-gold-radial px-6 py-10 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <div className="flex justify-center">
          <Logo size={72} />
        </div>

        <h1 className="mt-6 text-2xl font-bold text-ink">{t('review.title')}</h1>
        <p className="mt-1 text-sm text-ink-muted">{t('review.subtitle')}</p>

        {/* 48h badge */}
        <div className="mx-auto mt-5 inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-4 py-1.5 text-sm text-gold">
          <FiClock size={16} />
          {t('review.cycle')}
        </div>

        {/* Steps */}
        <div className="card-luxury mt-8 space-y-4 p-6 text-start">
          {steps.map((s, i) => (
            <div key={i} className="flex items-center gap-3">
              {s.done ? (
                <FiCheckCircle className="shrink-0 text-gold" size={22} />
              ) : (
                <span className="flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full border-2 border-gold/50">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-gold" />
                </span>
              )}
              <span className={s.done ? 'text-ink' : 'font-medium text-gold'}>{s.label}</span>
            </div>
          ))}
        </div>

        <p className="mt-6 text-sm leading-relaxed text-ink-muted">{t('review.note')}</p>

        <div className="mt-8 space-y-3">
          <Button onClick={() => navigate('/success')}>{t('review.backHome')}</Button>
          <Button variant="ghost" onClick={logout}>
            {t('success.logout')}
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default AccountUnderReview;

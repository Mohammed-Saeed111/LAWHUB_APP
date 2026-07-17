import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FiSmartphone, FiMessageSquare, FiMail, FiShield, FiCheck } from 'react-icons/fi';
import AuthLayout from '../../layouts/AuthLayout.jsx';
import Button from '../../components/ui/Button.jsx';
import authApi from '../../api/authApi.js';
import useAuth from '../../hooks/useAuth.js';
import { useLanguage } from '../../context/LanguageContext.jsx';

/**
 * SCREEN 6 — Multi-Factor Security Setup.
 * Lets the user enable an extra security layer (authenticator / SMS / email)
 * and includes a "Why do we need two-factor?" explainer to build trust.
 */
const MfaSetup = () => {
  const navigate = useNavigate();
  const { updateUser } = useAuth();
  const { t } = useLanguage();
  const [method, setMethod] = useState('authenticator');
  const [loading, setLoading] = useState(false);

  const METHODS = [
    { key: 'authenticator', icon: FiSmartphone, title: t('mfa.authenticator'), desc: t('mfa.authenticatorDesc') },
    { key: 'sms', icon: FiMessageSquare, title: t('mfa.sms'), desc: t('mfa.smsDesc') },
    { key: 'email', icon: FiMail, title: t('mfa.email'), desc: t('mfa.emailDesc') },
  ];

  const enable = async () => {
    setLoading(true);
    try {
      const res = await authApi.setupMfa(method);
      updateUser(res.data.user);
      toast.success('🔐');
      navigate('/success', { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not enable MFA.');
    } finally {
      setLoading(false);
    }
  };

  const skip = async () => {
    try {
      await authApi.setupMfa('none');
    } finally {
      navigate('/success', { replace: true });
    }
  };

  return (
    <AuthLayout title={t('mfa.title')} subtitle={t('mfa.subtitle')}>
      <div className="space-y-3">
        {METHODS.map(({ key, icon: Icon, title, desc }) => {
          const active = method === key;
          return (
            <button
              key={key}
              onClick={() => setMethod(key)}
              className={`flex w-full items-center gap-4 rounded-2xl border p-4 text-start transition ${
                active ? 'border-gold bg-gold/10 shadow-gold' : 'border-white/10 bg-navy-800 hover:border-gold/40'
              }`}
            >
              <div
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                  active ? 'bg-gold text-navy' : 'bg-navy-600 text-gold'
                }`}
              >
                <Icon size={20} />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-ink">{title}</p>
                <p className="text-xs text-ink-muted">{desc}</p>
              </div>
              {active && <FiCheck className="text-gold" size={20} />}
            </button>
          );
        })}

        {/* Why 2FA explainer */}
        <div className="rounded-2xl border border-gold/20 bg-navy-800/60 p-4">
          <div className="flex items-center gap-2 text-gold">
            <FiShield size={18} />
            <span className="font-semibold">{t('mfa.whyTitle')}</span>
          </div>
          <p className="mt-2 text-sm leading-relaxed text-ink-muted">{t('mfa.whyText')}</p>
        </div>

        <Button onClick={enable} loading={loading}>
          {t('mfa.enable')}
        </Button>
        <button onClick={skip} className="mx-auto block text-sm text-ink-muted hover:text-gold">
          {t('mfa.skip')}
        </button>
      </div>
    </AuthLayout>
  );
};

export default MfaSetup;

import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FiUser } from 'react-icons/fi';
import { MdFingerprint } from 'react-icons/md';
import AuthLayout from '../../layouts/AuthLayout.jsx';
import Input from '../../components/ui/Input.jsx';
import Button from '../../components/ui/Button.jsx';
import useAuth from '../../hooks/useAuth.js';
import { useLanguage } from '../../context/LanguageContext.jsx';

/**
 * SCREEN 3 — Login.
 * Email OR phone + password, "forgot password", and a biometric shortcut.
 * Gold CTA highlights the primary action per the Legal Luxury theme.
 */
const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const { t } = useLanguage();
  const from = location.state?.from?.pathname || '/success';

  const [form, setForm] = useState({ identifier: '', password: '' });
  const [loading, setLoading] = useState(false);

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form);
      toast.success(t('biometric.welcome') + ' 👋');
      navigate(from, { replace: true });
    } catch (err) {
      const data = err.response?.data;
      if (data?.data?.requiresVerification) {
        toast('📩');
        return navigate('/verify', { state: { email: data.data.email } });
      }
      toast.error(data?.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title={t('login.title')} subtitle={t('login.subtitle')}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label={t('login.identifier')}
          name="identifier"
          icon={FiUser}
          value={form.identifier}
          onChange={onChange}
          placeholder="you@example.com / 01xxxxxxxxx"
          dir="ltr"
          required
        />
        <Input
          label={t('login.password')}
          name="password"
          type="password"
          value={form.password}
          onChange={onChange}
          placeholder="••••••••"
          dir="ltr"
          required
        />

        <div className="flex justify-start">
          <button
            type="button"
            onClick={() => navigate('/forgot-password')}
            className="link-gold text-sm"
          >
            {t('login.forgot')}
          </button>
        </div>

        <Button type="submit" loading={loading}>
          {t('login.submit')}
        </Button>

        {/* Biometric shortcut */}
        <div className="flex items-center gap-3 py-1">
          <span className="h-px flex-1 bg-white/10" />
          <span className="text-xs text-ink-faint">•</span>
          <span className="h-px flex-1 bg-white/10" />
        </div>
        <button
          type="button"
          onClick={() => navigate('/biometric')}
          className="mx-auto flex items-center gap-2 rounded-xl border border-gold/30 px-4 py-2.5
                     text-gold transition hover:bg-gold/10"
        >
          <MdFingerprint size={22} />
          {t('login.biometric')}
        </button>

        <p className="text-center text-sm text-ink-muted">
          {t('login.noAccount')}{' '}
          <button type="button" onClick={() => navigate('/register')} className="link-gold">
            {t('login.createAccount')}
          </button>
        </p>
      </form>
    </AuthLayout>
  );
};

export default Login;

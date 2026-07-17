import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FiMail, FiArrowLeft } from 'react-icons/fi';
import AuthLayout from '../../layouts/AuthLayout.jsx';
import Input from '../../components/ui/Input.jsx';
import Button from '../../components/ui/Button.jsx';
import authApi from '../../api/authApi.js';
import { useLanguage } from '../../context/LanguageContext.jsx';

/**
 * SUPPORTING PAGE — Forgot Password.
 * Requests a reset OTP, then forwards the email to the reset screen.
 */
const ForgotPassword = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authApi.forgotPassword(email);
      toast.success('📩');
      navigate('/reset-password', { state: { email } });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title={t('login.forgot')} subtitle={t('login.subtitle')}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label={t('register.email')}
          name="email"
          type="email"
          icon={FiMail}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          dir="ltr"
          required
        />
        <Button type="submit" loading={loading}>
          {t('common.confirm')}
        </Button>
        <button
          type="button"
          onClick={() => navigate('/login')}
          className="mx-auto flex items-center gap-1 text-sm text-ink-muted hover:text-gold"
        >
          <FiArrowLeft /> {t('common.back')}
        </button>
      </form>
    </AuthLayout>
  );
};

export default ForgotPassword;

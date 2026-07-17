import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import AuthLayout from '../../layouts/AuthLayout.jsx';
import OtpInput from '../../components/ui/OtpInput.jsx';
import Button from '../../components/ui/Button.jsx';
import authApi from '../../api/authApi.js';
import useAuth from '../../hooks/useAuth.js';
import { useLanguage } from '../../context/LanguageContext.jsx';

/**
 * SCREEN 5 — OTP Verification.
 * Six-box code entry with a mm:ss resend timer ("Resend in 00:52").
 * On success: lawyers/firms go to credentials, clients go to MFA setup.
 */
const RESEND_SECONDS = 52;

const formatTime = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

const OtpVerification = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { verifyOtp } = useAuth();
  const { t } = useLanguage();
  const email = location.state?.email;

  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(RESEND_SECONDS);

  useEffect(() => {
    if (!email) navigate('/register', { replace: true });
  }, [email, navigate]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => setCooldown((c) => c - 1), 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleVerify = async (e) => {
    e.preventDefault();
    if (code.length !== 6) return toast.error('6 digits required.');
    setLoading(true);
    try {
      const res = await verifyOtp({ email, code });
      toast.success('✅');
      const user = res.data.user;
      const isPro = user.role === 'lawyer' || user.role === 'lawfirm';
      navigate(isPro ? '/lawyer-credentials' : '/mfa-setup', { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid code.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      await authApi.resendOtp(email);
      toast.success('📩');
      setCooldown(RESEND_SECONDS);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not resend.');
    }
  };

  return (
    <AuthLayout title={t('otp.title')} subtitle={t('otp.subtitle')}>
      <form onSubmit={handleVerify} className="space-y-6">
        <OtpInput value={code} onChange={setCode} />

        <Button type="submit" loading={loading}>
          {t('otp.verify')}
        </Button>

        <p className="text-center text-sm text-ink-muted">
          {cooldown > 0 ? (
            <span className="text-ink-faint">
              {t('otp.resendIn')} <span dir="ltr">{formatTime(cooldown)}</span>
            </span>
          ) : (
            <button type="button" onClick={handleResend} className="link-gold">
              {t('otp.resend')}
            </button>
          )}
        </p>
      </form>
    </AuthLayout>
  );
};

export default OtpVerification;

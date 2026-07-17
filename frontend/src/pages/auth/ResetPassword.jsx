import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import AuthLayout from '../../layouts/AuthLayout.jsx';
import Input from '../../components/ui/Input.jsx';
import OtpInput from '../../components/ui/OtpInput.jsx';
import Button from '../../components/ui/Button.jsx';
import authApi from '../../api/authApi.js';
import { useLanguage } from '../../context/LanguageContext.jsx';

/**
 * SUPPORTING PAGE — Reset Password.
 * Confirms the reset OTP + a new password, then routes back to login.
 */
const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();
  const email = location.state?.email;

  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!email) navigate('/forgot-password', { replace: true });
  }, [email, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (code.length !== 6) return toast.error('6 digits required.');
    if (newPassword !== confirm) return toast.error('Passwords do not match.');
    setLoading(true);
    try {
      await authApi.resetPassword({ email, code, newPassword });
      toast.success('✅');
      navigate('/login', { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Reset failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title={t('login.forgot')} subtitle={t('otp.subtitle')}>
      <form onSubmit={handleSubmit} className="space-y-5">
        <OtpInput value={code} onChange={setCode} />
        <Input
          label={t('register.password')}
          name="newPassword"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          dir="ltr"
          required
        />
        <Input
          label={t('login.password')}
          name="confirm"
          type="password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          dir="ltr"
          required
        />
        <Button type="submit" loading={loading}>
          {t('common.save')}
        </Button>
      </form>
    </AuthLayout>
  );
};

export default ResetPassword;

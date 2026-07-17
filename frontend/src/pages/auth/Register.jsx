import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FiUser, FiMail, FiPhone } from 'react-icons/fi';
import AuthLayout from '../../layouts/AuthLayout.jsx';
import Input from '../../components/ui/Input.jsx';
import Button from '../../components/ui/Button.jsx';
import authApi from '../../api/authApi.js';
import { useLanguage } from '../../context/LanguageContext.jsx';

/**
 * SUPPORTING PAGE — Registration details form.
 * Reached from the Account Type screen (state.role). Collects the account
 * fields, creates the user, then routes to OTP verification.
 */
const Register = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t, lang } = useLanguage();
  const role = location.state?.role || 'client';

  const [form, setForm] = useState({ fullName: '', email: '', phone: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);
    try {
      await authApi.register({ ...form, role, preferredLanguage: lang });
      toast.success('✅');
      navigate('/verify', { state: { email: form.email, role } });
    } catch (err) {
      const details = err.response?.data?.details;
      if (Array.isArray(details)) {
        setErrors(Object.fromEntries(details.map((d) => [d.field, d.message])));
      }
      toast.error(err.response?.data?.message || 'Could not create account.');
    } finally {
      setLoading(false);
    }
  };

  const roleLabel = t(`accountType.${role}`);

  return (
    <AuthLayout title={t('register.title')} subtitle={roleLabel}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label={t('register.fullName')}
          name="fullName"
          icon={FiUser}
          value={form.fullName}
          onChange={onChange}
          error={errors.fullName}
          required
        />
        <Input
          label={t('register.email')}
          name="email"
          type="email"
          icon={FiMail}
          value={form.email}
          onChange={onChange}
          error={errors.email}
          placeholder="you@example.com"
          dir="ltr"
          required
        />
        <Input
          label={t('register.phone')}
          name="phone"
          icon={FiPhone}
          value={form.phone}
          onChange={onChange}
          error={errors.phone}
          placeholder="01xxxxxxxxx"
          dir="ltr"
          required
        />
        <Input
          label={t('register.password')}
          name="password"
          type="password"
          value={form.password}
          onChange={onChange}
          error={errors.password}
          dir="ltr"
          required
        />

        <Button type="submit" loading={loading}>
          {t('register.submit')}
        </Button>
      </form>
    </AuthLayout>
  );
};

export default Register;

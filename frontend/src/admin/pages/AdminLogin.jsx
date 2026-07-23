import { useState } from 'react';
import { FiShield, FiMail, FiLock } from 'react-icons/fi';
import { useAdminAuth } from '../context/AdminAuthContext.jsx';

const AdminLogin = () => {
  const { login } = useAdminAuth();
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(email, password);
    } catch (err) {
      setError(err.message || 'فشل تسجيل الدخول.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#111416] p-6" dir="rtl">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-6 flex flex-col items-center">
          <svg width={64} height={64} viewBox="0 0 64 64" fill="none">
            <path d="M32 3 54 11V29C54 44 44 55 32 61 20 55 10 44 10 29V11L32 3Z" stroke="#C9A24B" strokeWidth="2" fill="#161919"/>
            <line x1="32" y1="16" x2="32" y2="46" stroke="#C9A24B" strokeWidth="2"/>
            <line x1="18" y1="22" x2="46" y2="22" stroke="#C9A24B" strokeWidth="2"/>
            <path d="M18 22 14 32H22L18 22Z" stroke="#E3C57E" strokeWidth="1.5"/>
            <path d="M46 22 42 32H50L46 22Z" stroke="#E3C57E" strokeWidth="1.5"/>
            <line x1="24" y1="46" x2="40" y2="46" stroke="#C9A24B" strokeWidth="2"/>
            <circle cx="32" cy="14" r="2.5" fill="#C9A24B"/>
          </svg>
          <h1 className="mt-3 font-serif text-2xl font-bold text-[#C9A24B]">محاميك</h1>
          <p className="flex items-center gap-1 text-xs text-slate-400">
            <FiShield size={12} /> لوحة تحكم الأدمن
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-white/10 bg-white/5 shadow-xl backdrop-blur-xl p-6 sm:p-8">
          <h2 className="text-2xl font-bold text-white">دخول الإدارة</h2>
          <p className="mt-1 text-sm text-slate-400">هذه اللوحة مخصّصة لطاقم الإدارة فقط.</p>

          <form onSubmit={submit} className="mt-5 space-y-4">
            <div className="relative">
              <FiMail className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg bg-[#1A1E1E]/80 border border-white/10 px-4 py-2.5 pr-10 text-white placeholder:text-slate-500 outline-none transition focus:border-[#C9A24B]/60 focus:ring-2 focus:ring-[#C9A24B]/20"
                placeholder="البريد الإلكتروني"
                type="email"
                dir="ltr"
                required
              />
            </div>
            <div className="relative">
              <FiLock className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                className="w-full rounded-lg bg-[#1A1E1E]/80 border border-white/10 px-4 py-2.5 pr-10 text-white placeholder:text-slate-500 outline-none transition focus:border-[#C9A24B]/60 focus:ring-2 focus:ring-[#C9A24B]/20"
                placeholder="كلمة المرور"
                dir="ltr"
                required
              />
            </div>
            {error && <p className="text-center text-sm text-red-400">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#C9A24B] px-5 py-2.5 font-semibold text-[#111416] transition hover:bg-[#E3C57E] active:scale-[0.99] disabled:opacity-60"
            >
              {loading ? 'جارٍ الدخول…' : 'دخول'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;

import { useState } from 'react';
import { NavLink, useNavigate, Outlet } from 'react-router-dom';
import {
  FiGrid, FiBarChart2, FiCreditCard, FiUsers, FiCheckSquare,
  FiFileText, FiPlayCircle, FiStar, FiActivity, FiClock,
  FiMenu, FiLogOut, FiShield,
} from 'react-icons/fi';
import AdminAvatar from '../components/AdminAvatar.jsx';
import { useAdminAuth } from '../context/AdminAuthContext.jsx';

const NAV = [
  { to: '/admin',                  icon: FiGrid,        label: 'لوحة الإشراف',        end: true },
  { to: '/admin/analytics',        icon: FiBarChart2,   label: 'التحليلات المتقدمة'         },
  { to: '/admin/subscriptions',    icon: FiCreditCard,  label: 'إدارة الاشتراكات'           },
  { to: '/admin/users',            icon: FiUsers,       label: 'المستخدمون والصلاحيات'      },
  { to: '/admin/verifications',    icon: FiCheckSquare, label: 'طابور التوثيق'              },
  { to: '/admin/cms/news',         icon: FiFileText,    label: 'إدارة الأخبار'              },
  { to: '/admin/cms/videos',       icon: FiPlayCircle,  label: 'مكتبة الفيديو'             },
  { to: '/admin/reviews',          icon: FiStar,        label: 'مراقبة التقييمات'           },
  { to: '/admin/system',           icon: FiActivity,    label: 'صحة النظام'                },
  { to: '/admin/roadmap',          icon: FiClock,       label: 'قريبًا'                    },
];

const AdminLayout = () => {
  const [open, setOpen]         = useState(false);
  const navigate                = useNavigate();
  const { user, logout }        = useAdminAuth();

  const roleLabel = user?.role === 'admin' ? 'مدير' : user?.role === 'moderator' ? 'مشرف' : 'دعم';

  const SideNav = () => (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <button
        onClick={() => navigate('/admin')}
        className="mb-6 flex items-center gap-3 px-2"
      >
        <svg width={38} height={38} viewBox="0 0 64 64" fill="none">
          <path d="M32 3 54 11V29C54 44 44 55 32 61 20 55 10 44 10 29V11L32 3Z" stroke="#C9A24B" strokeWidth="2" fill="#161919"/>
          <line x1="32" y1="16" x2="32" y2="46" stroke="#C9A24B" strokeWidth="2"/>
          <line x1="18" y1="22" x2="46" y2="22" stroke="#C9A24B" strokeWidth="2"/>
          <path d="M18 22 14 32H22L18 22Z" stroke="#E3C57E" strokeWidth="1.5"/>
          <path d="M46 22 42 32H50L46 22Z" stroke="#E3C57E" strokeWidth="1.5"/>
          <line x1="24" y1="46" x2="40" y2="46" stroke="#C9A24B" strokeWidth="2"/>
          <circle cx="32" cy="14" r="2.5" fill="#C9A24B"/>
        </svg>
        <div className="text-start">
          <p className="font-serif text-lg font-bold text-gold leading-none">محاميك</p>
          <p className="flex items-center gap-1 font-sans text-[10px] tracking-wide text-slate-400">
            <FiShield size={10} /> لوحة الأدمن
          </p>
        </div>
      </button>

      {/* Nav */}
      <nav className="flex-1 space-y-1 overflow-y-auto">
        {NAV.map(({ to, icon: Icon, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg border border-transparent px-3 py-2 text-sm transition ${
                isActive
                  ? 'bg-gold/10 text-gold border-gold/30 font-semibold shadow-sm'
                  : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <button
        onClick={logout}
        className="mt-3 flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-400 transition hover:bg-white/5 hover:text-red-400"
      >
        <FiLogOut size={18} />
        تسجيل الخروج
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#111416]" dir="rtl">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 rtl:right-0 ltr:left-0 hidden w-64 border-white/10 bg-[#161A1A]/70 p-5 backdrop-blur-xl lg:block rtl:border-l ltr:border-r">
        <SideNav />
      </aside>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setOpen(false)} />
          <aside className="absolute inset-y-0 rtl:right-0 ltr:left-0 w-64 bg-[#161A1A] p-5">
            <SideNav />
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="lg:rtl:pr-64 lg:ltr:pl-64">
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-white/10 bg-[#111416]/70 px-4 py-3 backdrop-blur-xl sm:px-6">
          <button
            onClick={() => setOpen(true)}
            className="inline-flex items-center justify-center gap-2 rounded-lg px-3 py-2 font-medium text-slate-400 transition hover:text-slate-200 hover:bg-white/5 p-2 lg:hidden"
          >
            <FiMenu size={22} />
          </button>
          <div className="rtl:mr-auto ltr:ml-auto flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-gold/25 bg-gold/10 px-3 py-1 text-xs font-medium text-gold">
              {roleLabel}
            </span>
            <AdminAvatar seed={user?.seed || user?.fullName || 'admin'} size={36} online />
          </div>
        </header>
        <main className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;

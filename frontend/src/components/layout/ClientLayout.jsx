import { useState } from 'react';
import { NavLink, useNavigate, Outlet } from 'react-router-dom';
import {
  FiHome, FiMap, FiSearch, FiHeart, FiFolder, FiBell, FiMenu, FiX, FiUser, FiFileText,
} from 'react-icons/fi';
import Logo from '../ui/Logo.jsx';
import Avatar from '../ui/Avatar.jsx';

const NAV = [
  { to: '/', icon: FiHome, label: 'الرئيسية', end: true },
  { to: '/map', icon: FiMap, label: 'الخريطة' },
  { to: '/search', icon: FiSearch, label: 'ابحث عن محامٍ' },
  { to: '/favorites', icon: FiHeart, label: 'المفضلة' },
  { to: '/cases', icon: FiFolder, label: 'قضاياي' },
  { to: '/policy', icon: FiFileText, label: 'سياسة الإلغاء' },
];

const ClientLayout = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const SidebarInner = () => (
    <div className="flex h-full flex-col">
      <button onClick={() => navigate('/')} className="mb-8 flex items-center gap-3 px-2">
        <Logo size={40} />
        <div className="text-start">
          <p className="font-serif text-lg font-bold text-gold leading-none">محاميك</p>
          <p className="text-[10px] tracking-wide text-ink-faint" dir="ltr">Egypt LawHub</p>
        </div>
      </button>

      <nav className="flex-1 space-y-1">
        {NAV.map(({ to, icon: Icon, label, end }) => (
          <NavLink key={to} to={to} end={end} onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${
                isActive ? 'bg-gold/10 text-gold font-semibold shadow-gold' : 'text-ink-muted hover:bg-white/5 hover:text-ink'
              }`}>
            <Icon size={19} /> {label}
          </NavLink>
        ))}
      </nav>

      <div className="mt-4 rounded-2xl border border-gold/20 bg-navy-800/60 p-4 text-center">
        <p className="text-xs text-ink-muted">تحتاج مساعدة قانونية عاجلة؟</p>
        <button onClick={() => navigate('/search')} className="btn-gold mt-3 w-full text-sm py-2">ابدأ الآن</button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-navy bg-gold-radial">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 ltr:left-0 rtl:right-0 hidden w-64 border-gold/10 p-5 lg:block ltr:border-r rtl:border-l bg-navy-900/60 backdrop-blur">
        <SidebarInner />
      </aside>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setOpen(false)} />
          <aside className="absolute inset-y-0 ltr:left-0 rtl:right-0 w-72 bg-navy-900 p-5 shadow-card">
            <SidebarInner />
          </aside>
        </div>
      )}

      {/* Main */}
      <div className="lg:ltr:pl-64 lg:rtl:pr-64">
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-gold/10 bg-navy-900/70 px-4 py-3 backdrop-blur sm:px-6">
          <div className="flex items-center gap-3">
            <button onClick={() => setOpen(true)} className="btn-ghost p-2 lg:hidden"><FiMenu size={22} /></button>
            <div className="relative hidden sm:block">
              <FiSearch className="absolute ltr:left-3 rtl:right-3 top-1/2 -translate-y-1/2 text-ink-faint" size={16} />
              <input onFocus={() => navigate('/search')} placeholder="ابحث عن محامٍ أو تخصص…"
                className="input-luxury w-72 ltr:pl-9 rtl:pr-9 py-2 text-sm" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => navigate('/cases')} className="btn-ghost relative p-2">
              <FiBell size={20} />
              <span className="absolute top-1 ltr:right-1 rtl:left-1 h-2 w-2 rounded-full bg-gold" />
            </button>
            <button onClick={() => navigate('/favorites')} className="btn-ghost p-2"><FiHeart size={20} /></button>
            <button className="flex items-center gap-2 rounded-full border border-gold/20 py-1 ltr:pl-1 ltr:pr-3 rtl:pr-1 rtl:pl-3">
              <Avatar seed="client-kareem" size={32} />
              <span className="hidden text-sm font-medium text-ink sm:block">كريم</span>
            </button>
          </div>
        </header>

        <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
export default ClientLayout;

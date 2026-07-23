import { useState } from 'react';
import { NavLink, useNavigate, Outlet } from 'react-router-dom';
import { FiGrid, FiCalendar, FiFolder, FiUsers, FiShare2, FiSettings, FiAward, FiTrendingUp, FiStar, FiBell, FiMenu, FiSearch, FiLogOut } from 'react-icons/fi';
import Logo from '../components/ui/Logo.jsx';
import Avatar from '../components/ui/Avatar.jsx';
import useAuth from '../hooks/useAuth.js';
const NAV = [
  { to: '/workspace', icon: FiGrid, label: 'لوحة التحكم', end: true }, { to: '/workspace/calendar', icon: FiCalendar, label: 'التقويم والمواعيد' },
  { to: '/workspace/cases', icon: FiFolder, label: 'إدارة القضايا' }, { to: '/workspace/team', icon: FiUsers, label: 'إدارة الفريق' },
  { to: '/workspace/assignment', icon: FiShare2, label: 'توزيع القضايا' }, { to: '/workspace/services', icon: FiSettings, label: 'إعدادات الخدمات' },
  { to: '/workspace/membership', icon: FiAward, label: 'العضوية والامتثال' }, { to: '/workspace/plans', icon: FiTrendingUp, label: 'خطط النمو' }, { to: '/workspace/reviews', icon: FiStar, label: 'التقييمات والسمعة' },
];
const WorkspaceLayout = () => {
  const [open, setOpen] = useState(false); const navigate = useNavigate(); const { user, logout } = useAuth();
  const Sidebar = () => (
    <div className="flex h-full flex-col">
      <button onClick={() => navigate('/')} className="mb-8 flex items-center gap-3 px-2"><Logo size={40} /><div className="text-start"><p className="font-serif text-lg font-bold text-gold leading-none">محاميك</p><p className="font-sans text-[10px] tracking-wide text-ink-faint">مساحة عمل المحامي</p></div></button>
      <nav className="flex-1 space-y-1 overflow-y-auto">{NAV.map(({ to, icon: Icon, label, end }) => (<NavLink key={to} to={to} end={end} onClick={() => setOpen(false)} className={({ isActive }) => `flex items-center gap-3 rounded-lg border border-transparent px-3 py-2.5 text-sm transition ${isActive ? 'nav-active font-semibold shadow-gold' : 'text-ink-muted hover:bg-white/5 hover:text-ink'}`}><Icon size={19} /> {label}</NavLink>))}</nav>
      <button onClick={() => { logout(); }} className="mt-4 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-ink-muted transition hover:bg-white/5 hover:text-danger"><FiLogOut size={19} /> تسجيل الخروج</button>
    </div>
  );
  return (
    <div className="min-h-screen bg-surface bg-gold-radial">
      <aside className="fixed inset-y-0 ltr:left-0 rtl:right-0 hidden w-64 border-white/10 bg-surface-800/70 p-5 backdrop-blur-xl lg:block ltr:border-r rtl:border-l"><Sidebar /></aside>
      {open && (<div className="fixed inset-0 z-40 lg:hidden"><div className="absolute inset-0 bg-black/60" onClick={() => setOpen(false)} /><aside className="absolute inset-y-0 ltr:left-0 rtl:right-0 w-64 bg-surface-800 p-5"><Sidebar /></aside></div>)}
      <div className="lg:ltr:pl-64 lg:rtl:pr-64">
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-white/10 bg-surface-900/70 px-4 py-3 backdrop-blur-xl sm:px-6"><button onClick={() => setOpen(true)} className="btn-ghost p-2 lg:hidden"><FiMenu size={22} /></button><div className="relative hidden max-w-sm flex-1 sm:block"><FiSearch className="absolute ltr:left-3 rtl:right-3 top-1/2 -translate-y-1/2 text-ink-faint" size={16} /><input placeholder="بحث سريع…" className="input ltr:pl-9 rtl:pr-9 py-2 text-sm" /></div><div className="ltr:ml-auto rtl:mr-auto flex items-center gap-2"><button className="btn-ghost relative p-2"><FiBell size={20} /><span className="absolute top-1 ltr:right-1 rtl:left-1 h-2 w-2 rounded-full bg-gold" /></button><div className="flex items-center gap-2"><Avatar seed={user?.seed || 'ahmed'} size={36} online /><div className="hidden text-start sm:block"><p className="font-sans text-sm font-semibold text-ink leading-none">{user?.fullName}</p><p className="font-sans text-[11px] text-ink-faint">{user?.title}</p></div></div></div></header>
        <main className="p-4 sm:p-6 lg:p-8"><Outlet /></main>
      </div>
    </div>
  );
};
export default WorkspaceLayout;

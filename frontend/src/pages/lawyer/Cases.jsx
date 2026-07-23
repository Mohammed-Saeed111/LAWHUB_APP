import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiPlus, FiChevronLeft } from 'react-icons/fi';
import PageHeader from '../../components/ui/PageHeader.jsx';
import Badge from '../../components/ui/Badge.jsx';
import Progress from '../../components/ui/Progress.jsx';
import Loader from '../../components/ui/Loader.jsx';
import ErrorState from '../../components/ui/ErrorState.jsx';
import { workspaceApi } from '../../api/lawhubApi.js';
import useApi from '../../hooks/useApi.js';
const TABS = [{ k: 'all', l: 'الكل' }, { k: 'active', l: 'نشطة' }, { k: 'pending', l: 'معلّقة' }, { k: 'archived', l: 'مؤرشفة' }];
const CATS = ['الكل', 'عقاري', 'شركات', 'أحوال شخصية', 'عمالي', 'ملكية فكرية', 'مدني'];
const Cases = () => {
  const navigate = useNavigate(); const [q, setQ] = useState(''); const [status, setStatus] = useState('all'); const [cat, setCat] = useState('الكل');
  const { data: rows, loading, error, refetch } = useApi(() => workspaceApi.cases({ q, status, category: cat }), [q, status, cat]);
  return (
    <div className="space-y-6">
      <PageHeader title="إدارة القضايا" subtitle="قاعدة بيانات القضايا"><button className="btn-gold text-sm"><FiPlus size={16} /> قضية جديدة</button></PageHeader>
      <div className="glass p-4"><div className="flex flex-col gap-3 lg:flex-row lg:items-center"><div className="relative flex-1"><FiSearch className="absolute ltr:left-3 rtl:right-3 top-1/2 -translate-y-1/2 text-ink-faint" size={16} /><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="بحث برقم القضية أو اسم العميل…" className="input ltr:pl-9 rtl:pr-9" /></div><select value={cat} onChange={(e) => setCat(e.target.value)} className="input lg:w-48">{CATS.map((c) => <option key={c} value={c} className="bg-surface-800">{c}</option>)}</select></div><div className="mt-3 flex flex-wrap gap-2">{TABS.map((t) => (<button key={t.k} onClick={() => setStatus(t.k)} className={`chip ${status === t.k ? 'bg-gold text-surface' : ''}`}>{t.l}</button>))}</div></div>
      {loading && <Loader />}{error && <ErrorState message={error} onRetry={refetch} />}
      {!loading && !error && (<div className="glass overflow-x-auto"><table className="w-full min-w-[820px] text-sm"><thead><tr className="border-b border-white/10 text-ink-muted"><th className="p-4 text-start font-medium">القضية</th><th className="p-4 text-start font-medium">العميل</th><th className="p-4 text-start font-medium">التصنيف</th><th className="p-4 text-start font-medium">الحالة</th><th className="p-4 text-start font-medium">الأولوية</th><th className="p-4 text-start font-medium">التقدّم</th><th className="p-4 text-start font-medium">الجلسة</th><th className="p-4" /></tr></thead><tbody>{(rows || []).map((c) => (<tr key={c.id} onClick={() => navigate(`/cases/${c.ref || c.id}`)} className="cursor-pointer border-b border-white/5 transition hover:bg-white/5"><td className="p-4"><p className="font-semibold text-ink">{c.title}</p><p className="font-sans text-xs text-ink-faint" dir="ltr">{c.ref}</p></td><td className="p-4 text-ink-muted">{c.client}</td><td className="p-4"><span className="chip">{c.category}</span></td><td className="p-4"><Badge status={c.status} /></td><td className="p-4"><Badge priority={c.priority} /></td><td className="p-4 w-40"><Progress value={c.progress} /></td><td className="p-4 text-ink-muted" dir="ltr">{c.nextHearing || '—'}</td><td className="p-4 text-ink-faint"><FiChevronLeft /></td></tr>))}{(!rows || rows.length === 0) && (<tr><td colSpan={8} className="p-10 text-center text-ink-muted">لا توجد قضايا مطابقة.</td></tr>)}</tbody></table></div>)}
    </div>
  );
};
export default Cases;

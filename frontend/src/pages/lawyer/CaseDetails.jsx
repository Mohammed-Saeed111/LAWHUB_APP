import { useParams, useNavigate } from 'react-router-dom';
import { FiArrowRight, FiFileText, FiDownload, FiCheckCircle, FiUser, FiCalendar, FiFolder } from 'react-icons/fi';
import PageHeader from '../../components/ui/PageHeader.jsx';
import Badge from '../../components/ui/Badge.jsx';
import Progress from '../../components/ui/Progress.jsx';
import Loader from '../../components/ui/Loader.jsx';
import ErrorState from '../../components/ui/ErrorState.jsx';
import { workspaceApi } from '../../api/lawhubApi.js';
import useApi from '../../hooks/useApi.js';
const CaseDetails = () => {
  const { id } = useParams(); const navigate = useNavigate();
  const { data: c, loading, error, refetch } = useApi(() => workspaceApi.case(id), [id]);
  if (loading) return <Loader label="جارٍ تحميل تفاصيل القضية…" />;
  if (error) return <ErrorState message={error} onRetry={refetch} />;
  return (
    <div className="space-y-6">
      <button onClick={() => navigate('/cases')} className="btn-ghost text-sm"><FiArrowRight className="rtl:hidden" /><span className="ltr:hidden">←</span> رجوع إلى القضايا</button>
      <PageHeader title={c.title} subtitle={`${c.ref} · ${c.client}`}><Badge status={c.status} /><Badge priority={c.priority} /></PageHeader>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><div className="glass p-4"><div className="flex items-center gap-2 text-ink-muted"><FiUser size={16} className="text-gold" /><span className="text-xs">المسؤول</span></div><p className="mt-2 font-semibold text-ink">{c.assignedTo}</p></div><div className="glass p-4"><div className="flex items-center gap-2 text-ink-muted"><FiFolder size={16} className="text-gold" /><span className="text-xs">التصنيف</span></div><p className="mt-2 font-semibold text-ink">{c.category}</p></div><div className="glass p-4"><div className="flex items-center gap-2 text-ink-muted"><FiCalendar size={16} className="text-gold" /><span className="text-xs">الجلسة القادمة</span></div><p className="mt-2 font-semibold text-ink" dir="ltr">{c.nextHearing || '—'}</p></div><div className="glass p-4"><div className="flex items-center gap-2 text-ink-muted"><FiCheckCircle size={16} className="text-gold" /><span className="text-xs">نسبة الإنجاز</span></div><div className="mt-3"><Progress value={c.progress} /></div></div></div>
      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <section className="glass p-6"><h2 className="mb-6 font-bold text-ink">الخط الزمني للإجراءات</h2><div className="space-y-0">{(c.timeline || []).length === 0 && <p className="text-sm text-ink-faint">لا توجد إجراءات مسجّلة بعد.</p>}{(c.timeline || []).map((t, i) => (<div key={i} className="flex gap-4"><div className="flex flex-col items-center"><span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 ${t.done ? 'border-gold bg-gold text-surface' : 'border-gold/40 text-transparent'}`}>{t.done ? <FiCheckCircle size={16} /> : <span className="h-2 w-2 rounded-full bg-gold/50" />}</span>{i < c.timeline.length - 1 && <span className={`w-0.5 flex-1 ${t.done ? 'bg-gold/40' : 'bg-white/10'}`} style={{ minHeight: 44 }} />}</div><div className="pb-6"><div className="flex flex-wrap items-center gap-2"><p className={`font-semibold ${t.done ? 'text-ink' : 'text-ink-muted'}`}>{t.title}</p><span className="font-sans text-xs text-ink-faint" dir="ltr">{t.date}</span></div>{t.note && <p className="mt-1 text-sm text-ink-muted">{t.note}</p>}{t.by && <p className="mt-1 text-xs text-gold">بواسطة: {t.by}</p>}</div></div>))}</div><button className="btn-outline mt-2 w-full text-sm">+ إضافة إجراء جديد</button></section>
        <section className="glass h-fit p-6"><h2 className="mb-4 font-bold text-ink">مستندات القضية</h2><div className="space-y-3">{(c.documents || []).length === 0 && <p className="text-sm text-ink-faint">لا توجد مستندات.</p>}{(c.documents || []).map((d) => (<div key={d.name} className="flex items-center gap-3 rounded-lg border border-white/5 bg-white/5 p-3"><span className="flex h-10 w-10 items-center justify-center rounded-lg bg-gold/10 text-gold"><FiFileText size={18} /></span><div className="flex-1 overflow-hidden"><p className="truncate text-sm text-ink">{d.name}</p><p className="font-sans text-xs text-ink-faint">{d.size} · {d.date}</p></div><button className="btn-ghost p-2"><FiDownload size={16} /></button></div>))}</div><button className="btn-gold mt-4 w-full text-sm">رفع مستند</button></section>
      </div>
    </div>
  );
};
export default CaseDetails;

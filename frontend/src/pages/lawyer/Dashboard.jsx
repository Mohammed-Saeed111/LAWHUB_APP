import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiVideo, FiPhone, FiMapPin, FiArrowLeft } from 'react-icons/fi';
import PageHeader from '../../components/ui/PageHeader.jsx';
import StatCard from '../../components/ui/StatCard.jsx';
import Badge from '../../components/ui/Badge.jsx';
import Loader from '../../components/ui/Loader.jsx';
import ErrorState from '../../components/ui/ErrorState.jsx';
import { workspaceApi } from '../../api/lawhubApi.js';
import useApi from '../../hooks/useApi.js';
const TI = { 'فيديو': FiVideo, 'هاتف': FiPhone, 'بالمكتب': FiMapPin };
const Dashboard = () => {
  const navigate = useNavigate();
  const { data, loading, error, refetch } = useApi(() => workspaceApi.dashboard(), []);
  if (loading) return <Loader label="جارٍ تحميل لوحة التحكم…" />;
  if (error) return <ErrorState message={error} onRetry={refetch} />;
  const { kpis, revenue, agenda } = data; const max = Math.max(...revenue.map((d) => d.v));
  return (
    <div className="space-y-6">
      <PageHeader title="لوحة التحكم" subtitle="ملخّص يومك ومؤشرات أدائك"><button className="btn-outline text-sm">تصدير تقرير</button><button onClick={() => navigate('/calendar')} className="btn-gold text-sm">عرض التقويم</button></PageHeader>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{kpis.map((k) => <StatCard key={k.key} {...k} />)}</div>
      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <section className="glass p-6"><div className="mb-6 flex items-center justify-between"><h2 className="font-bold text-ink">إيرادات الأسبوع</h2><span className="chip">بالألف ج.م</span></div><div className="flex h-48 items-end justify-between gap-3">{revenue.map((d, i) => (<div key={d.day} className="flex flex-1 flex-col items-center gap-2"><motion.div initial={{ height: 0 }} animate={{ height: `${(d.v / max) * 100}%` }} transition={{ delay: i * 0.06, duration: 0.5 }} className="w-full rounded-t-lg bg-gradient-to-t from-gold/30 to-gold" title={`${d.v}k`} /><span className="font-sans text-[10px] text-ink-faint">{d.day}</span></div>))}</div></section>
        <section className="glass p-6"><div className="mb-4 flex items-center justify-between"><h2 className="font-bold text-ink">جدول اليوم</h2><button onClick={() => navigate('/calendar')} className="flex items-center gap-1 text-sm text-gold hover:text-gold-light">الكل <FiArrowLeft size={14} /></button></div><div className="space-y-3">{agenda.map((a) => { const Icon = TI[a.type] || FiVideo; return (<div key={a._id || a.time} className="flex items-center gap-3 rounded-lg border border-white/5 bg-white/5 p-3"><span className="font-sans text-sm font-bold text-gold" dir="ltr">{a.time}</span><span className="h-10 w-px bg-white/10" /><span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gold/10 text-gold"><Icon size={17} /></span><div className="flex-1"><p className="text-sm font-semibold text-ink">{a.client}</p><p className="text-xs text-ink-faint">{a.topic} · {a.type}</p></div><Badge status={a.status} /></div>); })}</div></section>
      </div>
    </div>
  );
};
export default Dashboard;

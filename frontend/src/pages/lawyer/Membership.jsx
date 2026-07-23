import { FiAward, FiCheckCircle, FiClock, FiUploadCloud, FiFileText, FiAlertTriangle } from 'react-icons/fi';
import PageHeader from '../../components/ui/PageHeader.jsx';
import Loader from '../../components/ui/Loader.jsx';
import ErrorState from '../../components/ui/ErrorState.jsx';
import { workspaceApi } from '../../api/lawhubApi.js';
import useApi from '../../hooks/useApi.js';
const Membership = () => {
  const { data, loading, error, refetch } = useApi(() => workspaceApi.profile(), []);
  if (loading) return <Loader label="جارٍ تحميل بيانات العضوية…" />;
  if (error) return <ErrorState message={error} onRetry={refetch} />;
  const m = data.membership || {}; const soon = (m.daysLeft ?? 999) <= 180;
  return (
    <div className="space-y-6">
      <PageHeader title="العضوية والامتثال" subtitle="بيانات القيد بالنقابة وتوثيق الحساب" />
      <div className={`flex items-start gap-4 rounded-2xl border p-5 ${soon ? 'border-warn/30 bg-warn/10' : 'border-ok/30 bg-ok/10'}`}>{soon ? <FiAlertTriangle size={26} className="mt-0.5 shrink-0 text-warn" /> : <FiCheckCircle size={26} className="mt-0.5 shrink-0 text-ok" />}<div><h3 className={`font-bold ${soon ? 'text-warn' : 'text-ok'}`}>{soon ? `تذكير: تبقّى ${m.daysLeft} يومًا على انتهاء العضوية` : 'العضوية سارية'}</h3><p className="mt-1 text-sm text-ink-muted">تنتهي في {m.expiryDate}. جدّد مبكرًا لتفادي إيقاف ظهور ملفك.</p></div>{soon && <button className="btn-gold ltr:ml-auto rtl:mr-auto shrink-0 text-sm">تجديد الآن</button>}</div>
      <div className="grid gap-6 lg:grid-cols-2">
        <section className="glass p-6"><div className="mb-5 flex items-center gap-2"><FiAward className="text-gold" size={20} /><h2 className="font-bold text-ink">بيانات القيد بالنقابة</h2></div><dl className="space-y-4">{[['رقم القيد', m.barNumber, true], ['النقابة', m.association], ['تاريخ القيد', m.issueDate, true], ['تاريخ الانتهاء', m.expiryDate, true]].map(([label, value, ltr]) => (<div key={label} className="flex items-center justify-between border-b border-white/5 pb-3"><dt className="text-sm text-ink-muted">{label}</dt><dd className="font-sans font-semibold text-ink" dir={ltr ? 'ltr' : 'rtl'}>{value}</dd></div>))}<div className="flex items-center justify-between"><dt className="text-sm text-ink-muted">حالة التوثيق</dt><dd><span className="inline-flex items-center gap-1.5 rounded-full border border-ok/30 bg-ok/10 px-2.5 py-0.5 text-xs font-medium text-ok"><FiCheckCircle size={12} /> موثّق</span></dd></div></dl><div className="mt-6 flex items-center gap-4 rounded-lg border border-gold/20 bg-white/5 p-4"><div className="relative flex h-16 w-16 items-center justify-center"><svg className="h-16 w-16 -rotate-90" viewBox="0 0 36 36"><circle cx="18" cy="18" r="15.5" fill="none" stroke="#232727" strokeWidth="3" /><circle cx="18" cy="18" r="15.5" fill="none" stroke="#C9A24B" strokeWidth="3" strokeLinecap="round" strokeDasharray={`${((m.daysLeft ?? 0) / 365) * 97} 97`} /></svg><FiClock className="absolute text-gold" size={20} /></div><div><p className="font-sans text-lg font-bold text-ink">{m.daysLeft} يومًا</p><p className="text-xs text-ink-muted">متبقية على التجديد</p></div></div></section>
        <section className="glass p-6"><h2 className="mb-5 font-bold text-ink">مستندات التجديد</h2><label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gold/30 bg-white/5 p-8 text-center transition hover:border-gold/60"><FiUploadCloud size={36} className="text-gold" /><p className="mt-3 text-ink">ارفع كارنيه النقابة أو شهادة القيد</p><p className="mt-1 text-xs text-ink-faint">JPG · PNG · PDF — حتى 5MB</p><input type="file" className="hidden" /></label><div className="mt-4 space-y-3">{(m.documents || []).map((d) => (<div key={d.name} className="flex items-center gap-3 rounded-lg border border-white/5 bg-white/5 p-3"><span className="flex h-10 w-10 items-center justify-center rounded-lg bg-gold/10 text-gold"><FiFileText size={18} /></span><p className="flex-1 truncate text-sm text-ink">{d.name}</p>{d.verified && <span className="inline-flex items-center gap-1 text-xs text-ok"><FiCheckCircle size={13} /> موثّق</span>}</div>))}</div></section>
      </div>
    </div>
  );
};
export default Membership;

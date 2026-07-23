import { useState, useEffect } from 'react';
import { FiCheck, FiMapPin, FiDollarSign, FiSave } from 'react-icons/fi';
import PageHeader from '../../components/ui/PageHeader.jsx';
import Loader from '../../components/ui/Loader.jsx';
import ErrorState from '../../components/ui/ErrorState.jsx';
import { workspaceApi } from '../../api/lawhubApi.js';
import useApi from '../../hooks/useApi.js';
const SPECS = ['جنائي', 'مدني', 'شركات', 'أحوال شخصية', 'عمالي', 'عقاري', 'ضرائب', 'ملكية فكرية', 'دستوري', 'إداري'];
const CITIES = ['القاهرة', 'الجيزة', 'الإسكندرية', 'المنصورة', 'أسيوط', 'طنطا', 'المنيا', 'الزقازيق'];
const Services = () => {
  const { data, loading, error, refetch } = useApi(() => workspaceApi.profile(), []);
  const [specs, setSpecs] = useState([]); const [cities, setCities] = useState([]); const [services, setServices] = useState([]); const [saving, setSaving] = useState(false); const [saved, setSaved] = useState(false);
  useEffect(() => { if (data) { setSpecs(data.specializations || []); setCities(data.cities || []); setServices(data.services || []); } }, [data]);
  if (loading) return <Loader label="جارٍ تحميل الإعدادات…" />;
  if (error) return <ErrorState message={error} onRetry={refetch} />;
  const tog = (list, set, v) => set(list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);
  const save = async () => { setSaving(true); setSaved(false); try { await workspaceApi.updateProfile({ specializations: specs, cities, services }); setSaved(true); setTimeout(() => setSaved(false), 2000); } finally { setSaving(false); } };
  return (
    <div className="space-y-6">
      <PageHeader title="إعدادات الخدمات" subtitle="حدّد تخصصاتك ونطاق تغطيتك وأسعار خدماتك"><button onClick={save} disabled={saving} className="btn-gold text-sm"><FiSave size={16} /> {saving ? 'جارٍ الحفظ…' : saved ? 'تم الحفظ ✓' : 'حفظ التغييرات'}</button></PageHeader>
      <section className="glass p-6"><h2 className="mb-1 font-bold text-ink">التخصصات القانونية</h2><p className="mb-4 text-sm text-ink-muted">اختر المجالات التي تقدّم فيها خدماتك.</p><div className="flex flex-wrap gap-2">{SPECS.map((s) => { const on = specs.includes(s); return (<button key={s} onClick={() => tog(specs, setSpecs, s)} className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-1.5 text-sm transition ${on ? 'border-gold bg-gold/15 text-gold' : 'border-white/10 text-ink-muted hover:border-gold/40'}`}>{on && <FiCheck size={14} />} {s}</button>); })}</div></section>
      <section className="glass p-6"><h2 className="mb-1 flex items-center gap-2 font-bold text-ink"><FiMapPin className="text-gold" size={18} /> التغطية الجغرافية</h2><p className="mb-4 text-sm text-ink-muted">المدن التي تستقبل فيها القضايا والمواعيد.</p><div className="flex flex-wrap gap-2">{CITIES.map((c) => { const on = cities.includes(c); return (<button key={c} onClick={() => tog(cities, setCities, c)} className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-1.5 text-sm transition ${on ? 'border-gold bg-gold/15 text-gold' : 'border-white/10 text-ink-muted hover:border-gold/40'}`}>{on && <FiCheck size={14} />} {c}</button>); })}</div></section>
      <section className="glass p-6"><h2 className="mb-1 flex items-center gap-2 font-bold text-ink"><FiDollarSign className="text-gold" size={18} /> أسعار الخدمات</h2><p className="mb-4 text-sm text-ink-muted">حدّد سعر كل خدمة بالجنيه المصري.</p><div className="space-y-3">{services.map((s, i) => (<div key={s.key} className="flex items-center gap-3 rounded-lg border border-white/5 bg-white/5 p-3"><span className="flex-1 text-sm text-ink">{s.label}</span><div className="flex items-center gap-2"><input type="number" value={s.price} onChange={(e) => setServices((arr) => arr.map((x, j) => (j === i ? { ...x, price: +e.target.value } : x)))} className="input w-28 py-1.5 text-center font-sans" dir="ltr" /><span className="text-sm text-ink-faint">ج.م</span></div></div>))}</div></section>
    </div>
  );
};
export default Services;

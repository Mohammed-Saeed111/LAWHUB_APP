import { useState, useEffect } from 'react';
import { FiCheck, FiStar, FiZap, FiBriefcase } from 'react-icons/fi';
import PageHeader from '../../components/ui/PageHeader.jsx';
import Loader from '../../components/ui/Loader.jsx';
import ErrorState from '../../components/ui/ErrorState.jsx';
import { workspaceApi } from '../../api/lawhubApi.js';
import useApi from '../../hooks/useApi.js';
const ICONS = { pro: FiZap, elite: FiStar, firm: FiBriefcase };
const Plans = () => {
  const [yearly, setYearly] = useState(false);
  const { data, loading, error, refetch } = useApi(async () => { const [plans, profile] = await Promise.all([workspaceApi.plans(), workspaceApi.profile()]); return { plans, current: profile.currentPlan }; }, []);
  const [current, setCurrent] = useState(null);
  useEffect(() => { if (data) setCurrent(data.current); }, [data]);
  if (loading) return <Loader label="جارٍ تحميل الخطط…" />;
  if (error) return <ErrorState message={error} onRetry={refetch} />;
  const upgrade = async (key) => { setCurrent(key); try { await workspaceApi.updateProfile({ currentPlan: key }); } catch { /* ignore */ } };
  return (
    <div className="space-y-6">
      <PageHeader title="خطط النمو" subtitle="طوّر حسابك لزيادة ظهورك وأدواتك الاحترافية" />
      <div className="flex items-center justify-center gap-3"><span className={`text-sm ${!yearly ? 'text-ink' : 'text-ink-muted'}`}>شهري</span><button onClick={() => setYearly((y) => !y)} className={`relative h-7 w-14 rounded-full border transition ${yearly ? 'border-gold bg-gold/20' : 'border-white/15 bg-surface-700'}`}><span className={`absolute top-0.5 h-5 w-5 rounded-full bg-gold transition-all ${yearly ? 'ltr:left-8 rtl:right-8' : 'ltr:left-0.5 rtl:right-0.5'}`} /></button><span className={`text-sm ${yearly ? 'text-ink' : 'text-ink-muted'}`}>سنوي</span><span className="chip">وفّر 20%</span></div>
      <div className="grid gap-6 md:grid-cols-3">{data.plans.map((p) => { const Icon = ICONS[p.key] || FiZap; const price = yearly ? Math.round(p.price * 12 * 0.8) : p.price; const isCur = current === p.key; return (<div key={p.key} className={`relative flex flex-col p-6 ${p.highlight ? 'glass-gold shadow-gold' : 'glass'}`}>{p.highlight && <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gold px-3 py-1 text-xs font-bold text-surface">الأكثر شيوعًا</span>}<div className="flex items-center gap-3"><span className="flex h-12 w-12 items-center justify-center rounded-lg bg-gold/10 text-gold"><Icon size={24} /></span><div><h3 className="text-lg font-bold text-ink">{p.name}</h3><p className="text-xs text-ink-faint">{isCur ? 'خطتك الحالية' : 'ترقية'}</p></div></div><div className="mt-5"><span className="font-sans text-3xl font-bold text-gold">{price.toLocaleString()}</span><span className="text-sm text-ink-faint"> ج.م / {yearly ? 'سنويًا' : 'شهريًا'}</span></div><ul className="mt-5 flex-1 space-y-3">{p.features.map((f) => (<li key={f} className="flex items-start gap-2 text-sm text-ink-muted"><FiCheck className="mt-0.5 shrink-0 text-gold" size={16} /> {f}</li>))}</ul><button onClick={() => !isCur && upgrade(p.key)} disabled={isCur} className={`mt-6 w-full rounded-lg py-3 font-semibold transition ${isCur ? 'cursor-default border border-white/10 text-ink-muted' : p.highlight ? 'bg-gold text-surface hover:bg-gold-light' : 'border border-gold/40 text-gold hover:bg-gold/10'}`}>{isCur ? 'الخطة الحالية' : `الترقية إلى ${p.name}`}</button></div>); })}</div>
      <p className="text-center text-xs text-ink-faint">جميع الخطط تشمل ضريبة القيمة المضافة · يمكنك الإلغاء في أي وقت.</p>
    </div>
  );
};
export default Plans;

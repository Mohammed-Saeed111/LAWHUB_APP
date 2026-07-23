import { useState } from 'react';
import { FiVideo, FiPhone, FiMapPin, FiPlus } from 'react-icons/fi';
import PageHeader from '../../components/ui/PageHeader.jsx';
import Loader from '../../components/ui/Loader.jsx';
import ErrorState from '../../components/ui/ErrorState.jsx';
import { workspaceApi } from '../../api/lawhubApi.js';
import useApi from '../../hooks/useApi.js';
const WEEK = ['السبت', 'الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة'];
const HOURS = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];
const TYPE = { 'فيديو': { icon: FiVideo, cls: 'border-gold/40 bg-gold/10 text-gold' }, 'هاتف': { icon: FiPhone, cls: 'border-ok/40 bg-ok/10 text-ok' }, 'بالمكتب': { icon: FiMapPin, cls: 'border-warn/40 bg-warn/10 text-warn' } };
const Calendar = () => {
  const { data: events, loading, error, refetch } = useApi(() => workspaceApi.calendar(), []);
  const [slots, setSlots] = useState({});
  const toggle = (d, h) => setSlots((s) => ({ ...s, [`${d}-${h}`]: !s[`${d}-${h}`] }));
  if (loading) return <Loader label="جارٍ تحميل التقويم…" />;
  if (error) return <ErrorState message={error} onRetry={refetch} />;
  const evAt = (d, hi) => events.find((e) => e.day === d && HOURS.indexOf(e.hour) === hi);
  return (
    <div className="space-y-6">
      <PageHeader title="التقويم والمواعيد" subtitle="نظّم ساعات عملك وتابع حجوزات العملاء"><button className="btn-gold text-sm"><FiPlus size={16} /> إضافة موعد</button></PageHeader>
      <div className="flex flex-wrap gap-3">{Object.entries(TYPE).map(([k, v]) => (<span key={k} className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs ${v.cls}`}><v.icon size={12} /> {k}</span>))}<span className="inline-flex items-center gap-1.5 rounded-full border border-gold/40 px-3 py-1 text-xs text-gold">اضغط خانة فارغة لإتاحتها</span></div>
      <div className="glass overflow-x-auto p-4"><div className="min-w-[720px]"><div className="grid grid-cols-[64px_repeat(7,1fr)] gap-1"><div />{WEEK.map((d) => (<div key={d} className="pb-2 text-center text-xs font-semibold text-ink-muted">{d}</div>))}</div>
        {HOURS.map((hour, hi) => (<div key={hour} className="grid grid-cols-[64px_repeat(7,1fr)] gap-1"><div className="flex items-start justify-center pt-2 font-sans text-[11px] text-ink-faint" dir="ltr">{hour}</div>{WEEK.map((_, day) => { const ev = evAt(day, hi); const key = `${day}-${hi}`; const av = slots[key]; if (ev) { const t = TYPE[ev.type] || TYPE['فيديو']; return (<div key={key} className={`m-0.5 rounded-lg border p-2 text-xs ${t.cls}`} style={{ minHeight: 52 }}><div className="flex items-center gap-1 font-semibold"><t.icon size={12} /> {ev.client}</div><span className="text-[10px] opacity-80">{ev.type}</span></div>); } return (<button key={key} onClick={() => toggle(day, hi)} className={`m-0.5 rounded-lg border border-dashed transition ${av ? 'border-gold/50 bg-gold/10' : 'border-white/5 hover:border-gold/30 hover:bg-white/5'}`} style={{ minHeight: 52 }}>{av && <span className="text-[10px] text-gold">متاح</span>}</button>); })}</div>))}
      </div></div>
    </div>
  );
};
export default Calendar;

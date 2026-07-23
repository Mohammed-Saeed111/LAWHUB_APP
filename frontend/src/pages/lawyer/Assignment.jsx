import { useState, useEffect } from 'react';
import { FiFolder, FiUser, FiMove } from 'react-icons/fi';
import PageHeader from '../../components/ui/PageHeader.jsx';
import Avatar from '../../components/ui/Avatar.jsx';
import Badge from '../../components/ui/Badge.jsx';
import Loader from '../../components/ui/Loader.jsx';
import ErrorState from '../../components/ui/ErrorState.jsx';
import { workspaceApi } from '../../api/lawhubApi.js';
import useApi from '../../hooks/useApi.js';
const Assignment = () => {
  const { data, loading, error, refetch } = useApi(async () => { const [cases, team] = await Promise.all([workspaceApi.cases({}), workspaceApi.team()]); return { cases, team }; }, []);
  const [unassigned, setUnassigned] = useState([]); const [loads, setLoads] = useState({}); const [dragId, setDragId] = useState(null); const [overId, setOverId] = useState(null);
  useEffect(() => { if (!data) return; setUnassigned(data.cases.filter((c) => c.assignedTo === 'غير مُسند' || c.status === 'pending').filter((v, i, a) => a.findIndex((x) => x.id === v.id) === i).slice(0, 5)); setLoads(data.team.reduce((a, m) => ({ ...a, [m.id]: m.cases }), {})); }, [data]);
  if (loading) return <Loader label="جارٍ تحميل بيانات التوزيع…" />;
  if (error) return <ErrorState message={error} onRetry={refetch} />;
  const onDrop = async (m) => { if (!dragId) return; const cid = dragId; setUnassigned((l) => l.filter((c) => c.id !== cid)); setLoads((l) => ({ ...l, [m.id]: (l[m.id] || 0) + 1 })); setDragId(null); setOverId(null); try { await workspaceApi.assignCase(cid, m.name); } catch { /* ignore */ } };
  const maxLoad = Math.max(...Object.values(loads), 1);
  return (
    <div className="space-y-6">
      <PageHeader title="توزيع القضايا" subtitle="اسحب القضية وأفلتها على عضو الفريق لإسنادها وموازنة الحِمل" />
      <div className="grid gap-6 lg:grid-cols-[340px_1fr]">
        <section className="glass p-5"><h2 className="mb-4 flex items-center gap-2 font-bold text-ink"><FiFolder className="text-gold" /> قضايا بانتظار الإسناد <span className="chip">{unassigned.length}</span></h2><div className="space-y-3">{unassigned.map((c) => (<div key={c.id} draggable onDragStart={() => setDragId(c.id)} onDragEnd={() => setDragId(null)} className={`cursor-grab rounded-lg border bg-white/5 p-4 transition active:cursor-grabbing ${dragId === c.id ? 'border-gold opacity-50' : 'border-white/10 hover:border-gold/40'}`}><div className="flex items-start justify-between gap-2"><p className="text-sm font-semibold text-ink">{c.title}</p><FiMove className="shrink-0 text-ink-faint" size={15} /></div><p className="mt-1 font-sans text-xs text-ink-faint" dir="ltr">{c.ref}</p><div className="mt-2 flex items-center gap-2"><span className="chip">{c.category}</span><Badge priority={c.priority} /></div></div>))}{unassigned.length === 0 && <p className="py-8 text-center text-sm text-ink-muted">🎉 تم إسناد جميع القضايا!</p>}</div></section>
        <section><h2 className="mb-4 flex items-center gap-2 font-bold text-ink"><FiUser className="text-gold" /> أعضاء الفريق</h2><div className="grid gap-4 sm:grid-cols-2">{data.team.map((m) => { const load = loads[m.id] || 0; const over = overId === m.id; return (<div key={m.id} onDragOver={(e) => { e.preventDefault(); setOverId(m.id); }} onDragLeave={() => setOverId(null)} onDrop={() => onDrop(m)} className={`glass p-5 transition ${over ? 'border-gold bg-gold/10 shadow-gold scale-[1.02]' : ''}`}><div className="flex items-center gap-3"><Avatar seed={m.seed} size={48} online={m.online} /><div className="flex-1"><p className="font-bold text-ink">{m.name}</p><p className="text-xs text-ink-muted">{m.role}</p></div><div className="text-center"><p className="font-sans text-xl font-bold text-gold">{load}</p><p className="text-[10px] text-ink-faint">قضية</p></div></div><div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-gold transition-all" style={{ width: `${(load / maxLoad) * 100}%` }} /></div>{over && <p className="mt-2 text-center text-xs text-gold">أفلت هنا للإسناد</p>}</div>); })}</div></section>
      </div>
    </div>
  );
};
export default Assignment;

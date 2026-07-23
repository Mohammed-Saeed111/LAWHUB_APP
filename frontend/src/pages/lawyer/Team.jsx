import { useState, useEffect } from 'react';
import { FiPlus, FiMoreVertical, FiShield, FiEdit2, FiEye } from 'react-icons/fi';
import PageHeader from '../../components/ui/PageHeader.jsx';
import Avatar from '../../components/ui/Avatar.jsx';
import Loader from '../../components/ui/Loader.jsx';
import ErrorState from '../../components/ui/ErrorState.jsx';
import { workspaceApi } from '../../api/lawhubApi.js';
import useApi from '../../hooks/useApi.js';
const PERM = { admin: { l: 'مدير كامل', icon: FiShield, c: 'text-gold border-gold/30 bg-gold/10' }, editor: { l: 'تعديل', icon: FiEdit2, c: 'text-ok border-ok/30 bg-ok/10' }, viewer: { l: 'عرض فقط', icon: FiEye, c: 'text-ink-muted border-white/15 bg-white/5' } };
const Team = () => {
  const { data, loading, error, refetch } = useApi(() => workspaceApi.team(), []);
  const [team, setTeam] = useState([]); useEffect(() => { if (data) setTeam(data); }, [data]);
  const cycle = async (m) => { const o = ['viewer', 'editor', 'admin']; const next = o[(o.indexOf(m.permission) + 1) % 3]; setTeam((t) => t.map((x) => (x.id === m.id ? { ...x, permission: next } : x))); try { await workspaceApi.setPermission(m.id, next); } catch { /* ignore */ } };
  if (loading) return <Loader label="جارٍ تحميل الفريق…" />;
  if (error) return <ErrorState message={error} onRetry={refetch} />;
  return (
    <div className="space-y-6">
      <PageHeader title="إدارة الفريق" subtitle={`${team.length} أعضاء في المكتب`}><button className="btn-gold text-sm"><FiPlus size={16} /> دعوة عضو</button></PageHeader>
      <div className="grid gap-4 sm:grid-cols-3"><div className="glass p-5"><p className="font-sans text-2xl font-bold text-gold">{team.length}</p><p className="mt-1 text-sm text-ink-muted">إجمالي الأعضاء</p></div><div className="glass p-5"><p className="font-sans text-2xl font-bold text-ink">{team.reduce((s, m) => s + m.cases, 0)}</p><p className="mt-1 text-sm text-ink-muted">القضايا الموزّعة</p></div><div className="glass p-5"><p className="font-sans text-2xl font-bold text-ok">{team.filter((m) => m.online).length}</p><p className="mt-1 text-sm text-ink-muted">متصل الآن</p></div></div>
      <div className="grid gap-4 md:grid-cols-2">{team.map((m) => { const p = PERM[m.permission]; return (<div key={m.id} className="glass flex items-center gap-4 p-5"><Avatar seed={m.seed} size={56} online={m.online} /><div className="flex-1"><p className="font-bold text-ink">{m.name}</p><p className="text-sm text-ink-muted">{m.role} · {m.cases} قضية</p><button onClick={() => cycle(m)} className={`mt-2 inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium transition ${p.c}`}><p.icon size={12} /> {p.l}</button></div><button className="btn-ghost p-2"><FiMoreVertical size={18} /></button></div>); })}</div>
      <p className="text-center text-xs text-ink-faint">💡 اضغط على شارة الصلاحية لتغييرها (محفوظة على الخادم)</p>
    </div>
  );
};
export default Team;

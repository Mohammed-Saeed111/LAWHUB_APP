import { useState, useEffect } from 'react';
import { FiFolder, FiDollarSign, FiClock, FiInfo, FiCheck } from 'react-icons/fi';
import PageHeader from '../../components/ui/PageHeader.jsx';
import Loader from '../../components/ui/Loader.jsx';
import ErrorState from '../../components/ui/ErrorState.jsx';
import { eApi } from '../../api/phaseEApi.js';
import useApi from '../../hooks/useApi.js';

const META = {
  case:    { icon: FiFolder,      l: 'تحديثات القضايا', c: 'text-info' },
  payment: { icon: FiDollarSign,  l: 'المدفوعات',       c: 'text-ok' },
  reminder:{ icon: FiClock,       l: 'تذكيرات',         c: 'text-warn' },
  system:  { icon: FiInfo,        l: 'أخبار النظام',    c: 'text-gold' },
};

const TABS = [
  { k: 'all',     l: 'الكل' },
  { k: 'case',    l: 'القضايا' },
  { k: 'payment', l: 'المدفوعات' },
  { k: 'reminder',l: 'التذكيرات' },
  { k: 'system',  l: 'النظام' },
];

const Notifications = () => {
  const { data, loading, error, refetch } = useApi(() => eApi.notifications(), []);
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => { if (data) setItems(data); }, [data]);

  if (loading) return <Loader label="جارٍ تحميل الإشعارات…" />;
  if (error) return <ErrorState message={error} onRetry={refetch} />;

  const readAll = async () => {
    setItems((x) => x.map((n) => ({ ...n, read: true })));
    try { await eApi.readAll(); } catch { /* optimistic */ }
  };
  const read = async (id) => {
    setItems((x) => x.map((n) => (n.id === id ? { ...n, read: true } : n)));
    try { await eApi.readNotification(id); } catch { /* optimistic */ }
  };

  const filtered = filter === 'all' ? items : items.filter((n) => n.type === filter);

  return (
    <div className="space-y-6">
      <PageHeader title="مركز الإشعارات" subtitle="كل تنبيهات المنصة في مكان واحد">
        <button onClick={readAll} className="btn-outline text-sm">
          <FiCheck size={16} /> تعليم الكل كمقروء
        </button>
      </PageHeader>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button key={t.k} onClick={() => setFilter(t.k)}
            className={`chip ${filter === t.k ? 'bg-gold text-navy' : ''}`}>{t.l}</button>
        ))}
      </div>

      {/* Notification Items */}
      <div className="space-y-3">
        {filtered.map((n) => {
          const m = META[n.type] || META.system;
          const Icon = m.icon;
          return (
            <button key={n.id} onClick={() => read(n.id)}
              className={`card flex w-full items-start gap-4 p-4 text-start transition hover:border-gold/30 ${!n.read ? 'ring-1 ring-gold/20 shadow-gold' : ''}`}>
              <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-white/5 ${m.c}`}>
                <Icon size={20} />
              </span>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-ink">{n.title}</p>
                  {!n.read && <span className="h-2 w-2 rounded-full bg-gold" />}
                </div>
                <p className="mt-1 text-sm text-ink-muted">{n.body}</p>
                <p className="mt-1 text-[11px] text-ink-faint">{m.l}</p>
              </div>
            </button>
          );
        })}
        {filtered.length === 0 && (
          <div className="card p-10 text-center text-ink-muted">لا توجد إشعارات.</div>
        )}
      </div>
    </div>
  );
};
export default Notifications;

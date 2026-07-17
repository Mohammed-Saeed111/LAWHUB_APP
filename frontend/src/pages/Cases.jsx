import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiFolder, FiCalendar, FiCheckCircle, FiClock, FiChevronDown } from 'react-icons/fi';
import lawhubApi from '../api/lawhubApi.js';
import useApi from '../hooks/useApi.js';
import { STATUS_META } from '../lib/ui.js';
import EmptyState from '../components/ui/EmptyState.jsx';
import EmptyCases from './EmptyCases.jsx';
import Loader from '../components/ui/Loader.jsx';
import ErrorState from '../components/ui/ErrorState.jsx';

/**
 * SCREEN 8 — My Legal Cases.
 * A client dashboard to track case status (in progress / waiting / completed)
 * with an expandable Timeline of the lawyer's actions for full transparency.
 * Cases are loaded from /api/cases; zero cases → Screen 9 (empty state).
 */
const Cases = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all');
  const [openId, setOpenId] = useState(null);

  const { data: cases, loading, error, refetch } = useApi(() => lawhubApi.getCases(), []);

  // Open the first case by default once data arrives.
  useEffect(() => {
    if (cases?.length) setOpenId((prev) => prev ?? cases[0].id);
  }, [cases]);

  if (loading) return <Loader label="جارٍ تحميل قضاياك…" />;
  if (error) return <ErrorState message={error} onRetry={refetch} />;

  // If the client has zero cases, show the dedicated empty-state screen (Screen 9).
  if (!cases || cases.length === 0) return <EmptyCases />;

  const filtered = filter === 'all' ? cases : cases.filter((c) => c.status === filter);
  const FILTERS = [
    { key: 'all', label: 'الكل' },
    { key: 'in_progress', label: 'قيد التنفيذ' },
    { key: 'waiting', label: 'في انتظار الرد' },
    { key: 'completed', label: 'مكتملة' },
  ];

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="h-5 w-1 rounded-full bg-gold" />
          <h1 className="section-title">قضاياي القانونية</h1>
        </div>
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <button key={f.key} onClick={() => setFilter(f.key)}
              className={`chip ${filter === f.key ? 'bg-gold text-navy' : ''}`}>{f.label}</button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={FiFolder} title="لا توجد قضايا بهذه الحالة" />
      ) : (
        <div className="space-y-4">
          {filtered.map((c) => {
            const meta = STATUS_META[c.status] || STATUS_META.in_progress;
            const open = openId === c.id;
            return (
              <motion.div key={c.id} layout className="card-luxury overflow-hidden">
                <button onClick={() => setOpenId(open ? null : c.id)} className="flex w-full items-center gap-4 p-5 text-start">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gold/10 text-gold"><FiFolder size={22} /></span>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-bold text-ink">{c.title}</h3>
                      <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${meta.color}`}>
                        <span className={`h-2 w-2 rounded-full ${meta.dot}`} /> {meta.label}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-ink-faint">{c.ref} · {c.category} · {c.lawyerName}</p>
                  </div>
                  {c.nextHearing && (
                    <span className="hidden items-center gap-1 text-xs text-ink-muted sm:inline-flex">
                      <FiCalendar size={13} className="text-gold" /> جلسة: {c.nextHearing}
                    </span>
                  )}
                  <FiChevronDown className={`text-ink-faint transition ${open ? 'rotate-180' : ''}`} />
                </button>

                {open && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                    className="border-t border-white/5 px-5 pb-5 pt-4">
                    <h4 className="mb-4 flex items-center gap-2 text-sm font-semibold text-gold"><FiClock size={15} /> الخط الزمني للقضية</h4>
                    <div className="space-y-0">
                      {(c.timeline || []).map((t, i) => (
                        <div key={i} className="flex gap-3">
                          <div className="flex flex-col items-center">
                            <span className={`flex h-6 w-6 items-center justify-center rounded-full border-2 ${t.done ? 'border-gold bg-gold text-navy' : 'border-gold/40 text-transparent'}`}>
                              {t.done && <FiCheckCircle size={13} />}
                            </span>
                            {i < c.timeline.length - 1 && <span className={`w-0.5 flex-1 ${t.done ? 'bg-gold/50' : 'bg-white/10'}`} style={{ minHeight: 28 }} />}
                          </div>
                          <div className="pb-4">
                            <p className={`text-sm ${t.done ? 'text-ink' : 'text-ink-muted'}`}>{t.title}</p>
                            <p className="text-xs text-ink-faint">{t.date}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    {c.lawyer && (
                      <button onClick={() => navigate(`/lawyer/${c.lawyer}`)} className="btn-outline mt-2 text-sm">تواصل مع المحامي</button>
                    )}
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};
export default Cases;

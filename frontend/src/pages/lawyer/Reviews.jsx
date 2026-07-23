import { useState, useEffect } from 'react';
import { FiStar, FiFlag, FiMessageCircle, FiCheckCircle } from 'react-icons/fi';
import PageHeader from '../../components/ui/PageHeader.jsx';
import Avatar from '../../components/ui/Avatar.jsx';
import Badge from '../../components/ui/Badge.jsx';
import Loader from '../../components/ui/Loader.jsx';
import ErrorState from '../../components/ui/ErrorState.jsx';
import { workspaceApi } from '../../api/lawhubApi.js';
import useApi from '../../hooks/useApi.js';
const Stars = ({ value, size = 14 }) => (<span className="inline-flex" dir="ltr">{[1, 2, 3, 4, 5].map((n) => (<FiStar key={n} size={size} className={n <= value ? 'fill-gold text-gold' : 'text-ink-faint'} />))}</span>);
const Reviews = () => {
  const { data, loading, error, refetch } = useApi(() => workspaceApi.reviews(), []);
  const [reviews, setReviews] = useState([]); useEffect(() => { if (data) setReviews(data.reviews); }, [data]);
  if (loading) return <Loader label="جارٍ تحميل التقييمات…" />;
  if (error) return <ErrorState message={error} onRetry={refetch} />;
  const s = data.stats;
  const dispute = async (id) => { setReviews((r) => r.map((x) => (x.id === id ? { ...x, status: 'disputed' } : x))); try { await workspaceApi.disputeReview(id); } catch { /* ignore */ } };
  return (
    <div className="space-y-6">
      <PageHeader title="التقييمات والسمعة" subtitle="حلّل آراء العملاء وأدِر سمعتك الرقمية" />
      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        <section className="glass h-fit p-6 text-center"><p className="font-sans text-5xl font-bold text-gold">{s.average}</p><div className="mt-2 flex justify-center"><Stars value={Math.round(s.average)} size={18} /></div><p className="mt-1 text-sm text-ink-muted">من {s.total} تقييم</p><div className="mt-6 space-y-2">{s.breakdown.map((b) => (<div key={b.s} className="flex items-center gap-2 text-xs"><span className="w-8 font-sans text-ink-muted" dir="ltr">{b.s}★</span><div className="h-2 flex-1 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-gold" style={{ width: `${s.total ? (b.c / s.total) * 100 : 0}%` }} /></div><span className="w-8 text-end font-sans text-ink-faint">{b.c}</span></div>))}</div></section>
        <section className="space-y-4">{reviews.map((r) => (<div key={r.id} className="glass p-5"><div className="flex items-start gap-3"><Avatar seed={r.author} size={44} /><div className="flex-1"><div className="flex flex-wrap items-center gap-2"><p className="font-semibold text-ink">{r.author}</p><Stars value={r.rating} /><span className="text-xs text-ink-faint">{r.date}</span>{r.status === 'disputed' && <Badge status="disputed" />}</div><p className="mt-2 text-sm text-ink-muted">{r.text}</p><div className="mt-3 flex gap-2"><button className="btn-ghost text-xs"><FiMessageCircle size={14} /> رد</button>{r.status !== 'disputed' ? (<button onClick={() => dispute(r.id)} className="btn-ghost text-xs text-danger hover:bg-danger/10"><FiFlag size={14} /> الاعتراض على التقييم</button>) : (<span className="inline-flex items-center gap-1 text-xs text-warn"><FiCheckCircle size={13} /> تم رفع نزاع — قيد المراجعة</span>)}</div></div></div></div>))}</section>
      </div>
    </div>
  );
};
export default Reviews;

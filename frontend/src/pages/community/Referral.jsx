import { useState } from 'react';
import { FiGift, FiCopy, FiCheck, FiAward, FiTrendingUp } from 'react-icons/fi';
import PageHeader from '../../components/ui/PageHeader.jsx';
import Avatar from '../../components/ui/Avatar.jsx';
import Loader from '../../components/ui/Loader.jsx';
import ErrorState from '../../components/ui/ErrorState.jsx';
import { eApi } from '../../api/phaseEApi.js';
import useApi from '../../hooks/useApi.js';

const Referral = () => {
  const { data, loading, error, refetch } = useApi(() => eApi.referral(), []);
  const [copied, setCopied] = useState(false);

  if (loading) return <Loader label="جارٍ تحميل برنامج المكافآت…" />;
  if (error) return <ErrorState message={error} onRetry={refetch} />;

  const link = `https://lawhub.eg/invite/${data.code}`;
  const copy = () => {
    navigator.clipboard?.writeText(link);
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  };
  const pct = Math.min(100, Math.round((data.milestone.current / data.milestone.target) * 100));

  return (
    <div className="space-y-6">
      <PageHeader title="الإحالة والمكافآت" subtitle="ادعُ زملاءك واكسب نقاطًا ومزايا حصرية" />

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          {/* Invite Card */}
          <section className="glass-gold p-6 text-center">
            <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gold/15 text-gold shadow-gold">
              <FiGift size={30} />
            </span>
            <h2 className="mt-4 font-serif text-2xl font-bold text-ink">ادعُ زميلًا واربح 100 نقطة</h2>
            <p className="mt-1 text-sm text-ink-muted">لكل زميل ينضم عبر رابطك، تحصل أنت وهو على مكافأة.</p>
            <div className="mx-auto mt-5 flex max-w-md items-center gap-2 rounded-lg border border-gold/30 bg-navy-900/60 p-2">
              <span className="flex-1 truncate px-2 font-sans text-sm text-ink" dir="ltr">{link}</span>
              <button onClick={copy} className="btn-gold px-4 py-2 text-sm">
                {copied ? <><FiCheck size={16} /> تم النسخ</> : <><FiCopy size={16} /> نسخ</>}
              </button>
            </div>
          </section>

          {/* Progress */}
          <section className="glass p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="flex items-center gap-2 font-bold text-ink">
                <FiTrendingUp className="text-gold" /> تقدّمك نحو الهدف
              </h3>
              <span className="text-sm text-ink-muted">{data.milestone.current}/{data.milestone.target} إحالة</span>
            </div>
            <div className="h-3 w-full overflow-hidden rounded-full bg-white/10">
              <div className="h-full rounded-full bg-gradient-to-r from-gold-dark via-gold to-gold-light transition-all"
                style={{ width: `${pct}%` }} />
            </div>
            <p className="mt-3 text-sm text-ink-muted">
              أكمل <span className="text-gold font-bold">{Math.max(0, data.milestone.target - data.milestone.current)}</span> إحالات إضافية للوصول لمكافأة الباقة المجانية.
            </p>
          </section>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="glass p-5 text-center">
              <p className="font-sans text-3xl font-bold text-gold">{data.points}</p>
              <p className="mt-1 text-sm text-ink-muted">نقطة مكتسبة</p>
            </div>
            <div className="glass p-5 text-center">
              <p className="font-sans text-3xl font-bold text-ink">{data.referrals}</p>
              <p className="mt-1 text-sm text-ink-muted">زميل انضمّ</p>
            </div>
          </div>
        </div>

        {/* Leaderboard */}
        <aside className="glass h-fit p-6">
          <h3 className="mb-4 flex items-center gap-2 font-bold text-ink">
            <FiAward className="text-gold" /> المتصدّرون
          </h3>
          <div className="space-y-3">
            {data.leaderboard.map((l, i) => (
              <div key={l._id || i} className="flex items-center gap-3 rounded-lg border border-white/5 bg-white/5 p-3">
                <span className={`flex h-7 w-7 items-center justify-center rounded-full text-sm font-bold ${i === 0 ? 'bg-gold text-navy' : 'bg-white/10 text-ink-muted'}`}>
                  {i + 1}
                </span>
                <Avatar seed={l.seed} size={36} />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-ink">{l.name}</p>
                  <p className="text-xs text-ink-faint">{l.referrals} إحالة</p>
                </div>
                <span className="font-sans text-sm text-gold">{l.points}</span>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
};
export default Referral;

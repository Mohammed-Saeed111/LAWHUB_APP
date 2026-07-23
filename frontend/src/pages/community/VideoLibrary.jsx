import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiPlay, FiClock, FiStar, FiAward } from 'react-icons/fi';
import PageHeader from '../../components/ui/PageHeader.jsx';
import Loader from '../../components/ui/Loader.jsx';
import ErrorState from '../../components/ui/ErrorState.jsx';
import { eApi } from '../../api/phaseEApi.js';
import useApi from '../../hooks/useApi.js';

const Thumb = ({ className = '' }) => (
  <div className={`relative overflow-hidden rounded-xl bg-gradient-to-br from-navy-800 to-navy-900 ${className}`}>
    <div className="absolute inset-0 bg-gold-radial opacity-30" />
    <span className="absolute inset-0 flex items-center justify-center text-gold/30">
      <FiPlay size={40} />
    </span>
  </div>
);

const VideoLibrary = () => {
  const [cat, setCat] = useState('الكل');
  const { data, loading, error, refetch } = useApi(() => eApi.videos({ category: cat }), [cat]);
  if (loading) return <Loader label="جارٍ تحميل المكتبة…" />;
  if (error) return <ErrorState message={error} onRetry={refetch} />;
  const { videos, featured, categories } = data;
  return (
    <div className="space-y-6">
      <PageHeader title="مكتبة الفيديو التعليمية" subtitle="دورات ومحاضرات احترافية بأسلوب Masterclass" />

      {/* Featured Video */}
      {featured && (
        <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="relative overflow-hidden rounded-2xl border border-gold/15 p-6 sm:p-10">
          <div className="absolute inset-0 bg-gradient-to-br from-navy-800 to-navy-900" />
          <div className="absolute inset-0 bg-gold-radial opacity-20" />
          <div className="relative max-w-xl">
            <span className="chip">{featured.isPro ? 'Pro · مميّز' : 'مجاني'}</span>
            <h2 className="mt-4 font-serif text-3xl font-bold text-ink">{featured.title}</h2>
            <p className="mt-2 text-ink-muted">{featured.description}</p>
            <div className="mt-3 flex items-center gap-4 text-sm text-ink-faint">
              <span>{featured.instructor}</span>
              <span className="inline-flex items-center gap-1"><FiClock size={13} /> {featured.duration}</span>
            </div>
            <button className="btn-gold mt-6"><FiPlay size={18} /> شاهد الآن</button>
          </div>
        </motion.section>
      )}

      {/* Category Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
        {['الكل', ...categories].map((c) => (
          <button key={c} onClick={() => setCat(c)}
            className={`chip shrink-0 ${cat === c ? 'bg-gold text-navy' : ''}`}>{c}</button>
        ))}
      </div>

      {/* Videos Grid */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {videos.map((v, i) => (
          <motion.div key={v.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            className="card group overflow-hidden transition hover:-translate-y-1 hover:shadow-gold">
            <div className="relative">
              <Thumb className="h-40 w-full" />
              <span className="absolute inset-0 flex items-center justify-center opacity-0 transition group-hover:opacity-100">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gold text-navy">
                  <FiPlay size={22} />
                </span>
              </span>
              {v.isPro && (
                <span className="absolute top-3 ltr:right-3 rtl:left-3 inline-flex items-center gap-1 rounded-full bg-gold px-2 py-0.5 text-[11px] font-bold text-navy">
                  <FiAward size={11} /> Pro
                </span>
              )}
              <span className="absolute bottom-2 ltr:left-2 rtl:right-2 rounded bg-black/60 px-1.5 py-0.5 text-[11px] text-white" dir="ltr">{v.duration}</span>
            </div>
            {v.progress > 0 && (
              <div className="h-1 w-full bg-white/10">
                <div className="h-full bg-gold" style={{ width: `${v.progress}%` }} />
              </div>
            )}
            <div className="p-4">
              <h3 className="font-bold text-ink line-clamp-1">{v.title}</h3>
              <p className="mt-1 text-xs text-ink-muted">{v.instructor}</p>
              <div className="mt-2 flex items-center gap-3 text-xs text-ink-faint">
                <span className="chip">{v.category}</span>
                <span className="inline-flex items-center gap-1">
                  <FiStar size={11} className="fill-gold text-gold" /> {(4 + Math.random()).toFixed(1)}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
export default VideoLibrary;

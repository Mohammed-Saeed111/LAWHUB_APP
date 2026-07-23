import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as Fi from 'react-icons/fi';
import useApi from '../../hooks/useApi.js';
import { dApi } from '../../api/phaseDApi.js';

const Marketplace = () => {
  const navigate = useNavigate();
  const [q, setQ] = useState('');
  const [cat, setCat] = useState('الكل');
  const { data, loading, error, refetch } = useApi(() => dApi.templates({ q, category: cat }), [q, cat]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-6 w-1 rounded bg-gold" />
            <h1 className="text-xl font-bold text-ink">سوق العقود</h1>
          </div>
          <p className="mt-1 ml-3 text-sm text-ink-muted">قوالب قانونية معتمدة وموثّقة بالذكاء الاصطناعي</p>
        </div>
      </div>

      {/* Search + Filters */}
      <div className="glass p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Fi.FiSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-faint" size={16} />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="ابحث عن قالب عقد…"
              className="input pr-9"
            />
          </div>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {['الكل', ...(data?.categories || [])].map((c) => (
            <button key={c} onClick={() => setCat(c)} className={`chip ${cat === c ? 'bg-gold text-surface' : ''}`}>{c}</button>
          ))}
        </div>
      </div>

      {/* Loading / Error */}
      {loading && (
        <div className="flex flex-col items-center justify-center gap-3 py-20 text-ink-muted">
          <span className="h-8 w-8 animate-spin rounded-full border-2 border-gold/30 border-t-gold" />
          <span className="text-sm">جارٍ التحميل…</span>
        </div>
      )}
      {error && (
        <div className="glass flex flex-col items-center gap-3 p-10 text-center">
          <Fi.FiAlertTriangle size={26} className="text-danger" />
          <p className="text-ink">{error}</p>
          <button onClick={refetch} className="btn-outline mt-2 text-sm">إعادة المحاولة</button>
        </div>
      )}

      {/* Templates Grid */}
      {!loading && !error && data && (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {data.templates.map((t, i) => {
            const Icon = Fi[t.icon] || Fi.FiFileText;
            return (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="market-card flex flex-col p-5"
              >
                <div className="flex items-start justify-between">
                  <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-gold/10 text-gold">
                    <Icon size={24} />
                  </span>
                  {t.aiVerified && (
                    <span className="inline-flex items-center gap-1 rounded-full border border-gold/30 bg-gold/10 px-2 py-0.5 text-[11px] text-gold">
                      <Fi.FiShield size={11} /> موثّق بالذكاء
                    </span>
                  )}
                </div>
                <h3 className="mt-4 font-bold text-ink">{t.title}</h3>
                <p className="mt-1 flex-1 text-sm text-ink-muted">{t.description}</p>
                <div className="mt-3 flex items-center gap-3 text-xs text-ink-faint">
                  <span className="inline-flex items-center gap-1"><Fi.FiStar size={12} className="fill-gold text-gold" /> {t.rating}</span>
                  <span className="inline-flex items-center gap-1"><Fi.FiDownload size={12} /> {t.downloads}</span>
                  <span className="inline-flex items-center gap-1"><Fi.FiFile size={12} /> {t.pages} صفحات</span>
                </div>
                <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-4">
                  <div>
                    <span className="font-sans text-lg font-bold text-gold">{t.price}</span>
                    <span className="text-xs text-ink-faint"> {t.currency}</span>
                  </div>
                  <button onClick={() => navigate(`/market/editor/${t.id}`)} className="btn-gold text-sm py-2">
                    تخصيص وشراء
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Marketplace;

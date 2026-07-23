import { useState } from 'react';
import { FiClock, FiBookmark } from 'react-icons/fi';
import PageHeader from '../../components/ui/PageHeader.jsx';
import Loader from '../../components/ui/Loader.jsx';
import ErrorState from '../../components/ui/ErrorState.jsx';
import { eApi } from '../../api/phaseEApi.js';
import useApi from '../../hooks/useApi.js';

const LegalNews = () => {
  const { data, loading, error, refetch } = useApi(() => eApi.news(), []);
  const [saved, setSaved] = useState([]);
  const tog = (id) => setSaved((s) => s.includes(id) ? s.filter((x) => x !== id) : [...s, id]);
  if (loading) return <Loader label="جارٍ تحميل الأخبار…" />;
  if (error) return <ErrorState message={error} onRetry={refetch} />;
  const { news, featured } = data;
  return (
    <div className="space-y-6">
      <PageHeader title="الأخبار والتحليلات القانونية" subtitle="تحديثات تشريعية وأحكام قضائية وتحليلات" />

      {/* Featured Article */}
      {featured && (
        <section className="relative overflow-hidden rounded-2xl border border-gold/15">
          <div className="h-48 bg-gradient-to-br from-navy-800 to-navy-900" />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-900 to-transparent" />
          <div className="absolute bottom-0 p-6">
            <span className="chip">{featured.category}</span>
            <h2 className="mt-3 font-serif text-2xl font-bold text-ink">{featured.title}</h2>
            <p className="mt-2 max-w-2xl text-sm text-ink-muted">{featured.excerpt}</p>
            <div className="mt-2 flex items-center gap-3 text-xs text-ink-faint">
              <span>{featured.source}</span>
              <span className="inline-flex items-center gap-1"><FiClock size={12} /> {featured.readTime} دقائق</span>
            </div>
          </div>
        </section>
      )}

      {/* News Feed */}
      <div className="space-y-4">
        {news.map((n) => (
          <article key={n.id} className="card flex items-start gap-4 p-5 transition hover:border-gold/30">
            <div className="hidden h-24 w-32 shrink-0 rounded-lg bg-gradient-to-br from-navy-800 to-navy-900 sm:block" />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="chip">{n.category}</span>
                <span className="inline-flex items-center gap-1 text-xs text-ink-faint">
                  <FiClock size={11} /> {n.readTime} دقائق
                </span>
              </div>
              <h3 className="mt-2 font-serif text-lg font-bold text-ink">{n.title}</h3>
              <p className="mt-1 text-sm text-ink-muted">{n.excerpt}</p>
              <p className="mt-2 text-xs text-ink-faint">{n.source}</p>
            </div>
            <button onClick={() => tog(n.id)} className={`btn-ghost p-2 ${saved.includes(n.id) ? 'text-gold' : ''}`}>
              <FiBookmark size={18} className={saved.includes(n.id) ? 'fill-gold' : ''} />
            </button>
          </article>
        ))}
      </div>
    </div>
  );
};
export default LegalNews;

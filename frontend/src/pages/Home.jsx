import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as Fi from 'react-icons/fi';
import lawhubApi from '../api/lawhubApi.js';
import useApi from '../hooks/useApi.js';
import SectionHeader from '../components/ui/SectionHeader.jsx';
import LawyerCard from '../components/ui/LawyerCard.jsx';
import Loader from '../components/ui/Loader.jsx';
import ErrorState from '../components/ui/ErrorState.jsx';

/**
 * SCREEN 1 — Client Home Page.
 * Smart luxury search (by specialty/location), categorized service cards with
 * gold icons, "Top Lawyers", and "Latest Legal Articles" sections.
 * All content is now loaded from the real API.
 */
const Home = () => {
  const navigate = useNavigate();
  const [q, setQ] = useState('');
  const [city, setCity] = useState('');

  // Fetch everything the home page needs in parallel.
  const { data, loading, error, refetch } = useApi(
    async () => {
      const [categories, cities, articles, top] = await Promise.all([
        lawhubApi.getCategories(),
        lawhubApi.getCities(),
        lawhubApi.getArticles(),
        lawhubApi.getLawyers({ sort: 'rating', limit: 3 }),
      ]);
      return { categories, cities, articles, topLawyers: top.lawyers };
    },
    []
  );

  const submit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (q) params.set('q', q);
    if (city) params.set('city', city);
    navigate(`/search?${params.toString()}`);
  };

  return (
    <div className="space-y-10">
      {/* Hero + smart search */}
      <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl border border-gold/15 bg-gradient-to-br from-navy-800 to-navy-700 p-6 sm:p-10">
        <div className="absolute inset-0 bg-gold-radial" />
        <div className="relative">
          <span className="chip">بوابتك نحو التميّز القانوني</span>
          <h1 className="mt-4 font-serif text-3xl font-bold text-ink sm:text-4xl">
            أهلاً كريم، <span className="text-gold">كيف نساعدك اليوم؟</span>
          </h1>
          <p className="mt-2 max-w-lg text-ink-muted">ابحث عن نخبة المحامين المعتمدين في مصر، قارن، واحجز استشارتك بأمان تام.</p>

          <form onSubmit={submit} className="mt-6 flex flex-col gap-3 rounded-2xl border border-gold/20 bg-navy-900/60 p-3 sm:flex-row">
            <div className="relative flex-1">
              <Fi.FiSearch className="absolute ltr:left-3 rtl:right-3 top-1/2 -translate-y-1/2 text-gold" size={18} />
              <input value={q} onChange={(e) => setQ(e.target.value)}
                placeholder="التخصص أو اسم المحامي (مثال: جنائي، عقاري…)"
                className="input-luxury ltr:pl-10 rtl:pr-10 border-0 bg-transparent" />
            </div>
            <div className="relative sm:w-56">
              <Fi.FiMapPin className="absolute ltr:left-3 rtl:right-3 top-1/2 -translate-y-1/2 text-gold" size={18} />
              <select value={city} onChange={(e) => setCity(e.target.value)}
                className="input-luxury ltr:pl-10 rtl:pr-10 border-0 bg-transparent appearance-none">
                <option value="">كل المدن</option>
                {(data?.cities || []).map((c) => <option key={c} value={c} className="bg-navy-800">{c}</option>)}
              </select>
            </div>
            <button type="submit" className="btn-gold shrink-0">بحث</button>
          </form>

          <button onClick={() => navigate('/map')} className="mt-3 inline-flex items-center gap-2 text-sm link-gold">
            <Fi.FiMap size={16} /> أو تصفّح المحامين على الخريطة التفاعلية
          </button>
        </div>
      </motion.section>

      {error && <ErrorState message={error} onRetry={refetch} />}
      {!error && loading && <Loader />}

      {!error && !loading && data && (
        <>
          {/* Categories */}
          <section>
            <SectionHeader title="التخصصات القانونية" action="عرض الكل" onAction={() => navigate('/search')} />
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {data.categories.map((cat) => {
                const Icon = Fi[cat.icon] || Fi.FiBookOpen;
                return (
                  <button key={cat.key} onClick={() => navigate(`/search?q=${encodeURIComponent(cat.label)}`)}
                    className="card-luxury group flex flex-col items-center gap-3 p-5 text-center transition hover:border-gold/40 hover:shadow-gold">
                    <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gold/10 text-gold transition group-hover:bg-gold group-hover:text-navy">
                      <Icon size={26} />
                    </span>
                    <span className="font-semibold text-ink">{cat.label}</span>
                    <span className="text-xs text-ink-faint">{cat.count} محامٍ</span>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Top lawyers */}
          <section>
            <SectionHeader title="أبرز المحامين" action="عرض الكل" onAction={() => navigate('/search?sort=rating')} />
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {data.topLawyers.map((l) => <LawyerCard key={l.id} lawyer={l} />)}
            </div>
          </section>

          {/* Latest articles */}
          <section>
            <SectionHeader title="أحدث الاستشارات القانونية" />
            <div className="grid gap-4 sm:grid-cols-3">
              {data.articles.map((a) => (
                <div key={a.id} className="card-luxury p-5 transition hover:border-gold/40">
                  <span className="chip">{a.category}</span>
                  <h3 className="mt-3 font-semibold text-ink">{a.title}</h3>
                  <p className="mt-3 flex items-center gap-1 text-xs text-ink-faint">
                    <Fi.FiClock size={13} /> {a.readMins} دقائق قراءة
                  </p>
                </div>
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
};
export default Home;

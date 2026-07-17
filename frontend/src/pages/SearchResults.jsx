import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FiSliders, FiSearch } from 'react-icons/fi';
import lawhubApi from '../api/lawhubApi.js';
import LawyerCard from '../components/ui/LawyerCard.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';
import Loader from '../components/ui/Loader.jsx';
import ErrorState from '../components/ui/ErrorState.jsx';

/**
 * SCREEN 3 — Lawyer Search Results.
 * Organized list of verified lawyers with an advanced filter rail
 * (experience, session price, rating) + sorting.
 * Filtering & sorting now happen on the server (/api/lawyers?...).
 */
const SearchResults = () => {
  const [params] = useSearchParams();
  const [q, setQ] = useState(params.get('q') || '');
  const [city, setCity] = useState(params.get('city') || '');
  const [minRating, setMinRating] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1000);
  const [minExp, setMinExp] = useState(0);
  const [sort, setSort] = useState(params.get('sort') || 'rating');
  const [showFilters, setShowFilters] = useState(false);

  // Filter options (cities + categories) loaded once from the API.
  const [cities, setCities] = useState([]);
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    lawhubApi.getCities().then(setCities).catch(() => setCities([]));
    lawhubApi.getCategories().then(setCategories).catch(() => setCategories([]));
  }, []);

  // Results — refetched whenever a filter changes (debounced on q).
  const [results, setResults] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const sortParam = { rating: 'rating', experience: 'experience', price_low: 'price_asc', price_high: 'price_desc' }[sort] || 'rating';

  const load = async () => {
    setLoading(true); setError(null);
    try {
      const d = await lawhubApi.getLawyers({
        q, city, minRating: minRating || undefined, maxRate: maxPrice,
        minExp: minExp || undefined, sort: sortParam, limit: 50,
      });
      setResults(d.lawyers); setTotal(d.total);
    } catch (e) {
      setError(e.message || 'تعذّر تحميل النتائج.');
    } finally { setLoading(false); }
  };

  useEffect(() => {
    const t = setTimeout(load, 250); // debounce
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, city, minRating, maxPrice, minExp, sort]);

  const Filters = () => (
    <div className="space-y-6">
      <div>
        <label className="mb-2 block text-sm font-medium text-ink-muted">المدينة</label>
        <select value={city} onChange={(e) => setCity(e.target.value)} className="input-luxury">
          <option value="">كل المدن</option>
          {cities.map((c) => <option key={c} value={c} className="bg-navy-800">{c}</option>)}
        </select>
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium text-ink-muted">أقل تقييم: <span className="text-gold">{minRating}★</span></label>
        <input type="range" min="0" max="5" step="0.5" value={minRating} onChange={(e) => setMinRating(+e.target.value)} className="w-full accent-gold" />
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium text-ink-muted">أقصى سعر للساعة: <span className="text-gold">{maxPrice} ج.م</span></label>
        <input type="range" min="300" max="1000" step="50" value={maxPrice} onChange={(e) => setMaxPrice(+e.target.value)} className="w-full accent-gold" />
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium text-ink-muted">أقل خبرة: <span className="text-gold">{minExp} سنة</span></label>
        <input type="range" min="0" max="20" step="1" value={minExp} onChange={(e) => setMinExp(+e.target.value)} className="w-full accent-gold" />
      </div>
      <div>
        <p className="mb-2 text-sm font-medium text-ink-muted">تخصصات شائعة</p>
        <div className="flex flex-wrap gap-2">
          {categories.slice(0, 6).map((c) => (
            <button key={c.key} onClick={() => setQ(c.label)}
              className={`chip ${q === c.label ? 'bg-gold text-navy' : ''}`}>{c.label}</button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-5">
      {/* Search bar */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <FiSearch className="absolute ltr:left-3 rtl:right-3 top-1/2 -translate-y-1/2 text-gold" size={18} />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="ابحث بالاسم أو التخصص…"
            className="input-luxury ltr:pl-10 rtl:pr-10" />
        </div>
        <button onClick={() => setShowFilters((s) => !s)} className="btn-outline lg:hidden"><FiSliders size={18} /></button>
        <select value={sort} onChange={(e) => setSort(e.target.value)} className="input-luxury w-auto hidden sm:block">
          <option value="rating" className="bg-navy-800">الأعلى تقييمًا</option>
          <option value="experience" className="bg-navy-800">الأكثر خبرة</option>
          <option value="price_low" className="bg-navy-800">السعر: الأقل أولاً</option>
          <option value="price_high" className="bg-navy-800">السعر: الأعلى أولاً</option>
        </select>
      </div>

      <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
        {/* Filter rail */}
        <aside className={`card-luxury h-fit p-5 ${showFilters ? 'block' : 'hidden'} lg:block`}>
          <h3 className="mb-4 flex items-center gap-2 font-bold text-ink"><FiSliders size={18} className="text-gold" /> فلاتر متقدمة</h3>
          <Filters />
        </aside>

        {/* Results */}
        <div>
          <p className="mb-4 text-sm text-ink-muted">تم العثور على <span className="font-bold text-gold">{total}</span> محامٍ معتمد</p>
          {loading && <Loader />}
          {error && <ErrorState message={error} onRetry={load} />}
          {!loading && !error && (
            results.length ? (
              <div className="grid gap-4 xl:grid-cols-2">
                {results.map((l) => <LawyerCard key={l.id} lawyer={l} />)}
              </div>
            ) : (
              <EmptyState icon={FiSearch} title="لا توجد نتائج مطابقة"
                description="جرّب توسيع الفلاتر أو البحث بتخصص مختلف." />
            )
          )}
        </div>
      </div>
    </div>
  );
};
export default SearchResults;

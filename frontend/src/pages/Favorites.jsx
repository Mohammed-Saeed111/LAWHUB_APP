import { useNavigate } from 'react-router-dom';
import { FiHeart, FiSearch } from 'react-icons/fi';
import lawhubApi from '../api/lawhubApi.js';
import useApi from '../hooks/useApi.js';
import LawyerCard from '../components/ui/LawyerCard.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';
import Loader from '../components/ui/Loader.jsx';
import ErrorState from '../components/ui/ErrorState.jsx';
import { useApp } from '../context/AppContext.jsx';

/**
 * SCREEN 5 — Favorites Page.
 * Clean grid of the lawyers the client saved, for quick access & re-booking.
 * Saved lawyers are fetched from /api/favorites; re-fetches when the
 * favorites set changes (add/remove reflects instantly).
 */
const Favorites = () => {
  const navigate = useNavigate();
  const { favorites } = useApp();

  const { data: saved, loading, error, refetch } = useApi(
    async () => (await lawhubApi.getFavorites()).lawyers,
    [favorites.length]
  );

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2">
        <span className="h-5 w-1 rounded-full bg-gold" />
        <h1 className="section-title">المحامون المفضّلون</h1>
        {saved?.length > 0 && <span className="chip ltr:ml-2 rtl:mr-2">{saved.length}</span>}
      </div>

      {loading && <Loader />}
      {error && <ErrorState message={error} onRetry={refetch} />}

      {!loading && !error && (
        saved?.length ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {saved.map((l) => <LawyerCard key={l.id} lawyer={l} />)}
          </div>
        ) : (
          <EmptyState icon={FiHeart} title="قائمة المفضلة فارغة"
            description="احفظ المحامين الذين لفتوا انتباهك للوصول إليهم بسرعة وحجز موعد لاحقًا.">
            <button onClick={() => navigate('/search')} className="btn-gold"><FiSearch /> ابحث عن محامٍ</button>
          </EmptyState>
        )
      )}
    </div>
  );
};
export default Favorites;

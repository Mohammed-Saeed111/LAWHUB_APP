import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMapPin, FiBriefcase, FiAward, FiCheckCircle, FiHeart, FiGlobe, FiCalendar } from 'react-icons/fi';
import lawhubApi from '../api/lawhubApi.js';
import useApi from '../hooks/useApi.js';
import Avatar from '../components/ui/Avatar.jsx';
import Rating from '../components/ui/Rating.jsx';
import VerifiedBadge from '../components/ui/VerifiedBadge.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';
import Loader from '../components/ui/Loader.jsx';
import ErrorState from '../components/ui/ErrorState.jsx';
import { useApp } from '../context/AppContext.jsx';

/**
 * SCREEN 4 — Lawyer Profile.
 * A premium professional profile: bio, exact specialties, success record,
 * client reviews, and a very prominent gold "Book Consultation" CTA.
 * Profile + reviews are loaded from the API.
 */
const Stat = ({ icon: Icon, value, label }) => (
  <div className="card-luxury flex flex-col items-center gap-1 p-4 text-center">
    <Icon className="text-gold" size={22} />
    <span className="text-xl font-bold text-ink">{value}</span>
    <span className="text-xs text-ink-faint">{label}</span>
  </div>
);

const LawyerProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite } = useApp();

  const { data, loading, error, refetch } = useApi(
    async () => {
      const [lawyer, reviews] = await Promise.all([
        lawhubApi.getLawyer(id),
        lawhubApi.getLawyerReviews(id),
      ]);
      return { lawyer, reviews };
    },
    [id]
  );

  if (loading) return <Loader label="جارٍ تحميل ملف المحامي…" />;
  if (error) return <ErrorState message={error} onRetry={refetch} />;
  if (!data?.lawyer) return <EmptyState icon={FiBriefcase} title="المحامي غير موجود" />;

  const { lawyer, reviews } = data;
  const fav = isFavorite(lawyer.id);

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl border border-gold/15 bg-gradient-to-br from-navy-800 to-navy-700 p-6 sm:p-8">
        <div className="absolute inset-0 bg-gold-radial" />
        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-start">
          <Avatar seed={lawyer.avatarSeed} size={96} online={lawyer.online} />
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-bold text-ink">{lawyer.name}</h1>
              {lawyer.verified && <VerifiedBadge />}
            </div>
            <p className="mt-1 text-ink-muted">{lawyer.title}</p>
            <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-ink-muted">
              <Rating value={lawyer.rating} count={lawyer.reviews} />
              <span className="inline-flex items-center gap-1"><FiMapPin size={14} className="text-gold" /> {lawyer.city} — {lawyer.area}</span>
              <span className="inline-flex items-center gap-1"><FiGlobe size={14} className="text-gold" /> {(lawyer.languages || []).join('، ')}</span>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {(lawyer.specialties || []).map((s) => <span key={s} className="chip">{s}</span>)}
            </div>
          </div>
          <div className="flex sm:flex-col gap-2">
            <button onClick={() => toggleFavorite(lawyer.id)}
              className={`btn-outline ${fav ? 'bg-gold/10' : ''}`}>
              <FiHeart className={fav ? 'fill-gold' : ''} /> {fav ? 'محفوظ' : 'حفظ'}
            </button>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat icon={FiBriefcase} value={`${lawyer.experience} سنة`} label="خبرة" />
        <Stat icon={FiCheckCircle} value={lawyer.wins} label="قضية ناجحة" />
        <Stat icon={FiAward} value={lawyer.reviews} label="تقييم" />
        <Stat icon={FiCalendar} value={`${lawyer.hourlyRate} ج.م`} label="سعر الساعة" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {/* Bio */}
          <section className="card-luxury p-6">
            <h2 className="section-title mb-3">نبذة مهنية</h2>
            <p className="leading-relaxed text-ink-muted">{lawyer.bio}</p>
          </section>

          {/* Reviews */}
          <section className="card-luxury p-6">
            <h2 className="section-title mb-4">آراء العملاء</h2>
            <div className="space-y-4">
              {reviews.length === 0 && <p className="text-sm text-ink-faint">لا توجد تقييمات بعد.</p>}
              {reviews.map((r) => (
                <div key={r.id} className="border-b border-white/5 pb-4 last:border-0">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-ink">{r.author}</span>
                    <span className="text-xs text-ink-faint">{r.date || ''}</span>
                  </div>
                  <div className="mt-1"><Rating value={r.rating} showValue={false} size={13} /></div>
                  <p className="mt-2 text-sm text-ink-muted">{r.text}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Sticky booking card */}
        <aside className="lg:sticky lg:top-24 h-fit">
          <div className="card-luxury p-6 text-center">
            <p className="text-sm text-ink-muted">استشارة تبدأ من</p>
            <p className="mt-1 text-3xl font-bold text-gold">{Math.round(lawyer.hourlyRate / 2)} <span className="text-sm text-ink-faint">ج.م</span></p>
            <p className="mt-1 text-xs text-ink-faint">لأول 30 دقيقة</p>
            <button onClick={() => navigate(`/booking/${lawyer.id}`)} className="btn-gold mt-5 w-full text-base py-3.5 shadow-gold">
              احجز استشارة الآن
            </button>
            <p className="mt-3 flex items-center justify-center gap-1 text-xs text-emerald-400">
              <FiCheckCircle size={13} /> دفع آمن عبر نظام الضمان
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
};
export default LawyerProfile;

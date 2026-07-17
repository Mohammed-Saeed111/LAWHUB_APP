import { useNavigate } from 'react-router-dom';
import { FiHeart, FiMapPin, FiBriefcase } from 'react-icons/fi';
import Avatar from './Avatar.jsx';
import Rating from './Rating.jsx';
import VerifiedBadge from './VerifiedBadge.jsx';
import { useApp } from '../../context/AppContext.jsx';

/** Rich lawyer card used in search results, favorites, home. */
const LawyerCard = ({ lawyer }) => {
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite } = useApp();
  const fav = isFavorite(lawyer.id);

  return (
    <div className="card-luxury group relative flex flex-col p-5 transition hover:border-gold/40 hover:shadow-gold">
      {/* Favorite */}
      <button
        onClick={() => toggleFavorite(lawyer.id)}
        className={`absolute top-4 ltr:right-4 rtl:left-4 rounded-full p-2 transition ${
          fav ? 'bg-gold/15 text-gold' : 'text-ink-faint hover:text-gold hover:bg-white/5'
        }`}
        aria-label="favorite"
      >
        <FiHeart size={18} className={fav ? 'fill-gold' : ''} />
      </button>

      <div className="flex items-start gap-4">
        <Avatar seed={lawyer.avatarSeed} size={64} online={lawyer.online} />
        <div className="flex-1 pt-1">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-ink">{lawyer.name}</h3>
            {lawyer.verified && <VerifiedBadge />}
          </div>
          <p className="mt-0.5 text-sm text-ink-muted">{lawyer.title}</p>
          <div className="mt-2"><Rating value={lawyer.rating} count={lawyer.reviews} /></div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {lawyer.specialties.map((s) => <span key={s} className="chip">{s}</span>)}
      </div>

      <div className="mt-4 flex items-center gap-4 text-sm text-ink-muted">
        <span className="inline-flex items-center gap-1"><FiMapPin size={14} className="text-gold" /> {lawyer.city}</span>
        <span className="inline-flex items-center gap-1"><FiBriefcase size={14} className="text-gold" /> {lawyer.experience} سنة خبرة</span>
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-white/5 pt-4">
        <div>
          <span className="text-lg font-bold text-gold">{lawyer.hourlyRate}</span>
          <span className="text-xs text-ink-faint"> ج.م / ساعة</span>
        </div>
        <div className="flex gap-2">
          <button onClick={() => navigate(`/lawyer/${lawyer.id}`)} className="btn-ghost text-sm">الملف</button>
          <button onClick={() => navigate(`/booking/${lawyer.id}`)} className="btn-gold text-sm py-2">احجز استشارة</button>
        </div>
      </div>
    </div>
  );
};
export default LawyerCard;

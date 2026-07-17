import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiMapPin, FiX } from 'react-icons/fi';
import lawhubApi from '../api/lawhubApi.js';
import useApi from '../hooks/useApi.js';
import Avatar from '../components/ui/Avatar.jsx';
import Rating from '../components/ui/Rating.jsx';
import VerifiedBadge from '../components/ui/VerifiedBadge.jsx';
import Loader from '../components/ui/Loader.jsx';
import ErrorState from '../components/ui/ErrorState.jsx';

/**
 * SCREEN 2 — Interactive Map View.
 * A dark-mode stylized map with gold pins for lawyer offices. Clicking a pin
 * opens a side preview panel (photo, rating, specialty). Lawyers (with lat/lng)
 * are loaded from the API. (Static SVG map so the demo needs no external
 * tiles/keys; swap for Google/Mapbox in production.)
 */
const MapView = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(null);

  const { data: lawyers, loading, error, refetch } = useApi(
    async () => (await lawhubApi.getLawyers({ limit: 100 })).lawyers.filter((l) => l.lat && l.lng),
    []
  );

  // Project lat/lng into the SVG viewport (rough, for demo layout only).
  const project = (l) => ({
    x: ((l.lng - 29.8) / (31.6 - 29.8)) * 100,
    y: (1 - (l.lat - 30.0) / (31.3 - 30.0)) * 100,
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <span className="h-5 w-1 rounded-full bg-gold" />
        <h1 className="section-title">الخريطة التفاعلية</h1>
        {lawyers && <span className="chip ltr:ml-2 rtl:mr-2">{lawyers.length} مكتب قريب منك</span>}
      </div>

      {loading && <Loader label="جارٍ تحميل الخريطة…" />}
      {error && <ErrorState message={error} onRetry={refetch} />}

      {!loading && !error && lawyers && (
        <div className="relative overflow-hidden rounded-3xl border border-gold/15" style={{ height: '70vh' }}>
          {/* Stylized dark map */}
          <div className="absolute inset-0 bg-navy-900">
            <svg className="h-full w-full opacity-40" preserveAspectRatio="none">
              <defs>
                <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse">
                  <path d="M48 0H0V48" fill="none" stroke="#1c243b" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
              {/* faux roads */}
              <path d="M0 60% Q 40% 40% 100% 55%" stroke="#C9A24B22" strokeWidth="6" fill="none" />
              <path d="M30% 0 Q 45% 50% 35% 100%" stroke="#C9A24B22" strokeWidth="5" fill="none" />
              <path d="M0 30% L 100% 35%" stroke="#1c243b" strokeWidth="8" fill="none" />
            </svg>
          </div>

          {/* Gold pins */}
          {lawyers.map((l) => {
            const p = project(l);
            const active = selected?.id === l.id;
            return (
              <button key={l.id} onClick={() => setSelected(l)}
                className="absolute -translate-x-1/2 -translate-y-full transition"
                style={{ left: `${p.x}%`, top: `${p.y}%` }}>
                {active && <span className="absolute inset-0 -m-2 rounded-full bg-gold/40 animate-pulse-ring" />}
                <span className={`relative flex flex-col items-center ${active ? 'scale-110' : ''}`}>
                  <span className={`flex h-9 w-9 items-center justify-center rounded-full border-2 shadow-gold ${active ? 'bg-gold text-navy border-gold-light' : 'bg-navy-700 text-gold border-gold/60'}`}>
                    <FiMapPin size={18} />
                  </span>
                </span>
              </button>
            );
          })}

          {/* Side preview panel */}
          {selected && (
            <div className="absolute inset-y-0 ltr:right-0 rtl:left-0 w-full max-w-sm border-gold/15 bg-navy-800/95 p-5 backdrop-blur ltr:border-l rtl:border-r animate-fade-up">
              <button onClick={() => setSelected(null)} className="btn-ghost absolute top-3 ltr:left-3 rtl:right-3 p-2"><FiX size={18} /></button>
              <div className="mt-6 flex items-start gap-3">
                <Avatar seed={selected.avatarSeed} size={60} online={selected.online} />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-ink">{selected.name}</h3>
                    {selected.verified && <VerifiedBadge />}
                  </div>
                  <p className="text-sm text-ink-muted">{selected.title}</p>
                  <div className="mt-1"><Rating value={selected.rating} count={selected.reviews} /></div>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {selected.specialties.map((s) => <span key={s} className="chip">{s}</span>)}
              </div>
              <p className="mt-4 flex items-center gap-1 text-sm text-ink-muted">
                <FiMapPin size={14} className="text-gold" /> {selected.city} — {selected.area}
              </p>
              <div className="mt-6 flex gap-2">
                <button onClick={() => navigate(`/lawyer/${selected.id}`)} className="btn-outline flex-1 text-sm">الملف الكامل</button>
                <button onClick={() => navigate(`/booking/${selected.id}`)} className="btn-gold flex-1 text-sm">احجز استشارة</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
export default MapView;

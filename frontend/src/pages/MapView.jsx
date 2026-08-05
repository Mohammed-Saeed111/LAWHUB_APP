import { useEffect, useState } from 'react';
import { MapContainer, Marker, TileLayer } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import { useNavigate } from 'react-router-dom';
import { FiMapPin, FiX } from 'react-icons/fi';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import lawhubApi from '../api/lawhubApi.js';
import useApi from '../hooks/useApi.js';
import Avatar from '../components/ui/Avatar.jsx';
import Rating from '../components/ui/Rating.jsx';
import VerifiedBadge from '../components/ui/VerifiedBadge.jsx';
import Loader from '../components/ui/Loader.jsx';
import ErrorState from '../components/ui/ErrorState.jsx';

const DEFAULT_CENTER = [30.0444, 31.2357];

const createPinIcon = (lawyer, active) => {
  const style = active ? { bg: '#f5c96f', text: '#0f172a' } : { bg: '#0f172a', text: '#f5c96f' };
  return L.divIcon({
    html: `
      <div style="display:flex;align-items:center;justify-content:center;filter:drop-shadow(0 8px 18px rgba(0,0,0,0.35));">
        <div style="width:28px;height:28px;border-radius:999px;border:2px solid #f5c96f;background:${style.bg};color:${style.text};display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;box-shadow:0 0 0 4px ${active ? 'rgba(245,201,111,0.24)' : 'rgba(15,23,42,0.28)'};">${active ? '✓' : '⚖'}</div>
      </div>
    `,
    className: '',
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  });
};

const createClusterIcon = (cluster) => {
  const count = cluster.getChildCount();
  return L.divIcon({
    html: `<div style="background:#f5c96f;color:#0f172a;border:2px solid #0f172a;border-radius:999px;width:42px;height:42px;display:flex;align-items:center;justify-content:center;font-weight:700;box-shadow:0 8px 24px rgba(0,0,0,0.3);">${count}</div>`,
    className: '',
    iconSize: [42, 42],
    iconAnchor: [21, 21],
  });
};

const MapView = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(null);
  const [view, setView] = useState(DEFAULT_CENTER);
  const [zoom, setZoom] = useState(6);

  const { data: lawyers, loading, error, refetch } = useApi(
    async () => (await lawhubApi.getLawyers({ limit: 100 })).lawyers.filter((l) => l.lat && l.lng),
    []
  );

  useEffect(() => {
    if (!lawyers?.length) return;
    if (selected) {
      setView([selected.lat, selected.lng]);
      setZoom(10);
      return;
    }
    const first = lawyers[0];
    setView([first.lat, first.lng]);
    setZoom(8);
  }, [lawyers, selected]);

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
          <MapContainer center={view} zoom={zoom} scrollWheelZoom className="h-full w-full" style={{ height: '100%', width: '100%' }}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MarkerClusterGroup chunkedLoading iconCreateFunction={createClusterIcon}>
              {lawyers.map((l) => {
                const active = selected?.id === l.id;
                return (
                  <Marker
                    key={l.id}
                    position={[l.lat, l.lng]}
                    icon={createPinIcon(l, active)}
                    eventHandlers={{ click: () => setSelected(l) }}
                  />
                );
              })}
            </MarkerClusterGroup>
          </MapContainer>

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
                {(selected.specialties || []).map((s) => <span key={s} className="chip">{s}</span>)}
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

import { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiEdit3, FiType, FiShield, FiCheck, FiAlertTriangle } from 'react-icons/fi';
import useApi from '../../hooks/useApi.js';
import { dApi } from '../../api/phaseDApi.js';

const STYLES = ['كريم عبد الحليم', 'Kareem A.', 'ك. عبدالحليم'];

const Signature = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: tx, loading, error, refetch } = useApi(() => dApi.transaction(id), [id]);
  const [mode, setMode] = useState('draw');
  const [typed, setTyped] = useState(STYLES[0]);
  const [drawn, setDrawn] = useState(false);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');
  const canvasRef = useRef(null);
  const drawingRef = useRef(false);

  useEffect(() => {
    const c = canvasRef.current; if (!c) return;
    const ctx = c.getContext('2d');
    ctx.strokeStyle = '#121414'; ctx.lineWidth = 2.5; ctx.lineCap = 'round';
    const pos = (e) => { const r = c.getBoundingClientRect(); const t = e.touches?.[0]; return { x: (t ? t.clientX : e.clientX) - r.left, y: (t ? t.clientY : e.clientY) - r.top }; };
    const down = (e) => { drawingRef.current = true; const p = pos(e); ctx.beginPath(); ctx.moveTo(p.x, p.y); };
    const move = (e) => { if (!drawingRef.current) return; e.preventDefault(); const p = pos(e); ctx.lineTo(p.x, p.y); ctx.stroke(); setDrawn(true); };
    const up = () => { drawingRef.current = false; };
    c.addEventListener('mousedown', down); c.addEventListener('mousemove', move); window.addEventListener('mouseup', up);
    c.addEventListener('touchstart', down); c.addEventListener('touchmove', move, { passive: false }); window.addEventListener('touchend', up);
    return () => { c.removeEventListener('mousedown', down); c.removeEventListener('mousemove', move); window.removeEventListener('mouseup', up); c.removeEventListener('touchstart', down); c.removeEventListener('touchmove', move); window.removeEventListener('touchend', up); };
  }, [mode, tx]);

  if (loading) return (
    <div className="flex flex-col items-center justify-center gap-3 py-20 text-ink-muted">
      <span className="h-8 w-8 animate-spin rounded-full border-2 border-gold/30 border-t-gold" />
      <span className="text-sm">جارٍ تحميل المستند…</span>
    </div>
  );
  if (error) return (
    <div className="glass flex flex-col items-center gap-3 p-10 text-center">
      <FiAlertTriangle size={26} className="text-danger" />
      <p className="text-ink">{error}</p>
      <button onClick={refetch} className="btn-outline mt-2 text-sm">إعادة المحاولة</button>
    </div>
  );

  const clear = () => { const c = canvasRef.current; c.getContext('2d').clearRect(0, 0, c.width, c.height); setDrawn(false); };
  const confirm = async () => {
    if (mode === 'draw' && !drawn) { setErr('من فضلك ارسم توقيعك.'); return; }
    setSaving(true); setErr('');
    try {
      const value = mode === 'draw' ? canvasRef.current.toDataURL('image/png') : typed;
      const signed = await dApi.sign(tx.id, { type: mode, value });
      navigate(`/market/success/${signed.id}`);
    } catch (e) { setErr(e.message || 'تعذّر حفظ التوقيع.'); } finally { setSaving(false); }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="mb-6">
        <div className="flex items-center gap-2">
          <span className="h-6 w-1 rounded bg-gold" />
          <h1 className="text-xl font-bold text-ink">التوقيع الإلكتروني</h1>
        </div>
        <p className="mt-1 ml-3 text-sm text-ink-muted">{tx.templateTitle} · {tx.ref}</p>
      </div>
      <div className="flex items-center gap-2 rounded-full border border-ok/30 bg-ok/10 px-4 py-2 text-xs text-ok">
        <FiShield size={14} /> موثّق عبر البلوك تشين — يُنشأ ختم زمني غير قابل للتعديل عند التوقيع.
      </div>
      <section className="glass p-6">
        <div className="mb-4 flex gap-2">
          <button
            onClick={() => setMode('draw')}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg border p-3 text-sm ${mode === 'draw' ? 'border-gold bg-gold/10 text-gold' : 'border-white/10 text-ink-muted hover:border-gold/40'}`}
          >
            <FiEdit3 size={16} /> ارسم توقيعك
          </button>
          <button
            onClick={() => setMode('type')}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg border p-3 text-sm ${mode === 'type' ? 'border-gold bg-gold/10 text-gold' : 'border-white/10 text-ink-muted hover:border-gold/40'}`}
          >
            <FiType size={16} /> اختر نمطًا
          </button>
        </div>
        {mode === 'draw' ? (
          <div>
            <canvas ref={canvasRef} width={560} height={200} className="w-full cursor-crosshair rounded-lg border border-white/10 bg-white" />
            <button onClick={clear} className="btn-ghost mt-2 text-xs">مسح</button>
          </div>
        ) : (
          <div className="space-y-2">
            {STYLES.map((s) => (
              <button
                key={s}
                onClick={() => setTyped(s)}
                className={`flex w-full items-center justify-between rounded-lg border bg-white p-4 text-surface transition ${typed === s ? 'border-gold ring-2 ring-gold/40' : 'border-white/10'}`}
              >
                <span className="font-serif text-2xl" style={{ fontStyle: 'italic' }}>{s}</span>
                {typed === s && <FiCheck className="text-gold" />}
              </button>
            ))}
          </div>
        )}
        {err && <p className="mt-3 text-center text-sm text-danger">{err}</p>}
        <button onClick={confirm} disabled={saving} className="btn-gold mt-6 w-full py-3">
          {saving ? 'جارٍ التوقيع والتوثيق…' : 'توقيع وتوثيق على البلوك تشين'}
        </button>
      </section>
    </div>
  );
};

export default Signature;

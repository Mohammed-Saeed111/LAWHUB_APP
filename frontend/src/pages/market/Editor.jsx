import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiArrowRight, FiShoppingCart, FiAlertTriangle } from 'react-icons/fi';
import useApi from '../../hooks/useApi.js';
import { dApi } from '../../api/phaseDApi.js';

/** Replace {{placeholders}} with live values. */
const render = (body, data) =>
  body.replace(/\{\{(\w+)\}\}/g, (_, k) => data[k] ? `\u200E${data[k]}\u200E` : '……');

const Editor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: template, loading, error, refetch } = useApi(() => dApi.template(id), [id]);
  const [values, setValues] = useState({});
  const [buying, setBuying] = useState(false);
  const [err, setErr] = useState('');

  useEffect(() => {
    if (template) setValues(Object.fromEntries((template.fields || []).map((f) => [f.key, ''])));
  }, [template]);

  if (loading) return (
    <div className="flex flex-col items-center justify-center gap-3 py-20 text-ink-muted">
      <span className="h-8 w-8 animate-spin rounded-full border-2 border-gold/30 border-t-gold" />
      <span className="text-sm">جارٍ تحميل القالب…</span>
    </div>
  );
  if (error) return (
    <div className="glass flex flex-col items-center gap-3 p-10 text-center">
      <FiAlertTriangle size={26} className="text-danger" />
      <p className="text-ink">{error}</p>
      <button onClick={refetch} className="btn-outline mt-2 text-sm">إعادة المحاولة</button>
    </div>
  );

  const buy = async () => {
    setBuying(true); setErr('');
    try {
      const tx = await dApi.purchase({ templateId: template.id, filledData: values });
      navigate(`/market/sign/${tx.id}`);
    } catch (e) {
      setErr(e.message || 'تعذّر إتمام الشراء.');
    } finally {
      setBuying(false);
    }
  };

  return (
    <div className="space-y-6">
      <button onClick={() => navigate('/market')} className="btn-ghost text-sm">
        <span>←</span> رجوع للسوق
      </button>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-6 w-1 rounded bg-gold" />
            <h1 className="text-xl font-bold text-ink">{template.title}</h1>
          </div>
          <p className="mt-1 ml-3 text-sm text-ink-muted">{template.category} · {template.price} {template.currency}</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Fields Panel */}
        <section className="glass h-fit p-6">
          <h2 className="mb-4 font-bold text-ink">بيانات العقد</h2>
          <div className="space-y-4">
            {(template.fields || []).map((f) => (
              <div key={f.key}>
                <label className="mb-1.5 block text-sm text-ink-muted">{f.label}</label>
                <input
                  value={values[f.key] || ''}
                  onChange={(e) => setValues((v) => ({ ...v, [f.key]: e.target.value }))}
                  placeholder={f.placeholder || f.label}
                  className="input"
                />
              </div>
            ))}
          </div>
          {err && <p className="mt-4 text-center text-sm text-danger">{err}</p>}
          <button onClick={buy} disabled={buying} className="btn-gold mt-6 w-full py-3">
            <FiShoppingCart size={18} />
            {buying ? 'جارٍ المعالجة…' : `شراء وتوقيع · ${template.price} ${template.currency}`}
          </button>
        </section>

        {/* Live Preview */}
        <section className="glass p-6">
          <h2 className="mb-4 font-bold text-ink">معاينة حيّة</h2>
          <div className="rounded-lg border border-white/10 bg-white/95 p-6 text-surface shadow-inner" style={{ minHeight: 360 }}>
            <h3 className="mb-4 text-center font-serif text-lg font-bold">{template.title}</h3>
            <p className="whitespace-pre-wrap font-sans text-sm leading-8">{render(template.body || '', values)}</p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Editor;

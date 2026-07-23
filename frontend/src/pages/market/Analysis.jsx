import { useState } from 'react';
import { FiCpu, FiAlertTriangle } from 'react-icons/fi';
import ProcessingSphere from '../../components/ai/ProcessingSphere.jsx';
import RiskHeatmap, { RISK } from '../../components/ai/RiskHeatmap.jsx';
import HealthGauge from '../../components/ai/HealthGauge.jsx';
import { dApi } from '../../api/phaseDApi.js';

const SAMPLE = 'يحق للطرف الأول إنهاء العقد دون إشعار في أي وقت.\nيلتزم الطرف الثاني بالسرية التامة.\nيتجدد العقد تلقائيًا لمدة مماثلة.\nفي حال النزاع يكون الاختصاص لمحاكم القاهرة.\nيلتزم الطرفان بحسن النية في التنفيذ.';

const Analysis = () => {
  const [text, setText] = useState('');
  const [phase, setPhase] = useState('input');
  const [report, setReport] = useState(null);
  const [sel, setSel] = useState(null);
  const [err, setErr] = useState('');

  const run = async () => {
    if (text.trim().length < 20) { setErr('الصق نص العقد (20 حرفًا على الأقل).'); return; }
    setErr(''); setPhase('processing');
    try {
      const r = await dApi.analyze({ text, title: 'تحليل عقد' });
      await new Promise((res) => setTimeout(res, 1800));
      setReport(r); setSel(r.clauses[0]?.index ?? null); setPhase('result');
    } catch (e) { setErr(e.message); setPhase('input'); }
  };

  if (phase === 'processing') return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-8 bg-ai-spot text-center">
      <ProcessingSphere />
      <div>
        <h2 className="font-serif text-2xl font-bold text-gold">الذكاء القانوني يعمل…</h2>
        <p className="mt-2 text-sm text-ink-muted animate-pulse">جارٍ فحص البنود والامتثال للمخاطر…</p>
      </div>
    </div>
  );

  if (phase === 'result' && report) {
    const selClause = report.clauses.find((c) => c.index === sel);
    return (
      <div className="space-y-6">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-6 w-1 rounded bg-gold" />
              <h1 className="text-xl font-bold text-ink">تحليل العقد بالذكاء الاصطناعي</h1>
            </div>
            <p className="mt-1 ml-3 text-sm text-ink-muted">خريطة المخاطر بندًا بندًا مع اقتراحات التحسين</p>
          </div>
          <button onClick={() => { setPhase('input'); setReport(null); }} className="btn-outline text-sm">
            تحليل عقد آخر
          </button>
        </div>
        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <section className="glass p-6">
            <h2 className="mb-4 font-bold text-ink">البنود ({report.clauses.length})</h2>
            <RiskHeatmap clauses={report.clauses} selected={sel} onSelect={setSel} />
          </section>
          <aside className="space-y-4">
            <div className="glass-gold flex flex-col items-center p-6">
              <HealthGauge score={report.healthScore} />
              <div className="mt-4 grid w-full grid-cols-2 gap-2 text-center text-xs">
                {Object.entries(RISK).map(([k, v]) => (
                  <div key={k} className="rounded-lg border border-white/5 bg-white/5 p-2">
                    <span className={`font-sans text-lg font-bold ${v.text}`}>{report.summary[k] ?? 0}</span>
                    <p className="text-ink-muted">{v.label}</p>
                  </div>
                ))}
              </div>
            </div>
            {selClause && (
              <div className="glass p-5">
                <h3 className="mb-2 flex items-center gap-2 font-bold text-gold"><FiCpu size={16} /> توصية الذكاء الاصطناعي</h3>
                <p className="text-sm text-ink-muted">{selClause.note}</p>
                {selClause.suggestion && (
                  <div className="mt-3 rounded-lg border border-gold/20 bg-gold/5 p-3 text-sm text-ink">
                    <span className="text-gold">اقتراح: </span>{selClause.suggestion}
                  </div>
                )}
              </div>
            )}
          </aside>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <div className="flex items-center gap-2">
          <span className="h-6 w-1 rounded bg-gold" />
          <h1 className="text-xl font-bold text-ink">تحليل العقد بالذكاء الاصطناعي</h1>
        </div>
        <p className="mt-1 ml-3 text-sm text-ink-muted">الصق نص العقد لتحليل المخاطر تلقائيًا</p>
      </div>
      <section className="glass p-6">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={12}
          className="input resize-none font-sans leading-8"
          placeholder="الصق نص العقد هنا…"
        />
        {err && <p className="mt-3 text-center text-sm text-danger">{err}</p>}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <button onClick={() => setText(SAMPLE)} className="btn-ghost text-sm">تجربة بنص نموذجي</button>
          <button onClick={run} className="btn-gold"><FiCpu size={18} /> ابدأ التحليل</button>
        </div>
      </section>
    </div>
  );
};

export default Analysis;

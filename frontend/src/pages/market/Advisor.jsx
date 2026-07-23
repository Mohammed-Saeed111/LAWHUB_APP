import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiCompass, FiSend, FiStar } from 'react-icons/fi';
import ProcessingSphere from '../../components/ai/ProcessingSphere.jsx';
import { dApi } from '../../api/phaseDApi.js';

const avatarUrl = (seed) =>
  `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(seed || 'lawhub')}&backgroundColor=1B1F1F&textColor=C9A24B`;

const Advisor = () => {
  const [desc, setDesc] = useState('');
  const [phase, setPhase] = useState('input');
  const [advice, setAdvice] = useState(null);
  const [err, setErr] = useState('');

  const run = async () => {
    if (desc.trim().length < 10) { setErr('اكتب وصفًا لمشكلتك (10 أحرف على الأقل).'); return; }
    setErr(''); setPhase('processing');
    try {
      const a = await dApi.advise({ description: desc });
      await new Promise((r) => setTimeout(r, 1600));
      setAdvice(a); setPhase('result');
    } catch (e) { setErr(e.message); setPhase('input'); }
  };

  if (phase === 'processing') return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-8 bg-ai-spot text-center">
      <ProcessingSphere />
      <div>
        <h2 className="font-serif text-2xl font-bold text-gold">جارٍ تحليل حالتك…</h2>
        <p className="mt-2 text-sm text-ink-muted animate-pulse">نصنّف مشكلتك ونرشّح المحامي المناسب…</p>
      </div>
    </div>
  );

  return (
    <div className="mx-auto max-w-2xl space-y-8 py-6">
      <div className="text-center">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gold/10 text-gold shadow-gold">
          <FiCompass size={30} />
        </span>
        <h1 className="mt-4 font-serif text-3xl font-bold text-ink">مستشارك الذكي</h1>
        <p className="mt-2 text-ink-muted">اوصف مشكلتك القانونية بكلماتك، وسنوجّهك للتخصص والمحامي المناسب.</p>
      </div>

      <section className="glass p-2 shadow-ai-glow">
        <textarea
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          rows={5}
          className="w-full resize-none rounded-xl bg-transparent px-4 py-3 text-lg leading-8 text-ink placeholder:text-ink-faint outline-none"
          placeholder="مثال: صاحب العمل فصلني بدون إنذار ورفض صرف مستحقاتي…"
        />
        <div className="flex items-center justify-between px-2 pb-2">
          {err ? <span className="text-sm text-danger">{err}</span> : <span />}
          <button onClick={run} className="btn-gold"><FiSend size={16} /> حلّل حالتي</button>
        </div>
      </section>

      {phase === 'result' && advice && (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div className="glass-gold p-6 text-center">
            <p className="text-sm text-ink-muted">التصنيف المتوقّع</p>
            <p className="mt-1 font-serif text-3xl font-bold text-gold">{advice.category}</p>
            <div className="mt-3 flex items-center justify-center gap-4 text-xs text-ink-muted">
              <span>الثقة: <span className="text-gold font-bold">{advice.confidence}%</span></span>
              <span>الأولوية: <span className="text-gold font-bold">{advice.urgency}</span></span>
            </div>
          </div>
          <div className="glass p-5">
            <h3 className="mb-3 font-bold text-ink">محامون موصى بهم</h3>
            <div className="space-y-3">
              {advice.recommendedLawyers.map((l) => (
                <div key={l.name} className="flex items-center gap-3 rounded-lg border border-white/5 bg-white/5 p-3">
                  <img src={avatarUrl(l.seed)} alt="" width={44} height={44} className="rounded-lg border border-gold/20" />
                  <div className="flex-1">
                    <p className="font-semibold text-ink">{l.name}</p>
                    <p className="text-xs text-ink-muted">{l.specialty}</p>
                  </div>
                  <span className="inline-flex items-center gap-1 text-sm text-gold">
                    <FiStar size={14} className="fill-gold" /> {l.rating}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <button onClick={() => { setPhase('input'); setAdvice(null); setDesc(''); }} className="btn-ghost w-full text-sm">
            تحليل حالة أخرى
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default Advisor;

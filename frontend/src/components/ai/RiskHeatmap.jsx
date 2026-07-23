const RISK = {
  critical: { label: 'حرج', ring: 'border-risk-critical/60 bg-risk-critical/10', dot: 'bg-risk-critical', text: 'text-risk-critical' },
  warning: { label: 'تحذير', ring: 'border-risk-warning/60 bg-risk-warning/10', dot: 'bg-risk-warning', text: 'text-risk-warning' },
  suggested: { label: 'مقترح', ring: 'border-risk-suggested/60 bg-risk-suggested/10', dot: 'bg-risk-suggested', text: 'text-risk-suggested' },
  safe: { label: 'آمن', ring: 'border-white/10 bg-white/5', dot: 'bg-risk-safe', text: 'text-risk-safe' },
};
/** Clause-by-clause risk highlighting. Click a clause to select it. */
const RiskHeatmap = ({ clauses = [], selected, onSelect }) => (
  <div className="space-y-2">
    {clauses.map((c) => { const r = RISK[c.risk] || RISK.safe; const on = selected === c.index; return (
      <button key={c.index} onClick={() => onSelect?.(c.index)} className={`flex w-full items-start gap-3 rounded-lg border p-3 text-start transition ${r.ring} ${on ? 'ring-2 ring-gold/50' : ''}`}>
        <span className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${r.dot}`} />
        <span className="flex-1 text-sm leading-relaxed text-ink">{c.text}</span>
        <span className={`shrink-0 text-[11px] font-semibold ${r.text}`}>{r.label}</span>
      </button>
    ); })}
  </div>
);
export { RISK };
export default RiskHeatmap;

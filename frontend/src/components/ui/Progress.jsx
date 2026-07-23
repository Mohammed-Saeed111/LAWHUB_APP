const Progress = ({ value = 0 }) => (<div className="flex items-center gap-2"><div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-gold" style={{ width: `${value}%` }} /></div><span className="font-sans text-xs text-ink-muted">{value}%</span></div>);
export default Progress;

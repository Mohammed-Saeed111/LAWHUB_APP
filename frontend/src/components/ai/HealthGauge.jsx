/** Circular "Health Score" gauge (0-100). */
const HealthGauge = ({ score = 0, size = 132 }) => {
  const r = 15.5; const dash = (score / 100) * 97;
  const color = score >= 75 ? '#3FB984' : score >= 50 ? '#E0A93B' : '#E05B5B';
  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg className="-rotate-90" viewBox="0 0 36 36" width={size} height={size}><circle cx="18" cy="18" r={r} fill="none" stroke="#232727" strokeWidth="3" /><circle cx="18" cy="18" r={r} fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeDasharray={`${dash} 97`} /></svg>
      <div className="absolute text-center"><p className="font-sans text-3xl font-bold text-ink">{score}</p><p className="text-[10px] text-ink-muted">درجة السلامة</p></div>
    </div>
  );
};
export default HealthGauge;

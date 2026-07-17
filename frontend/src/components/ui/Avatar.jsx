import { avatarUrl } from '../../lib/ui.js';

/** Circular avatar with an optional online dot. */
const Avatar = ({ seed, size = 48, online }) => (
  <div className="relative shrink-0" style={{ width: size, height: size }}>
    <img src={avatarUrl(seed)} alt="" width={size} height={size}
      className="rounded-2xl border border-gold/20 bg-navy-700 object-cover" />
    {online !== undefined && (
      <span className={`absolute -bottom-0.5 ltr:-right-0.5 rtl:-left-0.5 h-3 w-3 rounded-full border-2 border-navy-800 ${online ? 'bg-emerald-400' : 'bg-ink-faint'}`} />
    )}
  </div>
);
export default Avatar;

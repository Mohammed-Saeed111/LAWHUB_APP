import { FiStar } from 'react-icons/fi';
/** Gold star rating with numeric value. */
const Rating = ({ value = 0, count, size = 15, showValue = true }) => (
  <span className="inline-flex items-center gap-1">
    <span className="inline-flex" dir="ltr">
      {[1, 2, 3, 4, 5].map((i) => (
        <FiStar key={i} size={size}
          className={i <= Math.round(value) ? 'fill-gold text-gold' : 'text-ink-faint'} />
      ))}
    </span>
    {showValue && <span className="text-sm font-semibold text-gold">{value.toFixed(1)}</span>}
    {count != null && <span className="text-xs text-ink-faint">({count})</span>}
  </span>
);
export default Rating;

/**
 * Minimal gold ring spinner.
 */
const Spinner = ({ size = 20, className = '' }) => (
  <span
    className={`inline-block animate-spin rounded-full border-2 border-navy/30 border-t-navy ${className}`}
    style={{ width: size, height: size }}
    role="status"
    aria-label="loading"
  />
);

export default Spinner;

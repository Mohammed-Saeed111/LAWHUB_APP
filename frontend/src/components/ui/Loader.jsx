/** Gold spinner + optional label for async screens. */
const Loader = ({ label = 'جارٍ التحميل…' }) => (
  <div className="flex flex-col items-center justify-center gap-3 py-20 text-ink-muted">
    <span className="h-8 w-8 animate-spin rounded-full border-2 border-gold/30 border-t-gold" />
    <span className="text-sm">{label}</span>
  </div>
);
export default Loader;

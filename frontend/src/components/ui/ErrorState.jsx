import { FiAlertTriangle } from 'react-icons/fi';

/** Friendly error panel with a retry button. */
const ErrorState = ({ message = 'تعذّر تحميل البيانات.', onRetry }) => (
  <div className="card-luxury flex flex-col items-center gap-3 p-10 text-center">
    <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10 text-red-400">
      <FiAlertTriangle size={26} />
    </span>
    <p className="text-ink">{message}</p>
    {onRetry && <button onClick={onRetry} className="btn-outline mt-2 text-sm">إعادة المحاولة</button>}
    <p className="text-xs text-ink-faint">تأكد أن الخادم يعمل على المنفذ 5000 وأن قاعدة البيانات مُهيّأة (npm run seed).</p>
  </div>
);
export default ErrorState;

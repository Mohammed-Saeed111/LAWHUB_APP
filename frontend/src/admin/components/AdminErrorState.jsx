import { FiAlertTriangle } from 'react-icons/fi';

const AdminErrorState = ({ message = 'تعذّر تحميل البيانات.', onRetry }) => (
  <div className="admin-glass flex flex-col items-center gap-3 p-10 text-center">
    <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10 text-red-400">
      <FiAlertTriangle size={26} />
    </span>
    <p className="text-admin-ink">{message}</p>
    {onRetry && (
      <button onClick={onRetry} className="admin-btn-outline mt-2 text-sm">
        إعادة المحاولة
      </button>
    )}
    <p className="text-xs text-admin-ink-faint">
      تأكد أن الخادم يعمل وأن قاعدة البيانات مُهيّأة.
    </p>
  </div>
);

export default AdminErrorState;

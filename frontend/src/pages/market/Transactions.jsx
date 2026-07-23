import { useNavigate } from 'react-router-dom';
import { FiFileText, FiChevronLeft } from 'react-icons/fi';
import useApi from '../../hooks/useApi.js';
import { dApi } from '../../api/phaseDApi.js';

const STATUS = {
  paid:    { l: 'مدفوع',         c: 'text-warn' },
  signed:  { l: 'موقّع',          c: 'text-ok' },
  pending: { l: 'قيد الانتظار',  c: 'text-ink-muted' },
  refunded:{ l: 'مُسترد',         c: 'text-danger' },
};

const Transactions = () => {
  const navigate = useNavigate();
  const { data, loading, error, refetch } = useApi(() => dApi.myTransactions(), []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2">
          <span className="h-6 w-1 rounded bg-gold" />
          <h1 className="text-xl font-bold text-ink">معاملاتي</h1>
        </div>
        <p className="mt-1 ml-3 text-sm text-ink-muted">سجلّ عقودك ومشترياتك الموقّعة</p>
      </div>

      {loading && (
        <div className="flex flex-col items-center justify-center gap-3 py-20 text-ink-muted">
          <span className="h-8 w-8 animate-spin rounded-full border-2 border-gold/30 border-t-gold" />
          <span className="text-sm">جارٍ التحميل…</span>
        </div>
      )}

      {error && (
        <div className="glass flex flex-col items-center gap-3 p-10 text-center">
          <p className="text-ink">{error}</p>
          <button onClick={refetch} className="btn-outline mt-2 text-sm">إعادة المحاولة</button>
        </div>
      )}

      {!loading && !error && (
        data?.length ? (
          <div className="space-y-3">
            {data.map((t) => {
              const s = STATUS[t.status] || STATUS.pending;
              return (
                <button
                  key={t.id}
                  onClick={() => navigate(`/market/success/${t.id}`)}
                  className="glass flex w-full items-center gap-4 p-4 text-start transition hover:border-gold/30"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-gold/10 text-gold">
                    <FiFileText size={20} />
                  </span>
                  <div className="flex-1">
                    <p className="font-semibold text-ink">{t.templateTitle}</p>
                    <p className="font-sans text-xs text-ink-faint" dir="ltr">{t.ref}</p>
                  </div>
                  <span className={`text-xs font-semibold ${s.c}`}>{s.l}</span>
                  <span className="font-sans text-sm text-gold">{t.amount} {t.currency}</span>
                  <FiChevronLeft className="text-ink-faint" />
                </button>
              );
            })}
          </div>
        ) : (
          <div className="glass p-12 text-center text-ink-muted">
            لا توجد معاملات بعد.{' '}
            <button onClick={() => navigate('/market')} className="text-gold">
              تصفّح سوق العقود
            </button>
          </div>
        )
      )}
    </div>
  );
};

export default Transactions;

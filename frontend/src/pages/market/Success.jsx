import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiCheck, FiDownload, FiFolder, FiShield } from 'react-icons/fi';
import useApi from '../../hooks/useApi.js';
import { dApi } from '../../api/phaseDApi.js';

const Success = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: tx, loading, error, refetch } = useApi(() => dApi.transaction(id), [id]);

  if (loading) return (
    <div className="flex flex-col items-center justify-center gap-3 py-20 text-ink-muted">
      <span className="h-8 w-8 animate-spin rounded-full border-2 border-gold/30 border-t-gold" />
      <span className="text-sm">جارٍ تجهيز الإيصال…</span>
    </div>
  );

  if (error) return (
    <div className="glass flex flex-col items-center gap-3 p-10 text-center">
      <p className="text-ink">{error}</p>
      <button onClick={refetch} className="btn-outline mt-2 text-sm">إعادة المحاولة</button>
    </div>
  );

  const sig = tx?.signature || {};

  return (
    <div className="mx-auto max-w-lg py-8">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="glass p-8 text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 14 }}
          className="mx-auto flex h-24 w-24 items-center justify-center rounded-full border-2 border-gold bg-gold/10 shadow-ai-glow"
        >
          <FiCheck size={48} className="text-gold" />
        </motion.div>

        <h2 className="mt-6 font-serif text-2xl font-bold text-ink">تمّت العملية بنجاح 🎉</h2>
        <p className="mt-2 text-ink-muted">تم شراء وتوقيع «{tx?.templateTitle}» بنجاح.</p>

        <div className="mt-6 space-y-2 rounded-xl border border-white/10 bg-white/5 p-4 text-start text-sm">
          <div className="flex justify-between">
            <span className="text-ink-muted">رقم المعاملة</span>
            <span className="font-sans text-ink" dir="ltr">{tx?.ref}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-ink-muted">المبلغ</span>
            <span className="font-sans text-gold">{tx?.amount} {tx?.currency}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-ink-muted">الحالة</span>
            <span className="text-ok">موقّع ✓</span>
          </div>
          {sig.blockchainTx && (
            <div className="flex items-center justify-between">
              <span className="text-ink-muted">توثيق البلوك تشين</span>
              <span className="font-sans text-[11px] text-gold" dir="ltr">{sig.blockchainTx.slice(0, 18)}…</span>
            </div>
          )}
        </div>

        <div className="mt-4 flex items-center justify-center gap-1 text-xs text-ok">
          <FiShield size={13} /> ختم زمني غير قابل للتعديل
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button onClick={() => window.print()} className="btn-outline flex-1">
            <FiDownload size={16} /> تحميل PDF
          </button>
          <button onClick={() => navigate('/market/transactions')} className="btn-gold flex-1">
            <FiFolder size={16} /> معاملاتي
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Success;

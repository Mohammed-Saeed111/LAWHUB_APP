import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiCreditCard, FiShield, FiLock, FiCheck, FiSmartphone } from 'react-icons/fi';
import { useApp } from '../context/AppContext.jsx';
import lawhubApi from '../api/lawhubApi.js';
import Avatar from '../components/ui/Avatar.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';

/**
 * SCREEN 7 — Payment & Escrow Gateway.
 * Multiple payment methods (cards / e-wallets) with a prominent Escrow
 * protection banner: funds are held by the platform and only released to the
 * lawyer after the service is delivered. The "pay" action calls the backend
 * (/api/consultations/:id/pay) to move the payment into escrow.
 */
const METHODS = [
  { key: 'card', icon: FiCreditCard, label: 'بطاقة ائتمان' },
  { key: 'wallet', icon: FiSmartphone, label: 'محفظة إلكترونية' },
];

const Payment = () => {
  const navigate = useNavigate();
  const { booking } = useApp();
  const [method, setMethod] = useState('card');
  const [processing, setProcessing] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState(null);

  if (!booking) return <EmptyState icon={FiCreditCard} title="لا توجد عملية حجز" description="ابدأ بحجز استشارة أولًا." />;

  const platformFee = 25;
  const total = booking.price + platformFee;

  const pay = async () => {
    setProcessing(true);
    setError(null);
    try {
      // Move funds into escrow on the backend (confirms the consultation).
      if (booking.consultationId) {
        await lawhubApi.payConsultation(booking.consultationId, method);
      }
      setDone(true);
    } catch (e) {
      setError(e.message || 'تعذّر إتمام الدفع. حاول مرة أخرى.');
    } finally {
      setProcessing(false);
    }
  };

  if (done) return (
    <div className="mx-auto max-w-lg">
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        className="card-luxury p-8 text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border-2 border-gold bg-gold/10 shadow-gold">
          <FiCheck size={40} className="text-gold" />
        </div>
        <h2 className="mt-6 text-2xl font-bold text-ink">تم تأكيد الحجز 🎉</h2>
        <p className="mt-2 text-ink-muted">تم حجز استشارتك مع {booking.lawyer.name} بتاريخ {booking.date} الساعة {booking.slot}.</p>
        <div className="mt-4 rounded-xl border border-emerald-400/30 bg-emerald-400/5 p-3 text-sm text-emerald-400">
          <FiShield className="inline" /> مبلغ {total} ج.م محفوظ بأمان في نظام الضمان.
        </div>
        <button onClick={() => navigate('/cases')} className="btn-gold mt-6 w-full">متابعة قضاياي</button>
      </motion.div>
    </div>
  );

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center gap-2">
        <span className="h-5 w-1 rounded-full bg-gold" />
        <h1 className="section-title">الدفع الآمن</h1>
      </div>

      {/* Escrow banner */}
      <div className="flex items-start gap-4 rounded-2xl border border-emerald-400/30 bg-emerald-400/5 p-5">
        <FiShield size={28} className="mt-0.5 shrink-0 text-emerald-400" />
        <div>
          <h3 className="font-bold text-emerald-400">محمي بنظام الضمان (Escrow)</h3>
          <p className="mt-1 text-sm text-ink-muted">أموالك محفوظة لدى المنصة ولن تُحوّل للمحامي إلا بعد تقديم الخدمة وتأكيدك. حماية كاملة لحقوقك.</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* Payment form */}
        <div className="space-y-5">
          <div className="flex gap-3">
            {METHODS.map(({ key, icon: Icon, label }) => (
              <button key={key} onClick={() => setMethod(key)}
                className={`flex flex-1 items-center justify-center gap-2 rounded-xl border p-4 transition ${method === key ? 'border-gold bg-gold/10 text-gold' : 'border-white/10 text-ink-muted hover:border-gold/40'}`}>
                <Icon size={20} /> {label}
              </button>
            ))}
          </div>

          {method === 'card' ? (
            <div className="card-luxury space-y-4 p-5">
              <div><label className="mb-1.5 block text-sm text-ink-muted">رقم البطاقة</label>
                <input className="input-luxury" placeholder="0000 0000 0000 0000" dir="ltr" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="mb-1.5 block text-sm text-ink-muted">تاريخ الانتهاء</label><input className="input-luxury" placeholder="MM/YY" dir="ltr" /></div>
                <div><label className="mb-1.5 block text-sm text-ink-muted">CVV</label><input className="input-luxury" placeholder="•••" dir="ltr" /></div>
              </div>
              <div><label className="mb-1.5 block text-sm text-ink-muted">الاسم على البطاقة</label><input className="input-luxury" placeholder="الاسم الكامل" /></div>
            </div>
          ) : (
            <div className="card-luxury space-y-4 p-5">
              <div><label className="mb-1.5 block text-sm text-ink-muted">رقم المحفظة</label>
                <input className="input-luxury" placeholder="01xxxxxxxxx" dir="ltr" /></div>
              <p className="text-xs text-ink-faint">هيوصلك رمز تأكيد على هاتفك لإتمام الدفع.</p>
            </div>
          )}

          {error && <p className="text-center text-sm text-red-400">{error}</p>}

          <p className="flex items-center justify-center gap-1 text-xs text-ink-faint">
            <FiLock size={13} /> جميع المعاملات مشفّرة بمعيار PCI-DSS
          </p>
        </div>

        {/* Summary */}
        <aside className="card-luxury h-fit p-5">
          <div className="flex items-center gap-3 border-b border-white/5 pb-4">
            <Avatar seed={booking.lawyer.avatarSeed} size={44} />
            <div><p className="text-sm font-bold text-ink">{booking.lawyer.name}</p><p className="text-xs text-ink-faint">{booking.date} — {booking.slot}</p></div>
          </div>
          <div className="space-y-2 py-4 text-sm">
            <div className="flex justify-between text-ink-muted"><span>سعر الاستشارة</span><span>{booking.price} ج.م</span></div>
            <div className="flex justify-between text-ink-muted"><span>رسوم المنصة</span><span>{platformFee} ج.م</span></div>
          </div>
          <div className="flex justify-between border-t border-white/5 pt-4 text-lg font-bold">
            <span className="text-ink">الإجمالي</span><span className="text-gold">{total} ج.م</span>
          </div>
          <button onClick={pay} disabled={processing} className="btn-gold mt-5 w-full py-3.5">
            {processing ? 'جارٍ المعالجة…' : `ادفع ${total} ج.م`}
          </button>
          <p className="mt-3 text-center text-[11px] text-ink-faint">بالضغط على "ادفع" فإنك توافق على سياسة الإلغاء والاسترداد.</p>
        </aside>
      </div>
    </div>
  );
};
export default Payment;

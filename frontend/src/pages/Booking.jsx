import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiCalendar, FiClock, FiVideo, FiPhone, FiMessageSquare, FiMapPin,
  FiFileText, FiUploadCloud, FiFile, FiX, FiCheck, FiChevronLeft, FiChevronRight,
} from 'react-icons/fi';
import lawhubApi from '../api/lawhubApi.js';
import useApi from '../hooks/useApi.js';
import Avatar from '../components/ui/Avatar.jsx';
import Loader from '../components/ui/Loader.jsx';
import ErrorState from '../components/ui/ErrorState.jsx';
import { useApp } from '../context/AppContext.jsx';

/**
 * SCREEN 6 — Booking Process (multi-step flow).
 * Step 1: pick date & time (interactive calendar) + consultation type.
 * Step 2: brief case description.
 * Step 3: upload required documents (with preview) → creates the consultation
 * on the backend, then proceeds to payment.
 */
const TYPES = [
  { key: 'video', icon: FiVideo, label: 'مكالمة فيديو' },
  { key: 'phone', icon: FiPhone, label: 'مكالمة هاتفية' },
  { key: 'chat', icon: FiMessageSquare, label: 'محادثة نصية' },
  { key: 'in_person', icon: FiMapPin, label: 'حضور بالمكتب' },
];
const SLOTS = ['10:00', '11:30', '13:00', '15:30', '17:00', '19:00'];
const STEPS = ['الموعد', 'تفاصيل القضية', 'المستندات'];

/** Build the next 14 days for the mini calendar. */
const buildDays = () => Array.from({ length: 14 }, (_, i) => {
  const d = new Date(); d.setDate(d.getDate() + i);
  return { iso: d.toISOString().slice(0, 10),
    day: d.toLocaleDateString('ar-EG', { weekday: 'short' }),
    num: d.getDate(),
    month: d.toLocaleDateString('ar-EG', { month: 'short' }) };
});

const Booking = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { setBooking } = useApp();
  const days = buildDays();

  const { data: lawyer, loading, error, refetch } = useApi(() => lawhubApi.getLawyer(id), [id]);

  const [step, setStep] = useState(0);
  const [type, setType] = useState('video');
  const [date, setDate] = useState(days[0].iso);
  const [slot, setSlot] = useState('');
  const [subject, setSubject] = useState('');
  const [notes, setNotes] = useState('');
  const [files, setFiles] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const addFiles = (list) => {
    const arr = Array.from(list).map((f) => ({ name: f.name, sizeKb: Math.round(f.size / 1024) }));
    setFiles((prev) => [...prev, ...arr]);
  };

  const canNext = step === 0 ? slot : step === 1 ? subject.trim().length > 5 : true;

  const next = async () => {
    if (step < 2) return setStep((s) => s + 1);
    // finalize → create the consultation on the backend, then go to payment.
    setSubmitting(true);
    setSubmitError(null);
    try {
      const scheduledAt = new Date(`${date}T${slot || '10:00'}:00`).toISOString();
      const consultation = await lawhubApi.createConsultation({
        lawyerId: lawyer.id, type, scheduledAt, slot,
        subject: `${subject}${notes ? ` — ${notes}` : ''}`,
        documents: files,
      });
      // Hand the created consultation to the payment screen (Screen 7).
      setBooking({
        consultationId: consultation.id,
        lawyer, type, date, slot, subject, notes, files,
        price: Math.round(lawyer.hourlyRate / 2),
      });
      navigate('/payment');
    } catch (e) {
      setSubmitError(e.message || 'تعذّر إنشاء الحجز. حاول مرة أخرى.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loader label="جارٍ تحميل بيانات المحامي…" />;
  if (error) return <ErrorState message={error} onRetry={refetch} />;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* Lawyer header */}
      <div className="card-luxury flex items-center gap-3 p-4">
        <Avatar seed={lawyer.avatarSeed} size={52} online={lawyer.online} />
        <div className="flex-1">
          <p className="font-bold text-ink">{lawyer.name}</p>
          <p className="text-sm text-ink-muted">{lawyer.title}</p>
        </div>
        <span className="text-gold font-bold">{Math.round(lawyer.hourlyRate / 2)} <span className="text-xs text-ink-faint">ج.م</span></span>
      </div>

      {/* Stepper */}
      <div className="flex items-center justify-between">
        {STEPS.map((label, i) => (
          <div key={label} className="flex flex-1 items-center">
            <div className="flex flex-col items-center gap-1">
              <span className={`flex h-9 w-9 items-center justify-center rounded-full border-2 text-sm font-bold transition ${
                i < step ? 'border-gold bg-gold text-navy' : i === step ? 'border-gold text-gold' : 'border-white/15 text-ink-faint'
              }`}>{i < step ? <FiCheck /> : i + 1}</span>
              <span className={`text-xs ${i <= step ? 'text-gold' : 'text-ink-faint'}`}>{label}</span>
            </div>
            {i < STEPS.length - 1 && <span className={`mx-2 h-0.5 flex-1 ${i < step ? 'bg-gold' : 'bg-white/10'}`} />}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={step} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.25 }} className="card-luxury p-6">
          {/* STEP 1 */}
          {step === 0 && (
            <div className="space-y-6">
              <div>
                <h3 className="mb-3 flex items-center gap-2 font-bold text-ink"><FiVideo className="text-gold" /> نوع الاستشارة</h3>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {TYPES.map(({ key, icon: Icon, label }) => (
                    <button key={key} onClick={() => setType(key)}
                      className={`flex flex-col items-center gap-2 rounded-xl border p-3 transition ${type === key ? 'border-gold bg-gold/10 text-gold' : 'border-white/10 text-ink-muted hover:border-gold/40'}`}>
                      <Icon size={22} /><span className="text-xs">{label}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="mb-3 flex items-center gap-2 font-bold text-ink"><FiCalendar className="text-gold" /> اختر التاريخ</h3>
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {days.map((d) => (
                    <button key={d.iso} onClick={() => setDate(d.iso)}
                      className={`flex shrink-0 flex-col items-center rounded-xl border px-3 py-2 transition ${date === d.iso ? 'border-gold bg-gold/10 text-gold' : 'border-white/10 text-ink-muted hover:border-gold/40'}`}>
                      <span className="text-[10px]">{d.day}</span>
                      <span className="text-lg font-bold">{d.num}</span>
                      <span className="text-[10px]">{d.month}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="mb-3 flex items-center gap-2 font-bold text-ink"><FiClock className="text-gold" /> اختر الوقت</h3>
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
                  {SLOTS.map((s) => (
                    <button key={s} onClick={() => setSlot(s)} dir="ltr"
                      className={`rounded-xl border py-2 text-sm transition ${slot === s ? 'border-gold bg-gold/10 text-gold' : 'border-white/10 text-ink-muted hover:border-gold/40'}`}>{s}</button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2 */}
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="flex items-center gap-2 font-bold text-ink"><FiFileText className="text-gold" /> صف قضيتك باختصار</h3>
              <input value={subject} onChange={(e) => setSubject(e.target.value)} className="input-luxury"
                placeholder="عنوان موجز (مثال: نزاع عقد إيجار محل تجاري)" />
              <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={6} className="input-luxury resize-none"
                placeholder="اكتب تفاصيل إضافية تساعد المحامي على الاستعداد لاستشارتك…" />
              <p className="text-xs text-ink-faint">💡 كلما كانت التفاصيل أوضح، كانت الاستشارة أكثر فائدة.</p>
            </div>
          )}

          {/* STEP 3 */}
          {step === 2 && (
            <div className="space-y-4">
              <h3 className="flex items-center gap-2 font-bold text-ink"><FiUploadCloud className="text-gold" /> ارفع المستندات (اختياري)</h3>
              <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gold/30 bg-navy-800 p-8 text-center transition hover:border-gold/60">
                <FiUploadCloud size={36} className="text-gold" />
                <p className="mt-3 text-ink">اسحب الملفات هنا أو اضغط للاختيار</p>
                <p className="mt-1 text-xs text-ink-faint">PDF · JPG · PNG — حتى 10MB</p>
                <input type="file" multiple className="hidden" onChange={(e) => addFiles(e.target.files)} />
              </label>
              {files.length > 0 && (
                <div className="space-y-2">
                  {files.map((f, i) => (
                    <div key={i} className="flex items-center gap-3 rounded-xl border border-gold/20 bg-navy-800 p-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-navy-600 text-gold"><FiFile size={20} /></span>
                      <div className="flex-1 overflow-hidden"><p className="truncate text-sm text-ink">{f.name}</p><p className="text-xs text-ink-faint">{f.sizeKb} KB</p></div>
                      <button onClick={() => setFiles((p) => p.filter((_, x) => x !== i))} className="text-ink-faint hover:text-red-400"><FiX size={18} /></button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {submitError && <p className="text-center text-sm text-red-400">{submitError}</p>}

      {/* Nav */}
      <div className="flex items-center justify-between">
        <button onClick={() => (step === 0 ? navigate(-1) : setStep((s) => s - 1))} className="btn-ghost" disabled={submitting}>
          <FiChevronRight className="rtl:hidden" /><FiChevronLeft className="ltr:hidden" /> {step === 0 ? 'إلغاء' : 'السابق'}
        </button>
        <button onClick={next} disabled={!canNext || submitting} className="btn-gold">
          {submitting ? 'جارٍ الحفظ…' : step === 2 ? 'المتابعة للدفع' : 'التالي'}
          {!submitting && <><FiChevronLeft className="rtl:hidden" /><FiChevronRight className="ltr:hidden" /></>}
        </button>
      </div>
    </div>
  );
};
export default Booking;

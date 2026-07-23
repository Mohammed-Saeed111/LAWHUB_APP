import { useState } from 'react';
import { FiSearch, FiChevronDown, FiLifeBuoy, FiSend } from 'react-icons/fi';
import PageHeader from '../../components/ui/PageHeader.jsx';
import Loader from '../../components/ui/Loader.jsx';
import ErrorState from '../../components/ui/ErrorState.jsx';
import { eApi } from '../../api/phaseEApi.js';
import useApi from '../../hooks/useApi.js';

const HelpCenter = () => {
  const { data: faqs, loading, error, refetch } = useApi(() => eApi.faqs(), []);
  const [q, setQ] = useState('');
  const [open, setOpen] = useState(null);
  const [form, setForm] = useState({ subject: '', category: 'الحساب', message: '' });
  const [sent, setSent] = useState(null);
  const [sending, setSending] = useState(false);
  const [err, setErr] = useState('');

  if (loading) return <Loader label="جارٍ تحميل مركز المساعدة…" />;
  if (error) return <ErrorState message={error} onRetry={refetch} />;

  const filtered = faqs.filter((f) => !q || f.question.includes(q) || f.answer.includes(q));

  const submit = async (e) => {
    e.preventDefault();
    if (!form.subject || !form.message) { setErr('الموضوع والرسالة مطلوبان.'); return; }
    setErr(''); setSending(true);
    try {
      const t = await eApi.createTicket(form);
      setSent(t.ref);
      setForm({ subject: '', category: 'الحساب', message: '' });
    } catch (e2) { setErr(e2.message); }
    finally { setSending(false); }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="مركز المساعدة والدعم" subtitle="أسئلة شائعة وتذاكر دعم فني" />

      {/* Search Hero */}
      <section className="glass-gold p-8 text-center">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gold/15 text-gold">
          <FiLifeBuoy size={28} />
        </span>
        <h2 className="mt-4 font-serif text-2xl font-bold text-ink">كيف يمكننا مساعدتك؟</h2>
        <div className="relative mx-auto mt-5 max-w-lg">
          <FiSearch className="absolute ltr:left-3 rtl:right-3 top-1/2 -translate-y-1/2 text-ink-faint" size={18} />
          <input value={q} onChange={(e) => setQ(e.target.value)}
            placeholder="ابحث في الأسئلة الشائعة…"
            className="input ltr:pl-10 rtl:pr-10" />
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
        {/* FAQs */}
        <section>
          <h3 className="mb-4 font-bold text-ink">الأسئلة الشائعة</h3>
          <div className="space-y-3">
            {filtered.map((f) => {
              const on = open === f.id;
              return (
                <div key={f.id} className="card overflow-hidden">
                  <button onClick={() => setOpen(on ? null : f.id)}
                    className="flex w-full items-center gap-3 p-4 text-start">
                    <span className="chip">{f.category}</span>
                    <span className="flex-1 font-semibold text-ink">{f.question}</span>
                    <FiChevronDown className={`text-ink-faint transition ${on ? 'rotate-180' : ''}`} />
                  </button>
                  {on && <div className="border-t border-white/5 p-4 text-sm text-ink-muted">{f.answer}</div>}
                </div>
              );
            })}
            {filtered.length === 0 && <p className="text-sm text-ink-faint">لا توجد نتائج مطابقة.</p>}
          </div>
        </section>

        {/* Support Ticket */}
        <aside className="glass h-fit p-6">
          <h3 className="mb-4 font-bold text-ink">إنشاء تذكرة دعم</h3>
          {sent ? (
            <div className="rounded-lg border border-ok/30 bg-ok/10 p-4 text-center">
              <p className="font-semibold text-ok">تم إرسال تذكرتك ✓</p>
              <p className="mt-1 font-sans text-sm text-ink-muted" dir="ltr">{sent}</p>
              <button onClick={() => setSent(null)} className="btn-outline mt-3 text-sm">تذكرة جديدة</button>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm text-ink-muted">الموضوع</label>
                <input value={form.subject} onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
                  className="input" placeholder="عنوان المشكلة" />
              </div>
              <div>
                <label className="mb-1.5 block text-sm text-ink-muted">التصنيف</label>
                <select value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                  className="input">
                  {['الحساب', 'المدفوعات', 'القضايا', 'التقنية'].map((c) => (
                    <option key={c} className="bg-navy-800">{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-sm text-ink-muted">الرسالة</label>
                <textarea value={form.message} onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                  rows={4} className="input resize-none" placeholder="اشرح مشكلتك بالتفصيل…" />
              </div>
              {err && <p className="text-center text-sm text-danger">{err}</p>}
              <button type="submit" disabled={sending} className="btn-gold w-full">
                <FiSend size={16} /> {sending ? 'جارٍ الإرسال…' : 'إرسال التذكرة'}
              </button>
            </form>
          )}
        </aside>
      </div>
    </div>
  );
};
export default HelpCenter;

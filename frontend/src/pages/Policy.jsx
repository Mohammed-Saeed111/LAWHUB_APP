import { FiShield, FiClock, FiRefreshCw, FiAlertCircle, FiCheckCircle } from 'react-icons/fi';

/**
 * SCREEN 10 — Cancellation & Refund Policy.
 * A clearly structured text page explaining cancellation terms and how refunds
 * work through the Escrow system. Follows the same Legal Luxury visual style.
 */
const SECTIONS = [
  {
    icon: FiClock, title: 'مواعيد الإلغاء',
    points: [
      'الإلغاء قبل 24 ساعة من موعد الاستشارة: استرداد كامل (100%).',
      'الإلغاء خلال 24–6 ساعة: استرداد جزئي (50%).',
      'الإلغاء خلال أقل من 6 ساعات: لا يُسترد المبلغ إلا في حالات استثنائية.',
    ],
  },
  {
    icon: FiRefreshCw, title: 'آلية الاسترداد عبر الضمان (Escrow)',
    points: [
      'تُحفظ أموالك في نظام الضمان ولا تُحوّل للمحامي إلا بعد تقديم الخدمة.',
      'عند الموافقة على الاسترداد، يُعاد المبلغ لنفس وسيلة الدفع خلال 5–7 أيام عمل.',
      'يمكنك متابعة حالة الاسترداد من صفحة "قضاياي" في أي وقت.',
    ],
  },
  {
    icon: FiAlertCircle, title: 'حالات خاصة',
    points: [
      'إذا لم يحضر المحامي الاستشارة، يُسترد المبلغ بالكامل تلقائيًا.',
      'في حال نزاع على جودة الخدمة، يتدخّل فريق المنصة كوسيط محايد.',
      'الاستشارات المكتملة فعليًا غير قابلة للاسترداد.',
    ],
  },
];

const Policy = () => (
  <div className="mx-auto max-w-3xl space-y-6">
    <div className="flex items-center gap-2">
      <span className="h-5 w-1 rounded-full bg-gold" />
      <h1 className="section-title">سياسة الإلغاء والاسترداد</h1>
    </div>

    {/* Escrow trust banner */}
    <div className="flex items-start gap-4 rounded-2xl border border-gold/20 bg-gradient-to-br from-navy-800 to-navy-700 p-5">
      <FiShield size={28} className="mt-0.5 shrink-0 text-gold" />
      <div>
        <h3 className="font-bold text-gold">حقوقك محمية بالكامل</h3>
        <p className="mt-1 text-sm text-ink-muted">نلتزم بالشفافية التامة. تشرح هذه الصفحة حقوقك المالية والقانونية عند إلغاء أي استشارة أو خدمة عبر المنصة.</p>
      </div>
    </div>

    {SECTIONS.map((s) => (
      <section key={s.title} className="card-luxury p-6">
        <h2 className="mb-4 flex items-center gap-2 font-bold text-ink">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gold/10 text-gold"><s.icon size={18} /></span>
          {s.title}
        </h2>
        <ul className="space-y-3">
          {s.points.map((p, i) => (
            <li key={i} className="flex gap-3 text-sm leading-relaxed text-ink-muted">
              <FiCheckCircle className="mt-0.5 shrink-0 text-gold" size={16} /> {p}
            </li>
          ))}
        </ul>
      </section>
    ))}

    <p className="text-center text-xs text-ink-faint">
      آخر تحديث: يوليو 2026 · لأي استفسار، تواصل مع الدعم عبر <span className="link-gold">support@lawhub.eg</span>
    </p>
  </div>
);
export default Policy;

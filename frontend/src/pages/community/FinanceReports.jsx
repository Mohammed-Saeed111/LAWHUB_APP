import { FiDownload, FiTrendingUp } from 'react-icons/fi';
import PageHeader from '../../components/ui/PageHeader.jsx';
import Loader from '../../components/ui/Loader.jsx';
import ErrorState from '../../components/ui/ErrorState.jsx';
import { eApi } from '../../api/phaseEApi.js';
import useApi from '../../hooks/useApi.js';

const STATUS = {
  paid:     { l: 'مدفوع',    c: 'text-ok' },
  pending:  { l: 'معلّق',    c: 'text-warn' },
  refunded: { l: 'مُسترد',  c: 'text-danger' },
};
const COLORS = ['#C9A24B', '#E3C57E', '#A5822F', '#6B7070', '#3FB984'];

const FinanceReports = () => {
  const { data, loading, error, refetch } = useApi(() => eApi.finance(), []);
  if (loading) return <Loader label="جارٍ تحميل التقارير…" />;
  if (error) return <ErrorState message={error} onRetry={refetch} />;
  const { txns, total, trend, distribution } = data;
  const maxT = Math.max(...trend.map((t) => t.v));

  // Donut chart via conic-gradient
  const totalDist = distribution.reduce((s, d) => s + d.value, 0) || 1;
  let acc = 0;
  const stops = distribution
    .map((d, i) => {
      const start = (acc / totalDist) * 360;
      acc += d.value;
      const end = (acc / totalDist) * 360;
      return `${COLORS[i % COLORS.length]} ${start}deg ${end}deg`;
    })
    .join(', ');

  return (
    <div className="space-y-6">
      <PageHeader title="التقارير المالية" subtitle="تحليل الإيرادات وسجلّ المعاملات">
        <button onClick={() => window.print()} className="btn-outline text-sm">
          <FiDownload size={16} /> تصدير PDF
        </button>
        <button className="btn-gold text-sm"><FiDownload size={16} /> CSV</button>
      </PageHeader>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="glass-gold p-5">
          <p className="font-sans text-3xl font-bold text-gold">
            {total.toLocaleString()} <span className="text-sm text-ink-faint">ج.م</span>
          </p>
          <p className="mt-1 text-sm text-ink-muted">إجمالي الإيرادات المحصّلة</p>
        </div>
        <div className="glass p-5">
          <p className="font-sans text-3xl font-bold text-ink">{txns.length}</p>
          <p className="mt-1 text-sm text-ink-muted">عدد المعاملات</p>
        </div>
        <div className="glass p-5">
          <p className="font-sans text-3xl font-bold text-warn">
            {txns.filter((t) => t.status === 'pending').length}
          </p>
          <p className="mt-1 text-sm text-ink-muted">معاملات معلّقة</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        {/* Bar Chart */}
        <section className="glass p-6">
          <div className="mb-6 flex items-center gap-2">
            <FiTrendingUp className="text-gold" />
            <h2 className="font-bold text-ink">اتجاه الإيرادات (نصف سنوي)</h2>
          </div>
          <div className="flex h-52 items-end justify-between gap-3">
            {trend.map((t) => (
              <div key={t.m} className="flex flex-1 flex-col items-center gap-2">
                <div className="relative w-full rounded-t-lg bg-gradient-to-t from-gold/20 to-gold"
                  style={{ height: `${(t.v / maxT) * 100}%` }}>
                  <span className="absolute -top-5 left-1/2 -translate-x-1/2 font-sans text-[10px] text-gold">
                    {t.v}k
                  </span>
                </div>
                <span className="text-[10px] text-ink-faint">{t.m}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Donut Chart */}
        <section className="glass p-6">
          <h2 className="mb-4 font-bold text-ink">توزيع الخدمات</h2>
          <div className="flex items-center gap-6">
            <div className="h-32 w-32 shrink-0 rounded-full" style={{ background: `conic-gradient(${stops})` }}>
              <div className="flex h-full w-full items-center justify-center">
                <div className="h-16 w-16 rounded-full bg-navy-900" />
              </div>
            </div>
            <div className="flex-1 space-y-2">
              {distribution.map((d, i) => (
                <div key={d.label} className="flex items-center gap-2 text-sm">
                  <span className="h-3 w-3 rounded-sm" style={{ background: COLORS[i % COLORS.length] }} />
                  <span className="flex-1 text-ink-muted">{d.label}</span>
                  <span className="font-sans text-ink">{d.value.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* Transactions Table */}
      <section className="glass overflow-x-auto">
        <table className="w-full min-w-[640px] text-sm">
          <thead>
            <tr className="border-b border-white/10 text-ink-muted">
              <th className="p-4 text-start font-medium">المرجع</th>
              <th className="p-4 text-start font-medium">العميل</th>
              <th className="p-4 text-start font-medium">الخدمة</th>
              <th className="p-4 text-start font-medium">المبلغ</th>
              <th className="p-4 text-start font-medium">الحالة</th>
              <th className="p-4 text-start font-medium">التاريخ</th>
            </tr>
          </thead>
          <tbody>
            {txns.map((t) => {
              const s = STATUS[t.status] || STATUS.paid;
              return (
                <tr key={t._id} className="border-b border-white/5">
                  <td className="p-4 font-sans text-ink" dir="ltr">{t.ref}</td>
                  <td className="p-4 text-ink-muted">{t.client}</td>
                  <td className="p-4 text-ink-muted">{t.service}</td>
                  <td className="p-4 font-sans text-gold">{t.amount} {t.currency}</td>
                  <td className="p-4"><span className={`text-xs font-semibold ${s.c}`}>{s.l}</span></td>
                  <td className="p-4 text-ink-muted" dir="ltr">{t.date}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>
    </div>
  );
};
export default FinanceReports;

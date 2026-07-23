import AnalysisReport from '../models/analysis.model.js';
import CaseAdvice from '../models/advice.model.js';
import asyncHandler from '../utils/asyncHandler.js';

/**
 * [D3] AI Contract Analysis — clause-by-clause risk heatmap + health score.
 * Deterministic rule-based engine (keyword heuristics) so it works offline;
 * swap for a real LLM call in production.
 */
const RISK_RULES = [
  { rx: /(دون إشعار|بدون إشعار|فسخ فوري|إنهاء فوري)/, risk: 'critical', note: 'بند إنهاء فوري دون إشعار — خطر عالٍ على الطرف الأضعف.', suggestion: 'أضف مهلة إشعار كتابي لا تقل عن 30 يومًا قبل الإنهاء.' },
  { rx: /(غرامة|شرط جزائي|تعويض غير محدد)/, risk: 'critical', note: 'شرط جزائي غير متناسب قد يُبطل قضائيًا.', suggestion: 'حدّد سقفًا واضحًا ومتناسبًا للتعويض.' },
  { rx: /(تجديد تلقائي|يتجدد تلقائيا)/, risk: 'warning', note: 'تجديد تلقائي قد يُلزم الطرف بمدة إضافية.', suggestion: 'اجعل التجديد مشروطًا بموافقة كتابية.' },
  { rx: /(سري|السرية|عدم الإفصاح)/, risk: 'warning', note: 'بند سرية بحاجة لتحديد المدة والنطاق.', suggestion: 'حدّد مدة الالتزام بالسرية بعد انتهاء العقد.' },
  { rx: /(التحكيم|اختصاص قضائي|القانون الواجب)/, risk: 'suggested', note: 'يفضّل توضيح جهة فض النزاع والقانون الواجب التطبيق.', suggestion: 'أضف بند اختصاص المحاكم المصرية أو التحكيم بالقاهرة.' },
];
const splitClauses = (text) => text.split(/\n+|(?<=\.)\s+/).map((t) => t.trim()).filter((t) => t.length > 8);

export const analyzeContract = asyncHandler(async (req, res) => {
  const { text = '', title = 'عقد بدون عنوان' } = req.body;
  const rawClauses = splitClauses(text).slice(0, 40);
  const clauses = rawClauses.map((t, i) => {
    const hit = RISK_RULES.find((r) => r.rx.test(t));
    return hit ? { index: i, text: t, risk: hit.risk, note: hit.note, suggestion: hit.suggestion }
               : { index: i, text: t, risk: 'safe', note: 'لا توجد مخاطر ظاهرة في هذا البند.', suggestion: '' };
  });
  const summary = { critical: 0, warning: 0, suggested: 0, safe: 0 };
  clauses.forEach((c) => { summary[c.risk] += 1; });
  const total = clauses.length || 1;
  const healthScore = Math.max(5, Math.round(100 - (summary.critical * 22 + summary.warning * 10 + summary.suggested * 3) / total * 10));
  const report = await AnalysisReport.create({ user: req.userId, title, healthScore, clauses, summary });
  res.status(201).json({ success: true, data: { report } });
});

export const getReport = asyncHandler(async (req, res) => {
  const r = await AnalysisReport.findOne({ _id: req.params.id, user: req.userId });
  if (!r) return res.status(404).json({ success: false, message: 'التقرير غير موجود.' });
  res.json({ success: true, data: { report: r } });
});

/**
 * [D5] AI Case-Type Advisor — natural-language intake → predicted category.
 */
const CATEGORY_RULES = [
  { cat: 'أحوال شخصية', kw: ['طلاق', 'نفقة', 'حضانة', 'خلع', 'زواج', 'ميراث'], urgency: 'عالية', lawyers: [{ name: 'المستشارة منى شعبان', seed: 'mona', specialty: 'أحوال شخصية', rating: 4.8 }] },
  { cat: 'عمالي', kw: ['فصل', 'راتب', 'مستحقات', 'عمل', 'استقالة', 'تعويض إصابة'], urgency: 'متوسطة', lawyers: [{ name: 'المستشارة سارة فؤاد', seed: 'sara', specialty: 'عمالي', rating: 4.6 }] },
  { cat: 'عقاري', kw: ['إيجار', 'شقة', 'عقار', 'أرض', 'بيع', 'إخلاء'], urgency: 'متوسطة', lawyers: [{ name: 'المستشار طارق منصور', seed: 'tarek', specialty: 'عقاري', rating: 4.7 }] },
  { cat: 'شركات', kw: ['شركة', 'تأسيس', 'عقد شراكة', 'استثمار', 'ضرائب', 'علامة تجارية'], urgency: 'منخفضة', lawyers: [{ name: 'المستشار كريم عبد الحليم', seed: 'kareem', specialty: 'شركات', rating: 5.0 }] },
  { cat: 'جنائي', kw: ['اتهام', 'جنحة', 'جناية', 'قذف', 'سب', 'نصب', 'سرقة'], urgency: 'عالية', lawyers: [{ name: 'المستشار أحمد الجندي', seed: 'ahmed', specialty: 'جنائي', rating: 4.9 }] },
];

export const adviseCase = asyncHandler(async (req, res) => {
  const { description = '' } = req.body;
  let best = { cat: 'مدني', score: 0, urgency: 'متوسطة', lawyers: [{ name: 'المستشار أحمد الجندي', seed: 'ahmed', specialty: 'مدني', rating: 4.9 }] };
  for (const r of CATEGORY_RULES) {
    const score = r.kw.reduce((s, k) => s + (description.includes(k) ? 1 : 0), 0);
    if (score > best.score) best = { cat: r.cat, score, urgency: r.urgency, lawyers: r.lawyers };
  }
  const confidence = Math.min(96, 55 + best.score * 12);
  const advice = await CaseAdvice.create({ user: req.userId, description, category: best.cat, confidence, urgency: best.urgency, recommendedLawyers: best.lawyers });
  res.status(201).json({ success: true, data: { advice } });
});

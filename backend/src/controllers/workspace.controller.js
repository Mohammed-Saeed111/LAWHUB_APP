import Case        from '../models/case.model.js';
import Appointment from '../models/appointment.model.js';
import Member      from '../models/member.model.js';
import LawyerReview from '../models/lawyerReview.model.js';
import Plan        from '../models/plan.model.js';
import Profile     from '../models/profile.model.js';
import ApiError    from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';

/** [C1] Dashboard: KPIs + 7-day revenue + today agenda. */
export const dashboard = asyncHandler(async (req, res) => {
  const [active, agenda] = await Promise.all([
    Case.countDocuments({ status: 'active' }),
    Appointment.find({ time: { $ne: null } }).sort({ time: 1 }).limit(4),
  ]);
  const kpis = [
    { key: 'appointments', label: 'مواعيد اليوم',   value: String(agenda.length), icon: 'FiCalendar',   delta: '+2'   },
    { key: 'revenue',      label: 'إيرادات الشهر',  value: '48,500 ج.م',          icon: 'FiTrendingUp', delta: '+12%' },
    { key: 'active',       label: 'قضايا نشطة',     value: String(active),         icon: 'FiFolder',     delta: '+3'   },
    { key: 'rating',       label: 'متوسط التقييم',  value: '4.9',                  icon: 'FiStar',       delta: '+0.1' },
  ];
  const revenue = [
    { day: 'السبت', v: 6.2 }, { day: 'الأحد', v: 8.5 }, { day: 'الإثنين', v: 5.1 },
    { day: 'الثلاثاء', v: 9.8 }, { day: 'الأربعاء', v: 7.3 }, { day: 'الخميس', v: 11.2 }, { day: 'الجمعة', v: 4.6 },
  ];
  res.json({ success: true, data: { kpis, revenue, agenda } });
});

/** [C2] Calendar: weekly events grid. */
export const calendar = asyncHandler(async (req, res) => {
  const events = await Appointment.find({ day: { $ne: null } });
  res.json({ success: true, data: { events } });
});

/** [C3] Cases list with filters. */
export const listCases = asyncHandler(async (req, res) => {
  const { q, status, category } = req.query;
  const f = {};
  if (status && status !== 'all') f.status = status;
  if (category && category !== 'الكل') f.category = category;
  if (q) { const rx = new RegExp(q, 'i'); f.$or = [{ title: rx }, { client: rx }, { ref: rx }]; }
  res.json({ success: true, data: { cases: await Case.find(f).sort({ updatedAt: -1 }) } });
});

/** [C4] Case details + timeline. */
export const getCase = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const isOid = /^[0-9a-f]{24}$/.test(id);
  const c = await Case.findOne(isOid ? { $or: [{ _id: id }, { ref: id }] } : { ref: id });
  if (!c) throw ApiError.notFound('القضية غير موجودة.');
  res.json({ success: true, data: { case: c } });
});

/** [C5] Team list. */
export const team = asyncHandler(async (req, res) =>
  res.json({ success: true, data: { team: await Member.find().sort({ createdAt: 1 }) } })
);

/** [C5] Update member permission. */
export const updateMemberPermission = asyncHandler(async (req, res) => {
  const m = await Member.findById(req.params.id);
  if (!m) throw ApiError.notFound('العضو غير موجود.');
  m.permission = req.body.permission;
  await m.save();
  res.json({ success: true, data: { member: m } });
});

/** [C6] Assign a case to a member. */
export const assignCase = asyncHandler(async (req, res) => {
  const c = await Case.findById(req.params.id);
  if (!c) throw ApiError.notFound('القضية غير موجودة.');
  c.assignedTo = req.body.assignedTo;
  await c.save();
  res.json({ success: true, data: { case: c } });
});

/** [C7/C8] Get workspace profile (services + membership). */
export const getProfile = asyncHandler(async (req, res) => {
  let p = await Profile.findOne();
  if (!p) p = await Profile.create({});
  res.json({ success: true, data: { profile: p } });
});

/** [C7/C8] Update profile. */
export const updateProfile = asyncHandler(async (req, res) => {
  let p = await Profile.findOne();
  if (!p) p = new Profile();
  const { specializations, cities, services, currentPlan } = req.body;
  if (specializations) p.specializations = specializations;
  if (cities)          p.cities          = cities;
  if (services)        p.services        = services;
  if (currentPlan)     p.currentPlan     = currentPlan;
  await p.save();
  res.json({ success: true, data: { profile: p } });
});

/** [C9] Plans. */
export const plans = asyncHandler(async (req, res) =>
  res.json({ success: true, data: { plans: await Plan.find().sort({ price: 1 }) } })
);

/** [C10] Reviews + stats. */
export const reviews = asyncHandler(async (req, res) => {
  const all = await LawyerReview.find().sort({ createdAt: -1 });
  const avg = all.length
    ? (all.reduce((s, r) => s + r.rating, 0) / all.length).toFixed(1)
    : '0.0';
  const breakdown = [5, 4, 3, 2, 1].map((st) => ({
    s: st, c: all.filter((r) => r.rating === st).length,
  }));
  res.json({ success: true, data: { reviews: all, stats: { average: Number(avg), total: all.length, breakdown } } });
});

/** [C10] Dispute a review. */
export const disputeReview = asyncHandler(async (req, res) => {
  const r = await LawyerReview.findById(req.params.id);
  if (!r) throw ApiError.notFound('التقييم غير موجود.');
  r.status = 'disputed';
  await r.save();
  res.json({ success: true, data: { review: r } });
});

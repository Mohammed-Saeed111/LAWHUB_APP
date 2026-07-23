import User from '../models/user.model.js';
import Subscription from '../models/subscription.model.js';
import Review from '../models/review.model.js';
import ServerLog from '../models/log.model.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';

// ─── [F1] Platform oversight — KPIs + revenue line + geo heat ───────────────
export const overview = asyncHandler(async (req, res) => {
  const [lawyers, clients] = await Promise.all([
    User.countDocuments({ role: { $in: ['lawyer', 'office'] } }),
    User.countDocuments({ role: 'client' }),
  ]);

  let pendingV = 0;
  try {
    const { default: Verification } = await import('../models/verification.model.js');
    pendingV = await Verification.countDocuments({ status: 'pending' });
  } catch { /* verification model may not have data yet */ }

  const kpis = [
    { key: 'users',   label: 'إجمالي المستخدمين',     value: String(lawyers + clients), icon: 'FiUsers',    delta: '+8%'  },
    { key: 'lawyers', label: 'محامون',                 value: String(lawyers),           icon: 'FiBriefcase', delta: '+5%' },
    { key: 'escrow',  label: 'أموال في الضمان',        value: '312,400 ج.م',             icon: 'FiShield',   delta: '+12%' },
    { key: 'queue',   label: 'طلبات توثيق معلّقة',     value: String(pendingV),          icon: 'FiClock',    delta: ''     },
  ];

  const revenue = [
    { m: 'يناير', v: 210 }, { m: 'فبراير', v: 265 }, { m: 'مارس', v: 240 },
    { m: 'أبريل', v: 320 }, { m: 'مايو',   v: 300 }, { m: 'يونيو', v: 390 },
  ];
  const geo = [
    { gov: 'القاهرة', value: 42 }, { gov: 'الجيزة', value: 27 },
    { gov: 'الإسكندرية', value: 18 }, { gov: 'المنوفية', value: 9 },
    { gov: 'الدقهلية', value: 7 }, { gov: 'أسيوط', value: 5 },
  ];

  res.json({ success: true, data: { kpis, revenue, geo, split: { lawyers, clients } } });
});

// ─── [F2] Advanced analytics ─────────────────────────────────────────────────
export const analytics = asyncHandler(async (req, res) => {
  const series = {
    revenue: [210, 265, 240, 320, 300, 390],
    users:   [120, 180, 210, 260, 320, 410],
    churn:   [4, 3, 5, 2, 3, 2],
    labels:  ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو'],
  };
  const specialties = [
    { label: 'جنائي', value: 28 }, { label: 'أحوال شخصية', value: 24 },
    { label: 'شركات', value: 19 }, { label: 'عقاري', value: 16 },
    { label: 'عمالي', value: 13 },
  ];
  res.json({ success: true, data: { series, specialties, churnRate: 2.4, arpu: 640 } });
});

// ─── [F3] Subscriptions ───────────────────────────────────────────────────────
export const subscriptions = asyncHandler(async (req, res) => {
  res.json({ success: true, data: { subscriptions: await Subscription.find().sort({ createdAt: -1 }) } });
});

export const updateSubscription = asyncHandler(async (req, res) => {
  const s = await Subscription.findById(req.params.id);
  if (!s) throw ApiError.notFound('الاشتراك غير موجود.');
  Object.assign(s, req.body);
  await s.save();
  res.json({ success: true, data: { subscription: s } });
});

// ─── [F4] Users & RBAC ───────────────────────────────────────────────────────
export const listUsers = asyncHandler(async (req, res) => {
  const { q, role } = req.query;
  const f = {};
  if (role && role !== 'all') f.role = role;
  if (q) { const rx = new RegExp(q, 'i'); f.$or = [{ fullName: rx }, { email: rx }]; }
  res.json({ success: true, data: { users: await User.find(f).sort({ createdAt: -1 }).limit(100) } });
});

export const updateUser = asyncHandler(async (req, res) => {
  const u = await User.findById(req.params.id);
  if (!u) throw ApiError.notFound('المستخدم غير موجود.');
  const { role, permissions, status } = req.body;
  if (role) u.role = role;
  if (permissions) u.permissions = permissions;
  if (status) u.accountStatus = status;
  await u.save();
  res.json({ success: true, data: { user: u } });
});

// ─── [F8] Reviews + sentiment ─────────────────────────────────────────────────
export const reviews = asyncHandler(async (req, res) => {
  const list = await Review.find().sort({ createdAt: -1 });
  const sentiment = {
    positive: list.filter((r) => r.sentiment === 'positive').length,
    neutral:  list.filter((r) => r.sentiment === 'neutral').length,
    negative: list.filter((r) => r.sentiment === 'negative').length,
  };
  res.json({ success: true, data: { reviews: list, sentiment } });
});

export const moderateReview = asyncHandler(async (req, res) => {
  const r = await Review.findById(req.params.id);
  if (!r) throw ApiError.notFound('التقييم غير موجود.');
  r.status = req.body.status || 'published';
  await r.save();
  res.json({ success: true, data: { review: r } });
});

// ─── [F9] System health + logs ───────────────────────────────────────────────
export const health = asyncHandler(async (req, res) => {
  const logs = await ServerLog.find().sort({ createdAt: -1 }).limit(40);
  const stats = { uptime: '99.98%', apiAvgMs: 128, activeSessions: 342, errorRate: '0.12%', cpu: 37, memory: 61 };
  const responseTimes = [90, 110, 95, 140, 120, 105, 130];
  res.json({ success: true, data: { logs, stats, responseTimes } });
});

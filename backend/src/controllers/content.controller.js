import Video from '../models/video.model.js';
import News from '../models/news.model.js';
import Notification from '../models/notification.model.js';
import Referral from '../models/referral.model.js';
import FinanceTxn from '../models/finance.model.js';
import { Faq, Ticket } from '../models/support.model.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';

/** [E1] Videos + categories + featured. */
export const videos = asyncHandler(async (req, res) => {
  const { category } = req.query; const f = {};
  if (category && category !== 'الكل') f.category = category;
  const [list, featured, categories] = await Promise.all([
    Video.find(f).sort({ views: -1 }), Video.findOne({ featured: true }), Video.distinct('category'),
  ]);
  res.json({ success: true, data: { videos: list, featured, categories: categories.filter(Boolean) } });
});

/** [E2] News feed. */
export const news = asyncHandler(async (req, res) => {
  const [feed, featured] = await Promise.all([News.find({ featured: false }).sort({ createdAt: -1 }), News.findOne({ featured: true })]);
  res.json({ success: true, data: { news: feed, featured } });
});

/** [E4] Notifications + mark read. */
export const notifications = asyncHandler(async (req, res) => res.json({ success: true, data: { notifications: await Notification.find({ user: req.userId }).sort({ createdAt: -1 }) } }));
export const readNotification = asyncHandler(async (req, res) => { const n = await Notification.findOne({ _id: req.params.id, user: req.userId }); if (!n) throw ApiError.notFound('الإشعار غير موجود.'); n.read = true; await n.save(); res.json({ success: true, data: { notification: n } }); });
export const readAllNotifications = asyncHandler(async (req, res) => { await Notification.updateMany({ user: req.userId, read: false }, { read: true }); res.json({ success: true, message: 'تم تعليم الكل كمقروء.' }); });

/** [E5] Referral: my code + leaderboard. */
export const referral = asyncHandler(async (req, res) => {
  const leaderboard = await Referral.find().sort({ referrals: -1 }).limit(5);
  const me = req.user;
  res.json({ success: true, data: { code: me.referralCode || 'LAWHUB-' + me._id.toString().slice(-5).toUpperCase(), points: me.points || 0, referrals: me.referrals || 0, milestone: { current: me.referrals || 0, target: 10 }, leaderboard } });
});

/** [E6] Financial reports: transactions + aggregates. */
export const finance = asyncHandler(async (req, res) => {
  const txns = await FinanceTxn.find({ user: req.userId }).sort({ createdAt: -1 });
  const total = txns.filter((t) => t.status === 'paid').reduce((s, t) => s + t.amount, 0);
  const trend = [{ m: 'يناير', v: 32 }, { m: 'فبراير', v: 41 }, { m: 'مارس', v: 38 }, { m: 'أبريل', v: 52 }, { m: 'مايو', v: 47 }, { m: 'يونيو', v: 63 }];
  const byService = {}; txns.forEach((t) => { byService[t.service] = (byService[t.service] || 0) + t.amount; });
  const distribution = Object.entries(byService).map(([label, value]) => ({ label, value }));
  res.json({ success: true, data: { txns, total, trend, distribution } });
});

/** [E7] Support: FAQ + create/list tickets. */
export const faqs = asyncHandler(async (req, res) => res.json({ success: true, data: { faqs: await Faq.find().sort({ createdAt: 1 }) } }));
export const createTicket = asyncHandler(async (req, res) => {
  const { subject, category, message } = req.body;
  if (!subject || !message) throw ApiError.badRequest('الموضوع والرسالة مطلوبان.');
  const ref = 'TKT-' + Date.now().toString(36).toUpperCase();
  const t = await Ticket.create({ user: req.userId, ref, subject, category, message });
  res.status(201).json({ success: true, data: { ticket: t } });
});
export const myTickets = asyncHandler(async (req, res) => res.json({ success: true, data: { tickets: await Ticket.find({ user: req.userId }).sort({ createdAt: -1 }) } }));

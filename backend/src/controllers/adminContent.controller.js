import Article from '../models/article.model.js';
import Video from '../models/video.model.js';
import { RoadmapModule, NotifySignup } from '../models/module.model.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';

// ─── Lazy-load Verification model (may or may not have data) ─────────────────
const getVerification = async () => {
  try {
    const { default: Verification } = await import('../models/verification.model.js');
    return Verification;
  } catch {
    return null;
  }
};

// ─── [F5] Verification queue — dual-pane review ──────────────────────────────
export const verifications = asyncHandler(async (req, res) => {
  const Verification = await getVerification();
  if (!Verification) return res.json({ success: true, data: { verifications: [] } });
  const { status = 'pending' } = req.query;
  const f = status === 'all' ? {} : { status };
  res.json({ success: true, data: { verifications: await Verification.find(f).sort({ createdAt: 1 }) } });
});

export const reviewVerification = asyncHandler(async (req, res) => {
  const Verification = await getVerification();
  if (!Verification) throw ApiError.notFound('الطلب غير موجود.');
  const v = await Verification.findById(req.params.id);
  if (!v) throw ApiError.notFound('الطلب غير موجود.');
  const { action, note } = req.body; // approve | reject | request_info
  v.status = action === 'approve' ? 'approved' : action === 'reject' ? 'rejected' : 'info_requested';
  if (note) v.note = note;
  await v.save();
  res.json({ success: true, data: { verification: v } });
});

// ─── [F6] News CMS — draft / publish ─────────────────────────────────────────
export const articles = asyncHandler(async (req, res) => {
  res.json({ success: true, data: { articles: await Article.find().sort({ createdAt: -1 }) } });
});

export const createArticle = asyncHandler(async (req, res) => {
  const a = await Article.create({ ...req.body, author: req.user.fullName });
  res.status(201).json({ success: true, data: { article: a } });
});

export const updateArticle = asyncHandler(async (req, res) => {
  const a = await Article.findById(req.params.id);
  if (!a) throw ApiError.notFound('المقال غير موجود.');
  Object.assign(a, req.body);
  await a.save();
  res.json({ success: true, data: { article: a } });
});

export const deleteArticle = asyncHandler(async (req, res) => {
  await Article.findByIdAndDelete(req.params.id);
  res.json({ success: true, message: 'تم الحذف.' });
});

// ─── [F7] Video CMS — visibility + pro toggles ───────────────────────────────
export const adminVideos = asyncHandler(async (req, res) => {
  res.json({ success: true, data: { videos: await Video.find().sort({ createdAt: -1 }) } });
});

export const updateAdminVideo = asyncHandler(async (req, res) => {
  const v = await Video.findById(req.params.id);
  if (!v) throw ApiError.notFound('الفيديو غير موجود.');
  Object.assign(v, req.body);
  await v.save();
  res.json({ success: true, data: { video: v } });
});

// ─── [F11] Roadmap + notify-me ───────────────────────────────────────────────
export const roadmap = asyncHandler(async (req, res) => {
  res.json({ success: true, data: { modules: await RoadmapModule.find().sort({ createdAt: 1 }) } });
});

export const notifyMe = asyncHandler(async (req, res) => {
  const { email, module } = req.body;
  if (!email) throw ApiError.badRequest('البريد الإلكتروني مطلوب.');
  await NotifySignup.create({ email, module });
  res.status(201).json({ success: true, message: 'سنخطرك عند الإطلاق.' });
});

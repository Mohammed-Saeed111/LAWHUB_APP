import { Router } from 'express';
import { protect, adminOnly } from '../middlewares/auth.middleware.js';

import authRoutes        from './auth.routes.js';
import lawyerRoutes      from './lawyer.routes.js';
import metaRoutes        from './meta.routes.js';
import favoriteRoutes    from './favorite.routes.js';
import consultationRoutes from './consultation.routes.js';
import caseRoutes        from './case.routes.js';
import workspaceRoutes   from './workspace.routes.js';   // ← Phase C

// ---- Phase D — Legal Commerce & AI Intelligence ----
import * as market from '../controllers/market.controller.js';
import * as ai     from '../controllers/ai.controller.js';

// ---- Phase E — Community, Education & Communication ----
import * as content from '../controllers/content.controller.js';
import * as chat    from '../controllers/chat.controller.js';

// ---- Phase F — Admin Console & Platform Governance ----
import * as admin        from '../controllers/admin.controller.js';
import * as adminContent from '../controllers/adminContent.controller.js';

const router = Router();

router.get('/health', (req, res) =>
  res.json({ success: true, message: 'LawHub unified API 🚀', time: new Date() }));

// ---- Phase 0 / A — Authentication (handles its own public/private routes) ----
router.use('/auth', authRoutes);

// ---- Phase B — Client Journey ----
router.use('/lawyers', lawyerRoutes);
router.use('/', metaRoutes);
router.use('/favorites', protect, favoriteRoutes);
router.use('/consultations', protect, consultationRoutes);
router.use('/cases', protect, caseRoutes);

// ---- Phase C — Lawyer Workspace (lawyer / office roles only) ----
router.use('/workspace', workspaceRoutes);

// ---- Phase D — Marketplace + AI + E-Signature ----
router.get('/templates', market.listTemplates);
router.get('/templates/:id', market.getTemplate);
router.post('/purchase', protect, market.purchase);
router.patch('/transactions/:id/sign', protect, market.signContract);
router.get('/transactions/:id', protect, market.getTransaction);
router.get('/transactions', protect, market.myTransactions);
router.post('/ai/analyze', protect, ai.analyzeContract);
router.get('/ai/reports/:id', protect, ai.getReport);
router.post('/ai/advise', protect, ai.adviseCase);

// ---- Phase E — Community, Education & Communication ----
// E1 - Video Library
router.get('/videos', protect, content.videos);
// E2 - Legal News
router.get('/news', protect, content.news);
// E3 - Chat
router.get('/conversations', protect, chat.conversations);
router.get('/conversations/:id/messages', protect, chat.messages);
router.post('/conversations/:id/messages', protect, chat.sendMessage);
// E4 - Notifications
router.get('/notifications', protect, content.notifications);
router.patch('/notifications/:id/read', protect, content.readNotification);
router.patch('/notifications/read-all', protect, content.readAllNotifications);
// E5 - Referral & Rewards
router.get('/referral', protect, content.referral);
// E6 - Financial Reports
router.get('/finance', protect, content.finance);
// E7 - Help Center
router.get('/faqs', protect, content.faqs);
router.get('/tickets', protect, content.myTickets);
router.post('/tickets', protect, content.createTicket);

// ---- Phase F — Admin Console & Platform Governance ----
const g = [protect, adminOnly()];
// F1 - Platform oversight
router.get('/admin/overview',                   ...g, admin.overview);
// F2 - Analytics
router.get('/admin/analytics',                  ...g, admin.analytics);
// F3 - Subscriptions
router.get('/admin/subscriptions',              ...g, admin.subscriptions);
router.patch('/admin/subscriptions/:id',        ...g, admin.updateSubscription);
// F4 - Users & RBAC
router.get('/admin/users',                      ...g, admin.listUsers);
router.patch('/admin/users/:id',                ...g, admin.updateUser);
// F5 - Verification queue
router.get('/admin/verifications',              ...g, adminContent.verifications);
router.patch('/admin/verifications/:id',        ...g, adminContent.reviewVerification);
// F6 - News CMS
router.get('/admin/articles',                   ...g, adminContent.articles);
router.post('/admin/articles',                  ...g, adminContent.createArticle);
router.patch('/admin/articles/:id',             ...g, adminContent.updateArticle);
router.delete('/admin/articles/:id',            ...g, adminContent.deleteArticle);
// F7 - Video CMS
router.get('/admin/videos',                     ...g, adminContent.adminVideos);
router.patch('/admin/videos/:id',               ...g, adminContent.updateAdminVideo);
// F8 - Reviews
router.get('/admin/reviews',                    ...g, admin.reviews);
router.patch('/admin/reviews/:id',              ...g, admin.moderateReview);
// F9 - System health
router.get('/admin/health',                     ...g, admin.health);
// F11 - Roadmap
router.get('/admin/roadmap',                    ...g, adminContent.roadmap);
router.post('/admin/notify',                    protect, adminContent.notifyMe);

export default router;

import { Router } from 'express';
import { protect } from '../middlewares/auth.middleware.js';

import authRoutes from './auth.routes.js';
import lawyerRoutes from './lawyer.routes.js';
import metaRoutes from './meta.routes.js';
import favoriteRoutes from './favorite.routes.js';
import consultationRoutes from './consultation.routes.js';
import caseRoutes from './case.routes.js';

const router = Router();

router.get('/health', (req, res) =>
  res.json({ success: true, message: 'LawHub unified API 🚀', time: new Date() }));

// ---- Phase 0 / A — Authentication (handles its own public/private routes) ----
router.use('/auth', authRoutes);

// ---- Phase B — Client Journey ----
// Public browsing: directory + profiles + meta (categories/cities/articles).
router.use('/lawyers', lawyerRoutes);
router.use('/', metaRoutes);
// Private (require a logged-in user): favorites, bookings, cases.
router.use('/favorites', protect, favoriteRoutes);
router.use('/consultations', protect, consultationRoutes);
router.use('/cases', protect, caseRoutes);

export default router;

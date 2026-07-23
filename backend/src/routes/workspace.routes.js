import { Router } from 'express';
import { protect, authorize } from '../middlewares/auth.middleware.js';
import * as w from '../controllers/workspace.controller.js';

const router = Router();

// كل routes مساحة عمل المحامي محمية بـ JWT + صلاحية lawyer/office
router.use(protect, authorize('lawyer', 'office'));

router.get('/dashboard',            w.dashboard);
router.get('/calendar',             w.calendar);
router.get('/cases',                w.listCases);
router.get('/cases/:id',            w.getCase);
router.patch('/cases/:id/assign',   w.assignCase);
router.get('/team',                 w.team);
router.patch('/team/:id/permission',w.updateMemberPermission);
router.get('/profile',              w.getProfile);
router.patch('/profile',            w.updateProfile);
router.get('/plans',                w.plans);
router.get('/reviews',              w.reviews);
router.patch('/reviews/:id/dispute',w.disputeReview);

export default router;

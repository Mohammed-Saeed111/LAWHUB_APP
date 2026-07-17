import { Router } from 'express';
import { listLawyers, getLawyer, getLawyerReviews } from '../controllers/lawyer.controller.js';

const router = Router();
router.get('/', listLawyers);
router.get('/:id', getLawyer);
router.get('/:id/reviews', getLawyerReviews);
export default router;

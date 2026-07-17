import { Router } from 'express';
import { createConsultation, payConsultation, myConsultations } from '../controllers/consultation.controller.js';

const router = Router();
router.get('/', myConsultations);
router.post('/', createConsultation);
router.post('/:id/pay', payConsultation);
export default router;
